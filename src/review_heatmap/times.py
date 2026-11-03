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
Shared date handling

The add-on represents a calendar day as the Unix timestamp of 00:00 UTC on
that date. The web layer turns it back into a local calendar date, and it
keeps all day arithmetic at exactly 86400 seconds per day regardless of
daylight-saving transitions.

Which calendar day a review belongs to is decided in local wall-clock time
after shifting back by the "next day starts at" rollover hour. Doing the shift
after the local-time conversion (rather than on the raw timestamp, as earlier
versions did) is what keeps reviews on the right day when the clocks change.
"""

import re
from datetime import datetime, timedelta, timezone
from typing import TYPE_CHECKING, Tuple, Union

if TYPE_CHECKING:
    from anki.dbproxy import DBProxy

DAY = 86400

_ISO_DATE = re.compile(r"^(\d{4})-(\d{2})-(\d{2})$")


def _rollover_modifier(rollover: int) -> str:
    rollover = int(rollover) % 24
    return f"'-{rollover} hours'"


def day_start_epoch(
    db: "DBProxy", when: Union[str, int, float] = "now", *, rollover: int = 0
) -> int:
    """Midnight-UTC timestamp of the local (rollover-shifted) day that `when`
    falls on. `when` is either the literal string "now" or a Unix timestamp
    in seconds."""
    if isinstance(when, (int, float)):
        value, args = "?, 'unixepoch'", (int(when),)
    elif when == "now":
        value, args = "'now'", ()
    else:
        raise ValueError(f"unsupported time specifier: {when!r}")
    cmd = (
        "SELECT CAST(STRFTIME('%s', {value}, 'localtime', {rollover}, "
        "'start of day') AS int)"
    ).format(value=value, rollover=_rollover_modifier(rollover))
    return int(db.scalar(cmd, *args))


def iso_date_to_day_epoch(iso_date: str) -> int:
    """Midnight-UTC timestamp for a YYYY-MM-DD string."""
    match = _ISO_DATE.match(iso_date)
    if not match:
        raise ValueError(f"not an ISO date: {iso_date!r}")
    year, month, day = (int(g) for g in match.groups())
    return int(datetime(year, month, day, tzinfo=timezone.utc).timestamp())


def day_epoch_to_iso_date(day_epoch: int) -> str:
    return datetime.fromtimestamp(day_epoch, tz=timezone.utc).date().isoformat()


def revlog_id_range_for_date(iso_date: str, rollover: int) -> Tuple[int, int]:
    """Half-open range of revlog ids (milliseconds) belonging to the given
    local calendar date, honouring the rollover hour. Uses the C library's
    local-time rules, the same ones SQLite's 'localtime' modifier uses, so the
    result matches the heatmap's own day bucketing."""
    match = _ISO_DATE.match(iso_date)
    if not match:
        raise ValueError(f"not an ISO date: {iso_date!r}")
    year, month, day = (int(g) for g in match.groups())
    rollover = int(rollover) % 24
    start = datetime(year, month, day) + timedelta(hours=rollover)
    end = start + timedelta(days=1)
    return int(start.timestamp()) * 1000, int(end.timestamp()) * 1000
