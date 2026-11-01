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
About dialog, including the author attribution required by the licence
"""

from typing import Optional

from aqt.qt import QDialog, QDialogButtonBox, QLabel, QVBoxLayout, QWidget, Qt

from ..consts import ADDON

# The exact wording and links of the first paragraph are prescribed by the
# additional licence terms (LICENSE, section 3). Do not alter them.
ATTRIBUTION_HTML = (
    'Based on the Anki add-on <a href="{upstream}">Review Heatmap</a> by Glutanimate. '
    '<a href="{support}">Click here to support Glutanimate\'s work.</a>'
).format(
    upstream=ADDON.LINKS["upstream"],
    support=ADDON.LINKS["support_original_author"],
)


def about_html() -> str:
    libraries = "".join(
        f'<li><a href="{lib["url"]}">{lib["name"]}</a> {lib["version"]} '
        f"by {lib['author']} ({lib['license']})</li>"
        for lib in ADDON.LIBRARIES
    )
    return f"""
<h2 style="margin-bottom:0">{ADDON.NAME} <small>v{ADDON.VERSION}</small></h2>
<p><b>This is a modified version</b>, updated for current Anki releases
(<a href="{ADDON.LINKS["fork"]}">source and changelog</a>). It is not the original
program and the original author is not responsible for it.</p>
<p>{ATTRIBUTION_HTML}</p>
<p>Copyright © 2016-2022 {ADDON.ORIGINAL_AUTHOR}; modifications © 2026.
Licensed under the {ADDON.LICENSE} (see the LICENSE file).</p>
<p>Bundled libraries:</p><ul>{libraries}</ul>
<p>Tips: shift-click the options button to cycle colour palettes, shift-click the
today button to switch calendar modes.</p>
"""


class AboutDialog(QDialog):
    def __init__(self, parent: Optional[QWidget] = None):
        super().__init__(parent)
        self.setWindowTitle(f"About {ADDON.NAME}")
        label = QLabel(about_html())
        label.setWordWrap(True)
        label.setOpenExternalLinks(True)
        label.setTextInteractionFlags(Qt.TextInteractionFlag.TextBrowserInteraction)
        buttons = QDialogButtonBox(QDialogButtonBox.StandardButton.Close)
        buttons.rejected.connect(self.reject)
        buttons.accepted.connect(self.accept)
        layout = QVBoxLayout(self)
        layout.addWidget(label)
        layout.addWidget(buttons)
        self.setMinimumWidth(420)


def invoke_about_dialog(parent: Optional[QWidget] = None) -> None:
    AboutDialog(parent=parent).exec()
