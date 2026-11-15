# AnkiWeb listing

Text for the add-on's AnkiWeb page. AnkiWeb descriptions take a small subset of HTML, so the block below uses only `<b>`, `<a>`, `<ul>` and `<li>`. The attribution sentence and its two links are required by the licence's additional terms (section 3) and must stay as they are.

Title: `Heatmap Continued`

Description:

```html
<b>Heatmap Continued</b> shows a calendar heatmap of your past and future reviews on the deck list, the deck overview, the finished-deck screen and the old statistics window (shift-click Stats), with streak statistics. Click a day to see its cards in the browser.

Based on the Anki add-on <a href="https://github.com/glutanimate/review-heatmap/">Review Heatmap</a> by Glutanimate. <a href="https://glutanimate.com/support-my-work/">Click here to support Glutanimate's work.</a>

<b>This is a modified version of Review Heatmap, not the original add-on.</b> It was improved with the help of Claude, with turquoise-turtle directing and testing the work. Glutanimate has not reviewed or endorsed these changes.

<b>What's different</b>
<ul>
<li>Works on Anki 25.09 and 26.09.</li>
<li>Reviews land on the right day across daylight-saving changes.</li>
<li>Clicking a day opens its cards in both cards and notes mode.</li>
<li>Also shown on the finished-deck screen.</li>
<li>New palettes (Grape, Teal, Slate, Mocha), a custom palette, an optional panel for background images, and a choice of palette direction in dark mode.</li>
<li>Show reviews, time spent, new cards learned or cards added (Alt-click the today button).</li>
<li>Streak options and an optional habit-strength statistic.</li>
<li>Lighter and faster: the calendar is drawn by the add-on itself, with no third-party libraries.</li>
</ul>

Installing it turns off the original Review Heatmap, since both would draw a heatmap. Your settings carry over.

Source code, changelog and releases: <a href="https://github.com/turquoise-turtle/heatmap-continued">github.com/turquoise-turtle/heatmap-continued</a>

Licence: GNU AGPLv3 with additional terms. Copyright © 2016-2022 Aristotelis P. (Glutanimate); modifications © 2026. Based on the Anki add-on <a href="https://github.com/glutanimate/review-heatmap/">Review Heatmap</a> by Glutanimate. <a href="https://glutanimate.com/support-my-work/">Click here to support Glutanimate's work.</a>
```

Upload `dist/heatmap-continued-<version>.ankiaddon` (built with `uv run build.py build`) at https://ankiweb.net/shared/addons. Once AnkiWeb assigns the add-on its number, add the AnkiWeb link to `README.md`.
