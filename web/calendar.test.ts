// Run with: TZ=<zone> node --test web/calendar.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PITCH,
  domainDays,
  domainKey,
  formatDomainLabel,
  formatLongDate,
  layoutCalendar,
  legendLevel,
  planSlide,
  weekColumn,
  weekdayRow,
} from "./calendar.ts";
import { localDateToIso } from "./dates.ts";

test("a year has every date exactly once, even across daylight-saving changes", () => {
  for (const year of [2024, 2025, 2026]) {
    const days = domainDays(year, "year").map(localDateToIso);
    assert.equal(days.length, year === 2024 ? 366 : 365);
    assert.equal(new Set(days).size, days.length);
    assert.equal(days[0], `${year}-01-01`);
    assert.equal(days[days.length - 1], `${year}-12-31`);
  }
});

test("months contain their own dates only", () => {
  const key = domainKey(new Date(2026, 1, 14), "month");
  const days = domainDays(key, "month").map(localDateToIso);
  assert.equal(days.length, 28);
  assert.equal(days[0], "2026-02-01");
  assert.equal(days[27], "2026-02-28");
});

test("weeks run Monday to Sunday from the first day shown", () => {
  assert.equal(weekdayRow(new Date(2026, 10, 2)), 0); // Monday
  assert.equal(weekdayRow(new Date(2026, 10, 8)), 6); // Sunday
  // 2026 starts on a Thursday, so the first Monday opens column 1.
  assert.equal(weekColumn(4, weekdayRow(new Date(2026, 0, 1))), 1);
  // 2024 starts on a Monday; its first week must be column 0, not 1 as in
  // the old library, which left an empty first column.
  const year2024 = layoutCalendar(2024, 1, "year", "%Y", false).domains[0];
  assert.equal(year2024.cells[0].x, 0);
  assert.equal(year2024.cells[0].y, 0);
});

test("layout matches the dimensions the old library drew", () => {
  const year = layoutCalendar(2026, 1, "year", "%Y", false);
  assert.equal(year.width, 636);
  assert.equal(year.height, 109);
  const today = year.domains[0].cells.find((c) => c.iso === "2026-11-03")!;
  assert.deepEqual([today.x, today.y], [44 * PITCH, 1 * PITCH]);

  const months = layoutCalendar(domainKey(new Date(2026, 6, 1), "month"), 9, "month", "%b '%y", true);
  assert.equal(months.width, 596);
  assert.deepEqual(
    months.domains.map((d) => d.width),
    [64, 76, 64, 64, 76, 64, 64, 52, 64]
  );
  assert.equal(months.domains[0].label, "Jul '26");
  assert.equal(months.graphX, PITCH);
});

test("legend levels split forecast and history and cap at the top level", () => {
  const legend = [-3, -2, -1, 0, 1, 2, 3];
  assert.equal(legendLevel(null, legend), 0);
  assert.equal(legendLevel(0, legend), 0);
  assert.equal(legendLevel(-10, legend), 1);
  assert.equal(legendLevel(-1, legend), 3);
  assert.equal(legendLevel(1, legend), 5);
  assert.equal(legendLevel(2.5, legend), 7);
  assert.equal(legendLevel(99, legend), legend.length + 1);
});

test("labels and long dates use Australian English order", () => {
  const date = new Date(2026, 10, 3);
  assert.equal(formatDomainLabel(date, "%b '%y"), "Nov '26");
  assert.equal(formatDomainLabel(date, "%Y %B %m %%"), "2026 November 11 %");
  assert.equal(formatLongDate(date), "Tuesday 3 November 2026");
});

test("paging moves domains the way cal-heatmap's slide did", () => {
  const jul = domainKey(new Date(2026, 6, 1), "month");
  const page = (key: number) => layoutCalendar(key, 9, "month", "%b '%y", true);
  const byLabel = (moves: ReturnType<typeof planSlide>) =>
    Object.fromEntries(moves.map((m) => [m.domain.label, [m.from, m.to, m.leaving]]));

  // Back two months: the two arriving months start stacked just left of the
  // edge, staying months glide right, leaving months slide to the right edge.
  const back = byLabel(planSlide(page(jul), page(jul - 2)));
  assert.deepEqual(back["May '26"], [-64, 0, false]);
  assert.deepEqual(back["Jun '26"], [-64, 64, false]);
  assert.deepEqual(back["Jul '26"], [0, 128, false]);
  assert.deepEqual(back["Mar '27"], [524, 588, true]);

  // Forward: arriving months start at the old row's right end, leaving ones
  // slide out to minus their own width.
  const forward = byLabel(planSlide(page(jul), page(jul + 2)));
  assert.deepEqual(forward["Apr '27"], [588, 448, false]);
  assert.deepEqual(forward["Jul '26"], [0, -64, true]);
  assert.deepEqual(forward["Aug '26"], [64, -76, true]);

  // Year view: one domain in, one out.
  const year = byLabel(
    planSlide(layoutCalendar(2026, 1, "year", "%Y", false), layoutCalendar(2025, 1, "year", "%Y", false))
  );
  assert.deepEqual(year["2025"], [-640, 0, false]);
  assert.deepEqual(year["2026"], [0, 640, true]);
});
