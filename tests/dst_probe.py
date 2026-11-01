"""
Probe run in a subprocess with a specific TZ environment variable.

Creates a collection, inserts review-log rows at the local wall-clock times
given on stdin (JSON list of "YYYY-MM-DD HH:MM" strings) and prints the day
bucketing produced by the add-on as JSON {iso_date: count}.
"""

import json
import sys
import tempfile
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
sys.path.insert(0, str(Path(__file__).resolve().parent))

from anki.collection import Collection  # noqa: E402

from conftest import FakeMW, Helper  # noqa: E402
from review_heatmap.activity import ActivityReporter  # noqa: E402
from review_heatmap.config import ConfigManager  # noqa: E402
from review_heatmap.finder import rewrite_search  # noqa: E402
from review_heatmap.times import day_epoch_to_iso_date  # noqa: E402


def main() -> None:
    request = json.load(sys.stdin)
    rollover = request["rollover"]
    with tempfile.TemporaryDirectory() as tmp:
        col = Collection(str(Path(tmp) / "collection.anki2"))
        col.set_config("rollover", rollover)
        helper = Helper(col)
        cid = helper.add_card()
        for stamp in request["reviews"]:
            helper.review(cid, datetime.strptime(stamp, "%Y-%m-%d %H:%M"))
        config = ConfigManager(FakeMW(col))
        reporter = ActivityReporter(col, config)
        today = reporter.today(rollover)
        rows = reporter._cards_done(today, rollover, None, None)
        days = {day_epoch_to_iso_date(day): count for day, count in rows}
        # Clicking a day must find exactly the cards reviewed on it
        clicks = {}
        for iso in days:
            search = rewrite_search(f"rid:{iso}", col, config)
            clicks[iso] = search
        col.close()
    json.dump({"days": days, "clicks": clicks, "cid": cid}, sys.stdout)


if __name__ == "__main__":
    main()
