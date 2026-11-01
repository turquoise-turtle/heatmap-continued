from datetime import datetime

from conftest import day_of
from review_heatmap.times import (
    DAY,
    day_epoch_to_iso_date,
    day_start_epoch,
    iso_date_to_day_epoch,
    revlog_id_range_for_date,
)


def test_iso_round_trip():
    epoch = iso_date_to_day_epoch("2025-10-05")
    assert epoch % DAY == 0
    assert day_epoch_to_iso_date(epoch) == "2025-10-05"


def test_day_start_now_matches_python(col):
    for rollover in (0, 4, 23):
        now = datetime.now()
        expected = day_of(now, rollover)
        actual = day_start_epoch(col.db, "now", rollover=rollover)
        # allow for the test straddling the rollover boundary
        assert actual in (expected, expected - DAY, expected + DAY)


def test_day_start_timestamp_respects_rollover(col):
    local = datetime.now().replace(hour=3, minute=30, second=0, microsecond=0)
    ts = int(local.timestamp())
    assert day_start_epoch(col.db, ts, rollover=4) == day_of(local, 4)
    assert day_start_epoch(col.db, ts, rollover=0) == day_of(local, 0)
    assert day_start_epoch(col.db, ts, rollover=4) == day_start_epoch(col.db, ts, rollover=0) - DAY


def test_revlog_range_covers_a_rollover_shifted_day():
    start, end = revlog_id_range_for_date("2025-06-15", 4)
    assert start == int(datetime(2025, 6, 15, 4).timestamp()) * 1000
    assert end == int(datetime(2025, 6, 16, 4).timestamp()) * 1000
    assert (end - start) // 1000 in (DAY, DAY - 3600, DAY + 3600)
