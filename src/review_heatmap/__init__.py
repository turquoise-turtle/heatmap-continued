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
Review Heatmap: visualises past and future review activity as a calendar
heatmap on Anki's deck browser, deck overview and legacy statistics screens.
"""

from ._version import __version__

__all__ = ["__version__", "initialize_addon"]


def initialize_addon() -> None:
    from aqt import mw

    if mw is None:  # imported outside Anki's GUI, e.g. by tests
        return

    from .config import ConfigManager
    from .controller import HeatmapController
    from .finder import FinderExtension
    from .gui.options import OptionsIntegration
    from .log import set_debug
    from .views import ViewManager
    from .web_bridge import HeatmapBridge

    mw.addonManager.setWebExports(__name__, r"web.*")

    config = ConfigManager(mw)
    set_debug(bool(config["local"].get("debug")))

    controller = HeatmapController(mw, config)
    views = ViewManager(mw, controller)
    views.register()

    HeatmapBridge(mw, config, controller).register()
    FinderExtension(mw, config).register()
    OptionsIntegration(mw, config, views).register()

    def on_config_saved() -> None:
        set_debug(bool(config["local"].get("debug")))
        views.refresh()

    config.add_save_listener(on_config_saved)

    # Kept for add-ons that reach for the controller through mw
    mw._review_heatmap = controller  # type: ignore[attr-defined]


initialize_addon()
