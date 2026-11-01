"""
Day bucketing across daylight-saving transitions (upstream issues 98, 128,
206, 213 and friends). Each case runs the probe in a subprocess with TZ set,
because the C library (used by both SQLite and Python) reads the zone once.
"""

import json
import os
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

import pytest

PROBE = Path(__file__).with_name("dst_probe.py")

# (zone, dates around a transition). Reviews are placed at wall-clock times
# that fall on both sides of the rollover hour on each date.
CASES = [
    ("Australia/Sydney", ["2025-10-04", "2025-10-05", "2025-10-06"]),  # forward
    ("Australia/Sydney", ["2025-04-05", "2025-04-06", "2025-04-07"]),  # back
    ("Pacific/Auckland", ["2025-09-27", "2025-09-28", "2025-09-29"]),  # forward
    ("Africa/Cairo", ["2025-04-24", "2025-04-25", "2025-04-26"]),  # forward (Friday)
    ("America/New_York", ["2025-03-08", "2025-03-09", "2025-03-10"]),  # forward
    ("America/New_York", ["2025-11-01", "2025-11-02", "2025-11-03"]),  # back
    ("Europe/Berlin", ["2025-03-29", "2025-03-30", "2025-03-31"]),  # forward
    ("Asia/Kolkata", ["2025-06-14", "2025-06-15", "2025-06-16"]),  # no DST, +05:30
    ("UTC", ["2025-06-14", "2025-06-15", "2025-06-16"]),
]
TIMES = ["00:30", "03:59", "04:00", "04:30", "12:00", "23:30"]


def expected_days(dates, rollover):
    counts = {}
    for date in dates:
        for time in TIMES:
            wall = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
            day = (wall - timedelta(hours=rollover)).date().isoformat()
            counts[day] = counts.get(day, 0) + 1
    return counts


def run_probe(zone, dates, rollover):
    env = dict(os.environ, TZ=zone)
    reviews = [f"{d} {t}" for d in dates for t in TIMES]
    proc = subprocess.run(
        [sys.executable, "-I", str(PROBE)],
        input=json.dumps({"reviews": reviews, "rollover": rollover}),
        capture_output=True,
        text=True,
        env=env,
        timeout=120,
    )
    assert proc.returncode == 0, proc.stderr
    return json.loads(proc.stdout)


@pytest.mark.parametrize("zone,dates", CASES, ids=[f"{z}:{d[1]}" for z, d in CASES])
@pytest.mark.parametrize("rollover", [4, 0])
def test_reviews_land_on_their_wall_clock_day(zone, dates, rollover):
    result = run_probe(zone, dates, rollover)
    assert result["days"] == expected_days(dates, rollover)
    # and clicking each day in the heatmap finds the card reviewed that day
    for iso, search in result["clicks"].items():
        assert search == f"cid:{result['cid']}", iso
