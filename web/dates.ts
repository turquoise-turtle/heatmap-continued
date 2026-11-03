/*
Review Heatmap Add-on for Anki

Copyright (C) 2016-2022  Aristotelis P. <https//glutanimate.com/>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version, with the additions
listed at the end of the accompanied license file.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

NOTE: This program is subject to certain additional terms pursuant to
Section 7 of the GNU Affero General Public License.  You should have
received a copy of these additional terms immediately following the
terms and conditions of the GNU Affero General Public License which
accompanied this program.

If not, please request a copy through one of the means of contact
listed here: <https://glutanimate.com/contact/>.

Any modifications to this file must keep this entire header intact.

This file is part of a modified version of Review Heatmap (2026).
*/

// Python hands us calendar days as "00:00 UTC of that date". The calendar works
// in local time, so each day is mapped to local midnight of the same calendar
// date. Converting through the UTC date components (rather than adding the
// current timezone offset, as earlier versions did) keeps the mapping correct
// on daylight-saving transition days.

export const DAY_MS = 86400 * 1000;

export function utcDayToLocalDate(utcMs: number): Date {
  const d = new Date(utcMs);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0);
}

export function localDateToIso(date: Date): string {
  const pad = (n: number) => (n < 10 ? "0" + n : "" + n);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Whole calendar days from `from` to `to`, ignoring the time of day and any
// 23- or 25-hour days in between.
export function daysBetweenLocalDates(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / DAY_MS);
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}
