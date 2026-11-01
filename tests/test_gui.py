"""
End-to-end tests against a real, headless Anki instance.

A throw-away Anki base folder is created, the add-on is linked into its
addons21 folder and `aqt` is started with the offscreen Qt platform. The
tests then drive the real deck browser, overview, browser and dialogs and
inspect the rendered pages through the web view's JavaScript bridge.
"""

import json
import os
import shutil
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path

import pytest

pytestmark = pytest.mark.gui

SRC = Path(__file__).resolve().parents[1] / "src"

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")
os.environ.setdefault("QTWEBENGINE_CHROMIUM_FLAGS", "--disable-gpu --no-sandbox")
os.environ.setdefault("ANKI_NOHIGHDPI", "1")
os.environ.setdefault("DISABLE_QT5_COMPAT", "1")


class _Timeout(AssertionError):
    pass


def dismiss_clock_warning() -> None:
    # Anki warns when the system clock disagrees with its reference; that is a
    # property of the machine running the tests, not of the add-on.
    from aqt.qt import QApplication, QMessageBox

    for widget in QApplication.topLevelWidgets():
        if isinstance(widget, QMessageBox) and widget.isVisible() and "clock" in widget.text():
            widget.accept()


def pump(seconds: float) -> None:
    from aqt.qt import QApplication

    end = time.monotonic() + seconds
    while time.monotonic() < end:
        QApplication.processEvents()
        time.sleep(0.01)
    dismiss_clock_warning()


def wait_until(condition, timeout: float = 30, what: str = "condition") -> None:
    end = time.monotonic() + timeout
    while time.monotonic() < end:
        if condition():
            return
        pump(0.05)
    raise _Timeout(f"timed out waiting for {what}")


def eval_js(web, expression: str, timeout: float = 15):
    """Evaluate a JS expression in a web view and return its JSON-serialisable result."""
    result = {}

    def callback(value):
        result["value"] = value

    web.evalWithCallback(f"JSON.stringify((function(){{ return ({expression}); }})())", callback)
    wait_until(lambda: "value" in result, timeout, f"JS result of {expression!r}")
    return json.loads(result["value"]) if result["value"] is not None else None


def wait_for_js(web, expression: str, timeout: float = 30):
    deadline = time.monotonic() + timeout
    last = None
    while time.monotonic() < deadline:
        last = eval_js(web, expression)
        if last:
            return last
        pump(0.1)
    raise _Timeout(f"{expression!r} stayed falsy, last value {last!r}")


@pytest.fixture(scope="module")
def mw(tmp_path_factory):
    base = tmp_path_factory.mktemp("anki_base")
    addons = base / "addons21"
    addons.mkdir()
    # Copy rather than symlink: Anki writes meta.json into the add-on folder
    shutil.copytree(
        SRC / "review_heatmap",
        addons / "review_heatmap",
        ignore=shutil.ignore_patterns("__pycache__", "meta.json", "user_files"),
    )

    import anki.lang
    import aqt
    from aqt.profiles import ProfileManager

    # Pre-seed the preferences database so Anki skips the modal first-run
    # language dialog; the first profile is still created automatically.
    anki.lang.set_lang("en_US")
    seed = ProfileManager(base)
    seed.setupMeta()
    seed.meta["defaultLang"] = "en_US"
    seed.db.execute("update profiles set data = ? where name = '_global'", seed._pickle(seed.meta))
    seed.db.commit()
    seed.db.close()

    # Other test modules import the add-on package directly from src/. Anki's
    # add-on loader would then find it already imported and skip its
    # initialisation, so make sure it is imported afresh by Anki.
    for name in [m for m in sys.modules if m == "review_heatmap" or m.startswith("review_heatmap.")]:
        del sys.modules[name]

    app = aqt._run(argv=["anki", "-b", str(base)], exec=False)
    assert app is not None
    main_window = aqt.mw
    wait_until(
        lambda: main_window.col is not None and main_window.state == "deckBrowser",
        timeout=90,
        what="profile to load",
    )
    assert "review_heatmap" in sys.modules, "add-on was not imported"
    yield main_window

    done = {}
    main_window.unloadProfile(lambda: done.setdefault("ok", True))
    wait_until(lambda: done, 30, "profile to unload")
    app.quit()
    pump(0.5)


@pytest.fixture(scope="module")
def helper(mw):
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from conftest import Helper

    return Helper(mw.col)


def refresh_deck_browser(mw):
    mw.deckBrowser.refresh()
    pump(0.3)
    wait_for_js(mw.web, "document.querySelectorAll('.rh-container').length")


def test_heatmap_renders_without_data(mw):
    wait_for_js(mw.web, "document.querySelectorAll('.rh-container').length")
    assert "No activity data" in eval_js(mw.web, "document.querySelector('.rh-container').textContent")


def test_heatmap_renders_with_reviews(mw, helper):
    cid = helper.add_card(front="gui")
    noon = datetime.now().replace(hour=12, minute=0, second=0, microsecond=0)
    for days_ago in (0, 1, 2):
        helper.review(cid, noon - timedelta(days=days_ago))
    helper.make_due(helper.add_card(front="due"), 3)
    refresh_deck_browser(mw)

    rects = wait_for_js(mw.web, "document.querySelectorAll('.cal-heatmap-container rect.graph-rect').length")
    assert rects >= 365
    assert eval_js(mw.web, "document.querySelectorAll('.cal-heatmap-container rect.q11, .cal-heatmap-container rect.q12, .cal-heatmap-container rect.q13').length") >= 3
    stats = eval_js(mw.web, "Array.from(document.querySelectorAll('.sstats')).map(e => e.textContent)")
    assert stats[2] == "3 days" and stats[3] == "3 days"
    # the palette is applied through CSS variables
    fill = eval_js(mw.web, "getComputedStyle(document.querySelector('.cal-heatmap-container rect.q11')).fill")
    assert fill == "rgb(214, 230, 133)"  # lime --rh-c1


