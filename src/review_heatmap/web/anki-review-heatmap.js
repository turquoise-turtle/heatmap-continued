(()=>{var F=`/* Cal-HeatMap CSS */

.cal-heatmap-container {
	display: block;
}

.cal-heatmap-container .graph
{
	font-family: "Lucida Grande", Lucida, Verdana, sans-serif;
}

.cal-heatmap-container .graph-label
{
	fill: #999;
	font-size: 10px
}

.cal-heatmap-container .graph, .cal-heatmap-container .graph-legend rect {
	shape-rendering: crispedges
}

.cal-heatmap-container .graph-rect
{
	fill: #ededed
}

.cal-heatmap-container .graph-subdomain-group rect:hover
{
	stroke: #000;
	stroke-width: 1px
}

.cal-heatmap-container .subdomain-text {
	font-size: 8px;
	fill: #999;
	pointer-events: none
}

.cal-heatmap-container .hover_cursor:hover {
	cursor: pointer
}

.cal-heatmap-container .qi {
	background-color: #999;
	fill: #999
}

/*
Remove comment to apply this style to date with value equal to 0
.q0
{
	background-color: #fff;
	fill: #fff;
	stroke: #ededed
}
*/

.cal-heatmap-container .q1
{
	background-color: #dae289;
	fill: #dae289
}

.cal-heatmap-container .q2
{
	background-color: #cedb9c;
	fill: #9cc069
}

.cal-heatmap-container .q3
{
	background-color: #b5cf6b;
	fill: #669d45
}

.cal-heatmap-container .q4
{
	background-color: #637939;
	fill: #637939
}

.cal-heatmap-container .q5
{
	background-color: #3b6427;
	fill: #3b6427
}

.cal-heatmap-container rect.highlight
{
	stroke:#444;
	stroke-width:1
}

.cal-heatmap-container text.highlight
{
	fill: #444
}

.cal-heatmap-container rect.highlight-now
{
	stroke: red
}

.cal-heatmap-container text.highlight-now
{
	fill: red;
	font-weight: 800
}

.cal-heatmap-container .domain-background {
	fill: none;
	shape-rendering: crispedges
}

.cal-heatmap-container .day-name-rect {
	fill: transparent;
}

.cal-heatmap-container .day-name-text {
	font-size: 10px;
	fill: #999;
}

.ch-tooltip {
	padding: 10px;
	background: #222;
	color: #bbb;
	font-size: 12px;
	line-height: 1.4;
	width: 140px;
	position: absolute;
	z-index: 99999;
	text-align: center;
	border-radius: 2px;
	box-shadow: 2px 2px 2px rgba(0,0,0,0.2);
	display: none;
	box-sizing: border-box;
}

.ch-tooltip::after{
	position: absolute;
	width: 0;
	height: 0;
	border-color: transparent;
	border-style: solid;
	content: "";
	padding: 0;
	display: block;
	bottom: -6px;
	left: 50%;
	margin-left: -6px;
    border-width: 6px 6px 0;
    border-top-color: #222;
}
`;var H=`/* 
This file is part of the Review Heatmap add-on for Anki

Custom Heatmap CSS

Copyright: (c) 2016-2022 Glutanimate <https://glutanimate.com/>
Modified version (2026): palettes refactored onto CSS custom properties
License: GNU AGPLv3 <https://www.gnu.org/licenses/agpl.html>
*/

/* Special classes:
"rh-platform-mac": Set when run on macOS
"rh-platform-win": Set when run on Windows
"rh-platform-lin": Set when run on Linux
"rh-theme-<name>": Set when the respective colour palette is active
"rh-dark-inverted" / "rh-dark-same": Dark-mode palette direction
"rh-mode-year": Set when calendar set to year mode
"rh-mode-months": Set when calendar set to months mode
"rh-view-deckbrowser", "rh-view-overview", "rh-view-stats": Set when drawn
    on respective view
"rh-disable-stats": Set when streak stats disabled
"rh-disable-heatmap": Set when heatmap disabled
"night_mode" / "nightMode" (body) or "night-mode" (html): Set by Anki in dark mode
*/

/* General layout */
/* ################################################################### */

.rh-container {
    margin-top: 1em;
}

.heatmap {
    display:inline-block;
}
.heatmap-controls {
    margin-bottom: 0;
}

/* Heatmap graph adjustments */
/* ################################################################### */

.cal-heatmap-container .graph {
    font-family: unset;
}
.graph-label {
    fill: #808080;
}

/* Graph rects */
.cal-heatmap-container rect.highlight-now {
    stroke: black;
}
.cal-heatmap-container rect.highlight {
    stroke: #E9002E;
}
.cal-heatmap-container .graph-rect {
    fill: #eaeaea;
}
:is(.night_mode, .night-mode) .cal-heatmap-container .graph-rect {
    fill: #222222;
}

/* Heatmap hover tooltip */
/* ################################################################### */

.ch-tooltip {
    color: rgb(240, 240, 240);
    animation: 0.5s ease 0s normal forwards 1 fadein;
    -webkit-animation: 0.5s ease 0s normal forwards 1 fadein;
}
/* Delay tooltip using fadein */
@keyframes fadein {
    0% { opacity:0; }
    66% { opacity:0; }
    100% { opacity:0.9; }
}
@-webkit-keyframes fadein {
    0% { opacity:0; }
    66% { opacity:0; }
    100% { opacity:0.9; }
}

/* Heatmap button area */
/* ################################################################### */
.alignleft {
    float: left;
    width:33.33333%;
    text-align:left;
}
.aligncenter {
    float: left;
    width:33.33333%;
    text-align:center;
}
.alignright {
    float: left;
    width:33.33333%;
    text-align:right;
}

/* Heatmap buttons */
/* ################################################################### */

/* Regular buttons */
.hm-btn {
    height: 100%;
    display: inline-block;
    cursor: pointer;
    background: #e6e6e6;
    color: #808080;
    padding: 2px 8px;
    border-radius: 3px;
    margin-left: 2px;
    text-decoration: none;
    user-select: none;
    vertical-align: center;
}
.hm-btn:hover {
    background: #bfbfbf;
}
.hm-btn:active {
    background: #000;
}
:is(.night_mode, .night-mode) .hm-btn {
    background-color: #313d45;
}
:is(.night_mode, .night-mode) .hm-btn:hover {
    background-color: #374f5b;
}
:is(.night_mode, .night-mode) .hm-btn:active {
    background-color: #433376;
}


/* Options button */
.opts-btn {
    padding: 2px 4px;
}
.opts-btn:hover {
    background: #bfbfbf;
}
.opts-btn>img {
    position:relative;
    top: calc(50% - 12px);
    height: 10px;
    width: 10px;
}

/* Heatmap links */
/* ################################################################### */

/* we use these instead of regular links to prevent bugs with page navigation,
   prevent the link color from changing on click, etc.*/

.linkspan {
     cursor:pointer;
     color:blue;
     text-decoration:underline;
}

:is(.night_mode, .night-mode) .linkspan {
    color: white;
}

/* Streak stats */
/* ################################################################### */

/* TODO: investigate why we had two copies of these */
.streak {margin-top: 0.5em;}
.streak-info {
    margin-left: 1em;
}
.sstats {
    font-weight: bold;
    color: #E6E6E6;
}

/* Colour palettes */
/* ################################################################### */

/* FORECAST COLOURS (same for every palette; reversed because of the negative
   value workaround) */
.cal-heatmap-container .q1{fill: #525252}
.cal-heatmap-container .q2{fill: #616161}
.cal-heatmap-container .q3{fill: #707070}
.cal-heatmap-container .q4{fill: #7F7F7F}
.cal-heatmap-container .q5{fill: #8E8E8E}
.cal-heatmap-container .q6{fill: #9D9D9D}
.cal-heatmap-container .q7{fill: #ACACAC}
.cal-heatmap-container .q8{fill: #BBBBBB}
.cal-heatmap-container .q9{fill: #CACACA}
.cal-heatmap-container .q10{fill: #D9D9D9}

:is(.night_mode, .night-mode) .cal-heatmap-container .q1{fill: #5d5f5f}
:is(.night_mode, .night-mode) .cal-heatmap-container .q2{fill: #585a5a}
:is(.night_mode, .night-mode) .cal-heatmap-container .q3{fill: #535555}
:is(.night_mode, .night-mode) .cal-heatmap-container .q4{fill: #4e5050}
:is(.night_mode, .night-mode) .cal-heatmap-container .q5{fill: #494b4b}
:is(.night_mode, .night-mode) .cal-heatmap-container .q6{fill: #444646}
:is(.night_mode, .night-mode) .cal-heatmap-container .q7{fill: #3f4141}
:is(.night_mode, .night-mode) .cal-heatmap-container .q8{fill: #3a3c3c}
:is(.night_mode, .night-mode) .cal-heatmap-container .q9{fill: #353737}
:is(.night_mode, .night-mode) .cal-heatmap-container .q10{fill: #313232}

/* REVIEW HISTORY COLOURS
   Each palette defines ten steps from light (--rh-c1, few reviews) to dark
   (--rh-c10, many reviews). Add a palette here and in config.py. */

.rh-theme-lime    {--rh-c1:#d6e685;--rh-c2:#bddb7a;--rh-c3:#a4d06f;--rh-c4:#8cc665;--rh-c5:#74ba58;--rh-c6:#5cae4c;--rh-c7:#44a340;--rh-c8:#378f36;--rh-c9:#2a7b2c;--rh-c10:#1e6823}
.rh-theme-olive   {--rh-c1:#dae289;--rh-c2:#bbd179;--rh-c3:#9cc069;--rh-c4:#8ab45d;--rh-c5:#78a851;--rh-c6:#669d45;--rh-c7:#648b3f;--rh-c8:#637939;--rh-c9:#4f6e30;--rh-c10:#3b6427}
.rh-theme-ice     {--rh-c1:#a8d5f6;--rh-c2:#95c8f3;--rh-c3:#82bbf0;--rh-c4:#70afee;--rh-c5:#5da2eb;--rh-c6:#4a95e8;--rh-c7:#3889e6;--rh-c8:#257ce3;--rh-c9:#126fe0;--rh-c10:#0063de}
.rh-theme-magenta {--rh-c1:#fde0dd;--rh-c2:#fcc5c0;--rh-c3:#fa9fb5;--rh-c4:#f768a1;--rh-c5:#ea4e9c;--rh-c6:#dd3497;--rh-c7:#ae017e;--rh-c8:#7a0177;--rh-c9:#610070;--rh-c10:#49006a}
.rh-theme-flame   {--rh-c1:#ffeda0;--rh-c2:#fed976;--rh-c3:#feb24c;--rh-c4:#fd8d3c;--rh-c5:#fc6d33;--rh-c6:#fc4e2a;--rh-c7:#e31a1c;--rh-c8:#d00d21;--rh-c9:#bd0026;--rh-c10:#800026}
.rh-theme-grape   {--rh-c1:#ead9fb;--rh-c2:#ddc7f6;--rh-c3:#cfb4f1;--rh-c4:#c09deb;--rh-c5:#ae80e6;--rh-c6:#9d68da;--rh-c7:#8d5cc5;--rh-c8:#794dad;--rh-c9:#613990;--rh-c10:#3c1569}
.rh-theme-teal    {--rh-c1:#c8f0e8;--rh-c2:#b4e2d9;--rh-c3:#9cd2ca;--rh-c4:#7ec0b8;--rh-c5:#52aca4;--rh-c6:#289a91;--rh-c7:#238a82;--rh-c8:#1d7770;--rh-c9:#15605a;--rh-c10:#0a3e3a}
.rh-theme-slate   {--rh-c1:#dbe4ee;--rh-c2:#c9d4e0;--rh-c3:#b4c1d1;--rh-c4:#9cacc0;--rh-c5:#7e94ad;--rh-c6:#667f9c;--rh-c7:#59718c;--rh-c8:#4b6079;--rh-c9:#374a61;--rh-c10:#15293f}
.rh-theme-mocha   {--rh-c1:#f2e4ff;--rh-c2:#ead8fd;--rh-c3:#e2cbfb;--rh-c4:#d9befa;--rh-c5:#d0aef8;--rh-c6:#c39ff1;--rh-c7:#b38ee4;--rh-c8:#9f7bd6;--rh-c9:#8962c6;--rh-c10:#6c3fb5}

/* Applied levels: light mode uses the palette as-is. */
.rh-container {
    --rh-l1: var(--rh-c1); --rh-l2: var(--rh-c2); --rh-l3: var(--rh-c3);
    --rh-l4: var(--rh-c4); --rh-l5: var(--rh-c5); --rh-l6: var(--rh-c6);
    --rh-l7: var(--rh-c7); --rh-l8: var(--rh-c8); --rh-l9: var(--rh-c9);
    --rh-l10: var(--rh-c10);
}

/* Dark mode, "inverted" setting: lighter means more reviews (the behaviour of
   earlier versions). The "same" setting keeps the light-mode direction. */
:is(.night_mode, .night-mode) .rh-container.rh-dark-inverted {
    --rh-l1: var(--rh-c10); --rh-l2: var(--rh-c9); --rh-l3: var(--rh-c8);
    --rh-l4: var(--rh-c7); --rh-l5: var(--rh-c6); --rh-l6: var(--rh-c5);
    --rh-l7: var(--rh-c4); --rh-l8: var(--rh-c3); --rh-l9: var(--rh-c2);
    --rh-l10: var(--rh-c1);
}

.rh-container .cal-heatmap-container .q11{fill: var(--rh-l1)}
.rh-container .cal-heatmap-container .q12{fill: var(--rh-l2)}
.rh-container .cal-heatmap-container .q13{fill: var(--rh-l3)}
.rh-container .cal-heatmap-container .q14{fill: var(--rh-l4)}
.rh-container .cal-heatmap-container .q15{fill: var(--rh-l5)}
.rh-container .cal-heatmap-container .q16{fill: var(--rh-l6)}
.rh-container .cal-heatmap-container .q17{fill: var(--rh-l7)}
.rh-container .cal-heatmap-container .q18{fill: var(--rh-l8)}
.rh-container .cal-heatmap-container .q19{fill: var(--rh-l9)}
.rh-container .cal-heatmap-container .q20{fill: var(--rh-l10)}

.rh-container .rh-col11{color: var(--rh-l1)}
.rh-container .rh-col12{color: var(--rh-l2)}
.rh-container .rh-col13{color: var(--rh-l3)}
.rh-container .rh-col14{color: var(--rh-l4)}
.rh-container .rh-col15{color: var(--rh-l5)}
.rh-container .rh-col16{color: var(--rh-l6)}
.rh-container .rh-col17{color: var(--rh-l7)}
.rh-container .rh-col18{color: var(--rh-l8)}
.rh-container .rh-col19{color: var(--rh-l9)}
.rh-container .rh-col20{color: var(--rh-l10)}

/* Finished-deck (congratulations) screen host */
.rh-host {
    text-align: center;
    margin-top: 1.5em;
}
`;/*! cal-heatmap v3.6.3.2-anki2150 (2022)
 *  ---------------------------------------------
 *  Fork of Cal-HeatMap for use in the Anki add-on Review Heatmap
 *  https://github.com/glutanimate/cal-heatmap
 *  Licensed under the MIT license
 *  Copyright 2014 Wan Qi Chen
 *  Copyright 2018-2022 Glutanimate
 *  Contributors: gakada, Srdjan Prpa
  */var p=window.d3,T=function(){"use strict";var t=this;this.allowedDataType=["json","csv","tsv","txt"],this.options={itemSelector:"#cal-heatmap",paintOnLoad:!0,range:12,cellSize:10,cellPadding:2,cellRadius:0,domainGutter:2,domainMargin:[0,0,0,0],domain:"hour",subDomain:"min",colLimit:null,rowLimit:null,weekStartOnMonday:!0,dayLabel:!1,start:new Date,minDate:null,maxDate:null,today:new Date,data:"",dataType:this.allowedDataType[0],dataPostPayload:null,dataRequestHeaders:null,considerMissingDataAsZero:!1,loadOnInit:!0,verticalOrientation:!1,domainDynamicDimension:!0,label:{position:"bottom",align:"center",offset:{x:0,y:0},rotate:null,width:100,height:null},legend:[10,20,30,40],displayLegend:!0,legendCellSize:10,legendCellPadding:2,legendMargin:[0,0,0,0],legendVerticalPosition:"bottom",legendHorizontalPosition:"left",legendOrientation:"horizontal",legendColors:null,highlight:[],itemName:["item","items"],domainLabelFormat:null,subDomainTitleFormat:{empty:"{date}",filled:"{count} {name} {connector} {date}"},subDomainDateFormat:null,subDomainTextFormat:null,legendTitleFormat:{lower:"less than {min} {name}",inner:"between {down} and {up} {name}",upper:"more than {max} {name}"},animationDuration:500,nextSelector:!1,previousSelector:!1,itemNamespace:"cal-heatmap",tooltip:!1,onClick:null,afterLoad:null,afterLoadNextDomain:null,afterLoadPreviousDomain:null,onComplete:null,afterLoadData:function(i){return i},afterUpdate:null,onMaxDomainReached:null,onMinDomainReached:null},this._domainType={min:{name:"minute",level:10,maxItemNumber:60,defaultRowNumber:10,defaultColumnNumber:6,row:function(i){return t.getSubDomainRowNumber(i)},column:function(i){return t.getSubDomainColumnNumber(i)},position:{x:function(i){return Math.floor(i.getMinutes()/t._domainType.min.row(i))},y:function(i){return i.getMinutes()%t._domainType.min.row(i)}},format:{date:"%H:%M, %A %B %-e, %Y",legend:"",connector:"at"},extractUnit:function(i){return new Date(i.getFullYear(),i.getMonth(),i.getDate(),i.getHours(),i.getMinutes()).getTime()}},hour:{name:"hour",level:20,maxItemNumber:function(i){switch(t.options.domain){case"day":return 24;case"week":return 168;case"month":return 24*(t.options.domainDynamicDimension?t.getDayCountInMonth(i):31)}},defaultRowNumber:6,defaultColumnNumber:function(i){switch(t.options.domain){case"day":return 4;case"week":return 28;case"month":return t.options.domainDynamicDimension?t.getDayCountInMonth(i):31}},row:function(i){return t.getSubDomainRowNumber(i)},column:function(i){return t.getSubDomainColumnNumber(i)},position:{x:function(i){return t.options.domain==="month"?t.options.colLimit>0||t.options.rowLimit>0?Math.floor((i.getHours()+(i.getDate()-1)*24)/t._domainType.hour.row(i)):Math.floor(i.getHours()/t._domainType.hour.row(i))+(i.getDate()-1)*4:t.options.domain==="week"?t.options.colLimit>0||t.options.rowLimit>0?Math.floor((i.getHours()+t.getWeekDay(i)*24)/t._domainType.hour.row(i)):Math.floor(i.getHours()/t._domainType.hour.row(i))+t.getWeekDay(i)*4:Math.floor(i.getHours()/t._domainType.hour.row(i))},y:function(i){var a=i.getHours();if(t.options.colLimit>0||t.options.rowLimit>0)switch(t.options.domain){case"month":a+=(i.getDate()-1)*24;break;case"week":a+=t.getWeekDay(i)*24;break}return Math.floor(a%t._domainType.hour.row(i))}},format:{date:"%Hh, %A %B %-e, %Y",legend:"%H:00",connector:"at"},extractUnit:function(i){return new Date(i.getFullYear(),i.getMonth(),i.getDate(),i.getHours()).getTime()}},day:{name:"day",level:30,maxItemNumber:function(i){switch(t.options.domain){case"week":return 7;case"month":return t.options.domainDynamicDimension?t.getDayCountInMonth(i):31;case"year":return t.options.domainDynamicDimension?t.getDayCountInYear(i):366}},defaultColumnNumber:function(i){switch(i=new Date(i),t.options.domain){case"week":return 1;case"month":return t.options.domainDynamicDimension&&!t.options.verticalOrientation?t.getWeekNumber(new Date(i.getFullYear(),i.getMonth()+1,0))-t.getWeekNumber(i)+1:6;case"year":return t.options.domainDynamicDimension?t.getWeekNumber(new Date(i.getFullYear(),11,31))-t.getWeekNumber(new Date(i.getFullYear(),0))+1:54}},defaultRowNumber:7,row:function(i){return t.getSubDomainRowNumber(i)},column:function(i){return t.getSubDomainColumnNumber(i)},position:{x:function(i){switch(t.options.domain){case"week":return Math.floor(t.getWeekDay(i)/t._domainType.day.row(i));case"month":return t.options.colLimit>0||t.options.rowLimit>0?Math.floor((i.getDate()-1)/t._domainType.day.row(i)):t.getWeekNumber(i)-t.getWeekNumber(new Date(i.getFullYear(),i.getMonth()));case"year":return t.options.colLimit>0||t.options.rowLimit>0?Math.floor((t.getDayOfYear(i)-1)/t._domainType.day.row(i)):t.getWeekNumber(i)}},y:function(i){var a=t.getWeekDay(i);if(t.options.colLimit>0||t.options.rowLimit>0)switch(t.options.domain){case"year":a=t.getDayOfYear(i)-1;break;case"week":a=t.getWeekDay(i);break;case"month":a=i.getDate()-1;break}return Math.floor(a%t._domainType.day.row(i))}},format:{date:"%A %B %-e, %Y",legend:"%e %b",connector:"on"},extractUnit:function(i){return new Date(i.getFullYear(),i.getMonth(),i.getDate()).getTime()}},week:{name:"week",level:40,maxItemNumber:54,defaultColumnNumber:function(i){switch(i=new Date(i),t.options.domain){case"year":return t._domainType.week.maxItemNumber;case"month":return t.options.domainDynamicDimension?t.getWeekNumber(new Date(i.getFullYear(),i.getMonth()+1,0))-t.getWeekNumber(i):5}},defaultRowNumber:1,row:function(i){return t.getSubDomainRowNumber(i)},column:function(i){return t.getSubDomainColumnNumber(i)},position:{x:function(i){switch(t.options.domain){case"year":return Math.floor(t.getWeekNumber(i)/t._domainType.week.row(i));case"month":return Math.floor(t.getMonthWeekNumber(i)/t._domainType.week.row(i))}},y:function(i){return t.getWeekNumber(i)%t._domainType.week.row(i)}},format:{date:"%B Week #%W",legend:"%B Week #%W",connector:"in"},extractUnit:function(i){var a=new Date(i.getFullYear(),i.getMonth(),i.getDate()),h=a.getDay()-(t.options.weekStartOnMonday?1:0);return h<0&&(h=6),a.setDate(a.getDate()-h),a.getTime()}},month:{name:"month",level:50,maxItemNumber:12,defaultColumnNumber:12,defaultRowNumber:1,row:function(){return t.getSubDomainRowNumber()},column:function(){return t.getSubDomainColumnNumber()},position:{x:function(i){return Math.floor(i.getMonth()/t._domainType.month.row(i))},y:function(i){return i.getMonth()%t._domainType.month.row(i)}},format:{date:"%B %Y",legend:"%B",connector:"in"},extractUnit:function(i){return new Date(i.getFullYear(),i.getMonth()).getTime()}},year:{name:"year",level:60,row:function(){return t.options.rowLimit||1},column:function(){return t.options.colLimit||1},position:{x:function(){return 1},y:function(){return 1}},format:{date:"%Y",legend:"%Y",connector:"in"},extractUnit:function(i){return new Date(i.getFullYear()).getTime()}}};for(var e in this._domainType)if(this._domainType.hasOwnProperty(e)){var n=this._domainType[e];this._domainType["x_"+e]={name:"x_"+e,level:n.type,maxItemNumber:n.maxItemNumber,defaultRowNumber:n.defaultRowNumber,defaultColumnNumber:n.defaultColumnNumber,row:n.column,column:n.row,position:{x:n.position.y,y:n.position.x},format:n.format,extractUnit:n.extractUnit}}this.lastInsertedSvg=null,this._completed=!1,this._domains=p.map(),this.graphDim={width:0,height:0},this.legendDim={width:0,height:0},this.NAVIGATE_LEFT=1,this.NAVIGATE_RIGHT=2,this.RESET_ALL_ON_UPDATE=0,this.RESET_SINGLE_ON_UPDATE=1,this.APPEND_ON_UPDATE=2,this.DEFAULT_LEGEND_MARGIN=10,this.root=null,this.tooltip=null,this._maxDomainReached=!1,this._minDomainReached=!1,this.domainPosition=new x,this.Legend=null,this.legendScale=null,this.DSTDomain=[],this._init=function(){return t.getDomain(t.options.start).map(function(i){return i.getTime()}).map(function(i){t._domains.set(i,t.getSubDomain(i).map(function(a){return{t:t._domainType[t.options.subDomain].extractUnit(a),v:null}}))}),t.root=p.select(t.options.itemSelector).append("svg").attr("class","cal-heatmap-container"),t.tooltip=p.select(t.options.itemSelector).attr("style",function(){var i=p.select(t.options.itemSelector).attr("style");return(i!==null?i:"")+"position:relative;"}).append("div").attr("class","ch-tooltip"),t.root.attr("x",0).attr("y",0).append("svg").attr("class","graph"),t.Legend=new k(t),t.options.paintOnLoad&&r(),!0};function r(){t.verticalDomainLabel=t.options.label.position==="top"||t.options.label.position==="bottom",t.domainVerticalLabelHeight=t.options.label.height===null?Math.max(25,t.options.cellSize*2):t.options.label.height,t.domainHorizontalLabelWidth=0,t.options.domainLabelFormat===""&&t.options.label.height===null&&(t.domainVerticalLabelHeight=0),t.verticalDomainLabel||(t.domainVerticalLabelHeight=0,t.domainHorizontalLabelWidth=t.options.label.width),t.paint(),t.options.nextSelector!==!1&&p.select(t.options.nextSelector).on("click."+t.options.itemNamespace,function(){return p.event.preventDefault(),t.loadNextDomain(1)}),t.options.previousSelector!==!1&&p.select(t.options.previousSelector).on("click."+t.options.itemNamespace,function(){return p.event.preventDefault(),t.loadPreviousDomain(1)}),t.Legend.redraw(t.graphDim.width-t.options.domainGutter-t.options.cellPadding),t.afterLoad();var i=t.getDomainKeys();t.options.loadOnInit?t.getDatas(t.options.data,new Date(i[0]),t.getSubDomain(i[i.length-1]).pop(),function(){t.fill(),t.onComplete()}):t.onComplete(),t.checkIfMinDomainIsReached(i[0]),t.checkIfMaxDomainIsReached(t.getNextDomain().getTime())}function o(i,a){var h=t.options.cellSize*t._domainType[t.options.subDomain].column(i)+t.options.cellPadding*t._domainType[t.options.subDomain].column(i);return arguments.length===2&&a===!0?h+=t.domainHorizontalLabelWidth+t.options.domainGutter+t.options.domainMargin[1]+t.options.domainMargin[3]:h}function s(i,a){var h=t.options.cellSize*t._domainType[t.options.subDomain].row(i)+t.options.cellPadding*t._domainType[t.options.subDomain].row(i);return arguments.length===2&&a===!0&&(h+=t.options.domainGutter+t.domainVerticalLabelHeight+t.options.domainMargin[0]+t.options.domainMargin[2]),h}this.paint=function(i){var a=t.options;arguments.length===0&&(i=!1);var h=t.root.select(".graph").selectAll(".graph-domain").data(function(){var l=t.getDomainKeys();return i===t.NAVIGATE_LEFT?l.reverse():l},function(l){return l}),u=0,m=0;if(a.dayLabel&&a.domain==="month"&&a.subDomain==="day"){var f=["monday","tuesday","wednesday","thursday","friday","saturday"];a.weekStartOnMonday?f.push("sunday"):f.shif("sunday");var d=f.map(function(l){return t.formatDate(p.time[l](new Date),"%a").charAt(0)});this.root.selectAll(".day-name").remove();var b=this.root.append("svg").attr("class","day-name").attr("x",0).attr("y",0),c=b.selectAll("g").data(d).enter().append("g");c.append("rect").attr("class","day-name-rect").attr("width",a.cellSize).attr("height",a.cellSize).attr("x",0).attr("y",function(l,g){return g*a.cellSize+g*a.cellPadding}),c.append("text").attr("class","day-name-text").attr("dominant-baseline","central").attr("x",0).attr("y",function(l,g){return g*a.cellSize+g*a.cellPadding+a.cellSize/2}).text(function(l){return l})}var y=h.enter().append("svg").attr("width",function(l){return o(l,!0)}).attr("height",function(l){return s(l,!0)}).attr("x",function(l){return a.verticalOrientation?(t.graphDim.width=Math.max(t.graphDim.width,o(l,!0)),0):M(l,t.graphDim,"width",o(l,!0))}).attr("y",function(l){return a.verticalOrientation?M(l,t.graphDim,"height",s(l,!0)):(t.graphDim.height=Math.max(t.graphDim.height,s(l,!0)),0)}).attr("class",function(l){var g="graph-domain",D=new Date(l);switch(a.domain){case"hour":g+=" h_"+D.getHours();case"day":g+=" d_"+D.getDate()+" dy_"+D.getDay();case"week":g+=" w_"+t.getWeekNumber(D);case"month":g+=" m_"+(D.getMonth()+1);case"year":g+=" y_"+D.getFullYear()}return g});t.lastInsertedSvg=y;function M(l,g,D,v){var w=0;switch(i){case!1:return w=g[D],g[D]+=v,t.domainPosition.setPosition(l,w),w;case t.NAVIGATE_RIGHT:return t.domainPosition.setPosition(l,g[D]),u=v,m=t.domainPosition.getPositionFromIndex(1),t.domainPosition.shiftRightBy(m),g[D];case t.NAVIGATE_LEFT:return w=-v,u=-w,m=g[D]-t.domainPosition.getLast(),t.domainPosition.setPosition(l,w),t.domainPosition.shiftLeftBy(u),w}}y.append("rect").attr("width",function(l){return o(l,!0)-a.domainGutter-a.cellPadding}).attr("height",function(l){return s(l,!0)-a.domainGutter-a.cellPadding}).attr("class","domain-background");var _=y.append("svg").attr("x",function(){return a.label.position==="left"?t.domainHorizontalLabelWidth+a.domainMargin[3]:a.domainMargin[3]}).attr("y",function(){return a.label.position==="top"?t.domainVerticalLabelHeight+a.domainMargin[0]:a.domainMargin[0]}).attr("class","graph-subdomain-group"),S=_.selectAll("g").data(function(l){return t._domains.get(l)}).enter().append("g");S.append("rect").attr("class",function(l){return"graph-rect"+t.getHighlightClassName(l.t)+(a.onClick!==null?" hover_cursor":"")}).attr("width",a.cellSize).attr("height",a.cellSize).attr("x",function(l){return t.positionSubDomainX(l.t)}).attr("y",function(l){return t.positionSubDomainY(l.t)}).on("click",function(l){if(a.onClick!==null)return t.onClick(new Date(l.t),l.v)}).call(function(l){a.cellRadius>0&&l.attr("rx",a.cellRadius).attr("ry",a.cellRadius),t.legendScale!==null&&a.legendColors!==null&&a.legendColors.hasOwnProperty("base")&&l.attr("fill",a.legendColors.base),a.tooltip&&(l.on("mouseover",function(g){var D=this.parentNode.parentNode;t.tooltip.html(t.getSubDomainTitle(g)).attr("style","display: block;");var v=t.positionSubDomainX(g.t)-t.tooltip[0][0].offsetWidth/2+a.cellSize/2,w=t.positionSubDomainY(g.t)-t.tooltip[0][0].offsetHeight-a.cellSize/2;v+=parseInt(D.getAttribute("x"),10),w+=parseInt(D.getAttribute("y"),10),v+=parseInt(t.root.select(".graph").attr("x"),10),w+=parseInt(t.root.select(".graph").attr("y"),10),v+=parseInt(D.parentNode.getAttribute("x"),10),w+=parseInt(D.parentNode.getAttribute("y"),10),t.tooltip.attr("style","display: block; left: "+v+"px; top: "+w+"px;")}),l.on("mouseout",function(){t.tooltip.attr("style","display:none").html("")}))}),a.tooltip||S.append("title").text(function(l){return t.formatDate(new Date(l.t),a.subDomainDateFormat)}),a.domainLabelFormat!==""&&y.append("text").attr("class","graph-label").attr("y",function(l){var g=a.domainMargin[0];switch(a.label.position){case"top":g+=t.domainVerticalLabelHeight/2;break;case"bottom":g+=s(l)+t.domainVerticalLabelHeight/2}return g+a.label.offset.y*(a.label.rotate==="right"&&a.label.position==="right"||a.label.rotate==="left"&&a.label.position==="left"?-1:1)}).attr("x",function(l){var g=a.domainMargin[3];switch(a.label.position){case"right":g+=o(l);break;case"bottom":case"top":g+=o(l)/2}return a.label.align==="right"?g+t.domainHorizontalLabelWidth-a.label.offset.x*(a.label.rotate==="right"?-1:1):g+a.label.offset.x}).attr("text-anchor",function(){switch(a.label.align){case"start":case"left":return"start";case"end":case"right":return"end";default:return"middle"}}).attr("dominant-baseline",function(){return t.verticalDomainLabel?"middle":"top"}).text(function(l){return t.formatDate(new Date(l),a.domainLabelFormat)}).call(C);function C(l){switch(a.label.rotate){case"right":l.attr("transform",function(g){var D="rotate(90), ";switch(a.label.position){case"right":D+="translate(-"+o(g)+" , -"+o(g)+")";break;case"left":D+="translate(0, -"+t.domainHorizontalLabelWidth+")";break}return D});break;case"left":l.attr("transform",function(g){var D="rotate(270), ";switch(a.label.position){case"right":D+="translate(-"+(o(g)+t.domainHorizontalLabelWidth)+" , "+o(g)+")";break;case"left":D+="translate(-"+t.domainHorizontalLabelWidth+" , "+t.domainHorizontalLabelWidth+")";break}return D});break}}a.subDomainTextFormat!==null&&S.append("text").attr("class",function(l){return"subdomain-text"+t.getHighlightClassName(l.t)}).attr("x",function(l){return t.positionSubDomainX(l.t)+a.cellSize/2}).attr("y",function(l){return t.positionSubDomainY(l.t)+a.cellSize/2}).attr("text-anchor","middle").attr("dominant-baseline","central").text(function(l){return t.formatDate(new Date(l.t),a.subDomainTextFormat)}),i!==!1&&h.transition().duration(a.animationDuration).attr("x",function(l){return a.verticalOrientation?0:t.domainPosition.getPosition(l)}).attr("y",function(l){return a.verticalOrientation?t.domainPosition.getPosition(l):0});var q=t.graphDim.width,G=t.graphDim.height;a.verticalOrientation?t.graphDim.height+=u-m:t.graphDim.width+=u-m,h.exit().transition().duration(a.animationDuration).attr("x",function(l){if(a.verticalOrientation)return 0;switch(i){case t.NAVIGATE_LEFT:return Math.min(t.graphDim.width,q);case t.NAVIGATE_RIGHT:return-o(l,!0)}}).attr("y",function(l){if(a.verticalOrientation)switch(i){case t.NAVIGATE_LEFT:return Math.min(t.graphDim.height,G);case t.NAVIGATE_RIGHT:return-s(l,!0)}else return 0}).remove(),t.resize()}};T.prototype={init:function(t){"use strict";var e=this,n=e.options=E(e.options,t);if(a(),s(n.itemSelector,!1,"itemSelector"),e.allowedDataType.indexOf(n.dataType)===-1)throw new Error("The data type '"+n.dataType+"' is not valid data type");if(p.select(n.itemSelector)[0][0]===null)throw new Error("The node '"+n.itemSelector+"' specified in itemSelector does not exist");try{s(n.nextSelector,!0,"nextSelector"),s(n.previousSelector,!0,"previousSelector")}catch(c){return console.log(c.message),!1}t.hasOwnProperty("subDomain")||(this.options.subDomain=i(t.domain)),(typeof n.itemNamespace!="string"||n.itemNamespace==="")&&(console.log("itemNamespace can not be empty, falling back to cal-heatmap"),n.itemNamespace="cal-heatmap");var r=["data","onComplete","onClick","afterLoad","afterLoadData","afterLoadPreviousDomain","afterLoadNextDomain","afterUpdate"];for(var o in r)t.hasOwnProperty(r[o])&&(n[r[o]]=t[r[o]]);n.subDomainDateFormat=typeof n.subDomainDateFormat=="string"||typeof n.subDomainDateFormat=="function"?n.subDomainDateFormat:this._domainType[n.subDomain].format.date,n.domainLabelFormat=typeof n.domainLabelFormat=="string"||typeof n.domainLabelFormat=="function"?n.domainLabelFormat:this._domainType[n.domain].format.legend,n.subDomainTextFormat=typeof n.subDomainTextFormat=="string"&&n.subDomainTextFormat!==""||typeof n.subDomainTextFormat=="function"?n.subDomainTextFormat:null,n.domainMargin=m(n.domainMargin),n.legendMargin=m(n.legendMargin),n.highlight=e.expandDateSetting(n.highlight),n.itemName=f(n.itemName),n.colLimit=d(n.colLimit),n.rowLimit=b(n.rowLimit),t.hasOwnProperty("legendMargin")||u(),h();function s(c,y,M){if((y&&c===!1||c instanceof Element||typeof c=="string")&&c!=="")return!0;throw new Error("The "+M+" is not valid")}function i(c){switch(c){case"year":return"month";case"month":return"day";case"week":return"day";case"day":return"hour";default:return"min"}}function a(){if(!e._domainType.hasOwnProperty(n.domain)||n.domain==="min"||n.domain.substring(0,2)==="x_")throw new Error("The domain '"+n.domain+"' is not valid");if(!e._domainType.hasOwnProperty(n.subDomain)||n.subDomain==="year")throw new Error("The subDomain '"+n.subDomain+"' is not valid");if(e._domainType[n.domain].level<=e._domainType[n.subDomain].level)throw new Error("'"+n.subDomain+"' is not a valid subDomain to '"+n.domain+"'");return!0}function h(){if(!t.hasOwnProperty("label")||t.hasOwnProperty("label")&&!t.label.hasOwnProperty("align")){switch(n.label.position){case"left":n.label.align="right";break;case"right":n.label.align="left";break;default:n.label.align="center"}n.label.rotate==="left"?n.label.align="right":n.label.rotate==="right"&&(n.label.align="left")}(!t.hasOwnProperty("label")||t.hasOwnProperty("label")&&!t.label.hasOwnProperty("offset"))&&(n.label.position==="left"||n.label.position==="right")&&(n.label.offset={x:10,y:15})}function u(){switch(n.legendVerticalPosition){case"top":n.legendMargin[2]=e.DEFAULT_LEGEND_MARGIN;break;case"bottom":n.legendMargin[0]=e.DEFAULT_LEGEND_MARGIN;break;case"middle":case"center":n.legendMargin[n.legendHorizontalPosition==="right"?3:1]=e.DEFAULT_LEGEND_MARGIN}}function m(c){switch(typeof c=="number"&&(c=[c]),Array.isArray(c)||(console.log("Margin only takes an integer or an array of integers"),c=[0]),c.length){case 1:return[c[0],c[0],c[0],c[0]];case 2:return[c[0],c[1],c[0],c[1]];case 3:return[c[0],c[1],c[2],c[1]];case 4:return c;default:return c.slice(0,4)}}function f(c){return typeof c=="string"?[c,c+(c!==""?"s":"")]:Array.isArray(c)?c.length===1?[c[0],c[0]+"s"]:c.length>2?c.slice(0,2):c:["item","items"]}function d(c){return c>0?c:null}function b(c){return c>0&&n.colLimit>0?(console.log("colLimit and rowLimit are mutually exclusive, rowLimit will be ignored"),null):c>0?c:null}return this._init()},expandDateSetting:function(t){"use strict";return Array.isArray(t)||(t=[t]),t.map(function(e){return e==="now"?new Date:e instanceof Date?e:!1}).filter(function(e){return e!==!1})},fill:function(t){"use strict";var e=this,n=e.options;arguments.length===0&&(t=e.root.selectAll(".graph-domain"));var r=t.selectAll("svg").selectAll("g").data(function(i){return e._domains.get(i)});function o(i){if(e.legendScale===null)return!1;i.attr("fill",function(a){return a.v===null&&n.hasOwnProperty("considerMissingDataAsZero")&&!n.considerMissingDataAsZero&&n.legendColors.hasOwnProperty("base")?n.legendColors.base:n.legendColors!==null&&n.legendColors.hasOwnProperty("empty")&&(a.v===0||a.v===null&&n.hasOwnProperty("considerMissingDataAsZero")&&n.considerMissingDataAsZero)?n.legendColors.empty:a.v<0&&n.legend[0]>0&&n.legendColors!==null&&n.legendColors.hasOwnProperty("overflow")?n.legendColors.overflow:e.legendScale(Math.min(a.v,n.legend[n.legend.length-1]))})}r.transition().duration(n.animationDuration).select("rect").attr("class",function(i){var a=e.getHighlightClassName(i.t).trim().split(" "),h=e.dateIsLessThan(i.t,new Date),u=e.dateIsEqual(i.t,new Date);return(e.legendScale===null||i.v===null&&n.hasOwnProperty("considerMissingDataAsZero")&&!n.considerMissingDataAsZero&&!n.legendColors.hasOwnProperty("base"))&&a.push("graph-rect"),u?a.push("now"):h||a.push("future"),i.v!==null?a.push(e.Legend.getClass(i.v,e.legendScale===null)):n.considerMissingDataAsZero&&h&&a.push(e.Legend.getClass(0,e.legendScale===null)),n.onClick!==null&&a.push("hover_cursor"),a.join(" ")}).call(o),r.transition().duration(n.animationDuration).select("title").text(function(i){return e.getSubDomainTitle(i)});function s(i){typeof n.subDomainTextFormat=="function"&&i.text(function(a){return n.subDomainTextFormat(a.t,a.v)})}r.transition().duration(n.animationDuration).select("text").attr("class",function(i){return"subdomain-text"+e.getHighlightClassName(i.t)}).call(s)},formatStringWithObject:function(t,e){"use strict";for(var n in e)if(e.hasOwnProperty(n)){var r=new RegExp("\\{"+n+"\\}","gi");t=t.replace(r,e[n])}return t},triggerEvent:function(t,e,n){"use strict";return arguments.length===3&&n||this.options[t]===null?!0:typeof this.options[t]=="function"?(typeof e=="function"&&(e=e()),this.options[t].apply(this,e)):(console.log("Provided callback for "+t+" is not a function."),!1)},onClick:function(t,e){"use strict";return this.triggerEvent("onClick",[t,e])},afterLoad:function(){"use strict";return this.triggerEvent("afterLoad")},onComplete:function(){"use strict";var t=this.triggerEvent("onComplete",[],this._completed);return this._completed=!0,t},afterLoadPreviousDomain:function(t){"use strict";var e=this;return this.triggerEvent("afterLoadPreviousDomain",function(){var n=e.getSubDomain(t);return[n.shift(),n.pop()]})},afterLoadNextDomain:function(t){"use strict";var e=this;return this.triggerEvent("afterLoadNextDomain",function(){var n=e.getSubDomain(t);return[n.shift(),n.pop()]})},onMinDomainReached:function(t){"use strict";return this._minDomainReached=t,this.triggerEvent("onMinDomainReached",[t])},onMaxDomainReached:function(t){"use strict";return this._maxDomainReached=t,this.triggerEvent("onMaxDomainReached",[t])},checkIfMinDomainIsReached:function(t,e){"use strict";this.minDomainIsReached(t)&&this.onMinDomainReached(!0),arguments.length===2&&this._maxDomainReached&&!this.maxDomainIsReached(e)&&this.onMaxDomainReached(!1)},checkIfMaxDomainIsReached:function(t,e){"use strict";this.maxDomainIsReached(t)&&this.onMaxDomainReached(!0),arguments.length===2&&this._minDomainReached&&!this.minDomainIsReached(e)&&this.onMinDomainReached(!1)},afterUpdate:function(){"use strict";return this.triggerEvent("afterUpdate")},formatNumber:p.format(",g"),formatDate:function(t,e){"use strict";if(arguments.length<2&&(e="title"),typeof e=="function")return e(t);var n=p.time.format(e);return n(t)},getSubDomainTitle:function(t){"use strict";if(t.v===null&&!this.options.considerMissingDataAsZero){var e={date:this.formatDate(new Date(t.t),this.options.subDomainDateFormat)};return typeof this.options.subDomainTitleFormat=="function"?this.options.subDomainTitleFormat(!0,e,t):this.formatStringWithObject(this.options.subDomainTitleFormat.empty,e)}else{var n=t.v;n===null&&this.options.considerMissingDataAsZero&&(n=0);var r={count:this.formatNumber(n),name:this.options.itemName[n!==1?1:0],connector:this._domainType[this.options.subDomain].format.connector,date:this.formatDate(new Date(t.t),this.options.subDomainDateFormat)};return typeof this.options.subDomainTitleFormat=="function"?this.options.subDomainTitleFormat(!1,r,t):this.formatStringWithObject(this.options.subDomainTitleFormat.filled,r)}},loadNextDomain:function(t){"use strict";if(this._maxDomainReached||t===0)return!1;var e=this.loadNewDomains(this.NAVIGATE_RIGHT,this.getDomain(this.getNextDomain(),t));return this.afterLoadNextDomain(e.end),this.checkIfMaxDomainIsReached(this.getNextDomain().getTime(),e.start),!0},loadPreviousDomain:function(t){"use strict";if(this._minDomainReached||t===0)return!1;var e=this.loadNewDomains(this.NAVIGATE_LEFT,this.getDomain(this.getDomainKeys()[0],-t).reverse());return this.afterLoadPreviousDomain(e.start),this.checkIfMinDomainIsReached(e.start,e.end),!0},loadNewDomains:function(t,e){"use strict";var n=this,r=t===this.NAVIGATE_LEFT,o=-1,s=e.length,i=this.getDomainKeys();function a(h){return{t:n._domainType[n.options.subDomain].extractUnit(h),v:null}}for(;++o<s;){if(r&&this.minDomainIsReached(e[o])){e=e.slice(0,o+1);break}if(!r&&this.maxDomainIsReached(e[o])){e=e.slice(0,o);break}}for(e=e.slice(-this.options.range),o=0,s=e.length;o<s;o++)this._domains.set(e[o].getTime(),this.getSubDomain(e[o]).map(a)),this._domains.remove(r?i.pop():i.shift());return i=this.getDomainKeys(),r&&(e=e.reverse()),this.paint(t),this.getDatas(this.options.data,e[0],this.getSubDomain(e[e.length-1]).pop(),function(){n.fill(n.lastInsertedSvg)}),{start:e[r?0:1],end:i[i.length-1]}},maxDomainIsReached:function(t){"use strict";return this.options.maxDate!==null&&this.options.maxDate.getTime()<t},minDomainIsReached:function(t){"use strict";return this.options.minDate!==null&&this.options.minDate.getTime()>=t},getDomainKeys:function(){"use strict";return this._domains.keys().map(function(t){return parseInt(t,10)}).sort(function(t,e){return t-e})},positionSubDomainX:function(t){"use strict";var e=this._domainType[this.options.subDomain].position.x(new Date(t));return e*this.options.cellSize+e*this.options.cellPadding},positionSubDomainY:function(t){"use strict";var e=this._domainType[this.options.subDomain].position.y(new Date(t));return e*this.options.cellSize+e*this.options.cellPadding},getSubDomainColumnNumber:function(t){"use strict";if(this.options.rowLimit>0){var e=this._domainType[this.options.subDomain].maxItemNumber;return typeof e=="function"&&(e=e(t)),Math.ceil(e/this.options.rowLimit)}var n=this._domainType[this.options.subDomain].defaultColumnNumber;return typeof n=="function"&&(n=n(t)),this.options.colLimit||n},getSubDomainRowNumber:function(t){"use strict";if(this.options.colLimit>0){var e=this._domainType[this.options.subDomain].maxItemNumber;return typeof e=="function"&&(e=e(t)),Math.ceil(e/this.options.colLimit)}var n=this._domainType[this.options.subDomain].defaultRowNumber;return typeof n=="function"&&(n=n(t)),this.options.rowLimit||n},getHighlightClassName:function(t){"use strict";if(t=new Date(t),this.options.highlight.length>0){for(var e in this.options.highlight)if(this.dateIsEqual(this.options.highlight[e],t))return this.isNow(this.options.highlight[e])?" highlight-now":" highlight"}return""},isNow:function(t){"use strict";return this.dateIsEqual(t,this.options.today)},dateIsEqual:function(t,e){"use strict";switch(t instanceof Date||(t=new Date(t)),e instanceof Date||(e=new Date(e)),this.options.subDomain){case"x_min":case"min":return t.getFullYear()===e.getFullYear()&&t.getMonth()===e.getMonth()&&t.getDate()===e.getDate()&&t.getHours()===e.getHours()&&t.getMinutes()===e.getMinutes();case"x_hour":case"hour":return t.getFullYear()===e.getFullYear()&&t.getMonth()===e.getMonth()&&t.getDate()===e.getDate()&&t.getHours()===e.getHours();case"x_day":case"day":return t.getFullYear()===e.getFullYear()&&t.getMonth()===e.getMonth()&&t.getDate()===e.getDate();case"x_week":case"week":return t.getFullYear()===e.getFullYear()&&this.getWeekNumber(t)===this.getWeekNumber(e);case"x_month":case"month":return t.getFullYear()===e.getFullYear()&&t.getMonth()===e.getMonth();default:return!1}},dateIsLessThan:function(t,e){"use strict";t instanceof Date||(t=new Date(t)),e instanceof Date||(e=new Date(e));function n(r,o){switch(o){case"x_min":case"min":return new Date(r.getFullYear(),r.getMonth(),r.getDate(),r.getHours(),r.getMinutes()).getTime();case"x_hour":case"hour":return new Date(r.getFullYear(),r.getMonth(),r.getDate(),r.getHours()).getTime();case"x_day":case"day":return new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime();case"x_week":case"week":case"x_month":case"month":return new Date(r.getFullYear(),r.getMonth()).getTime();default:return r.getTime()}}return n(t,this.options.subDomain)<n(e,this.options.subDomain)},getDayOfYear:p.time.format("%j"),getWeekNumber:function(t){"use strict";var e=this.options.weekStartOnMonday===!0?p.time.format("%W"):p.time.format("%U");return e(t)},getMonthWeekNumber:function(t){"use strict";typeof t=="number"&&(t=new Date(t));var e=this.getWeekNumber(new Date(t.getFullYear(),t.getMonth()));return this.getWeekNumber(t)-e-1},getWeekNumberInYear:function(t){"use strict";typeof t=="number"&&(t=new Date(t))},getDayCountInMonth:function(t){"use strict";return this.getEndOfMonth(t).getDate()},getDayCountInYear:function(t){"use strict";return typeof t=="number"&&(t=new Date(t)),new Date(t.getFullYear(),1,29).getMonth()===1?366:365},getWeekDay:function(t){"use strict";return this.options.weekStartOnMonday===!1?t.getDay():t.getDay()===0?6:t.getDay()-1},getEndOfMonth:function(t){"use strict";return typeof t=="number"&&(t=new Date(t)),new Date(t.getFullYear(),t.getMonth()+1,0)},jumpDate:function(t,e,n){"use strict";var r=new Date(t);switch(n){case"hour":r.setHours(r.getHours()+e);break;case"day":r.setHours(r.getHours()+e*24);break;case"week":r.setHours(r.getHours()+e*24*7);break;case"month":r.setMonth(r.getMonth()+e);break;case"year":r.setFullYear(r.getFullYear()+e)}return new Date(r)},getMinuteDomain:function(t,e){"use strict";var n=new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours()),r=null;return e instanceof Date?r=new Date(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours()):r=new Date(+n+e*1e3*60),p.time.minutes(Math.min(n,r),Math.max(n,r))},getHourDomain:function(t,e){"use strict";var n=new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours()),r=null;e instanceof Date?r=new Date(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours()):(r=new Date(n),r.setHours(r.getHours()+e));var o=p.time.hours(Math.min(n,r),Math.max(n,r)),s=0,i=o.length;for(s=0;s<i;s++)if(s>0&&o[s].getHours()===o[s-1].getHours()){this.DSTDomain.push(o[s].getTime()),o.splice(s,1);break}return typeof e=="number"&&o.length>Math.abs(e)&&o.splice(o.length-1,1),o},getDayDomain:function(t,e){"use strict";var n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),r=null;return e instanceof Date?r=new Date(e.getFullYear(),e.getMonth(),e.getDate()):(r=new Date(n),r=new Date(r.setDate(r.getDate()+parseInt(e,10)))),p.time.days(Math.min(n,r),Math.max(n,r))},getWeekDomain:function(t,e){"use strict";var n;this.options.weekStartOnMonday===!1?n=new Date(t.getFullYear(),t.getMonth(),t.getDate()-t.getDay()):t.getDay()===1?n=new Date(t.getFullYear(),t.getMonth(),t.getDate()):t.getDay()===0?(n=new Date(t.getFullYear(),t.getMonth(),t.getDate()),n.setDate(n.getDate()-6)):n=new Date(t.getFullYear(),t.getMonth(),t.getDate()-t.getDay()+1);var r=new Date(n),o=e;return typeof e!="object"&&(o=new Date(r.setDate(r.getDate()+e*7))),this.options.weekStartOnMonday===!0?p.time.mondays(Math.min(n,o),Math.max(n,o)):p.time.sundays(Math.min(n,o),Math.max(n,o))},getMonthDomain:function(t,e){"use strict";var n=new Date(t.getFullYear(),t.getMonth()),r=null;return e instanceof Date?r=new Date(e.getFullYear(),e.getMonth()):(r=new Date(n),r=r.setMonth(r.getMonth()+e)),p.time.months(Math.min(n,r),Math.max(n,r))},getYearDomain:function(t,e){"use strict";var n=new Date(t.getFullYear(),0),r=null;return e instanceof Date?r=new Date(e.getFullYear(),0):r=new Date(t.getFullYear()+e,0),p.time.years(Math.min(n,r),Math.max(n,r))},getDomain:function(t,e){"use strict";switch(typeof t=="number"&&(t=new Date(t)),arguments.length<2&&(e=this.options.range),this.options.domain){case"hour":var n=this.getHourDomain(t,e);return typeof e=="number"&&n.length<e&&(e>0?n.push(this.getHourDomain(n[n.length-1],2)[1]):n.shift(this.getHourDomain(n[0],-2)[0])),n;case"day":return this.getDayDomain(t,e);case"week":return this.getWeekDomain(t,e);case"month":return this.getMonthDomain(t,e);case"year":return this.getYearDomain(t,e)}},getSubDomain:function(t){"use strict";typeof t=="number"&&(t=new Date(t));var e=this,n=function(i,a){switch(a){case"year":return e.getDayCountInYear(i);case"month":return e.getDayCountInMonth(i);case"week":return 7}},r=function(i,a){switch(a){case"hour":return 60;case"day":return 1440;case"week":return 1440*7}},o=function(i,a){switch(a){case"day":return 24;case"week":return 168;case"month":return e.getDayCountInMonth(i)*24}},s=function(i,a){if(a==="month"){var h=new Date(i.getFullYear(),i.getMonth()+1,0),u=e.getWeekNumber(h),m=e.getWeekNumber(new Date(i.getFullYear(),i.getMonth()));return m>u&&(m=0,u++),u-m+1}else if(a==="year")return e.getWeekNumber(new Date(i.getFullYear(),11,31))};switch(this.options.subDomain){case"x_min":case"min":return this.getMinuteDomain(t,r(t,this.options.domain));case"x_hour":case"hour":return this.getHourDomain(t,o(t,this.options.domain));case"x_day":case"day":return this.getDayDomain(t,n(t,this.options.domain));case"x_week":case"week":return this.getWeekDomain(t,s(t,this.options.domain));case"x_month":case"month":return this.getMonthDomain(t,12)}},getNextDomain:function(t){"use strict";return arguments.length===0&&(t=1),this.getDomain(this.jumpDate(this.getDomainKeys().pop(),t,this.options.domain),1)[0]},getPreviousDomain:function(t){"use strict";return arguments.length===0&&(t=1),this.getDomain(this.jumpDate(this.getDomainKeys().shift(),-t,this.options.domain),1)[0]},getDatas:function(t,e,n,r,o,s){"use strict";var i=this;arguments.length<5&&(o=!0),arguments.length<6&&(s=this.APPEND_ON_UPDATE);var a=function(b,c){o!==!1?typeof o=="function"?c=o(c):typeof i.options.afterLoadData=="function"?c=i.options.afterLoadData(c):console.log("Provided callback for afterLoadData is not a function."):(i.options.dataType==="csv"||i.options.dataType==="tsv")&&(c=this.interpretCSV(c)),i.parseDatas(c,s,e,n),typeof r=="function"&&r()};switch(typeof t){case"string":if(t==="")return a(null,{}),!0;var h=this.parseURI(t,e,n),u="GET";i.options.dataPostPayload!==null&&(u="POST");var m=null;i.options.dataPostPayload!==null&&(m=this.parseURI(i.options.dataPostPayload,e,n));var f=null;switch(this.options.dataType){case"json":f=p.json(h);break;case"csv":f=p.csv(h);break;case"tsv":f=p.tsv(h);break;case"txt":f=p.text(h,"text/plain");break}if(i.options.dataRequestHeaders!==null)for(var d in i.options.dataRequestHeaders)i.options.dataRequestHeaders.hasOwnProperty(d)&&f.header(d,i.options.dataRequestHeaders[d]);return f.send(u,m,a),!1;case"object":if(t===Object(t))return a(null,t),!1;default:return a(null,{}),!0}},parseDatas:function(t,e,n,r){"use strict";e===this.RESET_ALL_ON_UPDATE&&this._domains.forEach(function(f,d){d.forEach(function(b,c,y){y[c].v=null})});var o={},s=function(f){return f.t};for(var i in t){var a=new Date(i*1e3),h=this.getDomain(a)[0].getTime();if(this.DSTDomain.indexOf(h)>=0&&this._domains.has(h-3600*1e3)&&(h-=3600*1e3),!(isNaN(i)||!t.hasOwnProperty(i)||!this._domains.has(h)||!(h>=+n&&h<+r))){var u=this._domains.get(h);o.hasOwnProperty(h)||(o[h]=u.map(s));var m=o[h].indexOf(this._domainType[this.options.subDomain].extractUnit(a));e===this.RESET_SINGLE_ON_UPDATE||isNaN(u[m].v)?u[m].v=t[i]:u[m].v+=t[i]}}},parseURI:function(t,e,n){"use strict";return t=t.replace(/\{\{t:start\}\}/g,e.getTime()/1e3),t=t.replace(/\{\{t:end\}\}/g,n.getTime()/1e3),t=t.replace(/\{\{d:start\}\}/g,e.toISOString()),t=t.replace(/\{\{d:end\}\}/g,n.toISOString()),t},interpretCSV:function(t){"use strict";var e={},n=Object.keys(t[0]),r,o;for(r=0,o=t.length;r<o;r++)e[t[r][n[0]]]=+t[r][n[1]];return e},resize:function(){"use strict";var t=this,e=t.options,n=e.displayLegend?t.Legend.getDim("width")+e.legendMargin[1]+e.legendMargin[3]:0,r=e.displayLegend?t.Legend.getDim("height")+e.legendMargin[0]+e.legendMargin[2]:0,o=t.graphDim.width-e.domainGutter-e.cellPadding,s=t.graphDim.height-e.domainGutter-e.cellPadding,i=0;e.dayLabel&&e.domain==="month"&&e.subDomain==="day"&&(i=e.cellSize+e.cellPadding),this.root.transition().duration(e.animationDuration).attr("width",function(){return e.legendVerticalPosition==="middle"||e.legendVerticalPosition==="center"?o+n+i:Math.max(o,n)+i}).attr("height",function(){return e.legendVerticalPosition==="middle"||e.legendVerticalPosition==="center"?Math.max(s,r):s+r}),this.root.select(".graph").transition().duration(e.animationDuration).attr("y",function(){return e.legendVerticalPosition==="top"?r:0}).attr("x",function(){return(e.legendVerticalPosition==="middle"||e.legendVerticalPosition==="center")&&e.legendHorizontalPosition==="left"?n+i:i})},next:function(t){"use strict";return arguments.length===0&&(t=1),this.loadNextDomain(t)},previous:function(t){"use strict";return arguments.length===0&&(t=1),this.loadPreviousDomain(t)},jumpTo:function(t,e){"use strict";arguments.length<2&&(e=!1);var n=this.getDomainKeys(),r=n[0],o=n[n.length-1];return t<r?this.loadPreviousDomain(this.getDomain(r,t).length):e?this.loadNextDomain(this.getDomain(r,t).length):t>o?this.loadNextDomain(this.getDomain(o,t).length):!1},rewind:function(){"use strict";this.jumpTo(this.options.start,!0)},update:function(t,e,n){"use strict";arguments.length===0&&(t=this.options.data),arguments.length<2&&(e=!0),arguments.length<3&&(n=this.RESET_ALL_ON_UPDATE);var r=this.getDomainKeys(),o=this;this.getDatas(t,new Date(r[0]),this.getSubDomain(r[r.length-1]).pop(),function(){o.fill(),o.afterUpdate()},e,n)},setLegend:function(){"use strict";var t=this.options.legend.slice(0);arguments.length>=1&&Array.isArray(arguments[0])&&(this.options.legend=arguments[0]),arguments.length>=2&&(Array.isArray(arguments[1])&&arguments[1].length>=2?this.options.legendColors=[arguments[1][0],arguments[1][1]]:this.options.legendColors=arguments[1]),(arguments.length>0&&!I(t,this.options.legend)||arguments.length>=2)&&(this.Legend.buildColors(),this.fill()),this.Legend.redraw(this.graphDim.width-this.options.domainGutter-this.options.cellPadding)},removeLegend:function(){"use strict";return this.options.displayLegend?(this.options.displayLegend=!1,this.Legend.remove(),!0):!1},showLegend:function(){"use strict";return this.options.displayLegend?!1:(this.options.displayLegend=!0,this.Legend.redraw(this.graphDim.width-this.options.domainGutter-this.options.cellPadding),!0)},highlight:function(t){"use strict";return(this.options.highlight=this.expandDateSetting(t)).length>0?(this.fill(),!0):!1},destroy:function(t){"use strict";return this.root.transition().duration(this.options.animationDuration).attr("width",0).attr("height",0).remove().each("end",function(){typeof t=="function"?t():typeof t!="undefined"&&console.log("Provided callback for destroy() is not a function.")}),null},getSVG:function(){"use strict";for(var t={".cal-heatmap-container":{},".graph":{},".graph-rect":{},"rect.highlight":{},"rect.now":{},"rect.highlight-now":{},"text.highlight":{},"text.now":{},"text.highlight-now":{},".domain-background":{},".graph-label":{},".subdomain-text":{},".q0":{},".qi":{}},e=1,n=this.options.legend.length+1;e<=n;e++)t[".q"+e]={};var r=this.root,o=["stroke","stroke-width","stroke-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-miterlimit","fill","fill-opacity","fill-rule","marker","marker-start","marker-mid","marker-end","alignement-baseline","baseline-shift","dominant-baseline","glyph-orientation-horizontal","glyph-orientation-vertical","kerning","text-anchor","shape-rendering","text-transform","font-family","font","font-size","font-weight"],s=function(_,S,C){o.indexOf(S)!==-1&&(t[_][S]=C)},i=function(_){return r.select(_)[0][0]};for(var a in t)if(t.hasOwnProperty(a)){var h=i(a);if(h!==null){if("getComputedStyle"in window){var u=getComputedStyle(h,null);if(u.length!==0)for(var m=0;m<u.length;m++)s(a,u.item(m),u.getPropertyValue(u.item(m)));else for(var f in u)u.hasOwnProperty(f)&&s(a,f,u[f])}else if("currentStyle"in h){var d=h.currentStyle;for(var b in d)s(a,b,d[b])}}}var c='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css"><![CDATA[ ';for(var y in t){c+=y+` {
`;for(var M in t[y])c+="	"+M+":"+t[y][M]+`;
`;c+=`}
`}return c+="]]></style>",c+=new XMLSerializer().serializeToString(this.root[0][0]),c+="</svg>",c}};var x=function(){"use strict";this.positions=p.map()};x.prototype.getPosition=function(t){"use strict";return this.positions.get(t)};x.prototype.getPositionFromIndex=function(t){"use strict";var e=this.getKeys();return this.positions.get(e[t])};x.prototype.getLast=function(){"use strict";var t=this.getKeys();return this.positions.get(t[t.length-1])};x.prototype.setPosition=function(t,e){"use strict";this.positions.set(t,e)};x.prototype.shiftRightBy=function(t){"use strict";this.positions.forEach(function(n,r){this.set(n,r-t)});var e=this.getKeys();this.positions.remove(e[0])};x.prototype.shiftLeftBy=function(t){"use strict";this.positions.forEach(function(n,r){this.set(n,r+t)});var e=this.getKeys();this.positions.remove(e[e.length-1])};x.prototype.getKeys=function(){"use strict";return this.positions.keys().sort(function(t,e){return parseInt(t,10)-parseInt(e,10)})};var k=function(t){"use strict";this.calendar=t,this.computeDim(),t.options.legendColors!==null&&this.buildColors()};k.prototype.computeDim=function(){"use strict";var t=this.calendar.options;this.dim={width:t.legendCellSize*(t.legend.length+1)+t.legendCellPadding*t.legend.length,height:t.legendCellSize}};k.prototype.remove=function(){"use strict";this.calendar.root.select(".graph-legend").remove(),this.calendar.resize()};k.prototype.redraw=function(t){"use strict";if(!this.calendar.options.displayLegend)return!1;var e=this,n=this.calendar,r=n.root,o,s=n.options;this.computeDim();var i=s.legend.slice(0);i.push(i[i.length-1]+1);var a=n.root.select(".graph-legend");a[0][0]!==null?(r=a,o=r.select("g").selectAll("rect").data(i)):(r=s.legendVerticalPosition==="top"?r.insert("svg",".graph"):r.append("svg"),r.attr("x",u()).attr("y",m()),o=r.attr("class","graph-legend").attr("height",e.getDim("height")).attr("width",e.getDim("width")).append("g").selectAll().data(i)),o.enter().append("rect").call(h).attr("class",function(f){return n.Legend.getClass(f,n.legendScale===null)}).attr("fill-opacity",0).call(function(f){n.legendScale!==null&&s.legendColors!==null&&s.legendColors.hasOwnProperty("base")&&f.attr("fill",s.legendColors.base)}).append("title"),o.exit().transition().duration(s.animationDuration).attr("fill-opacity",0).remove(),o.transition().delay(function(f,d){return s.animationDuration*d/10}).call(h).attr("fill-opacity",1).call(function(f){f.attr("fill",function(d,b){return n.legendScale===null?"":b===0?n.legendScale(d-1):n.legendScale(s.legend[b-1])}),f.attr("class",function(d){return n.Legend.getClass(d,n.legendScale===null)})});function h(f){f.attr("width",s.legendCellSize).attr("height",s.legendCellSize).attr("x",function(d,b){return b*(s.legendCellSize+s.legendCellPadding)})}o.select("title").text(function(f,d){return d===0?n.formatStringWithObject(s.legendTitleFormat.lower,{min:s.legend[d],name:s.itemName[1]}):d===i.length-1?n.formatStringWithObject(s.legendTitleFormat.upper,{max:s.legend[d-1],name:s.itemName[1]}):n.formatStringWithObject(s.legendTitleFormat.inner,{down:s.legend[d-1],up:s.legend[d],name:s.itemName[1]})}),r.transition().duration(s.animationDuration).attr("x",u()).attr("y",m()).attr("width",e.getDim("width")).attr("height",e.getDim("height")),r.select("g").transition().duration(s.animationDuration).attr("transform",function(){return s.legendOrientation==="vertical"?"rotate(90 "+s.legendCellSize/2+" "+s.legendCellSize/2+")":""});function u(){switch(s.legendHorizontalPosition){case"right":return s.legendVerticalPosition==="center"||s.legendVerticalPosition==="middle"?t+s.legendMargin[3]:t-e.getDim("width")-s.legendMargin[1];case"middle":case"center":return Math.round(t/2-e.getDim("width")/2);default:return s.legendMargin[3]}}function m(){return s.legendVerticalPosition==="bottom"?n.graphDim.height+s.legendMargin[0]-s.domainGutter-s.cellPadding:s.legendMargin[0]}n.resize()};k.prototype.getDim=function(t){"use strict";var e=this.calendar.options.legendOrientation==="horizontal";switch(t){case"width":return this.dim[e?"width":"height"];case"height":return this.dim[e?"height":"width"]}};k.prototype.buildColors=function(){"use strict";var t=this.calendar.options;if(t.legendColors===null)return this.calendar.legendScale=null,!1;var e=[];if(Array.isArray(t.legendColors))e=t.legendColors;else if(t.legendColors.hasOwnProperty("min")&&t.legendColors.hasOwnProperty("max"))e=[t.legendColors.min,t.legendColors.max];else return t.legendColors=null,!1;var n=t.legend.slice(0);n[0]>0?n.unshift(0):n[0]<=0&&n.unshift(n[0]-(n[n.length-1]-n[0])/n.length);var r=p.scale.linear().range(e).interpolate(p.interpolateHcl).domain([p.min(n),p.max(n)]),o=n.map(function(s){return r(s)});return this.calendar.legendScale=p.scale.threshold().domain(t.legend).range(o),!0};k.prototype.getClass=function(t,e){"use strict";if(t===null||isNaN(t))return"";for(var n=[this.calendar.options.legend.length+1],r=0,o=this.calendar.options.legend.length-1;r<=o;r++){if(this.calendar.options.legend[0]>0&&t<0){n=["1","i"];break}if(t<=this.calendar.options.legend[r]){n=[r+1];break}}return t===0&&n.push(0),n.unshift(""),(n.join(" r")+(e?n.join(" q"):"")).trim()};function E(t,e){"use strict";for(var n in e)try{e[n].constructor===Object?t[n]=E(t[n],e[n]):t[n]=e[n]}catch(r){t[n]=e[n]}return t}function I(t,e){"use strict";if(!e||!t||t.length!==e.length)return!1;for(var n=0;n<t.length;n++)if(t[n]instanceof Array&&e[n]instanceof Array){if(!I(t[n],e[n]))return!1}else if(t[n]!==e[n])return!1;return!0}typeof define=="function"&&define.amd?define(["d3"],function(){"use strict";return T}):typeof module=="object"&&module.exports?module.exports=T:window.CalHeatMap=T;function L(t){return pycmd(t)}function N(t){let e=new Date(t);return new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),0,0,0,0)}function O(t){return Math.floor(N(t*1e3).getTime()/1e3)}function R(t){let e=n=>n<10?"0"+n:""+n;return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}function Y(t,e){let n=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),r=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((r-n)/864e5)}function A(t){return new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,0,0,0)}var z="review-heatmap-style",W=300;function K(){if(document.getElementById(z))return;let t=document.createElement("style");t.id=z,t.textContent=F+`
`+H,document.head.appendChild(t)}var P=class{constructor(e){this.options=e;this.heatmap=null;this.busyUntil=0;this.today=N(this.options.today)}create(e){K();let n=this.today,r=N(this.options.start),o=N(this.options.stop),s=new Date(n);if(this.options.domain==="month"){let a=this.options.range/2,h=Math.round(a-1),u=Math.round(a+1);s.setMonth(s.getMonth()-h),s.setDate(1),r.getTime()>s.getTime()&&(s=r);let m=new Date(n);m.setMonth(m.getMonth()+u),m.setDate(1),m.getTime()>o.getTime()&&(o=m)}let i=new T;i.init({domain:this.options.domain,subDomain:this.options.subdomain,range:this.options.range,minDate:r,maxDate:o,cellSize:10,verticalOrientation:!1,dayLabel:!0,domainMargin:[1,1,1,1],itemName:["card","cards"],highlight:n,today:n,start:s,legend:this.options.legend,displayLegend:!1,domainLabelFormat:this.options.domLabForm,animationDuration:W,tooltip:!0,subDomainTitleFormat:(a,h,u)=>{let m=h.count;if(m!==void 0&&m.startsWith("-")&&(m=m.substring(1)),a)return`<b>No</b> ${u.t>n.getTime()?"cards due":"reviews"} on ${h.date}`;let f=Math.abs(u.v)==1?"card":"cards",d=u.v<0?"due":"reviewed";return`<b>${m}</b> ${f} <b>${d}</b> ${h.connector} ${h.date}`},onClick:(a,h)=>{if(h===null||h==0){i.highlight(n);return}let u=A(a),m=this.options.whole?"":"deck:current ";h>=0?m+="rid:"+R(u):m+="prop:due="+Y(n,u),L("revhm_browse:"+m),i.highlight([n,u])},afterLoadData:a=>{let h={};for(let u in a)h[O(parseInt(u,10))]=a[u];return h},data:e}),this.heatmap=i}navigationBlocked(){let e=Date.now();return e<this.busyUntil?!0:(this.busyUntil=e+W+50,!1)}onHmHome(e,n){if(e.shiftKey){L("revhm_modeswitch");return}this.heatmap&&!this.navigationBlocked()&&this.heatmap.rewind()}onHmNavigate(e,n,r){if(!this.heatmap||this.navigationBlocked())return;let o=this.heatmap.options;r==="next"?e.shiftKey?this.heatmap.jumpTo(o.maxDate,!1):this.heatmap.next(o.range):e.shiftKey?this.heatmap.jumpTo(o.minDate,!1):this.heatmap.previous(o.range)}onHmOpts(e,n){L(e.shiftKey?"revhm_themeswitch":"revhm_opts")}onHmContrib(e,n){L(e.shiftKey?"revhm_snanki":"revhm_about")}};globalThis.ReviewHeatmap=P;})();
