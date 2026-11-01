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
Heatmap and stats element generation
"""

import json
from enum import Enum
from typing import TYPE_CHECKING, Dict, List, NamedTuple, Optional, Tuple

from .activity import ActivityReport, ActivityReporter, StatsEntry, StatsType
from .config import activity_types, heatmap_colors, heatmap_modes, normalise_colors
from .web_content import (
    CSS_DARK_PREFIX,
    CSS_DISABLE_HEATMAP,
    CSS_DISABLE_STATS,
    CSS_MODE_PREFIX,
    CSS_PANEL,
    CSS_THEME_PREFIX,
    CSS_VIEW_PREFIX,
    HTML_HEATMAP,
    HTML_INFO_NODATA,
    HTML_MAIN_ELEMENT,
    HTML_STREAK,
    HTML_STREAK_ENTRY,
)

if TYPE_CHECKING:
    from aqt.main import AnkiQt

    from .config import ConfigManager


class HeatmapView(Enum):
    deckbrowser = 0
    overview = 1
    stats = 2


class _StatsVisual(NamedTuple):
    levels: Optional[List[Tuple[float, str]]]
    unit: Optional[str]


class _RenderCache(NamedTuple):
    html: str
    key: tuple


_CSS_COLORS: Tuple[str, ...] = ("rh-col0",) + tuple(f"rh-col{i}" for i in range(11, 21))


def _levels(thresholds, indices) -> List[Tuple[float, str]]:
    return list(zip(thresholds, (_CSS_COLORS[i] for i in indices)))


class HeatmapRenderer:
    _stats_formatting: Dict[StatsType, _StatsVisual] = {
        StatsType.streak: _StatsVisual(
            levels=_levels((0, 14, 30, 90, 180, 365), (0, 2, 4, 6, 9, 10)), unit="day"
        ),
        StatsType.percentage: _StatsVisual(
            levels=_levels((0, 25, 50, 60, 70, 80, 85, 90, 95, 99), range(11)),
            unit=None,
        ),
        StatsType.cards: _StatsVisual(levels=None, unit="card"),
    }

    _dynamic_legend_factors: Tuple[float, ...] = (
        0.125, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 4.0,
    )

    def __init__(self, mw: "AnkiQt", reporter: ActivityReporter, config: "ConfigManager"):
        self._mw = mw
        self._config = config
        self._reporter = reporter
        self._cache: Optional[_RenderCache] = None

    def render(
        self,
        view: HeatmapView,
        limhist: Optional[int] = None,
        limfcst: Optional[int] = None,
        current_deck_only: bool = False,
    ) -> str:
        key = self._cache_key(view, limhist, limfcst, current_deck_only)
        if self._cache and self._cache.key == key:
            return self._cache.html

        prefs = self._config["profile"]
        report = self._reporter.get_report(
            limhist=limhist, limfcst=limfcst, current_deck_only=current_deck_only
        )
        classes = self._css_classes(view)

        style = self._inline_style()

        if report is None:
            html = HTML_MAIN_ELEMENT.format(
                content=HTML_INFO_NODATA, classes=" ".join(classes), style=style
            )
            self._cache = _RenderCache(html=html, key=key)
            return html

        dynamic_legend = self._dynamic_legend(report.stats.activity_daily_avg.value)

        if prefs["display"].get(view.name, True):
            heatmap = self._heatmap_element(
                report, self._heatmap_legend(dynamic_legend), current_deck_only
            )
        else:
            heatmap = ""
            classes.append(CSS_DISABLE_HEATMAP)

        if prefs["display"].get(view.name, True) or prefs.get("statsvis", True):
            stats = self._stats_element(report, self._stats_legend(dynamic_legend))
        else:
            stats = ""
            classes.append(CSS_DISABLE_STATS)

        if not current_deck_only:
            self._publish_performance(report)

        html = HTML_MAIN_ELEMENT.format(
            content=heatmap + stats, classes=" ".join(classes), style=style
        )
        self._cache = _RenderCache(html=html, key=key)
        return html

    def invalidate_cache(self) -> None:
        self._cache = None

    # Helpers

    def _cache_key(self, view, limhist, limfcst, current_deck_only) -> tuple:
        col = self._mw.col
        deck = col.decks.get_current_id() if current_deck_only else None
        synced = self._config["synced"]
        return (
            view,
            limhist,
            limfcst,
            current_deck_only,
            deck,
            col.mod,
            self._reporter.today(),
            synced.get("colors"),
            synced.get("mode"),
            synced.get("darkmode"),
            synced.get("panel"),
            synced.get("activity"),
            synced.get("streak_min"),
            synced.get("streak_free_days"),
            tuple(synced.get("custom_colors") or ()),
        )

    def _inline_style(self) -> str:
        """CSS custom properties for the user-defined palette."""
        conf = self._config["synced"]
        if conf.get("colors") != "custom":
            return ""
        colors = normalise_colors(conf.get("custom_colors"))
        if colors is None:
            return ""
        return ";".join(f"--rh-c{i}:{c}" for i, c in enumerate(colors, start=1))

    def _css_classes(self, view: HeatmapView) -> List[str]:
        conf = self._config["synced"]
        theme = conf.get("colors") if conf.get("colors") in heatmap_colors else "lime"
        mode = conf.get("mode") if conf.get("mode") in heatmap_modes else "year"
        dark = conf.get("darkmode", "inverted")
        classes = [
            f"{CSS_THEME_PREFIX}-{theme}",
            f"{CSS_MODE_PREFIX}-{mode}",
            f"{CSS_VIEW_PREFIX}-{view.name}",
            f"{CSS_DARK_PREFIX}-{dark}",
        ]
        if conf.get("panel"):
            classes.append(CSS_PANEL)
        return classes

    def _heatmap_element(
        self, report: ActivityReport, legend: List[float], current_deck_only: bool
    ) -> str:
        mode_key = self._config["synced"].get("mode")
        mode = heatmap_modes.get(mode_key, heatmap_modes["year"])
        options = {
            "domain": mode["domain"],
            "subdomain": mode["subDomain"],
            "range": mode["range"],
            "domLabForm": mode["domLabForm"],
            "start": report.start,
            "stop": report.stop,
            "today": report.today,
            "offset": report.offset,
            "legend": legend,
            "whole": not current_deck_only,
            "activity": report.activity_type,
            "unit": activity_types[report.activity_type]["unit"],
            "verb": activity_types[report.activity_type]["verb"],
            "token": activity_types[report.activity_type]["token"],
        }
        return HTML_HEATMAP.format(
            options=json.dumps(options), data=json.dumps(report.activity)
        )

    _stats_labels: Dict[str, Tuple[str, str]] = {
        "activity_daily_avg": ("Daily average", "Average on active days"),
        "pct_days_active": ("Days learned", "Percentage of days with activity since the first recorded day"),
        "streak_max": ("Longest streak", "Longest run of consecutive active days"),
        "streak_cur": ("Current streak", "Current run of consecutive active days"),
    }

    def _stats_element(self, report: ActivityReport, legend: List[float]) -> str:
        dynamic_levels = list(zip(legend, _CSS_COLORS))
        unit_name = activity_types[report.activity_type]["unit"]
        entries: List[str] = []
        stats = report.stats._asdict()
        entry: Optional[StatsEntry]
        for name in ("activity_daily_avg", "pct_days_active", "streak_max", "streak_cur"):
            entry = stats[name]
            if entry is None:
                continue
            formatting = self._stats_formatting[entry.type]
            levels = formatting.levels if formatting.levels is not None else dynamic_levels
            css_class = _CSS_COLORS[0]
            for threshold, css_class in levels:
                if entry.value <= threshold:
                    break
            unit = formatting.unit
            if unit == "card":
                unit = unit_name
            if unit:
                text = self._pluralise(entry.value, unit)
            elif entry.type is StatsType.percentage:
                text = f"{entry.value}%"
            else:
                text = str(entry.value)
            label, title = self._stats_labels[name]
            if name == "pct_days_active" and report.activity_type == "added":
                label = "Days active"
            entries.append(
                HTML_STREAK_ENTRY.format(label=label, title=title, css_class=css_class, text=text)
            )
        return HTML_STREAK.format(entries="\n".join(entries))

    @staticmethod
    def _heatmap_legend(legend: List[float]) -> List[float]:
        # Negative mirror image for future dates lets the forecast use its own
        # colours without modifying cal-heatmap.
        return [-i for i in legend[::-1]] + [0.0] + legend

    @staticmethod
    def _stats_legend(legend: List[float]) -> List[float]:
        return [0.0] + legend

    def _dynamic_legend(self, average: int) -> List[float]:
        avg = max(20, average)
        return [factor * avg for factor in self._dynamic_legend_factors]

    @staticmethod
    def _pluralise(count: int, term: str) -> str:
        return f"{count} {term}{'s' if abs(count) != 1 else ''}"

    def _publish_performance(self, report: ActivityReport) -> None:
        # Other add-ons read these attributes; keep them for compatibility.
        self._mw._hmStreakMax = report.stats.streak_max.value  # type: ignore[attr-defined]
        self._mw._hmStreakCur = report.stats.streak_cur.value  # type: ignore[attr-defined]
        self._mw._hmActivityDailyAvg = report.stats.activity_daily_avg.value  # type: ignore[attr-defined]
