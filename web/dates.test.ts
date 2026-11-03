// Run with: TZ=<zone> node --test web/dates.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  utcDayToLocalDate,
  localDateToIso,
  daysBetweenLocalDates,
} from "./dates.ts";

const utcDay = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));

test("every day of a DST year maps to the same calendar date in local time", () => {
  for (let ms = utcDay("2025-01-01"); ms <= utcDay("2025-12-31"); ms += 86400000) {
    const local = utcDayToLocalDate(ms);
    assert.equal(localDateToIso(local), new Date(ms).toISOString().slice(0, 10));
    // The first instant of that date: midnight, or 01:00 in zones such as
    // America/Santiago where the clocks skip midnight on the changeover day.
    assert.notEqual(localDateToIso(new Date(local.getTime() - 1)), localDateToIso(local));
  }
});

test("day differences ignore 23 and 25 hour days", () => {
  assert.equal(daysBetweenLocalDates(new Date(2025, 9, 4), new Date(2025, 9, 6)), 2);
  assert.equal(daysBetweenLocalDates(new Date(2025, 2, 8), new Date(2025, 2, 10)), 2);
  assert.equal(daysBetweenLocalDates(new Date(2025, 10, 1), new Date(2025, 10, 3)), 2);
  assert.equal(daysBetweenLocalDates(new Date(2025, 0, 10), new Date(2025, 0, 3)), -7);
});
