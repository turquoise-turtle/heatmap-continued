"""
Streak options: minimum reviews per day (upstream issue 188) and days with
nothing due not breaking a streak (issues 82, 129; pull request 131).
"""

import pytest

from conftest import local_noon
from review_heatmap.activity import ActivityReporter


@pytest.fixture
def reporter(col, config):
    return ActivityReporter(col, config)


def streaks(reporter):
    stats = reporter.get_report().stats
    return stats.streak_max.value, stats.streak_cur.value


def test_threshold_excludes_light_days(reporter, helper, config):
    cid = helper.add_card()
    for days_ago, count in ((0, 5), (1, 1), (2, 5), (3, 5)):
        for _ in range(count):
            helper.review(cid, local_noon(days_ago))
    assert streaks(reporter) == (4, 4)
    config["synced"]["streak_min"] = 3
    # yesterday only had one review: the current streak is just today
    assert streaks(reporter) == (2, 1)


def test_free_day_does_not_break_streak(reporter, helper, config):
    cid = helper.add_card()
    # reviews 4, 3 and 1 days ago; the card is scheduled far ahead, so nothing
    # was due 2 days ago
    for days_ago in (4, 3, 1):
        helper.review(cid, local_noon(days_ago), ivl=30)
    # without the option the gap breaks the streak; yesterday alone is current
    assert streaks(reporter) == (2, 1)
    config["synced"]["streak_free_days"] = True
    # yesterday counts towards the current streak; today is still in progress
    assert streaks(reporter) == (3, 3)


def test_day_with_due_cards_still_breaks_streak(reporter, helper, config):
    config["synced"]["streak_free_days"] = True
    cid = helper.add_card()
    helper.review(cid, local_noon(4), ivl=2)  # due 2 days ago and not reviewed
    helper.review(cid, local_noon(3), ivl=30)  # ... except it was reviewed 3 days ago, due in 30
    other = helper.add_card(front="other")
    helper.review(other, local_noon(5), ivl=3)  # due 2 days ago, never reviewed again
    helper.review(cid, local_noon(1), ivl=30)
    # days ago: 5 5 4 3 [2: other was due] 1 -> longest 3 (5,4,3), current 1
    assert streaks(reporter) == (3, 1)


def test_review_resets_due_projection(reporter, helper, config):
    config["synced"]["streak_free_days"] = True
    cid = helper.add_card()
    helper.review(cid, local_noon(6), ivl=4)  # would be due 2 days ago
    helper.review(cid, local_noon(5), ivl=60)  # reviewed earlier, so not due until far later
    helper.review(cid, local_noon(1), ivl=60)
    # days 4, 3 and 2 ago were free, so the streak runs 6, 5, 1 = 3 days
    assert streaks(reporter) == (3, 3)


def test_free_days_respect_deck_limits(reporter, helper, config, col):
    config["synced"]["streak_free_days"] = True
    a = helper.add_card("A")
    b = helper.add_card("B")
    helper.review(a, local_noon(3), ivl=30)
    helper.review(b, local_noon(4), ivl=2)  # deck B card was due 2 days ago
    helper.review(a, local_noon(1), ivl=30)
    col.decks.select(col.decks.id("A"))
    report = reporter.get_report(current_deck_only=True)
    assert report.stats.streak_cur.value == 2
    report = reporter.get_report()
    assert report.stats.streak_cur.value == 1
