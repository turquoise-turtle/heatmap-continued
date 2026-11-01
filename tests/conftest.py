"""
Shared fixtures.

The add-on's Python package is imported directly from src/. Importing the
package runs its Anki initialisation, which is a no-op when aqt.mw is None,
so the data layer can be tested against a real `anki` collection without Qt.
"""

import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
from typing import Dict, Optional

import pytest

SRC = Path(__file__).resolve().parents[1] / "src"
sys.path.insert(0, str(SRC))

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

from anki.collection import Collection  # noqa: E402

DAY = 86400


class FakeAddonManager:
    def __init__(self):
        self.store: Dict[str, dict] = {}

    def getConfig(self, module):
        return self.store.get(module)

    def writeConfig(self, module, conf):
        self.store[module] = conf


class FakeMW:
    """The parts of aqt.main.AnkiQt the non-GUI modules touch."""

    def __init__(self, col: Collection):
        self.col = col
        self.pm = SimpleNamespace(profile={})
        self.addonManager = FakeAddonManager()
        self.state = "deckBrowser"


@pytest.fixture
def col(tmp_path):
    collection = Collection(str(tmp_path / "collection.anki2"))
    collection.set_config("rollover", 4)
    yield collection
    collection.close()


@pytest.fixture
def mw(col):
    return FakeMW(col)


@pytest.fixture
def config(mw):
    from review_heatmap.config import ConfigManager

    return ConfigManager(mw)


class Helper:
    """Builds cards and review-log rows at specific local wall-clock times."""

    def __init__(self, col: Collection):
        self.col = col
        self.model = col.models.by_name("Basic")

    def add_card(self, deck_name: str = "Default", front: str = "q") -> int:
        did = self.col.decks.id(deck_name)
        note = self.col.new_note(self.model)
        note["Front"] = front
        self.col.add_note(note, did)
        return note.card_ids()[0]

    def review(
        self, cid: int, when: datetime, ease: int = 3, rev_id: Optional[int] = None, ivl: int = 1
    ) -> int:
        """Insert a revlog row for a local wall-clock time (naive datetime).
        `ivl` is the new interval in days, i.e. the card falls due `ivl` days later."""
        rev_id = rev_id or int(when.timestamp() * 1000)
        while self.col.db.scalar("select 1 from revlog where id = ?", rev_id):
            rev_id += 1
        self.col.db.execute(
            "insert into revlog (id, cid, usn, ease, ivl, lastIvl, factor, time, type)"
            " values (?, ?, -1, ?, ?, 1, 2500, 5000, 1)",
            rev_id,
            cid,
            ease,
            ivl,
        )
        return rev_id

    def make_due(self, cid: int, days_from_today: int, queue: int = 2) -> None:
        card = self.col.get_card(cid)
        card.queue = queue
        card.type = 2
        card.due = self.col.sched.today + days_from_today
        self.col.update_card(card)

    def move_to_filtered(self, cid: int, filtered_did: int) -> None:
        """Mimic a card sitting in a filtered deck (odid/odue hold the originals)."""
        card = self.col.get_card(cid)
        card.odid = card.did
        card.odue = card.due
        card.did = filtered_did
        card.due = -100000
        self.col.update_card(card)


@pytest.fixture
def helper(col):
    return Helper(col)


def local_noon(days_ago: int) -> datetime:
    today = datetime.now().replace(hour=12, minute=0, second=0, microsecond=0)
    return today - timedelta(days=days_ago)


def day_of(when: datetime, rollover: int = 4) -> int:
    """Expected midnight-UTC day key for a local wall-clock time."""
    shifted = when - timedelta(hours=rollover)
    from datetime import timezone

    return int(datetime(shifted.year, shifted.month, shifted.day, tzinfo=timezone.utc).timestamp())

