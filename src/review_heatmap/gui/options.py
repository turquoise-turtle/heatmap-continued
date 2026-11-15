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
Options dialog

Written directly in Python rather than generated from a Qt Designer form, so
the add-on needs no compilation step and works unchanged across Qt versions.
"""

from datetime import datetime
from typing import TYPE_CHECKING, Dict, List, Optional, Tuple

from aqt.qt import (
    QAbstractItemView,
    QAction,
    QCheckBox,
    QComboBox,
    QDate,
    QDateEdit,
    QDialog,
    QDialogButtonBox,
    QFormLayout,
    QGroupBox,
    QHBoxLayout,
    QInputDialog,
    QLabel,
    QLineEdit,
    QListWidget,
    QListWidgetItem,
    QPushButton,
    QSpinBox,
    Qt,
    QTabWidget,
    QVBoxLayout,
    QWidget,
)
from aqt.utils import askUser, tooltip

from ..config import (
    activity_types,
    dark_mode_styles,
    heatmap_colors,
    heatmap_modes,
    normalise_colors,
)
from ..consts import ADDON

if TYPE_CHECKING:
    from aqt.main import AnkiQt

    from ..config import ConfigManager
    from ..views import ViewManager


def _combo(choices: Dict[str, Dict[str, str]]) -> QComboBox:
    combo = QComboBox()
    for key, info in choices.items():
        combo.addItem(info["label"], key)
    return combo


def _select(combo: QComboBox, key: str) -> None:
    index = combo.findData(key)
    combo.setCurrentIndex(index if index >= 0 else 0)


class OptionsDialog(QDialog):
    def __init__(self, mw: "AnkiQt", config: "ConfigManager", parent: Optional[QWidget] = None):
        super().__init__(parent or mw)
        self.mw = mw
        self.config = config
        self.setWindowTitle(f"{ADDON.NAME} Options")
        self.setMinimumWidth(480)
        self._build()
        self._load()

    # Layout

    def _build(self) -> None:
        tabs = QTabWidget()
        tabs.addTab(self._appearance_tab(), "Appearance")
        tabs.addTab(self._data_tab(), "Data")
        tabs.addTab(self._advanced_tab(), "Advanced")

        buttons = QDialogButtonBox(
            QDialogButtonBox.StandardButton.Ok
            | QDialogButtonBox.StandardButton.Cancel
            | QDialogButtonBox.StandardButton.RestoreDefaults
        )
        buttons.accepted.connect(self.accept)
        buttons.rejected.connect(self.reject)
        restore = buttons.button(QDialogButtonBox.StandardButton.RestoreDefaults)
        assert restore is not None
        restore.clicked.connect(self._restore_defaults)
        about = QPushButton("About…")
        about.clicked.connect(self._show_about)
        buttons.addButton(about, QDialogButtonBox.ButtonRole.HelpRole)

        layout = QVBoxLayout(self)
        layout.addWidget(tabs)
        layout.addWidget(buttons)

    def _appearance_tab(self) -> QWidget:
        page = QWidget()
        form = QFormLayout(page)

        self.activity = _combo(activity_types)
        self.activity.setToolTip("Alt-click the 'today' button on the heatmap to cycle")
        form.addRow("Activity shown:", self.activity)

        self.colors = _combo(heatmap_colors)
        self.colors.setToolTip("Shift-click the options button on the heatmap to cycle palettes")
        form.addRow("Colour palette:", self.colors)

        self.custom_colors = QLineEdit()
        self.custom_colors.setPlaceholderText("#d6e685 #bddb7a … ten colours, light to dark")
        self.custom_colors.setToolTip(
            "Ten hex colours from fewest to most reviews, separated by spaces or commas"
        )
        self.colors.currentIndexChanged.connect(
            lambda _i: self.custom_colors.setEnabled(self.colors.currentData() == "custom")
        )
        form.addRow("Custom palette:", self.custom_colors)

        self.darkmode = _combo(dark_mode_styles)
        form.addRow("Palette in dark mode:", self.darkmode)

        self.mode = _combo(heatmap_modes)
        self.mode.setToolTip("Shift-click the 'today' button on the heatmap to switch modes")
        form.addRow("Calendar mode:", self.mode)

        group = QGroupBox("Show heatmap on")
        group_layout = QVBoxLayout(group)
        self.show_deckbrowser = QCheckBox("Deck browser (main screen)")
        self.show_overview = QCheckBox("Deck overview and finished-deck screen")
        self.show_stats = QCheckBox("Statistics window (legacy, shift-click Stats)")
        for box in (self.show_deckbrowser, self.show_overview, self.show_stats):
            group_layout.addWidget(box)
        form.addRow(group)

        self.statsvis = QCheckBox("Show streak statistics even where the heatmap is hidden")
        form.addRow(self.statsvis)

        self.habit = QCheckBox("Show habit strength (moving average of active days)")
        form.addRow(self.habit)


        self.panel = QCheckBox("Draw a translucent panel behind the heatmap (for background images)")
        form.addRow(self.panel)
        return page

    def _data_tab(self) -> QWidget:
        page = QWidget()
        form = QFormLayout(page)

        self.limhist = QSpinBox()
        self.limhist.setRange(0, 36500)
        self.limhist.setSpecialValueText("No limit")
        self.limhist.setSuffix(" days")
        form.addRow("History limit:", self.limhist)

        self.limfcst = QSpinBox()
        self.limfcst.setRange(0, 36500)
        self.limfcst.setSpecialValueText("No limit")
        self.limfcst.setSuffix(" days")
        form.addRow("Forecast limit:", self.limfcst)

        date_row = QHBoxLayout()
        self.limdate_enabled = QCheckBox("Ignore data before")
        self.limdate = QDateEdit()
        self.limdate.setCalendarPopup(True)
        self.limdate.setDisplayFormat("yyyy-MM-dd")
        self.limdate.setMaximumDate(QDate.currentDate())
        self.limdate_enabled.toggled.connect(self.limdate.setEnabled)
        date_row.addWidget(self.limdate_enabled)
        date_row.addWidget(self.limdate)
        date_row.addStretch()
        form.addRow(date_row)

        streaks = QGroupBox("Streaks")
        streaks_form = QFormLayout(streaks)
        self.streak_min = QSpinBox()
        self.streak_min.setRange(1, 100000)
        self.streak_min.setSuffix(" reviews")
        self.streak_min.setToolTip("Days with fewer reviews than this do not count towards a streak")
        streaks_form.addRow("Minimum for a streak day:", self.streak_min)
        self.streak_free_days = QCheckBox("Days with no reviews and nothing due do not break the streak")
        self.streak_free_days.setToolTip(
            "Whether cards were due is reconstructed from the review log, so it is an approximation"
        )
        streaks_form.addRow(self.streak_free_days)
        form.addRow(streaks)

        self.limcdel = QCheckBox("Exclude reviews of cards that have since been deleted")
        form.addRow(self.limcdel)
        self.limcrt = QCheckBox("Ignore review entries older than this collection (e.g. from shared decks)")
        form.addRow(self.limcrt)
        self.limresched = QCheckBox("Exclude manual reschedules and 'forget' from history")
        form.addRow(self.limresched)

        group = QGroupBox("Ignored decks")
        group_layout = QHBoxLayout(group)
        self.decks = QListWidget()
        self.decks.setSelectionMode(QAbstractItemView.SelectionMode.ExtendedSelection)
        group_layout.addWidget(self.decks)
        side = QVBoxLayout()
        add = QPushButton("Add…")
        add.clicked.connect(self._add_deck)
        remove = QPushButton("Remove")
        remove.clicked.connect(self._remove_decks)
        side.addWidget(add)
        side.addWidget(remove)
        side.addStretch()
        group_layout.addLayout(side)
        form.addRow(group)
        return page

    def _advanced_tab(self) -> QWidget:
        page = QWidget()
        layout = QVBoxLayout(page)
        self.debug = QCheckBox("Write debug information to Anki's add-on log")
        layout.addWidget(self.debug)
        note = QLabel(
            f"Logs are stored under logs/addons/{ADDON.MODULE} in your Anki data "
            "folder. Appearance and data settings are synchronised with your "
            "collection; display settings are per profile."
        )
        note.setWordWrap(True)
        layout.addWidget(note)
        layout.addStretch()
        return page

    # Loading and saving

    def _load(self) -> None:
        synced = self.config["synced"]
        profile = self.config["profile"]
        local = self.config["local"]

        _select(self.activity, synced.get("activity", "reviews"))
        self.habit.setChecked(bool(synced.get("habit", False)))
        _select(self.colors, synced.get("colors", "lime"))
        _select(self.darkmode, synced.get("darkmode", "inverted"))
        _select(self.mode, synced.get("mode", "year"))
        self.custom_colors.setText(" ".join(synced.get("custom_colors") or []))
        self.custom_colors.setEnabled(self.colors.currentData() == "custom")
        self.panel.setChecked(bool(synced.get("panel", False)))
        self.streak_min.setValue(max(1, int(synced.get("streak_min") or 1)))
        self.streak_free_days.setChecked(bool(synced.get("streak_free_days", False)))

        display = profile.get("display", {})
        self.show_deckbrowser.setChecked(display.get("deckbrowser", True))
        self.show_overview.setChecked(display.get("overview", True))
        self.show_stats.setChecked(display.get("stats", True))
        self.statsvis.setChecked(profile.get("statsvis", True))

        self.limhist.setValue(int(synced.get("limhist") or 0))
        self.limfcst.setValue(int(synced.get("limfcst") or 0))

        limdate = synced.get("limdate") or 0
        iso = self._limdate_to_iso(limdate)
        self.limdate_enabled.setChecked(bool(iso))
        self.limdate.setEnabled(bool(iso))
        self.limdate.setDate(QDate.fromString(iso, "yyyy-MM-dd") if iso else QDate.currentDate())

        self.limcdel.setChecked(bool(synced.get("limcdel", False)))
        self.limcrt.setChecked(bool(synced.get("limcrt", False)))
        self.limresched.setChecked(bool(synced.get("limresched", True)))

        self.decks.clear()
        for did in synced.get("limdecks") or []:
            name = self.mw.col.decks.name_if_exists(int(did)) if self.mw.col else None
            if name:
                self._add_deck_item(name, int(did))

        self.debug.setChecked(bool(local.get("debug", False)))

    def _limdate_to_iso(self, value) -> str:
        if not value:
            return ""
        if isinstance(value, str):
            return value
        # Earlier versions stored a Unix timestamp
        try:
            return datetime.fromtimestamp(int(value)).date().isoformat()
        except (OverflowError, OSError, ValueError):
            return ""

    def accept(self) -> None:
        synced = self.config["synced"]
        profile = self.config["profile"]
        local = self.config["local"]

        custom_colors = normalise_colors(self.custom_colors.text())
        if self.colors.currentData() == "custom" and custom_colors is None:
            tooltip("The custom palette needs exactly ten hex colours, e.g. #d6e685", parent=self)
            return
        if custom_colors is not None:
            synced["custom_colors"] = custom_colors
        synced["panel"] = self.panel.isChecked()
        synced["streak_min"] = self.streak_min.value()
        synced["streak_free_days"] = self.streak_free_days.isChecked()

        synced["activity"] = self.activity.currentData()
        synced["habit"] = self.habit.isChecked()
        synced["colors"] = self.colors.currentData()
        synced["darkmode"] = self.darkmode.currentData()
        synced["mode"] = self.mode.currentData()
        synced["limhist"] = self.limhist.value()
        synced["limfcst"] = self.limfcst.value()
        synced["limdate"] = (
            self.limdate.date().toString("yyyy-MM-dd") if self.limdate_enabled.isChecked() else 0
        )
        synced["limcdel"] = self.limcdel.isChecked()
        synced["limcrt"] = self.limcrt.isChecked()
        synced["limresched"] = self.limresched.isChecked()
        synced["limdecks"] = [
            self.decks.item(i).data(Qt.ItemDataRole.UserRole) for i in range(self.decks.count())
        ]
        synced["version"] = ADDON.VERSION

        profile["display"] = {
            "deckbrowser": self.show_deckbrowser.isChecked(),
            "overview": self.show_overview.isChecked(),
            "stats": self.show_stats.isChecked(),
        }
        profile["statsvis"] = self.statsvis.isChecked()
        profile["version"] = ADDON.VERSION

        local["debug"] = self.debug.isChecked()

        self.config.save()
        super().accept()

    # Actions

    def _restore_defaults(self) -> None:
        if not askUser("Restore all Heatmap Continued settings to their defaults?", parent=self):
            return
        self.config.restore_defaults()
        self._load()
        tooltip("Defaults restored", parent=self)

    def _show_about(self) -> None:
        from .about import invoke_about_dialog

        invoke_about_dialog(parent=self)

    def _add_deck(self) -> None:
        if self.mw.col is None:
            return
        existing = {
            self.decks.item(i).data(Qt.ItemDataRole.UserRole) for i in range(self.decks.count())
        }
        candidates: List[Tuple[str, int]] = sorted(
            (d.name, d.id) for d in self.mw.col.decks.all_names_and_ids() if d.id not in existing
        )
        if not candidates:
            tooltip("All decks are already ignored", parent=self)
            return
        name, ok = QInputDialog.getItem(
            self, "Ignore deck", "Deck:", [c[0] for c in candidates], 0, False
        )
        if not ok or not name:
            return
        did = dict(candidates)[name]
        self._add_deck_item(name, did)

    def _add_deck_item(self, name: str, did: int) -> None:
        item = QListWidgetItem(name)
        item.setData(Qt.ItemDataRole.UserRole, did)
        self.decks.addItem(item)

    def _remove_decks(self) -> None:
        for item in self.decks.selectedItems():
            self.decks.takeItem(self.decks.row(item))


def invoke_options_dialog(mw: "AnkiQt", config: "ConfigManager", parent: Optional[QWidget] = None) -> int:
    if mw.col is None:
        tooltip("Please open a profile first")
        return 0
    return OptionsDialog(mw, config, parent=parent).exec()


class OptionsIntegration:
    """Tools menu entry and the add-on manager's Config button."""

    def __init__(self, mw: "AnkiQt", config: "ConfigManager", views: "ViewManager"):
        self._mw = mw
        self._config = config
        self._views = views

    def register(self) -> None:
        self._mw.addonManager.setConfigAction(ADDON.MODULE, self.open)
        action = QAction("&Heatmap Continued Options…", self._mw)
        action.triggered.connect(lambda _checked=False: self.open())
        self._mw.form.menuTools.addAction(action)

    def open(self) -> None:
        invoke_options_dialog(self._mw, self._config)

