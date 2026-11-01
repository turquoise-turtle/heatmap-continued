# Review Heatmap Add-on for Anki
#
# Copyright (C) 2016-2022  Aristotelis P. <https//glutanimate.com/>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version, with the additions
# listed at the end of the accompanied license file.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
# NOTE: This program is subject to certain additional terms pursuant to
# Section 7 of the GNU Affero General Public License.  You should have
# received a copy of these additional terms immediately following the
# terms and conditions of the GNU Affero General Public License which
# accompanied this program.
#
# If not, please request a copy through one of the means of contact
# listed here: <https://glutanimate.com/contact/>.
#
# Any modifications to this file must keep this entire header intact.
#
# This file is part of a modified version of Review Heatmap (2026). It is
# not the original program; see README.md for the list of changes.

"""
Gathering and analysing review activity
"""

from bisect import bisect_left
from enum import Enum
from typing import (
    TYPE_CHECKING,
    Dict,
    List,
    NamedTuple,
    Optional,
    Tuple,
)

from anki.utils import ids2str

from .errors import CollectionError
from .log import is_debugging, logger
from .times import DAY, day_start_epoch, iso_date_to_day_epoch

if TYPE_CHECKING:
    from anki.collection import Collection
    from anki.dbproxy import DBProxy

    from .config import ConfigManager

# Limit forecasts to 200 years to protect against invalid due dates
MAX_FORECAST_DAYS = 73000


class StatsType(Enum):
    streak = 0
    percentage = 1
    cards = 2


class StatsEntry(NamedTuple):
    value: int
    type: StatsType


class StatsReport(NamedTuple):
    streak_max: StatsEntry
    streak_cur: StatsEntry
    pct_days_active: StatsEntry
    activity_daily_avg: StatsEntry
    habit: Optional[StatsEntry] = None  # exponential moving average, optional


class ActivityReport(NamedTuple):
    activity: Dict[int, int]  # day (s) -> activity (positive) or due (negative)
    start: Optional[int]  # ms
    stop: Optional[int]  # ms
    today: int  # ms
    offset: int  # rollover hour
    stats: StatsReport
    activity_type: str = "reviews"


# Half-life of the habit-strength moving average, in days
HABIT_HALF_LIFE = 13



DayCounts = List[Tuple[int, int]]


