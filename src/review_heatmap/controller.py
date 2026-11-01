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
Overarching control of heatmap rendering and state
"""

from typing import TYPE_CHECKING, Optional

from .activity import ActivityReporter
from .errors import CollectionError
from .renderer import HeatmapRenderer, HeatmapView

if TYPE_CHECKING:
    from aqt.main import AnkiQt

    from .config import ConfigManager


class HeatmapController:
    def __init__(self, mw: "AnkiQt", config: "ConfigManager"):
        self._mw = mw
        self._config = config
        self._renderer: Optional[HeatmapRenderer] = None
        self._col_id: Optional[int] = None

    @property
    def config(self) -> "ConfigManager":
        """The live configuration; changes saved through it refresh the views."""
        return self._config

    def render_for_view(
        self,
        view: HeatmapView,
        limhist: Optional[int] = None,
        limfcst: Optional[int] = None,
        current_deck_only: bool = False,
    ) -> str:
        col = self._mw.col
        if col is None or col.db is None:
            raise CollectionError("Anki collection and/or database is not ready")

        # Profile switches and full syncs replace the collection object, so the
        # reporter is rebuilt whenever a different collection shows up.
        if self._renderer is None or self._col_id != id(col):
            reporter = ActivityReporter(col, self._config)
            self._renderer = HeatmapRenderer(self._mw, reporter, self._config)
            self._col_id = id(col)

        return self._renderer.render(view, limhist, limfcst, current_deck_only)

    def reset(self) -> None:
        """Drop all cached state (profile change, config change)."""
        self._renderer = None
        self._col_id = None
        self._config.reset_cache()

    def invalidate_cache(self) -> None:
        if self._renderer is not None:
            self._renderer.invalidate_cache()
