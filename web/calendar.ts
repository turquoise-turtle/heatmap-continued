/*
This file is part of a modified version of Review Heatmap (2026), an Anki
add-on originally by Aristotelis P. (Glutanimate). It is not the original
program; see README.md for the list of changes.

Licensed under the GNU AGPLv3 with additional terms; see the LICENSE file.
*/

// Dependency-free calendar heatmap. It replaces the vendored cal-heatmap 3.6
// fork and d3 3.5, and draws the same layout those produced for the two
// views the add-on uses: one year per page, or a run of months.

import { localDateToIso } from "./dates.ts";

export type CalendarMode = "year" | "month";

export const CELL = 10;
export const GAP = 2;
export const PITCH = CELL + GAP;
// Space between domains (months or years): cal-heatmap's 2px gutter plus a
// 1px margin on either side. Kept so existing screenshots and muscle memory
// still match.
const DOMAIN_SPACING = 4;
const ROWS_HEIGHT = 7 * PITCH;
const LABEL_Y = ROWS_HEIGHT + 13.5;
export const HEIGHT = ROWS_HEIGHT + 25;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_INITIALS = ["M", "T", "W", "T", "F", "S", "S"];

export function domainKey(date: Date, mode: CalendarMode): number {
  return mode === "year" ? date.getFullYear() : date.getFullYear() * 12 + date.getMonth();
}

export function domainFirstDay(key: number, mode: CalendarMode): Date {
  return mode === "year" ? new Date(key, 0, 1) : new Date(Math.floor(key / 12), key % 12, 1);
}

// Built from calendar fields rather than by adding 24 hours, so 23- and
// 25-hour days do not skip or repeat a date.
export function domainDays(key: number, mode: CalendarMode): Date[] {
  const first = domainFirstDay(key, mode);
  const end = mode === "year" ? new Date(key + 1, 0, 1) : new Date(first.getFullYear(), first.getMonth() + 1, 1);
  const days: Date[] = [];
  for (let n = 0; ; n++) {
    const day = new Date(first.getFullYear(), first.getMonth(), first.getDate() + n);
    if (day >= end) {
      return days;
    }
    days.push(day);
  }
}

