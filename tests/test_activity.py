from datetime import timedelta

import pytest

from conftest import DAY, day_of, local_noon
from review_heatmap.activity import ActivityReporter


@pytest.fixture
def reporter(col, config):
    return ActivityReporter(col, config)


def test_no_history_gives_no_report(reporter):
    assert reporter.get_report() is None


def test_streaks_and_counts(reporter, helper):
    cid = helper.add_card()
    # reviews on today, yesterday, day before; a gap; then 4 consecutive days
    for days_ago in (0, 0, 1, 2, 5, 6, 7, 8):
        helper.review(cid, local_noon(days_ago))
    report = reporter.get_report()
    assert report is not None
    stats = report.stats
    assert stats.streak_cur.value == 3
    assert stats.streak_max.value == 4
    assert stats.activity_daily_avg.value == round(8 / 7)
    # 7 active days out of the 9 since the first review
    assert stats.pct_days_active.value == round(7 / 9 * 100)
    today = reporter.today()
    assert report.today == today * 1000
    assert report.activity[today] == 2
    assert report.activity[today - 5 * DAY] == 1
    assert report.start == (today - 8 * DAY) * 1000


def test_current_streak_broken_when_last_review_before_yesterday(reporter, helper):
    cid = helper.add_card()
    for days_ago in (2, 3, 4):
        helper.review(cid, local_noon(days_ago))
    stats = reporter.get_report().stats
    assert stats.streak_cur.value == 0
    assert stats.streak_max.value == 3


def test_current_streak_counts_when_last_review_was_yesterday(reporter, helper):
    cid = helper.add_card()
    helper.review(cid, local_noon(1))
    helper.review(cid, local_noon(2))
    assert reporter.get_report().stats.streak_cur.value == 2


def test_reviews_before_rollover_belong_to_previous_day(reporter, helper):
    cid = helper.add_card()
    early = local_noon(0).replace(hour=3, minute=30)  # 03:30 today, rollover 4
    helper.review(cid, early)
    report = reporter.get_report()
    assert list(report.activity) == [day_of(early, 4)]
    assert day_of(early, 4) == reporter.today() - DAY


def test_manual_reschedules_excluded_by_default(reporter, helper, config):
    cid = helper.add_card()
    helper.review(cid, local_noon(0), ease=0)
    assert reporter.get_report() is None
    config["synced"]["limresched"] = False
    assert reporter.get_report().activity[reporter.today()] == 1


def test_deleted_cards_optionally_excluded(reporter, helper, config, col):
    cid = helper.add_card()
    keep = helper.add_card(front="keep")
    helper.review(cid, local_noon(0))
    helper.review(keep, local_noon(0))
    col.remove_cards_and_orphaned_notes([cid])
    assert reporter.get_report().activity[reporter.today()] == 2
    config["synced"]["limcdel"] = True
    assert reporter.get_report().activity[reporter.today()] == 1


def test_ignored_decks_include_children(reporter, helper, config, col):
    parent = helper.add_card("Parent")
    child = helper.add_card("Parent::Child")
    other = helper.add_card("Other")
    for cid in (parent, child, other):
        helper.review(cid, local_noon(0))
    config["synced"]["limdecks"] = [col.decks.id("Parent")]
    assert reporter.get_report().activity[reporter.today()] == 1
    config["synced"]["limdecks"] = [col.decks.id("Parent"), col.decks.id("Other")]
    assert reporter.get_report() is None


def test_current_deck_only_includes_subdecks_and_filtered_cards(reporter, helper, col):
    a = helper.add_card("A")
    sub = helper.add_card("A::Sub")
    b = helper.add_card("B")
    for cid in (a, sub, b):
        helper.review(cid, local_noon(0))
    # a card from deck A currently sitting in a filtered deck still counts
    filtered = col.decks.new_filtered("Cram")
    helper.move_to_filtered(sub, filtered)
    col.decks.select(col.decks.id("A"))
    report = reporter.get_report(current_deck_only=True)
    assert report.activity[reporter.today()] == 2
    col.decks.select(col.decks.id("B"))
    assert reporter.get_report(current_deck_only=True).activity[reporter.today()] == 1


def test_forecast_groups_due_days_and_counts_overdue_as_today(reporter, helper):
    reviewed = helper.add_card()
    helper.review(reviewed, local_noon(3))
    for days in (3, 3, 10, -2):
        helper.make_due(helper.add_card(front=str(days)), days)
    report = reporter.get_report()
    today = reporter.today()
    assert report.activity[today] == -1  # the overdue card
    assert report.activity[today + 3 * DAY] == -2
    assert report.activity[today + 10 * DAY] == -1
    assert report.stop == (today + 10 * DAY) * 1000


def test_history_takes_precedence_over_forecast_today(reporter, helper):
    cid = helper.add_card()
    helper.review(cid, local_noon(0))
    helper.make_due(helper.add_card(front="due"), 0)
    assert reporter.get_report().activity[reporter.today()] == 1


def test_filtered_deck_cards_use_original_due(reporter, helper, col):
    cid = helper.add_card("Home")
    helper.review(cid, local_noon(0))
    helper.make_due(cid, 5)
    helper.move_to_filtered(cid, col.decks.new_filtered("Cram"))
    report = reporter.get_report()
    assert report.activity[reporter.today() + 5 * DAY] == -1


def test_limits(reporter, helper, config):
    cid = helper.add_card()
    for days_ago in (0, 10, 20):
        helper.review(cid, local_noon(days_ago))
    for days in (5, 50):
        helper.make_due(helper.add_card(front=str(days)), days)
    today = reporter.today()

    report = reporter.get_report(limhist=15, limfcst=30)
    assert set(report.activity) == {today, today - 10 * DAY, today + 5 * DAY}

    config["synced"]["limhist"] = 15
    config["synced"]["limfcst"] = 30
    assert set(reporter.get_report().activity) == {today, today - 10 * DAY, today + 5 * DAY}

    config["synced"]["limhist"] = 0
    config["synced"]["limdate"] = (local_noon(12)).date().isoformat()
    assert set(reporter.get_report().activity) == {today, today - 10 * DAY, today + 5 * DAY}

    # legacy timestamp form of the date limit
    config["synced"]["limdate"] = int(local_noon(12).timestamp())
    assert set(reporter.get_report().activity) == {today, today - 10 * DAY, today + 5 * DAY}


def test_future_dated_revlog_rows_are_ignored(reporter, helper):
    cid = helper.add_card()
    helper.review(cid, local_noon(0))
    helper.review(cid, local_noon(0) + timedelta(days=400))
    report = reporter.get_report()
    assert max(report.activity) == reporter.today()
    assert report.stats.pct_days_active.value == 100
