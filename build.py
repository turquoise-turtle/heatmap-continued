#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# ///
"""
Build and development helper for the Heatmap Continued add-on.

    uv run build.py build            # bundle the web code and create dist/*.ankiaddon
    uv run build.py link [ADDONS]    # symlink src/review_heatmap into an Anki add-ons folder
    uv run build.py unlink [ADDONS]  # remove that symlink

ADDONS defaults to the add-ons folder of the standard Anki data location on
this platform. Linking is the quickest way to try changes: restart Anki after
editing Python, reload the screen after rebuilding the web bundle.
"""

import argparse
import json
import os
import subprocess
import sys
import time
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src" / "review_heatmap"
DIST = ROOT / "dist"
EXCLUDED_DIRS = {"__pycache__", "user_files"}
EXCLUDED_FILES = {"meta.json", ".DS_Store"}
# Anki integer versions (YYMMPP); 25.09.0 is the oldest release this fork targets.
MIN_POINT_VERSION = 250900


def version() -> str:
    namespace: dict = {}
    exec((SRC / "_version.py").read_text(encoding="utf-8"), namespace)
    return namespace["__version__"]


def manifest() -> dict:
    return {
        "package": "review_heatmap",
        "name": "Heatmap Continued",
        "human_version": version(),
        "mod": int(time.time()),
        "min_point_version": MIN_POINT_VERSION,
        "homepage": "https://github.com/turquoise-turtle/heatmap-continued",
        # Add-ons known to clash with this one (upstream list), plus the
        # AnkiWeb original: Anki disables it on install, otherwise both draw
        # a heatmap.
        "conflicts": ["1722241614", "723520343", "1771074083"],
    }


def build_web() -> None:
    if not (ROOT / "node_modules").exists():
        subprocess.run(["npm", "ci", "--no-fund", "--no-audit"], cwd=ROOT, check=True)
    subprocess.run(["npm", "run", "--silent", "build"], cwd=ROOT, check=True)


def build_package() -> Path:
    build_web()
    DIST.mkdir(exist_ok=True)
    target = DIST / f"heatmap-continued-{version()}.ankiaddon"
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(SRC.rglob("*")):
            if any(part in EXCLUDED_DIRS for part in path.relative_to(SRC).parts):
                continue
            if path.is_dir() or path.name in EXCLUDED_FILES or path.suffix == ".pyc":
                continue
            archive.write(path, path.relative_to(SRC).as_posix())
        archive.writestr("manifest.json", json.dumps(manifest(), indent=2))
        archive.write(ROOT / "LICENSE", "LICENSE")
    print(f"built {target.relative_to(ROOT)} ({target.stat().st_size // 1024} KB)")
    return target


def default_addons_folder() -> Path:
    if sys.platform == "darwin":
        base = Path.home() / "Library" / "Application Support" / "Anki2"
    elif sys.platform.startswith("win"):
        base = Path(os.environ.get("APPDATA", Path.home() / "AppData" / "Roaming")) / "Anki2"
    else:
        base = Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local" / "share")) / "Anki2"
    return base / "addons21"


def link(addons: Path) -> None:
    build_web()
    addons.mkdir(parents=True, exist_ok=True)
    target = addons / "review_heatmap"
    if target.is_symlink() or target.exists():
        if target.is_symlink() and Path(os.readlink(target)).resolve() == SRC.resolve():
            print(f"already linked: {target}")
            return
        sys.exit(f"refusing to replace existing {target}; remove it first")
    os.symlink(SRC, target, target_is_directory=True)
    print(f"linked {target} -> {SRC}")


def unlink(addons: Path) -> None:
    target = addons / "review_heatmap"
    if target.is_symlink():
        target.unlink()
        print(f"removed {target}")
    elif target.exists():
        sys.exit(f"{target} is not a symlink; not touching it")
    else:
        print("nothing to remove")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("build")
    for name in ("link", "unlink"):
        p = sub.add_parser(name)
        p.add_argument("addons", nargs="?", type=Path, default=default_addons_folder())
    args = parser.parse_args()
    if args.command == "build":
        build_package()
    elif args.command == "link":
        link(args.addons)
    else:
        unlink(args.addons)


if __name__ == "__main__":
    main()
