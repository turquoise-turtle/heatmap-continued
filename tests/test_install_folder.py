"""
The add-on must work whatever folder Anki installs it into: "review_heatmap"
for an .ankiaddon file, the add-on's number for AnkiWeb. 2.0.0 hard-coded the
first, so on AnkiWeb its script and config could not be found.
"""

import json
import os
import subprocess
import sys
from pathlib import Path

import pytest

PROBE = Path(__file__).with_name("install_folder_probe.py")


@pytest.mark.gui
@pytest.mark.parametrize("folder", ["1300407681", "review_heatmap"])
def test_addon_works_from_any_install_folder(folder):
    # Anki allows one running instance per user and quits if it finds another,
    # such as the one test_gui.py starts in this process. A separate instance
    # key (and, for releases that predate it, user name) keeps them apart.
    key = f"rh-probe-{folder}"
    env = dict(os.environ, ANKI_SINGLE_INSTANCE_KEY=key, USER=key, LOGNAME=key)
    proc = subprocess.run(
        [sys.executable, "-I", str(PROBE), folder],
        capture_output=True,
        text=True,
        env=env,
        timeout=180,
    )
    assert proc.returncode == 0, proc.stderr[-3000:]
    result = json.loads(proc.stdout.strip().splitlines()[-1])
    assert result["profile_loaded"]
    assert result["module"] == folder
    assert result["script_loaded"], "the web bundle did not load from /_addons/<folder>/web"
    assert result["cells"] >= 365
    assert result["config_action"], "the add-on's Config button is not wired up"
    assert result["config"] == {"debug": False}
