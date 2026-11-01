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
Integration with Anki's screens
"""

import weakref
from typing import TYPE_CHECKING, Any, Callable, Optional

from anki.hooks import wrap
from anki.stats import CollectionStats
from aqt import gui_hooks

from .log import logger
from .renderer import HeatmapView

if TYPE_CHECKING:
    from aqt.deckbrowser import DeckBrowser, DeckBrowserContent
    from aqt.main import AnkiQt
    from aqt.overview import Overview, OverviewContent
    from aqt.stats import DeckStats

    from .controller import HeatmapController


class ViewManager:
    """Registers the hooks that draw the heatmap on Anki's screens and knows
    how to refresh them after settings change."""

    def __init__(self, mw: "AnkiQt", controller: "HeatmapController"):
        self._mw = mw
        self._controller = controller
        self._open_stats_dialogs: "weakref.WeakSet[DeckStats]" = weakref.WeakSet()

    def register(self) -> None:
        gui_hooks.deck_browser_will_render_content.append(self.on_deck_browser_render)
        gui_hooks.overview_will_render_content.append(self.on_overview_render)
        gui_hooks.stats_dialog_old_will_show.append(self.on_legacy_stats_show)
        CollectionStats.dueGraph = wrap(  # type: ignore[method-assign]
            CollectionStats.dueGraph, self.on_legacy_stats_due_graph, "around"
        )
        gui_hooks.profile_did_open.append(self.on_profile_changed)
        gui_hooks.profile_will_close.append(self.on_profile_changed)

    # Deck browser (main screen)

    def on_deck_browser_render(self, deck_browser: "DeckBrowser", content: "DeckBrowserContent") -> None:
        html = self._render_safely(HeatmapView.deckbrowser)
        if html:
            content.stats += html

    # Deck overview

    def on_overview_render(self, overview: "Overview", content: "OverviewContent") -> None:
        html = self._render_safely(HeatmapView.overview, current_deck_only=True)
        if html:
            content.table += html

    # Legacy statistics window (shift-click on Stats)

    def on_legacy_stats_show(self, dialog: "DeckStats") -> None:
        self._open_stats_dialogs.add(dialog)
        web = dialog.form.web
        if getattr(web, "_bridge_context", None) is None:
            # Anki does not wire up pycmd() for the legacy stats page; without a
            # context our bridge hook cannot find a parent for dialogs.
            web.set_bridge_command(lambda cmd: None, dialog)

    def on_legacy_stats_due_graph(self, collection_stats: CollectionStats, _old: Callable) -> str:
        original = _old(collection_stats)
        limits = {0: (31, 31), 1: (365, 365)}.get(collection_stats.type, (None, None))
        html = self._render_safely(
            HeatmapView.stats,
            limhist=limits[0],
            limfcst=limits[1],
            current_deck_only=not collection_stats.wholeCollection,
        )
        return original + (html or "")

    # Profile lifecycle

    def on_profile_changed(self, *_args: Any) -> None:
        self._controller.reset()

    # Refreshing

    def refresh(self) -> None:
        """Redraw whichever screen is showing the heatmap."""
        self._controller.invalidate_cache()
        mw = self._mw
        if mw.col is None:
            return
        if mw.state == "deckBrowser":
            mw.deckBrowser.refresh()
        elif mw.state == "overview":
            mw.overview.refresh()
        for dialog in list(self._open_stats_dialogs):
            try:
                dialog.refresh()
            except Exception:  # dialog is closing
                pass

    # Helpers

    def _render_safely(
        self,
        view: HeatmapView,
        limhist: Optional[int] = None,
        limfcst: Optional[int] = None,
        current_deck_only: bool = False,
    ) -> str:
        try:
            return self._controller.render_for_view(
                view, limhist=limhist, limfcst=limfcst, current_deck_only=current_deck_only
            )
        except Exception:
            # Never take Anki's screens down with us
            logger.exception("Review Heatmap failed to render %s", view.name)
            return ""
