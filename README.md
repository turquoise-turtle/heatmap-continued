# Review Heatmap (modernised fork)

A calendar heatmap of your past and future Anki reviews on the deck browser, deck overview, finished-deck screen and legacy statistics window, with streak statistics. Clicking a day opens the cards reviewed or due on that day in the browser.

**This is a modified version of Review Heatmap, not the original program.** It targets Anki 25.09 and 26.09 and is maintained independently of the upstream project. Based on the Anki add-on [Review Heatmap](https://github.com/glutanimate/review-heatmap/) by Glutanimate. [Click here to support Glutanimate's work.](https://glutanimate.com/support-my-work/)

![Light mode, Lime palette](screenshots/light-lime.png)

![Dark mode, Grape palette, "same as light mode" setting](screenshots/dark-grape-same.png)

## What changed from upstream 1.0.1

Compatibility and robustness:

- Works on Anki 25.09 and 26.09 (Python 3.13, Qt 6). The vendored `libaddon` layer, whose Python 3.10+ incompatibilities crashed the add-on on current releases (upstream issues 217 and 218), is gone.
- Reviews land on the correct calendar day across daylight-saving transitions. Day bucketing is done in local wall-clock time, and the web layer maps days through their date rather than the current UTC offset (upstream issues 98, 128, 206, 213 and the pull request 214 family).
- Clicking a day opens the browser with a plain `cid:` search, which works in both cards and notes mode (upstream issues 125, 196).
- The heatmap also appears on the finished-deck congratulations screen (upstream issue 152).
- Profile switches, profile deletion and full syncs no longer leave the add-on holding a stale collection (upstream issues 159, 177).
- Deck-limited views count reviews of cards currently sitting in filtered decks, and forecasts use the real due date of such cards (upstream issue 207).
- Overdue cards count towards today in the forecast, as in Anki's own statistics.
- Navigation buttons ignore clicks while the calendar is animating (upstream issue 201).
- Debug logging goes through Anki's add-on logger (`logs/addons/review_heatmap/`) and is switched on from the options dialog.

Appearance:

- Four new colour palettes: Grape, Teal, Slate and Mocha (upstream issues 88, 209).
- A "Palette in dark mode" setting: inverted (lighter means more, the previous behaviour) or the same direction as light mode (upstream issues 59, 164, 215).
- Palettes are defined with CSS custom properties, so adding or tweaking one is a single line in `web/review-heatmap.css` plus an entry in `config.py`.

Removed: the Patreon contributions dialog (replaced by an About dialog that keeps the required attribution), the unused hotkey settings, and the Qt Designer forms. The Snanki easter egg is still there.

## Installation

Download `review-heatmap-<version>.ankiaddon` from a release or build it yourself (see below), then double-click it or use Tools → Add-ons → Install from file in Anki. Settings from the original add-on are picked up automatically; remove the original first since both use the same module name.

## Usage

- Tools → Review Heatmap Options… (or the options button on the heatmap) opens the settings.
- Shift-click the options button to cycle palettes, shift-click the today button to switch between the yearly overview and the continuous timeline.
- Shift-click Stats in Anki's toolbar to open the legacy statistics window, which includes the heatmap. The new statistics screen offers no way for add-ons to add content.
- Hover over a cell for the count; click a cell to see those cards in the browser.

## Development

Requirements: [uv](https://docs.astral.sh/uv/) and Node.js (for esbuild).

```bash
uv sync                     # Anki 26.09 test environment
npm install                 # esbuild
npm run build               # bundle web/ into src/review_heatmap/web/anki-review-heatmap.js
uv run pytest               # unit, DST and headless GUI tests
tests/run_matrix.sh         # the same against Anki 25.09 and 26.09
uv run build.py build       # dist/review-heatmap-<version>.ankiaddon
uv run build.py link        # symlink the add-on into your Anki add-ons folder
```

The web date helpers have their own Node tests: `TZ=Australia/Sydney npm test`.

Layout:

- `src/review_heatmap/` is the add-on package. `activity.py` queries the collection, `renderer.py` turns a report into HTML, `views.py` hooks into Anki's screens, `finder.py` handles the click-through search and `gui/` holds the dialogs.
- `web/` holds the TypeScript and CSS sources and the vendored cal-heatmap library; the built bundle is committed so the package can be assembled without Node.
- `tests/` runs against a real `anki` collection; `test_gui.py` boots a headless Anki with the add-on linked in.

## Licence

GNU AGPLv3 with additional terms; see [LICENSE](LICENSE). Copyright © 2016-2022 Aristotelis P. (Glutanimate); modifications © 2026. Bundled libraries: [d3.js](https://d3js.org/) v3.5.17 (BSD) and [cal-heatmap](https://github.com/glutanimate/cal-heatmap) v3.6.3.2-anki (MIT).
