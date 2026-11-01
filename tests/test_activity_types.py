"""
Activity types other than reviews: time spent (upstream issue 26, pull
request 62), new cards learned (issue 124) and cards added (issue 11).
"""

from datetime import timedelta

import pytest

from conftest import DAY, local_noon
from review_heatmap.activity import ActivityReporter
from review_heatmap.controller import HeatmapController
from review_heatmap.finder import rewrite_search
from review_heatmap.renderer import HeatmapView


@pytest.fixture
def reporter(col, config):
    return ActivityReporter(col, config)


def set_time(col, rev_id, ms):
    col.db.execute("update revlog set time = ? where id = ?", ms, rev_id)


def test_time_spent_is_minutes_per_day(reporter, helper, config, col):
    cid = helper.add_card()
    set_time(col, helper.review(cid, local_noon(0)), 90_000)
    set_time(col, helper.review(cid, local_noon(0)), 30_000)
    set_time(col, helper.review(cid, local_noon(1)), 5_000)  # rounds up to a minute
    config["synced"]["activity"] = "time"
    report = reporter.get_report()
    today = reporter.today()
    assert report.activity_type == "time"
    assert report.activity == {today - DAY: 1, today: 2}
    assert report.stats.activity_daily_avg.value == 2
    # no forecast for time
    helper.make_due(helper.add_card(front="due"), 3)
    assert all(v > 0 for v in reporter.get_report().activity.values())


def test_cards_learned_counts_first_reviews_only(reporter, helper, config):
    a = helper.add_card(front="a")
    b = helper.add_card(front="b")
    helper.review(a, local_noon(3))
    helper.review(a, local_noon(1))
    helper.review(b, local_noon(1))
    helper.review(b, local_noon(0))
    config["synced"]["activity"] = "learned"
    report = reporter.get_report()
    today = reporter.today()
    assert report.activity == {today - 3 * DAY: 1, today - DAY: 1}
    assert report.stats.streak_cur.value == 1


def test_cards_added_uses_creation_time(reporter, helper, config, col):
    a = helper.add_card(front="a")
    b = helper.add_card(front="b")
    old = int((local_noon(10)).timestamp() * 1000)
    col.db.execute("update cards set id = ? where id = ?", old, b)
    config["synced"]["activity"] = "added"
    report = reporter.get_report()
    today = reporter.today()
    assert report.activity == {today - 10 * DAY: 1, today: 1}
    # deck limits apply to creation counts too
    col.decks.select(col.decks.id("Default"))
    assert reporter.get_report(current_deck_only=True).activity[today] == 1


def test_unknown_activity_falls_back_to_reviews(reporter, helper, config):
    cid = helper.add_card()
    helper.review(cid, local_noon(0))
    config["synced"]["activity"] = "bogus"
    assert reporter.get_report().activity_type == "reviews"


def test_learned_and_added_click_through(col, config, helper):
    a = helper.add_card(front="a")
    b = helper.add_card(front="b")
    helper.review(a, local_noon(2))
    helper.review(a, local_noon(0))
    helper.review(b, local_noon(0))
    iso_then = local_noon(2).date().isoformat()
    iso_today = local_noon(0).date().isoformat()
    assert rewrite_search(f"lid:{iso_then}", col, config) == f"cid:{a}"
    assert rewrite_search(f"deck:current lid:{iso_today}", col, config) == f"deck:current cid:{b}"
    added = rewrite_search(f"aid:{iso_today}", col, config)
    assert set(added[4:].split(",")) == {str(a), str(b)}
    assert rewrite_search("aid:2001-01-01", col, config) == "cid:0"


def test_render_passes_activity_options_and_labels(mw, config, helper):
    cid = helper.add_card()
    helper.review(cid, local_noon(0))
    config["synced"]["activity"] = "added"
    html = HeatmapController(mw, config).render_for_view(HeatmapView.deckbrowser)
    assert '"activity": "added"' in html and '"token": "aid"' in html and '"verb": "added"' in html
    assert "Days active:" in html

    config["synced"]["activity"] = "time"
    html = HeatmapController(mw, config).render_for_view(HeatmapView.deckbrowser)
    assert '"unit": "minute"' in html
    assert "Daily average:" in html and ">1 minute<" in html

