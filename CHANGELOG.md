# Changelog

## Unreleased

### Changed

- The heatmap is drawn by a small built-in renderer (`web/calendar.ts`) instead of d3.js 3.5.17 (2016) and a 2022 fork of cal-heatmap 3.6. The add-on now ships no third-party JavaScript, and each screen loads 19 KB of script instead of about 214 KB. Layout, colours, tooltip wording and placement, navigation, click-through and the sliding page animation are unchanged.
- Tooltip dates read day-month-year, for example "Tuesday 3 November 2026".
- The paging slide is redone with the browser's Web Animations API, matching the old motion and easing. It is skipped when the system asks for reduced motion, and clicking again mid-slide simply starts the next one, so the navigation debounce is gone.
- Web tooling: esbuild 0.28.2, strict TypeScript 7 type-checking (`npm run typecheck`).

### Fixed

- In month view, paging back and then forward drew some six-week months five weeks wide, so they overlapped the next month.
- In year view, years starting on a Monday (2024, 2029) began with an empty column and pushed the last week into the gap.

## 2.0.0 - 2026-11-02

First release of this fork, based on upstream Review Heatmap 1.0.1 (2022-05-24).

### Added

- Four colour palettes: Grape, Teal, Slate, Mocha, and a Custom palette defined in the options dialog.
- Optional translucent panel behind the heatmap for custom backgrounds.
- Activity types: reviews, time spent, new cards learned, cards added; Alt-click the today button to cycle.
- Optional habit-strength statistic (exponential moving average of active days).
- "Ignore review entries older than this collection" setting.
- Streak options: a minimum number of reviews for a day to count, and free days (no reviews, nothing due) that do not break a streak.
- "Palette in dark mode" setting (inverted, or same as light mode).
- Heatmap on the finished-deck congratulations screen.
- Headless test-suite covering the data layer, daylight-saving handling in nine time zones and the real Anki screens, run against Anki 25.09 and 26.09.
- `build.py` for packaging and for linking the add-on into a local Anki installation.

### Changed

- Supports Anki 25.09 and 26.09; earlier releases are no longer targeted.
- Replaced the vendored `libaddon` framework with small config, logging and platform modules. Settings are stored where they always were, so they carry over.
- Day bucketing is done in local wall-clock time with the rollover hour applied afterwards; the web layer maps days by date instead of by the current UTC offset.
- Clicking a day rewrites the search into a `cid:` list rather than injecting result ids into the browser.
- Deck-limited views include cards currently in filtered decks; forecasts use their original due date; overdue cards count towards today.
- Options dialog rewritten in plain Qt; a debug-logging switch lives on its Advanced tab.
- The contributions dialog became an About dialog carrying the attribution required by the licence.
- Navigation buttons are debounced while the calendar animates.

### Removed

- Unused hotkey settings, Qt Designer forms and resource files, the vendored `logging`, `packaging` and `typing` copies.
