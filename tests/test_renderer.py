import json
import re

from conftest import local_noon
from review_heatmap.controller import HeatmapController
from review_heatmap.renderer import HeatmapView


def test_render_without_data_shows_hint(mw, config):
    html = HeatmapController(mw, config).render_for_view(HeatmapView.deckbrowser)
    assert "No activity data" in html
    assert "rh-theme-lime" in html and "rh-dark-inverted" in html


def test_render_contains_options_data_and_classes(mw, config, helper):
    cid = helper.add_card()
    helper.review(cid, local_noon(0))
    helper.review(cid, local_noon(1))
    config["synced"]["colors"] = "mocha"
    config["synced"]["darkmode"] = "same"
    config["synced"]["mode"] = "months"

    controller = HeatmapController(mw, config)
    html = controller.render_for_view(HeatmapView.deckbrowser)

    for cls in ("rh-theme-mocha", "rh-dark-same", "rh-mode-months", "rh-view-deckbrowser"):
        assert cls in html
    assert "/_addons/review_heatmap/web/anki-review-heatmap.js" in html

    options = json.loads(re.search(r"new ReviewHeatmap\((\{.*?\})\);", html, re.S).group(1))
    assert options["domain"] == "month" and options["range"] == 9
    assert options["whole"] is True and options["offset"] == 4
    data = json.loads(re.search(r"reviewHeatmap\.create\((\{.*?\})\);", html, re.S).group(1))
    assert list(data.values()) == [1, 1]
    assert "Current streak:" in html and ">2 days<" in html


def test_render_is_cached_until_collection_changes(mw, config, helper):
    cid = helper.add_card()
    helper.review(cid, local_noon(0))
    controller = HeatmapController(mw, config)
    first = controller.render_for_view(HeatmapView.deckbrowser)
    assert controller.render_for_view(HeatmapView.deckbrowser) is first
    helper.review(cid, local_noon(1))
    mw.col.db.execute("update col set mod = mod + 1")
    second = controller.render_for_view(HeatmapView.deckbrowser)
    assert second is not first and ">2 days<" in second


def test_hidden_views_only_show_stats(mw, config, helper):
    cid = helper.add_card()
    helper.review(cid, local_noon(0))
    config["profile"]["display"]["overview"] = False
    html = HeatmapController(mw, config).render_for_view(HeatmapView.overview, current_deck_only=True)
    assert "rh-disable-heatmap" in html and "cal-heatmap" not in html
    assert "Current streak:" in html
    config["profile"]["statsvis"] = False
    html = HeatmapController(mw, config).render_for_view(HeatmapView.overview, current_deck_only=True)
    assert "rh-disable-stats" in html and "Current streak:" not in html


def test_config_round_trip_and_defaults(mw, config):
    config["synced"]["colors"] = "teal"
    config["profile"]["display"]["stats"] = False
    config["local"]["debug"] = True
    config.save()
    fresh = type(config)(mw)
    assert fresh["synced"]["colors"] == "teal"
    assert fresh["synced"]["limresched"] is True  # default filled in
    assert fresh["profile"]["display"]["stats"] is False
    assert fresh["local"]["debug"] is True
    assert mw.col.get_config("heatmap")["colors"] == "teal"
    fresh.restore_defaults()
    assert type(config)(mw)["synced"]["colors"] == "lime"
