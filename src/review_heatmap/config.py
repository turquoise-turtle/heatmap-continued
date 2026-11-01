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
Add-on configuration

Three storages, kept at the same locations earlier versions used so existing
settings carry over:

- ``synced``: stored in the collection config under the key ``heatmap`` and
  therefore synchronised across devices (appearance, data limits).
- ``profile``: stored in the Anki profile under the key ``heatmap`` and local
  to this computer (which screens show the heatmap).
- ``local``: Anki's regular add-on config.json (debug switch only).

Storages are read lazily and re-read whenever a profile is opened, which fixes
the stale collection references of earlier versions.
"""

import copy
import re
from typing import TYPE_CHECKING, Any, Callable, Dict, List, Optional

from .consts import ADDON

if TYPE_CHECKING:
    from aqt.main import AnkiQt

__all__ = [
    "heatmap_colors",
    "heatmap_modes",
    "dark_mode_styles",
    "default_custom_colors",
    "config_defaults",
    "ConfigManager",
    "normalise_colors",
]

_HEX_COLOR = re.compile(r"^#?([0-9a-fA-F]{6})$")


def normalise_colors(values) -> Optional[List[str]]:
    """Return ten '#rrggbb' strings, or None if the input is not a valid palette."""
    if isinstance(values, str):
        values = re.split(r"[\s,;]+", values.strip())
    if not isinstance(values, (list, tuple)) or len(values) != 10:
        return None
    result = []
    for value in values:
        match = _HEX_COLOR.match(str(value).strip())
        if not match:
            return None
        result.append("#" + match.group(1).lower())
    return result

CONF_KEY = "heatmap"

# Order matters: it defines the dropdown order and the shift-click cycle.
heatmap_colors: Dict[str, Dict[str, str]] = {
    "lime": {"label": "Lime"},
    "olive": {"label": "Olive"},
    "ice": {"label": "Ice"},
    "magenta": {"label": "Magenta"},
    "flame": {"label": "Flame"},
    "grape": {"label": "Grape"},
    "teal": {"label": "Teal"},
    "slate": {"label": "Slate"},
    "mocha": {"label": "Mocha"},
    "custom": {"label": "Custom"},
}

# Ten steps, light to dark, used by the "custom" palette until the user edits it
default_custom_colors: List[str] = [
    "#d6e685", "#bddb7a", "#a4d06f", "#8cc665", "#74ba58",
    "#5cae4c", "#44a340", "#378f36", "#2a7b2c", "#1e6823",
]

heatmap_modes: Dict[str, Dict[str, Any]] = {
    "year": {
        "label": "Yearly Overview",
        "domain": "year",
        "subDomain": "day",
        "range": 1,
        "domLabForm": "%Y",
    },
    "months": {
        "label": "Continuous Timeline",
        "domain": "month",
        "subDomain": "day",
        "range": 9,
        "domLabForm": "%b '%y",
    },
}

dark_mode_styles: Dict[str, Dict[str, str]] = {
    "inverted": {"label": "Inverted (lighter means more reviews)"},
    "same": {"label": "Same as light mode (darker means more reviews)"},
}

config_defaults: Dict[str, Dict[str, Any]] = {
    "synced": {
        "colors": "lime",
        "mode": "year",
        "darkmode": "inverted",
        "custom_colors": list(default_custom_colors),
        "panel": False,
        "streak_min": 1,
        "streak_free_days": False,
        "limdate": 0,
        "limhist": 0,
        "limfcst": 0,
        "limcdel": False,
        "limresched": True,
        "limdecks": [],
        "version": ADDON.VERSION,
    },
    "profile": {
        "display": {"deckbrowser": True, "overview": True, "stats": True},
        "statsvis": True,
        "snanki": {"highscore": 0, "lastplayed": 0, "livesleft": None},
        "version": ADDON.VERSION,
    },
    "local": {"debug": False},
}


def _merge_defaults(defaults: Dict[str, Any], stored: Any) -> Dict[str, Any]:
    """Return defaults overlaid with stored values, recursing into dicts so new
    keys introduced by updates pick up their defaults."""
    result = copy.deepcopy(defaults)
    if not isinstance(stored, dict):
        return result
    for key, value in stored.items():
        if isinstance(value, dict) and isinstance(result.get(key), dict):
            result[key] = _merge_defaults(result[key], value)
        else:
            result[key] = copy.deepcopy(value)
    return result


class ConfigManager:
    def __init__(self, mw: "AnkiQt"):
        self._mw = mw
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._listeners: List[Callable[[], None]] = []

    # Dictionary-style access, e.g. config["synced"]["colors"]

    def __getitem__(self, storage: str) -> Dict[str, Any]:
        if storage not in config_defaults:
            raise KeyError(storage)
        if storage not in self._cache:
            self._cache[storage] = self._read(storage)
        return self._cache[storage]

    @property
    def synced(self) -> Dict[str, Any]:
        return self["synced"]

    @property
    def profile(self) -> Dict[str, Any]:
        return self["profile"]

    @property
    def local(self) -> Dict[str, Any]:
        return self["local"]

    # Lifecycle

    def reset_cache(self) -> None:
        """Forget cached values, e.g. after a profile switch."""
        self._cache.clear()

    def save(self) -> None:
        for storage in list(self._cache):
            self._write(storage, self._cache[storage])
        for listener in self._listeners:
            listener()

    def restore_defaults(self) -> None:
        for storage, defaults in config_defaults.items():
            self._cache[storage] = copy.deepcopy(defaults)
        self.save()

    def add_save_listener(self, callback: Callable[[], None]) -> None:
        self._listeners.append(callback)

    # Storage back-ends

    def _read(self, storage: str) -> Dict[str, Any]:
        defaults = config_defaults[storage]
        stored: Any = None
        if storage == "synced":
            col = self._mw.col
            if col is not None:
                stored = col.get_config(CONF_KEY, None)
        elif storage == "profile":
            profile = getattr(self._mw.pm, "profile", None)
            if profile is not None:
                stored = profile.get(CONF_KEY)
        elif storage == "local":
            stored = self._mw.addonManager.getConfig(ADDON.MODULE)
        return _merge_defaults(defaults, stored)

    def _write(self, storage: str, values: Dict[str, Any]) -> None:
        if storage == "synced":
            col = self._mw.col
            if col is None:
                return
            col.set_config(CONF_KEY, values)
        elif storage == "profile":
            profile = getattr(self._mw.pm, "profile", None)
            if profile is None:
                return
            profile[CONF_KEY] = values
        elif storage == "local":
            self._mw.addonManager.writeConfig(ADDON.MODULE, values)
