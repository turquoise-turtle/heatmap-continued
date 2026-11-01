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
JavaScript to Python communication
"""

from typing import TYPE_CHECKING, Any, Callable, Dict, Optional, Tuple

import aqt
from aqt.qt import QWidget

from .config import activity_types, heatmap_colors, heatmap_modes

if TYPE_CHECKING:
    from aqt.main import AnkiQt

    from .config import ConfigManager
    from .controller import HeatmapController

HANDLED_TYPE = Tuple[bool, Any]

_command_handlers: Dict[str, Callable] = {}


def command(name: str):
    def decorator(method):
        _command_handlers[name] = method
        return method

    return decorator


class HeatmapBridge:
    """Handles ``revhm_<command>[:<payload>]`` messages sent by the web view."""

    identifier = "revhm"

    def __init__(self, mw: "AnkiQt", config: "ConfigManager", controller: "HeatmapController"):
        self._mw = mw
        self._config = config
        self._controller = controller

    def register(self) -> None:
        from aqt.gui_hooks import webview_did_receive_js_message

        webview_did_receive_js_message.append(self.on_js_message)

    def on_js_message(self, handled: HANDLED_TYPE, message: str, context: Any) -> HANDLED_TYPE:
        if not message.startswith(self.identifier + "_"):
            return handled
        _, command_and_payload = message.split("_", 1)
        name, _, payload = command_and_payload.partition(":")
        handler = _command_handlers.get(name)
        if handler is None:
            return handled
        return (True, handler(self, payload or None, context))

    # Commands

    @command("browse")
    def browse(self, search: Optional[str], context: Any) -> None:
        if not search:
            return
        browser = aqt.dialogs.open("Browser", self._mw, search=(search,))
        # Older/newer browsers differ in whether `search` is applied on reopen
        if getattr(browser, "current_search", lambda: None)() != search:
            try:
                browser.search_for(search)
            except AttributeError:
                pass

    @command("opts")
    def options(self, payload: Any, context: Any) -> None:
        from .gui.options import invoke_options_dialog

        invoke_options_dialog(self._mw, self._config, parent=self._parent(context))

    @command("about")
    @command("contrib")
    def about(self, payload: Any, context: Any) -> None:
        from .gui.about import invoke_about_dialog

        invoke_about_dialog(parent=self._parent(context))

    @command("modeswitch")
    def cycle_modes(self, payload: Any, context: Any) -> None:
        self._cycle("mode", list(heatmap_modes))

    @command("themeswitch")
    def cycle_themes(self, payload: Any, context: Any) -> None:
        self._cycle("colors", list(heatmap_colors))

    @command("activityswitch")
    def cycle_activity(self, payload: Any, context: Any) -> None:
        self._cycle("activity", list(activity_types))

    @command("snanki")
    def snanki(self, payload: Any, context: Any) -> None:
        from .gui.snanki import invoke_snanki

        invoke_snanki(self._mw, self._config, parent=self._parent(context))

    # Helpers

    def _cycle(self, key: str, choices) -> None:
        synced = self._config["synced"]
        try:
            index = choices.index(synced.get(key))
        except ValueError:
            index = -1
        synced[key] = choices[(index + 1) % len(choices)]
        self._config.save()

    def _parent(self, context: Any) -> QWidget:
        return context if isinstance(context, QWidget) else self._mw
