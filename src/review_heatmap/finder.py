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
Browser search extensions

Clicking a day in the heatmap opens the browser with a search like
``rid:2025-10-05``. Anki has no search for "reviewed on this calendar date",
so the token is rewritten into a plain ``cid:`` search before Anki parses it.
Rewriting the search string (instead of injecting result ids, as earlier
versions did) works in both the cards and notes modes of the browser.
"""

import re
from typing import TYPE_CHECKING, List

from .times import revlog_id_range_for_date

if TYPE_CHECKING:
    from anki.collection import Collection
    from aqt.browser.table import SearchContext

    from .config import ConfigManager

_RE_RID_DATE = re.compile(r"(?<![\w:])rid:(\d{4}-\d{2}-\d{2})(?![\w:])")
# lid: cards first answered on that date; aid: cards added on that date
_RE_LID_DATE = re.compile(r"(?<![\w:])lid:(\d{4}-\d{2}-\d{2})(?![\w:])")
_RE_AID_DATE = re.compile(r"(?<![\w:])aid:(\d{4}-\d{2}-\d{2})(?![\w:])")
# Legacy format produced by earlier versions: millisecond range
_RE_RID_RANGE = re.compile(r"(?<![\w:])rid:(\d{9,})[:,](\d{9,})(?![\w:])")


def cards_reviewed_between(
    col: "Collection", start_ms: int, end_ms: int, include_rescheduled: bool
) -> List[int]:
    ease_condition = "" if include_rescheduled else " AND ease > 0"
    return col.db.list(
        "SELECT DISTINCT cid FROM revlog WHERE id >= ? AND id < ?"
        + ease_condition
        + " AND cid IN (SELECT id FROM cards)",
        start_ms,
        end_ms,
    )


def cards_first_reviewed_between(
    col: "Collection", start_ms: int, end_ms: int, include_rescheduled: bool
) -> List[int]:
    ease_condition = "" if include_rescheduled else " WHERE ease > 0"
    return col.db.list(
        "SELECT cid FROM (SELECT cid, MIN(id) AS first_id FROM revlog"
        + ease_condition
        + " GROUP BY cid) WHERE first_id >= ? AND first_id < ?"
        " AND cid IN (SELECT id FROM cards)",
        start_ms,
        end_ms,
    )


def cards_added_between(col: "Collection", start_ms: int, end_ms: int) -> List[int]:
    return col.db.list("SELECT id FROM cards WHERE id >= ? AND id < ?", start_ms, end_ms)


def rewrite_search(search: str, col: "Collection", config: "ConfigManager") -> str:
    """Replace the add-on's date tokens with equivalent cid: tokens."""
    if not any(token in search for token in ("rid:", "lid:", "aid:")):
        return search

    include_rescheduled = not config["synced"].get("limresched", True)

    def to_cid(start_ms: int, end_ms: int) -> str:
        cids = cards_reviewed_between(col, start_ms, end_ms, include_rescheduled)
        # cid:0 is a valid search that matches nothing
        return "cid:" + (",".join(str(c) for c in cids) if cids else "0")

    def day_range(iso_date: str):
        rollover = int(col.get_config("rollover", 4))
        return revlog_id_range_for_date(iso_date, rollover)

    def to_cid_list(cids: List[int]) -> str:
        return "cid:" + (",".join(str(c) for c in cids) if cids else "0")

    def replace_date(match: "re.Match[str]") -> str:
        return to_cid(*day_range(match.group(1)))

    def replace_range(match: "re.Match[str]") -> str:
        return to_cid(int(match.group(1)), int(match.group(2)))

    def replace_learned(match: "re.Match[str]") -> str:
        start_ms, end_ms = day_range(match.group(1))
        return to_cid_list(cards_first_reviewed_between(col, start_ms, end_ms, include_rescheduled))

    def replace_added(match: "re.Match[str]") -> str:
        return to_cid_list(cards_added_between(col, *day_range(match.group(1))))

    search = _RE_RID_DATE.sub(replace_date, search)
    search = _RE_RID_RANGE.sub(replace_range, search)
    search = _RE_LID_DATE.sub(replace_learned, search)
    search = _RE_AID_DATE.sub(replace_added, search)
    return search


class FinderExtension:
    def __init__(self, mw, config: "ConfigManager"):
        self._mw = mw
        self._config = config

    def register(self) -> None:
        from aqt.gui_hooks import browser_will_search

        browser_will_search.append(self.on_browser_will_search)

    def on_browser_will_search(self, search_context: "SearchContext") -> None:
        search = search_context.search
        if not isinstance(search, str) or not any(t in search for t in ("rid:", "lid:", "aid:")):
            return
        col = self._mw.col
        if col is None:
            return
        search_context.search = rewrite_search(search, col, self._config)