class ActivityReporter:
    def __init__(self, col: "Collection", config: "ConfigManager"):
        if col is None or col.db is None:
            raise CollectionError("Anki collection and/or database is not ready")
        self._col = col
        self._db: "DBProxy" = col.db
        self._config = config

    # Public API
    #########################################################################

    def get_report(
        self,
        limhist: Optional[int] = None,
        limfcst: Optional[int] = None,
        current_deck_only: bool = False,
    ) -> Optional[ActivityReport]:
        rollover = self.rollover
        today = self.today(rollover)
        history_start, forecast_stop = self._time_limits(today, limhist, limfcst)
        deck_ids = self._deck_ids(current_deck_only)
        activity_type = self.activity_type

        if activity_type == "time":
            history = self._time_spent(today, rollover, history_start, deck_ids)
        elif activity_type == "learned":
            history = self._cards_learned(today, rollover, history_start, deck_ids)
        elif activity_type == "added":
            history = self._cards_added(today, rollover, history_start, deck_ids)
        else:
            history = self._cards_done(today, rollover, history_start, deck_ids)
        if not history:
            return None

        # Only reviews have a meaningful forecast
        forecast = (
            self._cards_due(today, forecast_stop, deck_ids)
            if activity_type == "reviews"
            else []
        )

        return self._compose(history, forecast, today, rollover, deck_ids, activity_type)

    # Collection properties
    #########################################################################

    @property
    def activity_type(self) -> str:
        value = self._config["synced"].get("activity", "reviews")
        return value if value in ("reviews", "time", "learned", "added") else "reviews"

    @property
    def rollover(self) -> int:
        """Hour at which the next day starts ("Next day starts at")."""
        try:
            return int(self._col.get_config("rollover", 4)) % 24
        except Exception:  # defensive: unexpected config value
            return 4

    def today(self, rollover: Optional[int] = None) -> int:
        if rollover is None:
            rollover = self.rollover
        return day_start_epoch(self._db, "now", rollover=rollover)

    # Statistics
    #########################################################################

    def _compose(
        self,
        history: DayCounts,
        forecast: DayCounts,
        today: int,
        rollover: int,
        deck_ids: Optional[List[int]] = None,
        activity_type: str = "reviews",
    ) -> ActivityReport:
        streak_max, streak_cur, habit = self._streaks(history, today, rollover, deck_ids)

        total = sum(count for _, count in history)
        last_day = history[-1][0]
        days_learned = len(history)
        first_day = history[0][0]
        avg_cur = int(round(total / max(days_learned, 1)))

        # Percentage of days with activity since the first recorded review.
        # Deliberately not based on the collection creation date: the first
        # review is a more meaningful and motivating reference point.
        days_total = max((today - first_day) // DAY + 1, 1)
        pdays = min(100, int(round(days_learned / days_total * 100)))

        activity: Dict[int, int] = dict(forecast)
        activity.update(history)  # history takes precedence for today

        stop = forecast[-1][0] if forecast else last_day

        return ActivityReport(
            activity=dict(sorted(activity.items())),  # seconds, as cal-heatmap expects
            start=first_day * 1000,
            stop=stop * 1000,
            today=today * 1000,
            offset=rollover,
            stats=StatsReport(
                streak_max=StatsEntry(streak_max, StatsType.streak),
                streak_cur=StatsEntry(streak_cur, StatsType.streak),
                pct_days_active=StatsEntry(pdays, StatsType.percentage),
                activity_daily_avg=StatsEntry(avg_cur, StatsType.cards),
                habit=StatsEntry(habit, StatsType.percentage),
            ),
            activity_type=activity_type,
        )

    def _streaks(
        self, history: DayCounts, today: int, rollover: int, deck_ids: Optional[List[int]]
    ) -> Tuple[int, int, int]:
        """Longest streak, current streak and habit strength (percent).

        A day counts towards a streak when it has at least `streak_min`
        reviews. With `streak_free_days` on, a day without reviews on which no
        card was due neither extends nor breaks a streak. Today never breaks
        the current streak, since it is still in progress.

        Habit strength is an exponential moving average of active days with a
        half-life of HABIT_HALF_LIFE days, so it rises towards 100% with
        sustained daily activity and decays gently through missed days.
        """
        conf = self._config["synced"]
        threshold = max(1, int(conf.get("streak_min") or 1))
        # "Nothing due" only makes sense for review-based activity
        free_days_enabled = bool(conf.get("streak_free_days")) and self.activity_type in (
            "reviews",
            "time",
        )
        counts = dict(history)
        first_day = history[0][0]
        decay = 0.5 ** (1 / HABIT_HALF_LIFE)
        habit = 0.0

        due_days: set = set()
        if free_days_enabled:
            gap_days = [
                day for day in range(first_day, today, DAY) if counts.get(day, 0) < threshold
            ]
            due_days = self._days_with_cards_due(gap_days, rollover, deck_ids)

        run = streak_max = 0
        for day in range(first_day, today, DAY):
            active = counts.get(day, 0) >= threshold
            habit = decay * habit + (1 - decay) * (1 if active else 0)
            if active:
                run += 1
                streak_max = max(streak_max, run)
            elif free_days_enabled and day not in due_days:
                continue
            else:
                run = 0
        if counts.get(today, 0) >= threshold:
            run += 1
            streak_max = max(streak_max, run)
            habit = decay * habit + (1 - decay)
        return streak_max, run, int(round(habit * 100))

    def _days_with_cards_due(
        self, days: List[int], rollover: int, deck_ids: Optional[List[int]]
    ) -> set:
        """Subset of `days` on which at least one card was due, reconstructed
        from the review log: a review with interval N makes its card due N
        days later, and it stays due until the card's next review."""
        if not days:
            return set()
        condition = ""
        if deck_ids is not None:
            condition = (
                " AND cid IN (SELECT id FROM cards WHERE "
                + self._card_deck_condition(deck_ids)
                + ")"
            )
        rows = self._db.all(
            f"""
SELECT cid, CAST(STRFTIME('%s', id / 1000, 'unixepoch', 'localtime',
                          '-{int(rollover) % 24} hours', 'start of day') AS int), ivl
FROM revlog WHERE ivl > 0{condition}
ORDER BY cid, id"""
        )

        wanted = sorted(set(days))
        covered = [False] * len(wanted)
        previous_cid = None
        pending_due: Optional[int] = None

        def mark(due_from: int, due_until: Optional[int]) -> None:
            start = bisect_left(wanted, due_from)
            stop = bisect_left(wanted, due_until) if due_until is not None else len(wanted)
            for i in range(start, stop):
                covered[i] = True

        for cid, day, ivl in rows:
            if cid != previous_cid:
                if pending_due is not None:
                    mark(pending_due, None)
                previous_cid = cid
            elif pending_due is not None:
                mark(pending_due, day)
            pending_due = int(day) + int(ivl) * DAY
        if pending_due is not None:
            mark(pending_due, None)

        return {day for day, hit in zip(wanted, covered) if hit}

    # Time limits
    #########################################################################

    def _time_limits(
        self, today: int, limhist: Optional[int], limfcst: Optional[int]
    ) -> Tuple[Optional[int], int]:
        conf = self._config["synced"]

        if limhist is not None:
            history_start: Optional[int] = today - limhist * DAY
        else:
            history_start = self._configured_history_start(
                today, conf.get("limhist") or 0, conf.get("limdate") or 0
            )

        if limfcst is not None:
            forecast_stop = today + limfcst * DAY
        else:
            forecast_stop = today + (conf.get("limfcst") or MAX_FORECAST_DAYS) * DAY

        return history_start, forecast_stop

    def _configured_history_start(
        self, today: int, limit_days: int, limit_date
    ) -> Optional[int]:
        candidates: List[int] = []
        if limit_days:
            candidates.append(today - int(limit_days) * DAY)
        if limit_date:
            # Earlier versions stored a timestamp; newer ones an ISO date.
            if isinstance(limit_date, str):
                try:
                    candidates.append(iso_date_to_day_epoch(limit_date))
                except ValueError:
                    pass
            else:
                candidates.append(day_start_epoch(self._db, int(limit_date)))
        return max(candidates) if candidates else None

    # Deck limits
    #########################################################################

    def _deck_ids(self, current_deck_only: bool) -> Optional[List[int]]:
        """Deck ids to include, or None for no deck restriction."""
        decks = self._col.decks
        if current_deck_only:
            return list(decks.deck_and_child_ids(decks.get_current_id()))

        excluded_conf = self._config["synced"].get("limdecks") or []
        if not excluded_conf:
            return None

        excluded = set()
        for did in excluded_conf:
            try:
                excluded.update(decks.deck_and_child_ids(int(did)))
            except Exception:  # deck no longer exists
                excluded.add(int(did))
        return [d.id for d in decks.all_names_and_ids() if d.id not in excluded]

    @staticmethod
    def _card_deck_condition(deck_ids: List[int]) -> str:
        # Cards sitting in a filtered deck keep their home deck in `odid`, so
        # both columns are checked (fixes reviews missing from the deck view).
        ids = ids2str(deck_ids)
        return f"(did IN {ids} OR odid IN {ids})"

    # Database queries
    #########################################################################

    def _cards_done(
        self,
        today: int,
        rollover: int,
        start: Optional[int],
        deck_ids: Optional[List[int]],
    ) -> DayCounts:
        """Review counts per local day, as (day_epoch, count), ascending."""
        conf = self._config["synced"]
        conditions: List[str] = []
        args: List[int] = []

        if start is not None:
            # Cheap primary-key range filter; the exact day cut-off is applied
            # in Python below since the day expression can't use the index.
            conditions.append("id >= ?")
            args.append((start - DAY) * 1000)

        if conf.get("limresched", True):
            # Manual rescheduling and "forget" write revlog rows with ease 0
            conditions.append("ease > 0")

        if deck_ids is not None:
            conditions.append(
                "cid IN (SELECT id FROM cards WHERE "
                + self._card_deck_condition(deck_ids)
                + ")"
            )
        elif conf.get("limcdel", False):
            conditions.append("cid IN (SELECT id FROM cards)")

        where = ("WHERE " + " AND ".join(conditions)) if conditions else ""
        cmd = f"""
SELECT CAST(STRFTIME('%s', id / 1000, 'unixepoch', 'localtime',
                     '-{int(rollover) % 24} hours', 'start of day') AS int) AS day,
       COUNT()
FROM revlog {where}
GROUP BY day ORDER BY day"""

        rows = self._db.all(cmd, *args)
        result = [
            (int(day), int(count))
            for day, count in rows
            if (start is None or day >= start) and day <= today
        ]

        if is_debugging():
            logger.debug("cards done query: %s args=%s", cmd, args)
            logger.debug("cards done result (%d days): %s", len(result), result[-10:])
        return result

    def _day_expression(self, column: str, rollover: int) -> str:
        return (
            f"CAST(STRFTIME('%s', {column}, 'unixepoch', 'localtime', "
            f"'-{int(rollover) % 24} hours', 'start of day') AS int)"
        )

    def _revlog_conditions(
        self, start: Optional[int], deck_ids: Optional[List[int]]
    ) -> Tuple[str, List[int]]:
        conf = self._config["synced"]
        conditions: List[str] = []
        args: List[int] = []
        if start is not None:
            conditions.append("id >= ?")
            args.append((start - DAY) * 1000)
        if conf.get("limresched", True):
            conditions.append("ease > 0")
        if deck_ids is not None:
            conditions.append(
                "cid IN (SELECT id FROM cards WHERE "
                + self._card_deck_condition(deck_ids)
                + ")"
            )
        elif conf.get("limcdel", False):
            conditions.append("cid IN (SELECT id FROM cards)")
        return (("WHERE " + " AND ".join(conditions)) if conditions else ""), args

    def _time_spent(
        self,
        today: int,
        rollover: int,
        start: Optional[int],
        deck_ids: Optional[List[int]],
    ) -> DayCounts:
        """Minutes of review time per local day (at least one minute on any
        day with activity)."""
        where, args = self._revlog_conditions(start, deck_ids)
        cmd = f"""
SELECT {self._day_expression("id / 1000", rollover)} AS day, SUM(time)
FROM revlog {where}
GROUP BY day ORDER BY day"""
        rows = self._db.all(cmd, *args)
        return [
            (int(day), max(1, int(round(int(ms or 0) / 60000))))
            for day, ms in rows
            if (start is None or day >= start) and day <= today and (ms or 0) > 0
        ]

    def _cards_learned(
        self,
        today: int,
        rollover: int,
        start: Optional[int],
        deck_ids: Optional[List[int]],
    ) -> DayCounts:
        """Cards answered for the first time, per local day."""
        where, args = self._revlog_conditions(None, deck_ids)
        cmd = f"""
SELECT {self._day_expression("first_id / 1000", rollover)} AS day, COUNT()
FROM (SELECT MIN(id) AS first_id FROM revlog {where} GROUP BY cid)
GROUP BY day ORDER BY day"""
        rows = self._db.all(cmd, *args)
        return [
            (int(day), int(count))
            for day, count in rows
            if (start is None or day >= start) and day <= today
        ]

    def _cards_added(
        self,
        today: int,
        rollover: int,
        start: Optional[int],
        deck_ids: Optional[List[int]],
    ) -> DayCounts:
        """Cards created per local day (a card id is its creation time)."""
        conditions = []
        args: List[int] = []
        if start is not None:
            conditions.append("id >= ?")
            args.append((start - DAY) * 1000)
        if deck_ids is not None:
            conditions.append(self._card_deck_condition(deck_ids))
        where = ("WHERE " + " AND ".join(conditions)) if conditions else ""
        cmd = f"""
SELECT {self._day_expression("id / 1000", rollover)} AS day, COUNT()
FROM cards {where}
GROUP BY day ORDER BY day"""
        rows = self._db.all(cmd, *args)
        return [
            (int(day), int(count))
            for day, count in rows
            if (start is None or day >= start) and day <= today
        ]

    def _cards_due(
        self, today: int, stop: int, deck_ids: Optional[List[int]]
    ) -> DayCounts:
        """Due counts per day as (day_epoch, -count), ascending. Overdue cards
        count towards today, like Anki's own forecast."""
        sched_today = self._col.sched.today
        conditions = ["queue IN (2, 3)"]
        if deck_ids is not None:
            conditions.append(self._card_deck_condition(deck_ids))
        where = " AND ".join(conditions)

        # Cards in filtered decks keep their real due day in `odue`.
        cmd = f"""
SELECT MAX(due_eff - ?, 0) AS days_ahead, COUNT()
FROM (SELECT CASE WHEN odid != 0 THEN odue ELSE due END AS due_eff
      FROM cards WHERE {where})
WHERE due_eff < ?
GROUP BY days_ahead ORDER BY days_ahead"""
        rows = self._db.all(cmd, sched_today, sched_today + MAX_FORECAST_DAYS)

        result: DayCounts = []
        for days_ahead, count in rows:
            day = today + int(days_ahead) * DAY
            if day >= stop:
                break
            result.append((day, -int(count)))

        if is_debugging():
            logger.debug("cards due query: %s today=%s", cmd, sched_today)
            logger.debug("cards due result (%d days): %s", len(result), result[:10])
        return result