// Monday is the first row, as in the original add-on.
export function weekdayRow(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function weekColumn(dayIndex: number, firstRow: number): number {
  return Math.floor((dayIndex + firstRow) / 7);
}

// Index of the colour class for a value: the first legend threshold the
// value does not exceed, counting from 1, or one past the end when it exceeds
// them all. Zero and missing values have no colour. The legend is sorted and
// holds negative thresholds for the forecast, so due counts and history fall
// into separate ranges of classes.
export function legendLevel(value: number | null | undefined, legend: number[]): number {
  if (value === null || value === undefined || value === 0 || isNaN(value)) {
    return 0;
  }
  for (let i = 0; i < legend.length; i++) {
    if (value <= legend[i]) {
      return i + 1;
    }
  }
  return legend.length + 1;
}

// The strftime subset the add-on's label formats use.
export function formatDomainLabel(date: Date, format: string): string {
  return format.replace(/%([YybBm%])/g, (_match, code: string) => {
    switch (code) {
      case "Y":
        return String(date.getFullYear());
      case "y":
        return String(date.getFullYear() % 100).padStart(2, "0");
      case "b":
        return MONTHS[date.getMonth()].slice(0, 3);
      case "B":
        return MONTHS[date.getMonth()];
      case "m":
        return String(date.getMonth() + 1).padStart(2, "0");
      default:
        return "%";
    }
  });
}

export function formatLongDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export interface CellLayout {
  date: Date;
  iso: string;
  x: number;
  y: number;
}

export interface DomainLayout {
  key: number;
  x: number;
  width: number;
  label: string;
  cells: CellLayout[];
}

export interface CalendarLayout {
  width: number;
  height: number;
  graphX: number;
  domains: DomainLayout[];
}

export function layoutCalendar(
  firstKey: number,
  range: number,
  mode: CalendarMode,
  labelFormat: string,
  dayLabels: boolean
): CalendarLayout {
  const graphX = dayLabels ? PITCH : 0;
  const domains: DomainLayout[] = [];
  let x = 0;
  for (let key = firstKey; key < firstKey + range; key++) {
    const days = domainDays(key, mode);
    const firstRow = weekdayRow(days[0]);
    const cells = days.map((date, i) => ({
      date,
      iso: localDateToIso(date),
      x: weekColumn(i, firstRow) * PITCH,
      y: weekdayRow(date) * PITCH,
    }));
    const columns = weekColumn(days.length - 1, firstRow) + 1;
    const width = columns * PITCH + DOMAIN_SPACING;
    domains.push({ key, x, width, label: formatDomainLabel(days[0], labelFormat), cells });
    x += width;
  }
  return { width: graphX + x - DOMAIN_SPACING, height: HEIGHT, graphX, domains };
}

// How each domain moves when paging, reproducing cal-heatmap's slide. Domains
// that stay glide to their new place. Arriving domains all start stacked just
// beyond the edge they come from and fan out; leaving domains each slide to
// that same edge on the far side and are dropped. With one domain per page
// (year view) this is a plain slide; with a run of months it gives the
// accordion effect of the original.
export interface DomainMove {
  domain: DomainLayout;
  from: number;
  to: number;
  leaving: boolean;
}

function stripWidth(layout: CalendarLayout): number {
  return layout.domains.reduce((total, domain) => total + domain.width, 0);
}

export function planSlide(previous: CalendarLayout, next: CalendarLayout): DomainMove[] {
  const forward = next.domains[0].key > previous.domains[0].key;
  const previousX = new Map(previous.domains.map((domain) => [domain.key, domain.x]));
  const nextKeys = new Set(next.domains.map((domain) => domain.key));
  const previousWidth = stripWidth(previous);
  const nextWidth = stripWidth(next);
  const moves: DomainMove[] = next.domains.map((domain) => ({
    domain,
    from: previousX.get(domain.key) ?? (forward ? previousWidth : -domain.width),
    to: domain.x,
    leaving: false,
  }));
  for (const domain of previous.domains) {
    if (!nextKeys.has(domain.key)) {
      moves.push({
        domain,
        from: domain.x,
        to: forward ? -domain.width : Math.min(previousWidth, nextWidth),
        leaving: true,
      });
    }
  }
  return moves;
}

// Tooltip text as plain and bold runs, so nothing is parsed as HTML.
export type TooltipPart = string | { bold: string };

export interface CalendarOptions {
  mode: CalendarMode;
  range: number;
  minDate: Date;
  maxDate: Date;
  start: Date;
  today: Date;
  legend: number[];
  labelFormat: string;
  dayLabels: boolean;
  // Length of the paging slide; 0 turns it off.
  animationMs: number;
  // Keyed by ISO calendar date (YYYY-MM-DD).
  data: Map<string, number>;
  tooltip: (date: Date, value: number | null) => TooltipPart[];
  onClick: (date: Date, value: number | null) => void;
}

interface RenderedCell {
  date: Date;
  iso: string;
  value: number | null;
}

const SVG_NS = "http://www.w3.org/2000/svg";
// d3's default "cubic-in-out", which the old slide used.
const SLIDE_EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

function prefersReducedMotion(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export class Calendar {
  private firstKey: number;
  private readonly startKey: number;
  private readonly minKey: number;
  private readonly maxKey: number;
  private readonly todayIso: string;
  private selectedIso: string | null = null;
  private cells: RenderedCell[] = [];
  private layout: CalendarLayout | null = null;
  private animations: Animation[] = [];
  private renders = 0;
  private readonly graph: HTMLDivElement;
  private readonly tip: HTMLDivElement;
  private readonly host: HTMLElement;
  private readonly options: CalendarOptions;

  constructor(host: HTMLElement, options: CalendarOptions) {
    this.host = host;
    this.options = options;
    const { mode } = options;
    this.startKey = domainKey(options.start, mode);
    this.minKey = Math.min(domainKey(options.minDate, mode), this.startKey);
    this.maxKey = Math.max(domainKey(options.maxDate, mode), this.startKey + options.range - 1);
    this.firstKey = this.startKey;
    this.todayIso = localDateToIso(options.today);

    host.textContent = "";
    this.graph = document.createElement("div");
    this.tip = document.createElement("div");
    this.tip.className = "rh-tooltip";
    host.append(this.graph, this.tip);

    host.addEventListener("mouseover", (event) => this.onHover(event));
    host.addEventListener("mouseout", () => this.hideTooltip());
    host.addEventListener("click", (event) => this.onCellClick(event));
    this.render();
  }

  public get lastKey(): number {
    return this.firstKey + this.options.range - 1;
  }

  public next(): boolean {
    if (this.lastKey >= this.maxKey) {
      return false;
    }
    return this.show(Math.min(this.firstKey + this.options.range, this.maxKey - this.options.range + 1));
  }

  public previous(): boolean {
    if (this.firstKey <= this.minKey) {
      return false;
    }
    return this.show(Math.max(this.firstKey - this.options.range, this.minKey));
  }

  public toEnd(): boolean {
    return this.show(Math.max(this.firstKey, this.maxKey - this.options.range + 1));
  }

  public toStart(): boolean {
    return this.show(Math.min(this.firstKey, this.minKey));
  }

  public home(): boolean {
    return this.show(this.startKey);
  }

  public select(date: Date | null) {
    this.selectedIso = date ? localDateToIso(date) : null;
    for (const rect of this.graph.querySelectorAll<SVGRectElement>("rect.rh-day[data-i]")) {
      const cell = this.cells[Number(rect.dataset.i)];
      rect.classList.toggle("rh-selected", cell.iso === this.selectedIso && cell.iso !== this.todayIso);
    }
  }

  private show(firstKey: number): boolean {
    if (firstKey === this.firstKey) {
      return false;
    }
    this.firstKey = firstKey;
    this.render(this.layout);
    return true;
  }

  private render(previous: CalendarLayout | null = null) {
    // A click during a slide ends it at once; the new slide starts from the
    // page the old one was heading to.
    for (const animation of this.animations) {
      animation.cancel();
    }
    this.animations = [];
    const render = ++this.renders;

    const { mode, range, labelFormat, dayLabels, animationMs } = this.options;
    const layout = layoutCalendar(this.firstKey, range, mode, labelFormat, dayLabels);
    const slide = previous && animationMs > 0 && !prefersReducedMotion() ? planSlide(previous, layout) : null;
    const cells: RenderedCell[] = [];
    const parts: string[] = [
      `<svg xmlns="${SVG_NS}" class="rh-calendar" width="${layout.width}" height="${layout.height}">`,
    ];

    if (dayLabels) {
      parts.push('<g class="rh-day-names">');
      WEEKDAY_INITIALS.forEach((initial, row) => {
        parts.push(
          `<text x="0" y="${row * PITCH + CELL / 2}" dominant-baseline="central">${initial}</text>`
        );
      });
      parts.push("</g>");
    }

    // The nested <svg> clips the sliding domains so they pass under the
    // weekday labels rather than over them.
    parts.push(`<svg x="${layout.graphX}" y="0" class="rh-graph">`);
    for (const domain of layout.domains) {
      parts.push(this.domainMarkup(domain, domain.x, cells));
    }
    for (const move of slide ? slide.filter((m) => m.leaving) : []) {
      parts.push(this.domainMarkup(move.domain, move.to, null));
    }
    parts.push("</svg></svg>");

    this.hideTooltip();
    this.cells = cells;
    this.layout = layout;
    this.graph.innerHTML = parts.join("");

    if (slide && previous) {
      this.animate(slide, previous.width, layout.width, render);
    }
  }

  // Cells of a leaving domain get no index, so they show no tooltip and
  // ignore clicks while they slide away.
  private domainMarkup(domain: DomainLayout, x: number, cells: RenderedCell[] | null): string {
    const { legend, data } = this.options;
    const parts = [
      `<g class="rh-domain${cells ? "" : " rh-leaving"}" data-key="${domain.key}" transform="translate(${x},0)">` +
        '<g transform="translate(1,1)">',
    ];
    for (const cell of domain.cells) {
      const value = data.has(cell.iso) ? data.get(cell.iso)! : null;
      const level = legendLevel(value, legend);
      let classes = "rh-day";
      if (level) {
        classes += ` rh-q${level}`;
      }
      if (cell.iso === this.todayIso) {
        classes += " rh-today";
      } else if (cell.iso === this.selectedIso) {
        classes += " rh-selected";
      }
      const index = cells ? ` data-i="${cells.push({ date: cell.date, iso: cell.iso, value }) - 1}"` : "";
      parts.push(
        `<rect class="${classes}" width="${CELL}" height="${CELL}" x="${cell.x}" y="${cell.y}"${index}></rect>`
      );
    }
    parts.push(
      `</g><text class="rh-domain-label" x="${(domain.width - 2) / 2}" y="${LABEL_Y}"` +
        ` text-anchor="middle" dominant-baseline="middle">${escapeXml(domain.label)}</text></g>`
    );
    return parts.join("");
  }

  private animate(moves: DomainMove[], fromWidth: number, toWidth: number, render: number) {
    const svg = this.graph.querySelector<SVGSVGElement>("svg.rh-calendar");
    if (!svg || typeof svg.animate !== "function") {
      this.removeLeaving();
      return;
    }
    const timing = { duration: this.options.animationMs, easing: SLIDE_EASING };
    const animations = [svg.animate([{ width: `${fromWidth}px` }, { width: `${toWidth}px` }], timing)];
    for (const move of moves) {
      const selector = `g.rh-domain${move.leaving ? ".rh-leaving" : ":not(.rh-leaving)"}[data-key="${move.domain.key}"]`;
      const group = this.graph.querySelector<SVGGElement>(selector);
      if (group && move.from !== move.to) {
        animations.push(
          group.animate(
            [{ transform: `translate(${move.from}px, 0)` }, { transform: `translate(${move.to}px, 0)` }],
            timing
          )
        );
      }
    }
    // Finish events wait for a rendered frame, which a hidden webview never
    // produces, so a timer also clears the leaving domains. Either way only
    // this render's leftovers go.
    const cleanUp = () => {
      if (render === this.renders) {
        this.removeLeaving();
      }
    };
    animations[0].onfinish = cleanUp;
    setTimeout(cleanUp, this.options.animationMs + 50);
    this.animations = animations;
  }

  private removeLeaving() {
    for (const domain of this.graph.querySelectorAll(".rh-leaving")) {
      domain.remove();
    }
  }

  private cellFor(event: Event): { rect: SVGRectElement; cell: RenderedCell } | null {
    const target = event.target as Element | null;
    if (!target || !(target instanceof SVGRectElement) || !target.classList.contains("rh-day")) {
      return null;
    }
    const cell = this.cells[Number(target.dataset.i)];
    return cell ? { rect: target, cell } : null;
  }

  private onHover(event: Event) {
    const hit = this.cellFor(event);
    if (!hit) {
      return;
    }
    const tip = this.tip;
    tip.textContent = "";
    for (const part of this.options.tooltip(hit.cell.date, hit.cell.value)) {
      if (typeof part === "string") {
        tip.append(part);
      } else {
        const bold = document.createElement("b");
        bold.textContent = part.bold;
        tip.append(bold);
      }
    }
    tip.style.display = "block";
    const cellBox = hit.rect.getBoundingClientRect();
    const hostBox = this.host.getBoundingClientRect();
    tip.style.left = `${cellBox.left - hostBox.left + CELL / 2 - tip.offsetWidth / 2}px`;
    tip.style.top = `${cellBox.top - hostBox.top - tip.offsetHeight - CELL / 2}px`;
  }

  private hideTooltip() {
    this.tip.style.display = "none";
  }

  private onCellClick(event: Event) {
    const hit = this.cellFor(event);
    if (hit) {
      this.options.onClick(hit.cell.date, hit.cell.value);
    }
  }
}
