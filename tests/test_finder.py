from datetime import timedelta

from conftest import local_noon
from review_heatmap.finder import FinderExtension, rewrite_search
from review_heatmap.times import day_epoch_to_iso_date


def test_rid_date_is_rewritten_to_cids(col, config, helper):
    a = helper.add_card(front="a")
    b = helper.add_card(front="b")
    c = helper.add_card(front="c")
    when = local_noon(2)
    helper.review(a, when)
    helper.review(b, when + timedelta(hours=3))
    helper.review(c, when + timedelta(days=1))
    helper.review(c, when, ease=0)  # manual reschedule, excluded by default

    iso = when.date().isoformat()
    result = rewrite_search(f"deck:current rid:{iso}", col, config)
    assert result.startswith("deck:current cid:")
    ids = {int(x) for x in result.split("cid:")[1].split(",")}
    assert ids == {a, b}

    config["synced"]["limresched"] = False
    ids = {int(x) for x in rewrite_search(f"rid:{iso}", col, config).split("cid:")[1].split(",")}
    assert ids == {a, b, c}


def test_rid_with_no_matches_yields_empty_search(col, config):
    assert rewrite_search("rid:2001-01-01", col, config) == "cid:0"


def test_legacy_range_format_still_works(col, config, helper):
    a = helper.add_card()
    rev_id = helper.review(a, local_noon(1))
    assert rewrite_search(f"rid:{rev_id - 1}:{rev_id + 1}", col, config) == f"cid:{a}"


def test_unrelated_searches_untouched(col, config):
    assert rewrite_search("deck:current prop:due=3", col, config) == "deck:current prop:due=3"
    assert rewrite_search("tag:rid:2020-01-01", col, config) == "tag:rid:2020-01-01"


def test_hook_rewrites_search_context(mw, config, helper):
    a = helper.add_card()
    helper.review(a, local_noon(0))

    class Ctx:
        search = "rid:" + day_epoch_to_iso_date(
            __import__("review_heatmap.activity", fromlist=["ActivityReporter"]).ActivityReporter(mw.col, config).today()
        )

    ctx = Ctx()
    FinderExtension(mw, config).on_browser_will_search(ctx)
    assert ctx.search == f"cid:{a}"
