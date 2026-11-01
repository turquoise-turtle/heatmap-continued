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

import calHeatmapCss from "./_vendor/cal-heatmap.css";
import reviewHeatmapCss from "./review-heatmap.css";

import { CalHeatMap } from "./_vendor/cal-heatmap.js";
import { ReviewHeatmapOptions, ReviewHeatmapData } from "./types";
import { bridgeCommand } from "./bridge";
import {
  daysBetweenLocalDates,
  localDateToIso,
  startOfLocalDay,
  utcDayToLocalDate,
  utcDaySecondsToLocalSeconds,
} from "./dates";

const STYLE_ID = "review-heatmap-style";
const ANIMATION_MS = 300;

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) {
    return;
  }
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = calHeatmapCss + "\n" + reviewHeatmapCss;
  document.head.appendChild(style);
}

interface CalHeatmapFormatData {
  count: string | undefined;
  name: string;
  connector: string;
  date: Date;
}

interface CalHeatmapCellData {
  v: number; // count
  t: number; // timestamp
}

class ReviewHeatmap {
  private heatmap: CalHeatMap | null = null;
  private today: Date;
  // Navigating while cal-heatmap is still animating corrupts its domain list,
  // so navigation is ignored until the animation has finished.
  private busyUntil = 0;

  constructor(private options: ReviewHeatmapOptions) {
    this.today = utcDayToLocalDate(this.options.today);
  }

  public create(data: ReviewHeatmapData) {
    ensureStyles();

    const today = this.today;
    let calMinDate = utcDayToLocalDate(this.options.start);
    let calMaxDate = utcDayToLocalDate(this.options.stop);
    let calStartDate = new Date(today);

    // Running overview of recent activity in month view
    if (this.options.domain === "month") {
      const padding = this.options.range / 2;
      const paddingLower = Math.round(padding - 1);
      const paddingUpper = Math.round(padding + 1);

      calStartDate.setMonth(calStartDate.getMonth() - paddingLower);
      calStartDate.setDate(1);

      // Start at first data point if history is shorter than the window
      if (calMinDate.getTime() > calStartDate.getTime()) {
        calStartDate = calMinDate;
      }

      const tempDate = new Date(today);
      tempDate.setMonth(tempDate.getMonth() + paddingUpper);
      tempDate.setDate(1);

      // Always go back to centred view after scrolling back then forward
      if (tempDate.getTime() > calMaxDate.getTime()) {
        calMaxDate = tempDate;
      }
    }

    const heatmap = new CalHeatMap();

    heatmap.init({
      domain: this.options.domain,
      subDomain: this.options.subdomain,
      range: this.options.range,
      minDate: calMinDate,
      maxDate: calMaxDate,
      cellSize: 10,
      verticalOrientation: false,
      dayLabel: true,
      domainMargin: [1, 1, 1, 1],
      itemName: ["card", "cards"],
      highlight: today,
      today: today,
      start: calStartDate,
      legend: this.options.legend,
      displayLegend: false,
      domainLabelFormat: this.options.domLabForm,
      animationDuration: ANIMATION_MS,
      tooltip: true,
      subDomainTitleFormat: (
        isEmpty: boolean,
        formatData: CalHeatmapFormatData,
        cellData: CalHeatmapCellData
      ): string => {
        let count = formatData.count;
        if (count !== undefined && count.startsWith("-")) {
          count = count.substring(1);
        }
        const unit = this.options.unit || "card";
        if (isEmpty) {
          const future = cellData.t > today.getTime();
          const what = future ? "cards due" : `${unit}s ${this.options.verb || "reviewed"}`;
          return `<b>No</b> ${what} on ${formatData.date}`;
        }
        const due = cellData.v < 0;
        const label = (due ? "card" : unit) + (Math.abs(cellData.v) == 1 ? "" : "s");
        const verb = due ? "due" : this.options.verb || "reviewed";
        return `<b>${count}</b> ${label} <b>${verb}</b> ${formatData.connector} ${formatData.date}`;
      },
      onClick: (date: Date, nb: number | null) => {
        // Show the cards of the clicked day in Anki's browser
        if (nb === null || nb == 0) {
          heatmap.highlight(today);
          return;
        }

        const day = startOfLocalDay(date);
        let cmd = this.options.whole ? "" : "deck:current ";

        if (nb >= 0) {
          // History: the date token is resolved to card ids by the Python side
          cmd += (this.options.token || "rid") + ":" + localDateToIso(day);
        } else {
          // Forecast
          cmd += "prop:due=" + daysBetweenLocalDates(today, day);
        }

        bridgeCommand("revhm_browse:" + cmd);
        heatmap.highlight([today, day]);
      },
      afterLoadData: (timestamps: { [key: string]: number }) => {
        // Map each UTC day key onto local midnight of the same calendar date
        const results: { [key: number]: number } = {};
        for (const key in timestamps) {
          results[utcDaySecondsToLocalSeconds(parseInt(key, 10))] = timestamps[key];
        }
        return results;
      },
      data: data,
    });

    this.heatmap = heatmap;
  }

  private navigationBlocked(): boolean {
    const now = Date.now();
    if (now < this.busyUntil) {
      return true;
    }
    this.busyUntil = now + ANIMATION_MS + 50;
    return false;
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
    if (this.heatmap && !this.navigationBlocked()) {
      this.heatmap.rewind();
    }
  }

  public onHmNavigate(event: MouseEvent, _button: HTMLElement, direction: "next" | "prev") {
    if (!this.heatmap || this.navigationBlocked()) {
      return;
    }
    const options = this.heatmap.options;
    if (direction === "next") {
      if (event.shiftKey) {
        this.heatmap.jumpTo(options.maxDate, false);
      } else {
        this.heatmap.next(options.range);
      }
    } else if (event.shiftKey) {
      this.heatmap.jumpTo(options.minDate, false);
    } else {
      this.heatmap.previous(options.range);
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
