"""
Boot a headless Anki with the add-on installed under a given folder name and
report, as JSON on stdout, whether it initialised, drew the heatmap and
registered its config action.

AnkiWeb installs add-ons into a folder named after their number rather than
the package name, so this catches anything that assumes "review_heatmap".
It runs in a subprocess (see test_install_folder.py) because aqt can only
start once per process.
"""

import json
import os
import shutil
import sys
import tempfile
import time
from datetime import datetime
from pathlib import Path

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")
os.environ.setdefault("QTWEBENGINE_CHROMIUM_FLAGS", "--disable-gpu --no-sandbox")

FOLDER = sys.argv[1]
TESTS = Path(__file__).resolve().parent
SRC = TESTS.parent / "src"

base = Path(tempfile.mkdtemp(prefix="rh-folder-"))
addons = base / "addons21"
addons.mkdir()
shutil.copytree(
    SRC / "review_heatmap",
    addons / FOLDER,
    ignore=shutil.ignore_patterns("__pycache__", "meta.json", "user_files"),
)

import anki.lang  # noqa: E402
import aqt  # noqa: E402
from aqt.profiles import ProfileManager  # noqa: E402
from aqt.qt import QApplication, QMessageBox  # noqa: E402

anki.lang.set_lang("en_US")
seed = ProfileManager(base)
seed.setupMeta()
seed.meta["defaultLang"] = "en_US"
seed.meta["check_for_updates"] = False
seed.meta["last_addon_update_check"] = 2**31
seed.db.execute("update profiles set data = ? where name = '_global'", seed._pickle(seed.meta))
seed.db.commit()
seed.db.close()

app = aqt._run(argv=["anki", "-b", str(base)], exec=False)
mw = aqt.mw


def pump(seconds):
    end = time.time() + seconds
    while time.time() < end:
        QApplication.processEvents()
        time.sleep(0.01)
    for widget in QApplication.topLevelWidgets():
        if isinstance(widget, QMessageBox) and widget.isVisible():
            widget.accept()


def wait_until(check, timeout):
    end = time.time() + timeout
    while time.time() < end:
        if check():
            return True
        pump(0.1)
    return False


def eval_js(expression, timeout=20):
    box = {}
    mw.web.evalWithCallback(expression, lambda value: box.setdefault("value", value))
    wait_until(lambda: "value" in box, timeout)
    return box.get("value")


result = {"folder": FOLDER}
result["profile_loaded"] = wait_until(lambda: mw.col is not None and mw.state == "deckBrowser", 90)
consts = sys.modules.get(f"{FOLDER}.consts")
result["module"] = consts.ADDON.MODULE if consts else None

sys.path.insert(0, str(TESTS))
from conftest import Helper  # noqa: E402

helper = Helper(mw.col)
cid = helper.add_card(front="folder probe")
helper.review(cid, datetime.now().replace(hour=12, minute=0, second=0, microsecond=0))
mw.deckBrowser.refresh()
wait_until(lambda: (eval_js("document.querySelectorAll('.rh-calendar rect.rh-day').length", 2) or 0) > 0, 30)
result["cells"] = eval_js("document.querySelectorAll('.rh-calendar rect.rh-day').length")
result["script_loaded"] = eval_js("typeof ReviewHeatmap") == "function"
result["config_action"] = mw.addonManager.configAction(FOLDER) is not None
result["config"] = mw.addonManager.getConfig(FOLDER)

print(json.dumps(result), flush=True)
os._exit(0)
