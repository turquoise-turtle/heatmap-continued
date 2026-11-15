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
Add-on wide constants
"""

from ._version import __version__


class ADDON:
    # "Review Heatmap" is reserved by the licence's additional terms (section
    # 1), so the fork has its own name; the original's name appears only in
    # the required attribution and legal notices.
    NAME = "Heatmap Continued"
    MODULE = "review_heatmap"
    VERSION = __version__
    LICENSE = "GNU AGPLv3 with additional terms"
    # Required by the licence's additional terms (see LICENSE, section 3).
    ORIGINAL_AUTHOR = "Aristotelis P. (Glutanimate)"
    LINKS = {
        "upstream": "https://github.com/glutanimate/review-heatmap/",
        "support_original_author": "https://glutanimate.com/support-my-work/",
        "patreon": "https://www.patreon.com/glutanimate",
        "fork": "https://github.com/turquoise-turtle/review-heatmap",
        "help": "https://github.com/glutanimate/review-heatmap/wiki",
    }