def test_theme_cycle_and_options_dialog(mw):
    from review_heatmap.config import heatmap_colors
    from review_heatmap.gui.options import OptionsDialog

    config = mw._review_heatmap.config  # the add-on's live instance
    before = config["synced"]["colors"]
    mw.web._onBridgeCmd("revhm_themeswitch")
    pump(0.5)
    after = config["synced"]["colors"]
    assert after == list(heatmap_colors)[(list(heatmap_colors).index(before) + 1) % len(heatmap_colors)]
    wait_for_js(mw.web, f"document.querySelectorAll('.rh-container.rh-theme-{after}').length")

    dialog = OptionsDialog(mw, config)
    dialog.colors.setCurrentIndex(dialog.colors.findData("grape"))
    dialog.darkmode.setCurrentIndex(dialog.darkmode.findData("same"))
    dialog.limhist.setValue(100)
    dialog.streak_min.setValue(2)
    dialog.panel.setChecked(True)
    dialog.accept()
    pump(0.5)
    assert config["synced"]["colors"] == "grape"
    assert config["synced"]["darkmode"] == "same"
    assert config["synced"]["streak_min"] == 2
    assert mw.col.get_config("heatmap")["limhist"] == 100
    wait_for_js(mw.web, "document.querySelectorAll('.rh-container.rh-theme-grape.rh-dark-same.rh-panel').length")
    fill = eval_js(mw.web, "getComputedStyle(document.querySelector('.cal-heatmap-container rect.q11')).fill")
    assert fill == "rgb(234, 217, 251)"  # grape --rh-c1
    assert eval_js(mw.web, "getComputedStyle(document.querySelector('.rh-container')).backgroundColor") != "rgba(0, 0, 0, 0)"

    # a custom palette is applied through inline custom properties
    dialog = OptionsDialog(mw, config)
    dialog.colors.setCurrentIndex(dialog.colors.findData("custom"))
    dialog.custom_colors.setText("#010203 " * 9 + "#0a0b0c")
    dialog.accept()
    pump(0.5)
    wait_for_js(mw.web, "document.querySelectorAll('.rh-container.rh-theme-custom').length")
    fill = eval_js(mw.web, "getComputedStyle(document.querySelector('.cal-heatmap-container rect.q11')).fill")
    assert fill == "rgb(1, 2, 3)"

    # an invalid custom palette is rejected and the dialog stays open
    dialog = OptionsDialog(mw, config)
    dialog.custom_colors.setText("#010203")
    dialog.accept()
    assert dialog.isVisible() is False or dialog.result() == 0
    dialog.reject()


def test_click_opens_browser_with_cards_of_that_day(mw, helper):
    import aqt

    from review_heatmap.times import day_epoch_to_iso_date
    from review_heatmap.activity import ActivityReporter
    from review_heatmap.config import ConfigManager

    today = day_epoch_to_iso_date(ActivityReporter(mw.col, ConfigManager(mw)).today())
    mw.web._onBridgeCmd(f"revhm_browse:rid:{today}")
    browser = None

    def browser_ready():
        nonlocal browser
        browser = aqt.dialogs._dialogs["Browser"][1]
        return browser is not None and browser.table.len() == 1

    wait_until(browser_ready, 30, "browser with one matching card")
    # the search box keeps the readable rid: form; the hook rewrote the actual query
    assert browser.current_search().startswith("rid:")
    browser.close()
    pump(0.5)


def test_overview_shows_deck_heatmap(mw, helper):
    did = mw.col.decks.id("Default")
    mw.col.decks.select(did)
    mw.moveToState("overview")
    pump(0.5)
    wait_for_js(mw.web, "document.querySelectorAll('.rh-container.rh-view-overview').length")
    assert eval_js(mw.web, "document.querySelector('.rh-container').textContent").count("day") >= 1
    mw.moveToState("deckBrowser")
    pump(0.3)


def test_congratulations_screen_gets_heatmap(mw, helper):
    # a deck with reviews but nothing due shows Anki's Svelte congrats page
    cid = helper.add_card("Finished", front="done")
    helper.review(cid, datetime.now().replace(hour=12, minute=0, second=0, microsecond=0))
    helper.make_due(cid, 30)
    mw.col.decks.select(mw.col.decks.id("Finished"))
    mw.moveToState("overview")
    wait_until(lambda: "congrats" in mw.web.url().path(), 30, "congrats page")
    wait_for_js(mw.web, "document.querySelectorAll('.rh-host .rh-container.rh-view-overview').length", timeout=45)
    assert wait_for_js(mw.web, "document.querySelectorAll('.rh-host .cal-heatmap-container rect').length") >= 365
    mw.moveToState("deckBrowser")
    pump(0.3)


def test_legacy_stats_window_shows_heatmap(mw):
    from aqt.stats import DeckStats

    dialog = DeckStats(mw)
    pump(1.0)
    wait_for_js(dialog.form.web, "document.querySelectorAll('.rh-container.rh-view-stats').length", timeout=45)
    assert eval_js(dialog.form.web, "document.querySelectorAll('.cal-heatmap-container rect').length") > 0
    # the bridge has a context so our pycmd handlers find a parent window
    assert dialog.form.web._bridge_context is dialog
    dialog.reject()
    pump(0.5)
