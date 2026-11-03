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

This file is part of a modified version of Review Heatmap (2026). It is
not the original program; see README.md for the list of changes.
*/

import reviewHeatmapCss from "./review-heatmap.css";

import { Calendar, formatLongDate } from "./calendar.ts";
import type { TooltipPart } from "./calendar.ts";
import type { ReviewHeatmapOptions, ReviewHeatmapData } from "./types.ts";
import { bridgeCommand } from "./bridge.ts";
import { daysBetweenLocalDates, localDateToIso, startOfLocalDay, utcDayToLocalDate } from "./dates.ts";

const STYLE_ID = "review-heatmap-style";
const HOST_ID = "rh-calendar";

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) {
    return;
  }
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = reviewHeatmapCss;
  document.head.appendChild(style);
}

const numberFormat = new Intl.NumberFormat("en-AU");

class ReviewHeatmap {
  private calendar: Calendar | null = null;
  private readonly options: ReviewHeatmapOptions;
  private readonly today: Date;

  constructor(options: ReviewHeatmapOptions) {
    this.options = options;
    this.today = utcDayToLocalDate(options.today);
  }

  public create(data: ReviewHeatmapData) {
    ensureStyles();
    const host = document.getElementById(HOST_ID);
    if (!host) {
      return;
    }

    const today = this.today;
    const minDate = utcDayToLocalDate(this.options.start ?? this.options.today);
    let maxDate = utcDayToLocalDate(this.options.stop ?? this.options.today);
    let start = new Date(today);

    // Running overview of recent activity in month view
    if (this.options.domain === "month") {
      const padding = this.options.range / 2;
      const paddingLower = Math.round(padding - 1);
      const paddingUpper = Math.round(padding + 1);

      start = new Date(today.getFullYear(), today.getMonth() - paddingLower, 1);
      // Start at first data point if history is shorter than the window
      if (minDate.getTime() > start.getTime()) {
        start = minDate;
      }

      // Always go back to centred view after scrolling back then forward
      const centredEnd = new Date(today.getFullYear(), today.getMonth() + paddingUpper, 1);
      if (centredEnd.getTime() > maxDate.getTime()) {
        maxDate = centredEnd;
      }
    }

    // Python keys each day by 00:00 UTC of that date; the calendar works in
    // local calendar dates, so the key is turned straight into its ISO date.
    const values = new Map<string, number>();
    for (const key in data) {
      values.set(new Date(Number(key) * 1000).toISOString().slice(0, 10), data[key]);
    }

    this.calendar = new Calendar(host, {
      mode: this.options.domain,
      range: this.options.range,
      minDate,
      maxDate,
      start,
      today,
      legend: this.options.legend,
      labelFormat: this.options.domLabForm,
      dayLabels: this.options.domain === "month",
      animationMs: 300,
      data: values,
      tooltip: (date, value) => this.tooltip(date, value),
      onClick: (date, value) => this.onClick(date, value),
    });
  }

  private tooltip(date: Date, value: number | null): TooltipPart[] {
    const unit = this.options.unit || "card";
    const verb = this.options.verb || "reviewed";
    const when = ` on ${formatLongDate(date)}`;
    if (value === null || value === 0) {
      const future = date.getTime() > this.today.getTime();
      return [{ bold: "No" }, future ? " cards due" : ` ${unit}s ${verb}`, when];
    }
    const due = value < 0;
    const count = Math.abs(value);
    const label = (due ? "card" : unit) + (count === 1 ? "" : "s");
    return [{ bold: numberFormat.format(count) }, ` ${label} `, { bold: due ? "due" : verb }, when];
  }

  private onClick(date: Date, value: number | null) {
    // Show the cards of the clicked day in Anki's browser
    if (value === null || value === 0) {
      this.calendar?.select(null);
      return;
    }

    const day = startOfLocalDay(date);
    let cmd = this.options.whole ? "" : "deck:current ";
    if (value > 0) {
      // History: the date token is resolved to card ids by the Python side
      cmd += (this.options.token || "rid") + ":" + localDateToIso(day);
    } else {
      // Forecast
      cmd += "prop:due=" + daysBetweenLocalDates(this.today, day);
    }

    bridgeCommand("revhm_browse:" + cmd);
    this.calendar?.select(day);
  }

  public onHmHome(event: MouseEvent, _button: HTMLElement) {
    if (event.shiftKey) {
      bridgeCommand("revhm_modeswitch");
      return;
    }
    if (event.altKey) {
      bridgeCommand("revhm_activityswitch");
      return;
    }
    this.calendar?.home();
  }

  public onHmNavigate(event: MouseEvent, _button: HTMLElement, direction: "next" | "prev") {
    const calendar = this.calendar;
    if (!calendar) {
      return;
    }
    if (direction === "next") {
      event.shiftKey ? calendar.toEnd() : calendar.next();
    } else {
      event.shiftKey ? calendar.toStart() : calendar.previous();
    }
  }

  public onHmOpts(event: MouseEvent, _button: HTMLElement) {
    bridgeCommand(event.shiftKey ? "revhm_themeswitch" : "revhm_opts");
  }

  public onHmContrib(event: MouseEvent, _button: HTMLElement) {
    bridgeCommand(event.shiftKey ? "revhm_snanki" : "revhm_about");
  }
}

globalThis.ReviewHeatmap = ReviewHeatmap;
