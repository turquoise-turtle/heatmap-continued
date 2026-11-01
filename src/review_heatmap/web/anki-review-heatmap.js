(()=>{var P=`/* Cal-HeatMap CSS */

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
`;var F=`/* 
This file is part of the Review Heatmap add-on for Anki

Custom Heatmap CSS

Copyright: (c) 2016-2022 Glutanimate <https://glutanimate.com/>
License: GNU AGPLv3 <https://www.gnu.org/licenses/agpl.html>
*/

/* Special classes:
"rh-platform-mac": Set when run on macOS
"rh-platform-win": Set when run on Windows
"rh-platform-lin": Set when run on Linux
"rh-theme-olive", "rh-theme-lime", "rh-theme-ice",
    "rh-theme-magenta", "rh-theme-flame": Set when respective theme active
"rh-mode-year": Set when calendar set to year mode
"rh-mode-months": Set when calendar set to months mode
"rh-view-deckbrowser", "rh-view-overview", "rh-view-stats": Set when drawn
    on respective view
"rh-disable-stats": Set when streak stats disabled
"rh-disable-heatmap": Set when heatmap disabled
"night_mode": Set when night mode active (provided by Night Mode add-on)
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
.night_mode .cal-heatmap-container .graph-rect {
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
.night_mode .hm-btn {
    background-color: #313d45;
}
.night_mode .hm-btn:hover {
    background-color: #374f5b;
}
.night_mode .hm-btn:active {
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

/* Heatmap activity type widget */
/* ################################################################### */
.hm-sel {
    display: inline-block;
    height: 100%;
    padding: 4px 8px;
    font-size: 80%;
    cursor: pointer;
    color: #808080;
    border-radius: 3px;
    user-select: none;
    border: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: url(qrc:/review_heatmap/icons/down.svg) 96% / 10% no-repeat #e6e6e6;
}
select.hm-sel:hover {
    background: url(qrc:/review_heatmap/icons/down.svg) 96% / 10% no-repeat #bfbfbf;
}
select.hm-sel:active, select.hm-sel:focus {
    background: url(qrc:/review_heatmap/icons/down.svg) 96% / 10% no-repeat #e6e6e6;
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

.night_mode .linkspan {
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





/* Color themes */
/* ################################################################### */


/* FORECAST RECT COLORS */
/*
- same for every theme 
- reverse order because of negative value workaround 
*/
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

.night_mode .cal-heatmap-container .q1{fill: #5d5f5f}
.night_mode .cal-heatmap-container .q2{fill: #585a5a}
.night_mode .cal-heatmap-container .q3{fill: #535555}
.night_mode .cal-heatmap-container .q4{fill: #4e5050}
.night_mode .cal-heatmap-container .q5{fill: #494b4b}
.night_mode .cal-heatmap-container .q6{fill: #444646}
.night_mode .cal-heatmap-container .q7{fill: #3f4141}
.night_mode .cal-heatmap-container .q8{fill: #3a3c3c}
.night_mode .cal-heatmap-container .q9{fill: #353737}
.night_mode .cal-heatmap-container .q10{fill: #313232}

/* REVIEW HISTORY COLORS */
/*
- different between each theme
*/

/* olive */
.rh-theme-olive .cal-heatmap-container .q11{fill: #dae289}
.rh-theme-olive .cal-heatmap-container .q12{fill: #bbd179}
.rh-theme-olive .cal-heatmap-container .q13{fill: #9cc069}
.rh-theme-olive .cal-heatmap-container .q14{fill: #8ab45d}
.rh-theme-olive .cal-heatmap-container .q15{fill: #78a851}
.rh-theme-olive .cal-heatmap-container .q16{fill: #669d45}
.rh-theme-olive .cal-heatmap-container .q17{fill: #648b3f}
.rh-theme-olive .cal-heatmap-container .q18{fill: #637939}
.rh-theme-olive .cal-heatmap-container .q19{fill: #4f6e30}
.rh-theme-olive .cal-heatmap-container .q20{fill: #3b6427}

.rh-theme-olive .rh-col11{color: #dae289}
.rh-theme-olive .rh-col12{color: #bbd179}
.rh-theme-olive .rh-col13{color: #9cc069}
.rh-theme-olive .rh-col14{color: #8ab45d}
.rh-theme-olive .rh-col15{color: #78a851}
.rh-theme-olive .rh-col16{color: #669d45}
.rh-theme-olive .rh-col17{color: #648b3f}
.rh-theme-olive .rh-col18{color: #637939}
.rh-theme-olive .rh-col19{color: #4f6e30}
.rh-theme-olive .rh-col20{color: #3b6427}

.night_mode .rh-theme-olive .cal-heatmap-container .q11{fill: #3b6427}
.night_mode .rh-theme-olive .cal-heatmap-container .q12{fill: #4f6e30}
.night_mode .rh-theme-olive .cal-heatmap-container .q13{fill: #637939}
.night_mode .rh-theme-olive .cal-heatmap-container .q14{fill: #648b3f}
.night_mode .rh-theme-olive .cal-heatmap-container .q15{fill: #669d45}
.night_mode .rh-theme-olive .cal-heatmap-container .q16{fill: #78a851}
.night_mode .rh-theme-olive .cal-heatmap-container .q17{fill: #8ab45d}
.night_mode .rh-theme-olive .cal-heatmap-container .q18{fill: #9cc069}
.night_mode .rh-theme-olive .cal-heatmap-container .q19{fill: #bbd179}
.night_mode .rh-theme-olive .cal-heatmap-container .q20{fill: #dae289}

.night_mode .rh-theme-olive .rh-col11{color: #3b6427}
.night_mode .rh-theme-olive .rh-col12{color: #4f6e30}
.night_mode .rh-theme-olive .rh-col13{color: #637939}
.night_mode .rh-theme-olive .rh-col14{color: #648b3f}
.night_mode .rh-theme-olive .rh-col15{color: #669d45}
.night_mode .rh-theme-olive .rh-col16{color: #78a851}
.night_mode .rh-theme-olive .rh-col17{color: #8ab45d}
.night_mode .rh-theme-olive .rh-col18{color: #9cc069}
.night_mode .rh-theme-olive .rh-col19{color: #bbd179}
.night_mode .rh-theme-olive .rh-col20{color: #dae289}

/* lime */
.rh-theme-lime .cal-heatmap-container .q11{fill: #d6e685}
.rh-theme-lime .cal-heatmap-container .q12{fill: #bddb7a}
.rh-theme-lime .cal-heatmap-container .q13{fill: #a4d06f}
.rh-theme-lime .cal-heatmap-container .q14{fill: #8cc665}
.rh-theme-lime .cal-heatmap-container .q15{fill: #74ba58}
.rh-theme-lime .cal-heatmap-container .q16{fill: #5cae4c}
.rh-theme-lime .cal-heatmap-container .q17{fill: #44a340}
.rh-theme-lime .cal-heatmap-container .q18{fill: #378f36}
.rh-theme-lime .cal-heatmap-container .q19{fill: #2a7b2c}
.rh-theme-lime .cal-heatmap-container .q20{fill: #1e6823}

.rh-theme-lime .rh-col11{color: #d6e685}
.rh-theme-lime .rh-col12{color: #bddb7a}
.rh-theme-lime .rh-col13{color: #a4d06f}
.rh-theme-lime .rh-col14{color: #8cc665}
.rh-theme-lime .rh-col15{color: #74ba58}
.rh-theme-lime .rh-col16{color: #5cae4c}
.rh-theme-lime .rh-col17{color: #44a340}
.rh-theme-lime .rh-col18{color: #378f36}
.rh-theme-lime .rh-col19{color: #2a7b2c}
.rh-theme-lime .rh-col20{color: #1e6823}

.night_mode .rh-theme-lime .cal-heatmap-container .q11{fill: #1e6823}
.night_mode .rh-theme-lime .cal-heatmap-container .q12{fill: #2a7b2c}
.night_mode .rh-theme-lime .cal-heatmap-container .q13{fill: #378f36}
.night_mode .rh-theme-lime .cal-heatmap-container .q14{fill: #44a340}
.night_mode .rh-theme-lime .cal-heatmap-container .q15{fill: #5cae4c}
.night_mode .rh-theme-lime .cal-heatmap-container .q16{fill: #74ba58}
.night_mode .rh-theme-lime .cal-heatmap-container .q17{fill: #8cc665}
.night_mode .rh-theme-lime .cal-heatmap-container .q18{fill: #a4d06f}
.night_mode .rh-theme-lime .cal-heatmap-container .q19{fill: #bddb7a}
.night_mode .rh-theme-lime .cal-heatmap-container .q20{fill: #d6e685}

.night_mode .rh-theme-lime .rh-col11{color: #1e6823}
.night_mode .rh-theme-lime .rh-col12{color: #2a7b2c}
.night_mode .rh-theme-lime .rh-col13{color: #378f36}
.night_mode .rh-theme-lime .rh-col14{color: #44a340}
.night_mode .rh-theme-lime .rh-col15{color: #5cae4c}
.night_mode .rh-theme-lime .rh-col16{color: #74ba58}
.night_mode .rh-theme-lime .rh-col17{color: #8cc665}
.night_mode .rh-theme-lime .rh-col18{color: #a4d06f}
.night_mode .rh-theme-lime .rh-col19{color: #bddb7a}
.night_mode .rh-theme-lime .rh-col20{color: #d6e685}

/* ice */
.rh-theme-ice .cal-heatmap-container .q11{fill: #a8d5f6}
.rh-theme-ice .cal-heatmap-container .q12{fill: #95c8f3}
.rh-theme-ice .cal-heatmap-container .q13{fill: #82bbf0}
.rh-theme-ice .cal-heatmap-container .q14{fill: #70afee}
.rh-theme-ice .cal-heatmap-container .q15{fill: #5da2eb}
.rh-theme-ice .cal-heatmap-container .q16{fill: #4a95e8}
.rh-theme-ice .cal-heatmap-container .q17{fill: #3889e6}
.rh-theme-ice .cal-heatmap-container .q18{fill: #257ce3}
.rh-theme-ice .cal-heatmap-container .q19{fill: #126fe0}
.rh-theme-ice .cal-heatmap-container .q20{fill: #0063de}

.rh-theme-ice .rh-col11{color: #a8d5f6}
.rh-theme-ice .rh-col12{color: #95c8f3}
.rh-theme-ice .rh-col13{color: #82bbf0}
.rh-theme-ice .rh-col14{color: #70afee}
.rh-theme-ice .rh-col15{color: #5da2eb}
.rh-theme-ice .rh-col16{color: #4a95e8}
.rh-theme-ice .rh-col17{color: #3889e6}
.rh-theme-ice .rh-col18{color: #257ce3}
.rh-theme-ice .rh-col19{color: #126fe0}
.rh-theme-ice .rh-col20{color: #0063de}

.night_mode .rh-theme-ice .cal-heatmap-container .q11{fill: #0063de}
.night_mode .rh-theme-ice .cal-heatmap-container .q12{fill: #126fe0}
.night_mode .rh-theme-ice .cal-heatmap-container .q13{fill: #257ce3}
.night_mode .rh-theme-ice .cal-heatmap-container .q14{fill: #3889e6}
.night_mode .rh-theme-ice .cal-heatmap-container .q15{fill: #4a95e8}
.night_mode .rh-theme-ice .cal-heatmap-container .q16{fill: #5da2eb}
.night_mode .rh-theme-ice .cal-heatmap-container .q17{fill: #70afee}
.night_mode .rh-theme-ice .cal-heatmap-container .q18{fill: #82bbf0}
.night_mode .rh-theme-ice .cal-heatmap-container .q19{fill: #95c8f3}
.night_mode .rh-theme-ice .cal-heatmap-container .q20{fill: #a8d5f6}

.night_mode .rh-theme-ice .rh-col11{color: #0063de}
.night_mode .rh-theme-ice .rh-col12{color: #126fe0}
.night_mode .rh-theme-ice .rh-col13{color: #257ce3}
.night_mode .rh-theme-ice .rh-col14{color: #3889e6}
.night_mode .rh-theme-ice .rh-col15{color: #4a95e8}
.night_mode .rh-theme-ice .rh-col16{color: #5da2eb}
.night_mode .rh-theme-ice .rh-col17{color: #70afee}
.night_mode .rh-theme-ice .rh-col18{color: #82bbf0}
.night_mode .rh-theme-ice .rh-col19{color: #95c8f3}
.night_mode .rh-theme-ice .rh-col20{color: #a8d5f6}

/* magenta */
.rh-theme-magenta .cal-heatmap-container .q11{fill: #fde0dd}
.rh-theme-magenta .cal-heatmap-container .q12{fill: #fcc5c0}
.rh-theme-magenta .cal-heatmap-container .q13{fill: #fa9fb5}
.rh-theme-magenta .cal-heatmap-container .q14{fill: #f768a1}
.rh-theme-magenta .cal-heatmap-container .q15{fill: #ea4e9c}
.rh-theme-magenta .cal-heatmap-container .q16{fill: #dd3497}
.rh-theme-magenta .cal-heatmap-container .q17{fill: #ae017e}
.rh-theme-magenta .cal-heatmap-container .q18{fill: #7a0177}
.rh-theme-magenta .cal-heatmap-container .q19{fill: #610070}
.rh-theme-magenta .cal-heatmap-container .q20{fill: #49006a}

.rh-theme-magenta .rh-col11{color: #fde0dd}
.rh-theme-magenta .rh-col12{color: #fcc5c0}
.rh-theme-magenta .rh-col13{color: #fa9fb5}
.rh-theme-magenta .rh-col14{color: #f768a1}
.rh-theme-magenta .rh-col15{color: #ea4e9c}
.rh-theme-magenta .rh-col16{color: #dd3497}
.rh-theme-magenta .rh-col17{color: #ae017e}
.rh-theme-magenta .rh-col18{color: #7a0177}
.rh-theme-magenta .rh-col19{color: #610070}
.rh-theme-magenta .rh-col20{color: #49006a}

.night_mode .rh-theme-magenta .cal-heatmap-container .q11{fill: #49006a}
.night_mode .rh-theme-magenta .cal-heatmap-container .q12{fill: #610070}
.night_mode .rh-theme-magenta .cal-heatmap-container .q13{fill: #7a0177}
.night_mode .rh-theme-magenta .cal-heatmap-container .q14{fill: #ae017e}
.night_mode .rh-theme-magenta .cal-heatmap-container .q15{fill: #dd3497}
.night_mode .rh-theme-magenta .cal-heatmap-container .q16{fill: #ea4e9c}
.night_mode .rh-theme-magenta .cal-heatmap-container .q17{fill: #f768a1}
.night_mode .rh-theme-magenta .cal-heatmap-container .q18{fill: #fa9fb5}
.night_mode .rh-theme-magenta .cal-heatmap-container .q19{fill: #fcc5c0}
.night_mode .rh-theme-magenta .cal-heatmap-container .q20{fill: #fde0dd}

.night_mode .rh-theme-magenta .rh-col11{color: #49006a}
.night_mode .rh-theme-magenta .rh-col12{color: #610070}
.night_mode .rh-theme-magenta .rh-col13{color: #7a0177}
.night_mode .rh-theme-magenta .rh-col14{color: #ae017e}
.night_mode .rh-theme-magenta .rh-col15{color: #dd3497}
.night_mode .rh-theme-magenta .rh-col16{color: #ea4e9c}
.night_mode .rh-theme-magenta .rh-col17{color: #f768a1}
.night_mode .rh-theme-magenta .rh-col18{color: #fa9fb5}
.night_mode .rh-theme-magenta .rh-col19{color: #fcc5c0}
.night_mode .rh-theme-magenta .rh-col20{color: #fde0dd}


/* flame */
.rh-theme-flame .cal-heatmap-container .q11{fill: #ffeda0}
.rh-theme-flame .cal-heatmap-container .q12{fill: #fed976}
.rh-theme-flame .cal-heatmap-container .q13{fill: #feb24c}
.rh-theme-flame .cal-heatmap-container .q14{fill: #fd8d3c}
.rh-theme-flame .cal-heatmap-container .q15{fill: #fc6d33}
.rh-theme-flame .cal-heatmap-container .q16{fill: #fc4e2a}
.rh-theme-flame .cal-heatmap-container .q17{fill: #e31a1c}
.rh-theme-flame .cal-heatmap-container .q18{fill: #d00d21}
.rh-theme-flame .cal-heatmap-container .q19{fill: #bd0026}
.rh-theme-flame .cal-heatmap-container .q20{fill: #800026}

.rh-theme-flame .rh-col11{color: #ffeda0}
.rh-theme-flame .rh-col12{color: #fed976}
.rh-theme-flame .rh-col13{color: #feb24c}
.rh-theme-flame .rh-col14{color: #fd8d3c}
.rh-theme-flame .rh-col15{color: #fc6d33}
.rh-theme-flame .rh-col16{color: #fc4e2a}
.rh-theme-flame .rh-col17{color: #e31a1c}
.rh-theme-flame .rh-col18{color: #d00d21}
.rh-theme-flame .rh-col19{color: #bd0026}
.rh-theme-flame .rh-col20{color: #800026}

.night_mode .rh-theme-flame .cal-heatmap-container .q11{fill: #800026}
.night_mode .rh-theme-flame .cal-heatmap-container .q12{fill: #bd0026}
.night_mode .rh-theme-flame .cal-heatmap-container .q13{fill: #d00d21}
.night_mode .rh-theme-flame .cal-heatmap-container .q14{fill: #e31a1c}
.night_mode .rh-theme-flame .cal-heatmap-container .q15{fill: #fc4e2a}
.night_mode .rh-theme-flame .cal-heatmap-container .q16{fill: #fc6d33}
.night_mode .rh-theme-flame .cal-heatmap-container .q17{fill: #fd8d3c}
.night_mode .rh-theme-flame .cal-heatmap-container .q18{fill: #feb24c}
.night_mode .rh-theme-flame .cal-heatmap-container .q19{fill: #fed976}
.night_mode .rh-theme-flame .cal-heatmap-container .q20{fill: #ffeda0}

.night_mode .rh-theme-flame .rh-col11{color: #800026}
.night_mode .rh-theme-flame .rh-col12{color: #bd0026}
.night_mode .rh-theme-flame .rh-col13{color: #d00d21}
.night_mode .rh-theme-flame .rh-col14{color: #e31a1c}
.night_mode .rh-theme-flame .rh-col15{color: #fc4e2a}
.night_mode .rh-theme-flame .rh-col16{color: #fc6d33}
.night_mode .rh-theme-flame .rh-col17{color: #fd8d3c}
.night_mode .rh-theme-flame .rh-col18{color: #feb24c}
.night_mode .rh-theme-flame .rh-col19{color: #fed976}
.night_mode .rh-theme-flame .rh-col20{color: #ffeda0}


/* Platform-specific adjustments / workarounds */
/* ################################################################### */
`;/*! cal-heatmap v3.6.3.2-anki2150 (2022)
 *  ---------------------------------------------
 *  Fork of Cal-HeatMap for use in the Anki add-on Review Heatmap
 *  https://github.com/glutanimate/cal-heatmap
 *  Licensed under the MIT license
 *  Copyright 2014 Wan Qi Chen
 *  Copyright 2018-2022 Glutanimate
 *  Contributors: gakada, Srdjan Prpa
  */var d=window.d3,T=function(){"use strict";var e=this;this.allowedDataType=["json","csv","tsv","txt"],this.options={itemSelector:"#cal-heatmap",paintOnLoad:!0,range:12,cellSize:10,cellPadding:2,cellRadius:0,domainGutter:2,domainMargin:[0,0,0,0],domain:"hour",subDomain:"min",colLimit:null,rowLimit:null,weekStartOnMonday:!0,dayLabel:!1,start:new Date,minDate:null,maxDate:null,today:new Date,data:"",dataType:this.allowedDataType[0],dataPostPayload:null,dataRequestHeaders:null,considerMissingDataAsZero:!1,loadOnInit:!0,verticalOrientation:!1,domainDynamicDimension:!0,label:{position:"bottom",align:"center",offset:{x:0,y:0},rotate:null,width:100,height:null},legend:[10,20,30,40],displayLegend:!0,legendCellSize:10,legendCellPadding:2,legendMargin:[0,0,0,0],legendVerticalPosition:"bottom",legendHorizontalPosition:"left",legendOrientation:"horizontal",legendColors:null,highlight:[],itemName:["item","items"],domainLabelFormat:null,subDomainTitleFormat:{empty:"{date}",filled:"{count} {name} {connector} {date}"},subDomainDateFormat:null,subDomainTextFormat:null,legendTitleFormat:{lower:"less than {min} {name}",inner:"between {down} and {up} {name}",upper:"more than {max} {name}"},animationDuration:500,nextSelector:!1,previousSelector:!1,itemNamespace:"cal-heatmap",tooltip:!1,onClick:null,afterLoad:null,afterLoadNextDomain:null,afterLoadPreviousDomain:null,onComplete:null,afterLoadData:function(i){return i},afterUpdate:null,onMaxDomainReached:null,onMinDomainReached:null},this._domainType={min:{name:"minute",level:10,maxItemNumber:60,defaultRowNumber:10,defaultColumnNumber:6,row:function(i){return e.getSubDomainRowNumber(i)},column:function(i){return e.getSubDomainColumnNumber(i)},position:{x:function(i){return Math.floor(i.getMinutes()/e._domainType.min.row(i))},y:function(i){return i.getMinutes()%e._domainType.min.row(i)}},format:{date:"%H:%M, %A %B %-e, %Y",legend:"",connector:"at"},extractUnit:function(i){return new Date(i.getFullYear(),i.getMonth(),i.getDate(),i.getHours(),i.getMinutes()).getTime()}},hour:{name:"hour",level:20,maxItemNumber:function(i){switch(e.options.domain){case"day":return 24;case"week":return 168;case"month":return 24*(e.options.domainDynamicDimension?e.getDayCountInMonth(i):31)}},defaultRowNumber:6,defaultColumnNumber:function(i){switch(e.options.domain){case"day":return 4;case"week":return 28;case"month":return e.options.domainDynamicDimension?e.getDayCountInMonth(i):31}},row:function(i){return e.getSubDomainRowNumber(i)},column:function(i){return e.getSubDomainColumnNumber(i)},position:{x:function(i){return e.options.domain==="month"?e.options.colLimit>0||e.options.rowLimit>0?Math.floor((i.getHours()+(i.getDate()-1)*24)/e._domainType.hour.row(i)):Math.floor(i.getHours()/e._domainType.hour.row(i))+(i.getDate()-1)*4:e.options.domain==="week"?e.options.colLimit>0||e.options.rowLimit>0?Math.floor((i.getHours()+e.getWeekDay(i)*24)/e._domainType.hour.row(i)):Math.floor(i.getHours()/e._domainType.hour.row(i))+e.getWeekDay(i)*4:Math.floor(i.getHours()/e._domainType.hour.row(i))},y:function(i){var a=i.getHours();if(e.options.colLimit>0||e.options.rowLimit>0)switch(e.options.domain){case"month":a+=(i.getDate()-1)*24;break;case"week":a+=e.getWeekDay(i)*24;break}return Math.floor(a%e._domainType.hour.row(i))}},format:{date:"%Hh, %A %B %-e, %Y",legend:"%H:00",connector:"at"},extractUnit:function(i){return new Date(i.getFullYear(),i.getMonth(),i.getDate(),i.getHours()).getTime()}},day:{name:"day",level:30,maxItemNumber:function(i){switch(e.options.domain){case"week":return 7;case"month":return e.options.domainDynamicDimension?e.getDayCountInMonth(i):31;case"year":return e.options.domainDynamicDimension?e.getDayCountInYear(i):366}},defaultColumnNumber:function(i){switch(i=new Date(i),e.options.domain){case"week":return 1;case"month":return e.options.domainDynamicDimension&&!e.options.verticalOrientation?e.getWeekNumber(new Date(i.getFullYear(),i.getMonth()+1,0))-e.getWeekNumber(i)+1:6;case"year":return e.options.domainDynamicDimension?e.getWeekNumber(new Date(i.getFullYear(),11,31))-e.getWeekNumber(new Date(i.getFullYear(),0))+1:54}},defaultRowNumber:7,row:function(i){return e.getSubDomainRowNumber(i)},column:function(i){return e.getSubDomainColumnNumber(i)},position:{x:function(i){switch(e.options.domain){case"week":return Math.floor(e.getWeekDay(i)/e._domainType.day.row(i));case"month":return e.options.colLimit>0||e.options.rowLimit>0?Math.floor((i.getDate()-1)/e._domainType.day.row(i)):e.getWeekNumber(i)-e.getWeekNumber(new Date(i.getFullYear(),i.getMonth()));case"year":return e.options.colLimit>0||e.options.rowLimit>0?Math.floor((e.getDayOfYear(i)-1)/e._domainType.day.row(i)):e.getWeekNumber(i)}},y:function(i){var a=e.getWeekDay(i);if(e.options.colLimit>0||e.options.rowLimit>0)switch(e.options.domain){case"year":a=e.getDayOfYear(i)-1;break;case"week":a=e.getWeekDay(i);break;case"month":a=i.getDate()-1;break}return Math.floor(a%e._domainType.day.row(i))}},format:{date:"%A %B %-e, %Y",legend:"%e %b",connector:"on"},extractUnit:function(i){return new Date(i.getFullYear(),i.getMonth(),i.getDate()).getTime()}},week:{name:"week",level:40,maxItemNumber:54,defaultColumnNumber:function(i){switch(i=new Date(i),e.options.domain){case"year":return e._domainType.week.maxItemNumber;case"month":return e.options.domainDynamicDimension?e.getWeekNumber(new Date(i.getFullYear(),i.getMonth()+1,0))-e.getWeekNumber(i):5}},defaultRowNumber:1,row:function(i){return e.getSubDomainRowNumber(i)},column:function(i){return e.getSubDomainColumnNumber(i)},position:{x:function(i){switch(e.options.domain){case"year":return Math.floor(e.getWeekNumber(i)/e._domainType.week.row(i));case"month":return Math.floor(e.getMonthWeekNumber(i)/e._domainType.week.row(i))}},y:function(i){return e.getWeekNumber(i)%e._domainType.week.row(i)}},format:{date:"%B Week #%W",legend:"%B Week #%W",connector:"in"},extractUnit:function(i){var a=new Date(i.getFullYear(),i.getMonth(),i.getDate()),c=a.getDay()-(e.options.weekStartOnMonday?1:0);return c<0&&(c=6),a.setDate(a.getDate()-c),a.getTime()}},month:{name:"month",level:50,maxItemNumber:12,defaultColumnNumber:12,defaultRowNumber:1,row:function(){return e.getSubDomainRowNumber()},column:function(){return e.getSubDomainColumnNumber()},position:{x:function(i){return Math.floor(i.getMonth()/e._domainType.month.row(i))},y:function(i){return i.getMonth()%e._domainType.month.row(i)}},format:{date:"%B %Y",legend:"%B",connector:"in"},extractUnit:function(i){return new Date(i.getFullYear(),i.getMonth()).getTime()}},year:{name:"year",level:60,row:function(){return e.options.rowLimit||1},column:function(){return e.options.colLimit||1},position:{x:function(){return 1},y:function(){return 1}},format:{date:"%Y",legend:"%Y",connector:"in"},extractUnit:function(i){return new Date(i.getFullYear()).getTime()}}};for(var t in this._domainType)if(this._domainType.hasOwnProperty(t)){var n=this._domainType[t];this._domainType["x_"+t]={name:"x_"+t,level:n.type,maxItemNumber:n.maxItemNumber,defaultRowNumber:n.defaultRowNumber,defaultColumnNumber:n.defaultColumnNumber,row:n.column,column:n.row,position:{x:n.position.y,y:n.position.x},format:n.format,extractUnit:n.extractUnit}}this.lastInsertedSvg=null,this._completed=!1,this._domains=d.map(),this.graphDim={width:0,height:0},this.legendDim={width:0,height:0},this.NAVIGATE_LEFT=1,this.NAVIGATE_RIGHT=2,this.RESET_ALL_ON_UPDATE=0,this.RESET_SINGLE_ON_UPDATE=1,this.APPEND_ON_UPDATE=2,this.DEFAULT_LEGEND_MARGIN=10,this.root=null,this.tooltip=null,this._maxDomainReached=!1,this._minDomainReached=!1,this.domainPosition=new _,this.Legend=null,this.legendScale=null,this.DSTDomain=[],this._init=function(){return e.getDomain(e.options.start).map(function(i){return i.getTime()}).map(function(i){e._domains.set(i,e.getSubDomain(i).map(function(a){return{t:e._domainType[e.options.subDomain].extractUnit(a),v:null}}))}),e.root=d.select(e.options.itemSelector).append("svg").attr("class","cal-heatmap-container"),e.tooltip=d.select(e.options.itemSelector).attr("style",function(){var i=d.select(e.options.itemSelector).attr("style");return(i!==null?i:"")+"position:relative;"}).append("div").attr("class","ch-tooltip"),e.root.attr("x",0).attr("y",0).append("svg").attr("class","graph"),e.Legend=new M(e),e.options.paintOnLoad&&o(),!0};function o(){e.verticalDomainLabel=e.options.label.position==="top"||e.options.label.position==="bottom",e.domainVerticalLabelHeight=e.options.label.height===null?Math.max(25,e.options.cellSize*2):e.options.label.height,e.domainHorizontalLabelWidth=0,e.options.domainLabelFormat===""&&e.options.label.height===null&&(e.domainVerticalLabelHeight=0),e.verticalDomainLabel||(e.domainVerticalLabelHeight=0,e.domainHorizontalLabelWidth=e.options.label.width),e.paint(),e.options.nextSelector!==!1&&d.select(e.options.nextSelector).on("click."+e.options.itemNamespace,function(){return d.event.preventDefault(),e.loadNextDomain(1)}),e.options.previousSelector!==!1&&d.select(e.options.previousSelector).on("click."+e.options.itemNamespace,function(){return d.event.preventDefault(),e.loadPreviousDomain(1)}),e.Legend.redraw(e.graphDim.width-e.options.domainGutter-e.options.cellPadding),e.afterLoad();var i=e.getDomainKeys();e.options.loadOnInit?e.getDatas(e.options.data,new Date(i[0]),e.getSubDomain(i[i.length-1]).pop(),function(){e.fill(),e.onComplete()}):e.onComplete(),e.checkIfMinDomainIsReached(i[0]),e.checkIfMaxDomainIsReached(e.getNextDomain().getTime())}function l(i,a){var c=e.options.cellSize*e._domainType[e.options.subDomain].column(i)+e.options.cellPadding*e._domainType[e.options.subDomain].column(i);return arguments.length===2&&a===!0?c+=e.domainHorizontalLabelWidth+e.options.domainGutter+e.options.domainMargin[1]+e.options.domainMargin[3]:c}function r(i,a){var c=e.options.cellSize*e._domainType[e.options.subDomain].row(i)+e.options.cellPadding*e._domainType[e.options.subDomain].row(i);return arguments.length===2&&a===!0&&(c+=e.options.domainGutter+e.domainVerticalLabelHeight+e.options.domainMargin[0]+e.options.domainMargin[2]),c}this.paint=function(i){var a=e.options;arguments.length===0&&(i=!1);var c=e.root.select(".graph").selectAll(".graph-domain").data(function(){var s=e.getDomainKeys();return i===e.NAVIGATE_LEFT?s.reverse():s},function(s){return s}),u=0,m=0;if(a.dayLabel&&a.domain==="month"&&a.subDomain==="day"){var g=["monday","tuesday","wednesday","thursday","friday","saturday"];a.weekStartOnMonday?g.push("sunday"):g.shif("sunday");var p=g.map(function(s){return e.formatDate(d.time[s](new Date),"%a").charAt(0)});this.root.selectAll(".day-name").remove();var b=this.root.append("svg").attr("class","day-name").attr("x",0).attr("y",0),h=b.selectAll("g").data(p).enter().append("g");h.append("rect").attr("class","day-name-rect").attr("width",a.cellSize).attr("height",a.cellSize).attr("x",0).attr("y",function(s,f){return f*a.cellSize+f*a.cellPadding}),h.append("text").attr("class","day-name-text").attr("dominant-baseline","central").attr("x",0).attr("y",function(s,f){return f*a.cellSize+f*a.cellPadding+a.cellSize/2}).text(function(s){return s})}var y=c.enter().append("svg").attr("width",function(s){return l(s,!0)}).attr("height",function(s){return r(s,!0)}).attr("x",function(s){return a.verticalOrientation?(e.graphDim.width=Math.max(e.graphDim.width,l(s,!0)),0):x(s,e.graphDim,"width",l(s,!0))}).attr("y",function(s){return a.verticalOrientation?x(s,e.graphDim,"height",r(s,!0)):(e.graphDim.height=Math.max(e.graphDim.height,r(s,!0)),0)}).attr("class",function(s){var f="graph-domain",D=new Date(s);switch(a.domain){case"hour":f+=" h_"+D.getHours();case"day":f+=" d_"+D.getDate()+" dy_"+D.getDay();case"week":f+=" w_"+e.getWeekNumber(D);case"month":f+=" m_"+(D.getMonth()+1);case"year":f+=" y_"+D.getFullYear()}return f});e.lastInsertedSvg=y;function x(s,f,D,v){var w=0;switch(i){case!1:return w=f[D],f[D]+=v,e.domainPosition.setPosition(s,w),w;case e.NAVIGATE_RIGHT:return e.domainPosition.setPosition(s,f[D]),u=v,m=e.domainPosition.getPositionFromIndex(1),e.domainPosition.shiftRightBy(m),f[D];case e.NAVIGATE_LEFT:return w=-v,u=-w,m=f[D]-e.domainPosition.getLast(),e.domainPosition.setPosition(s,w),e.domainPosition.shiftLeftBy(u),w}}y.append("rect").attr("width",function(s){return l(s,!0)-a.domainGutter-a.cellPadding}).attr("height",function(s){return r(s,!0)-a.domainGutter-a.cellPadding}).attr("class","domain-background");var L=y.append("svg").attr("x",function(){return a.label.position==="left"?e.domainHorizontalLabelWidth+a.domainMargin[3]:a.domainMargin[3]}).attr("y",function(){return a.label.position==="top"?e.domainVerticalLabelHeight+a.domainMargin[0]:a.domainMargin[0]}).attr("class","graph-subdomain-group"),S=L.selectAll("g").data(function(s){return e._domains.get(s)}).enter().append("g");S.append("rect").attr("class",function(s){return"graph-rect"+e.getHighlightClassName(s.t)+(a.onClick!==null?" hover_cursor":"")}).attr("width",a.cellSize).attr("height",a.cellSize).attr("x",function(s){return e.positionSubDomainX(s.t)}).attr("y",function(s){return e.positionSubDomainY(s.t)}).on("click",function(s){if(a.onClick!==null)return e.onClick(new Date(s.t),s.v)}).call(function(s){a.cellRadius>0&&s.attr("rx",a.cellRadius).attr("ry",a.cellRadius),e.legendScale!==null&&a.legendColors!==null&&a.legendColors.hasOwnProperty("base")&&s.attr("fill",a.legendColors.base),a.tooltip&&(s.on("mouseover",function(f){var D=this.parentNode.parentNode;e.tooltip.html(e.getSubDomainTitle(f)).attr("style","display: block;");var v=e.positionSubDomainX(f.t)-e.tooltip[0][0].offsetWidth/2+a.cellSize/2,w=e.positionSubDomainY(f.t)-e.tooltip[0][0].offsetHeight-a.cellSize/2;v+=parseInt(D.getAttribute("x"),10),w+=parseInt(D.getAttribute("y"),10),v+=parseInt(e.root.select(".graph").attr("x"),10),w+=parseInt(e.root.select(".graph").attr("y"),10),v+=parseInt(D.parentNode.getAttribute("x"),10),w+=parseInt(D.parentNode.getAttribute("y"),10),e.tooltip.attr("style","display: block; left: "+v+"px; top: "+w+"px;")}),s.on("mouseout",function(){e.tooltip.attr("style","display:none").html("")}))}),a.tooltip||S.append("title").text(function(s){return e.formatDate(new Date(s.t),a.subDomainDateFormat)}),a.domainLabelFormat!==""&&y.append("text").attr("class","graph-label").attr("y",function(s){var f=a.domainMargin[0];switch(a.label.position){case"top":f+=e.domainVerticalLabelHeight/2;break;case"bottom":f+=r(s)+e.domainVerticalLabelHeight/2}return f+a.label.offset.y*(a.label.rotate==="right"&&a.label.position==="right"||a.label.rotate==="left"&&a.label.position==="left"?-1:1)}).attr("x",function(s){var f=a.domainMargin[3];switch(a.label.position){case"right":f+=l(s);break;case"bottom":case"top":f+=l(s)/2}return a.label.align==="right"?f+e.domainHorizontalLabelWidth-a.label.offset.x*(a.label.rotate==="right"?-1:1):f+a.label.offset.x}).attr("text-anchor",function(){switch(a.label.align){case"start":case"left":return"start";case"end":case"right":return"end";default:return"middle"}}).attr("dominant-baseline",function(){return e.verticalDomainLabel?"middle":"top"}).text(function(s){return e.formatDate(new Date(s),a.domainLabelFormat)}).call(N);function N(s){switch(a.label.rotate){case"right":s.attr("transform",function(f){var D="rotate(90), ";switch(a.label.position){case"right":D+="translate(-"+l(f)+" , -"+l(f)+")";break;case"left":D+="translate(0, -"+e.domainHorizontalLabelWidth+")";break}return D});break;case"left":s.attr("transform",function(f){var D="rotate(270), ";switch(a.label.position){case"right":D+="translate(-"+(l(f)+e.domainHorizontalLabelWidth)+" , "+l(f)+")";break;case"left":D+="translate(-"+e.domainHorizontalLabelWidth+" , "+e.domainHorizontalLabelWidth+")";break}return D});break}}a.subDomainTextFormat!==null&&S.append("text").attr("class",function(s){return"subdomain-text"+e.getHighlightClassName(s.t)}).attr("x",function(s){return e.positionSubDomainX(s.t)+a.cellSize/2}).attr("y",function(s){return e.positionSubDomainY(s.t)+a.cellSize/2}).attr("text-anchor","middle").attr("dominant-baseline","central").text(function(s){return e.formatDate(new Date(s.t),a.subDomainTextFormat)}),i!==!1&&c.transition().duration(a.animationDuration).attr("x",function(s){return a.verticalOrientation?0:e.domainPosition.getPosition(s)}).attr("y",function(s){return a.verticalOrientation?e.domainPosition.getPosition(s):0});var R=e.graphDim.width,Y=e.graphDim.height;a.verticalOrientation?e.graphDim.height+=u-m:e.graphDim.width+=u-m,c.exit().transition().duration(a.animationDuration).attr("x",function(s){if(a.verticalOrientation)return 0;switch(i){case e.NAVIGATE_LEFT:return Math.min(e.graphDim.width,R);case e.NAVIGATE_RIGHT:return-l(s,!0)}}).attr("y",function(s){if(a.verticalOrientation)switch(i){case e.NAVIGATE_LEFT:return Math.min(e.graphDim.height,Y);case e.NAVIGATE_RIGHT:return-r(s,!0)}else return 0}).remove(),e.resize()}};T.prototype={init:function(e){"use strict";var t=this,n=t.options=H(t.options,e);if(a(),r(n.itemSelector,!1,"itemSelector"),t.allowedDataType.indexOf(n.dataType)===-1)throw new Error("The data type '"+n.dataType+"' is not valid data type");if(d.select(n.itemSelector)[0][0]===null)throw new Error("The node '"+n.itemSelector+"' specified in itemSelector does not exist");try{r(n.nextSelector,!0,"nextSelector"),r(n.previousSelector,!0,"previousSelector")}catch(h){return console.log(h.message),!1}e.hasOwnProperty("subDomain")||(this.options.subDomain=i(e.domain)),(typeof n.itemNamespace!="string"||n.itemNamespace==="")&&(console.log("itemNamespace can not be empty, falling back to cal-heatmap"),n.itemNamespace="cal-heatmap");var o=["data","onComplete","onClick","afterLoad","afterLoadData","afterLoadPreviousDomain","afterLoadNextDomain","afterUpdate"];for(var l in o)e.hasOwnProperty(o[l])&&(n[o[l]]=e[o[l]]);n.subDomainDateFormat=typeof n.subDomainDateFormat=="string"||typeof n.subDomainDateFormat=="function"?n.subDomainDateFormat:this._domainType[n.subDomain].format.date,n.domainLabelFormat=typeof n.domainLabelFormat=="string"||typeof n.domainLabelFormat=="function"?n.domainLabelFormat:this._domainType[n.domain].format.legend,n.subDomainTextFormat=typeof n.subDomainTextFormat=="string"&&n.subDomainTextFormat!==""||typeof n.subDomainTextFormat=="function"?n.subDomainTextFormat:null,n.domainMargin=m(n.domainMargin),n.legendMargin=m(n.legendMargin),n.highlight=t.expandDateSetting(n.highlight),n.itemName=g(n.itemName),n.colLimit=p(n.colLimit),n.rowLimit=b(n.rowLimit),e.hasOwnProperty("legendMargin")||u(),c();function r(h,y,x){if((y&&h===!1||h instanceof Element||typeof h=="string")&&h!=="")return!0;throw new Error("The "+x+" is not valid")}function i(h){switch(h){case"year":return"month";case"month":return"day";case"week":return"day";case"day":return"hour";default:return"min"}}function a(){if(!t._domainType.hasOwnProperty(n.domain)||n.domain==="min"||n.domain.substring(0,2)==="x_")throw new Error("The domain '"+n.domain+"' is not valid");if(!t._domainType.hasOwnProperty(n.subDomain)||n.subDomain==="year")throw new Error("The subDomain '"+n.subDomain+"' is not valid");if(t._domainType[n.domain].level<=t._domainType[n.subDomain].level)throw new Error("'"+n.subDomain+"' is not a valid subDomain to '"+n.domain+"'");return!0}function c(){if(!e.hasOwnProperty("label")||e.hasOwnProperty("label")&&!e.label.hasOwnProperty("align")){switch(n.label.position){case"left":n.label.align="right";break;case"right":n.label.align="left";break;default:n.label.align="center"}n.label.rotate==="left"?n.label.align="right":n.label.rotate==="right"&&(n.label.align="left")}(!e.hasOwnProperty("label")||e.hasOwnProperty("label")&&!e.label.hasOwnProperty("offset"))&&(n.label.position==="left"||n.label.position==="right")&&(n.label.offset={x:10,y:15})}function u(){switch(n.legendVerticalPosition){case"top":n.legendMargin[2]=t.DEFAULT_LEGEND_MARGIN;break;case"bottom":n.legendMargin[0]=t.DEFAULT_LEGEND_MARGIN;break;case"middle":case"center":n.legendMargin[n.legendHorizontalPosition==="right"?3:1]=t.DEFAULT_LEGEND_MARGIN}}function m(h){switch(typeof h=="number"&&(h=[h]),Array.isArray(h)||(console.log("Margin only takes an integer or an array of integers"),h=[0]),h.length){case 1:return[h[0],h[0],h[0],h[0]];case 2:return[h[0],h[1],h[0],h[1]];case 3:return[h[0],h[1],h[2],h[1]];case 4:return h;default:return h.slice(0,4)}}function g(h){return typeof h=="string"?[h,h+(h!==""?"s":"")]:Array.isArray(h)?h.length===1?[h[0],h[0]+"s"]:h.length>2?h.slice(0,2):h:["item","items"]}function p(h){return h>0?h:null}function b(h){return h>0&&n.colLimit>0?(console.log("colLimit and rowLimit are mutually exclusive, rowLimit will be ignored"),null):h>0?h:null}return this._init()},expandDateSetting:function(e){"use strict";return Array.isArray(e)||(e=[e]),e.map(function(t){return t==="now"?new Date:t instanceof Date?t:!1}).filter(function(t){return t!==!1})},fill:function(e){"use strict";var t=this,n=t.options;arguments.length===0&&(e=t.root.selectAll(".graph-domain"));var o=e.selectAll("svg").selectAll("g").data(function(i){return t._domains.get(i)});function l(i){if(t.legendScale===null)return!1;i.attr("fill",function(a){return a.v===null&&n.hasOwnProperty("considerMissingDataAsZero")&&!n.considerMissingDataAsZero&&n.legendColors.hasOwnProperty("base")?n.legendColors.base:n.legendColors!==null&&n.legendColors.hasOwnProperty("empty")&&(a.v===0||a.v===null&&n.hasOwnProperty("considerMissingDataAsZero")&&n.considerMissingDataAsZero)?n.legendColors.empty:a.v<0&&n.legend[0]>0&&n.legendColors!==null&&n.legendColors.hasOwnProperty("overflow")?n.legendColors.overflow:t.legendScale(Math.min(a.v,n.legend[n.legend.length-1]))})}o.transition().duration(n.animationDuration).select("rect").attr("class",function(i){var a=t.getHighlightClassName(i.t).trim().split(" "),c=t.dateIsLessThan(i.t,new Date),u=t.dateIsEqual(i.t,new Date);return(t.legendScale===null||i.v===null&&n.hasOwnProperty("considerMissingDataAsZero")&&!n.considerMissingDataAsZero&&!n.legendColors.hasOwnProperty("base"))&&a.push("graph-rect"),u?a.push("now"):c||a.push("future"),i.v!==null?a.push(t.Legend.getClass(i.v,t.legendScale===null)):n.considerMissingDataAsZero&&c&&a.push(t.Legend.getClass(0,t.legendScale===null)),n.onClick!==null&&a.push("hover_cursor"),a.join(" ")}).call(l),o.transition().duration(n.animationDuration).select("title").text(function(i){return t.getSubDomainTitle(i)});function r(i){typeof n.subDomainTextFormat=="function"&&i.text(function(a){return n.subDomainTextFormat(a.t,a.v)})}o.transition().duration(n.animationDuration).select("text").attr("class",function(i){return"subdomain-text"+t.getHighlightClassName(i.t)}).call(r)},formatStringWithObject:function(e,t){"use strict";for(var n in t)if(t.hasOwnProperty(n)){var o=new RegExp("\\{"+n+"\\}","gi");e=e.replace(o,t[n])}return e},triggerEvent:function(e,t,n){"use strict";return arguments.length===3&&n||this.options[e]===null?!0:typeof this.options[e]=="function"?(typeof t=="function"&&(t=t()),this.options[e].apply(this,t)):(console.log("Provided callback for "+e+" is not a function."),!1)},onClick:function(e,t){"use strict";return this.triggerEvent("onClick",[e,t])},afterLoad:function(){"use strict";return this.triggerEvent("afterLoad")},onComplete:function(){"use strict";var e=this.triggerEvent("onComplete",[],this._completed);return this._completed=!0,e},afterLoadPreviousDomain:function(e){"use strict";var t=this;return this.triggerEvent("afterLoadPreviousDomain",function(){var n=t.getSubDomain(e);return[n.shift(),n.pop()]})},afterLoadNextDomain:function(e){"use strict";var t=this;return this.triggerEvent("afterLoadNextDomain",function(){var n=t.getSubDomain(e);return[n.shift(),n.pop()]})},onMinDomainReached:function(e){"use strict";return this._minDomainReached=e,this.triggerEvent("onMinDomainReached",[e])},onMaxDomainReached:function(e){"use strict";return this._maxDomainReached=e,this.triggerEvent("onMaxDomainReached",[e])},checkIfMinDomainIsReached:function(e,t){"use strict";this.minDomainIsReached(e)&&this.onMinDomainReached(!0),arguments.length===2&&this._maxDomainReached&&!this.maxDomainIsReached(t)&&this.onMaxDomainReached(!1)},checkIfMaxDomainIsReached:function(e,t){"use strict";this.maxDomainIsReached(e)&&this.onMaxDomainReached(!0),arguments.length===2&&this._minDomainReached&&!this.minDomainIsReached(t)&&this.onMinDomainReached(!1)},afterUpdate:function(){"use strict";return this.triggerEvent("afterUpdate")},formatNumber:d.format(",g"),formatDate:function(e,t){"use strict";if(arguments.length<2&&(t="title"),typeof t=="function")return t(e);var n=d.time.format(t);return n(e)},getSubDomainTitle:function(e){"use strict";if(e.v===null&&!this.options.considerMissingDataAsZero){var t={date:this.formatDate(new Date(e.t),this.options.subDomainDateFormat)};return typeof this.options.subDomainTitleFormat=="function"?this.options.subDomainTitleFormat(!0,t,e):this.formatStringWithObject(this.options.subDomainTitleFormat.empty,t)}else{var n=e.v;n===null&&this.options.considerMissingDataAsZero&&(n=0);var o={count:this.formatNumber(n),name:this.options.itemName[n!==1?1:0],connector:this._domainType[this.options.subDomain].format.connector,date:this.formatDate(new Date(e.t),this.options.subDomainDateFormat)};return typeof this.options.subDomainTitleFormat=="function"?this.options.subDomainTitleFormat(!1,o,e):this.formatStringWithObject(this.options.subDomainTitleFormat.filled,o)}},loadNextDomain:function(e){"use strict";if(this._maxDomainReached||e===0)return!1;var t=this.loadNewDomains(this.NAVIGATE_RIGHT,this.getDomain(this.getNextDomain(),e));return this.afterLoadNextDomain(t.end),this.checkIfMaxDomainIsReached(this.getNextDomain().getTime(),t.start),!0},loadPreviousDomain:function(e){"use strict";if(this._minDomainReached||e===0)return!1;var t=this.loadNewDomains(this.NAVIGATE_LEFT,this.getDomain(this.getDomainKeys()[0],-e).reverse());return this.afterLoadPreviousDomain(t.start),this.checkIfMinDomainIsReached(t.start,t.end),!0},loadNewDomains:function(e,t){"use strict";var n=this,o=e===this.NAVIGATE_LEFT,l=-1,r=t.length,i=this.getDomainKeys();function a(c){return{t:n._domainType[n.options.subDomain].extractUnit(c),v:null}}for(;++l<r;){if(o&&this.minDomainIsReached(t[l])){t=t.slice(0,l+1);break}if(!o&&this.maxDomainIsReached(t[l])){t=t.slice(0,l);break}}for(t=t.slice(-this.options.range),l=0,r=t.length;l<r;l++)this._domains.set(t[l].getTime(),this.getSubDomain(t[l]).map(a)),this._domains.remove(o?i.pop():i.shift());return i=this.getDomainKeys(),o&&(t=t.reverse()),this.paint(e),this.getDatas(this.options.data,t[0],this.getSubDomain(t[t.length-1]).pop(),function(){n.fill(n.lastInsertedSvg)}),{start:t[o?0:1],end:i[i.length-1]}},maxDomainIsReached:function(e){"use strict";return this.options.maxDate!==null&&this.options.maxDate.getTime()<e},minDomainIsReached:function(e){"use strict";return this.options.minDate!==null&&this.options.minDate.getTime()>=e},getDomainKeys:function(){"use strict";return this._domains.keys().map(function(e){return parseInt(e,10)}).sort(function(e,t){return e-t})},positionSubDomainX:function(e){"use strict";var t=this._domainType[this.options.subDomain].position.x(new Date(e));return t*this.options.cellSize+t*this.options.cellPadding},positionSubDomainY:function(e){"use strict";var t=this._domainType[this.options.subDomain].position.y(new Date(e));return t*this.options.cellSize+t*this.options.cellPadding},getSubDomainColumnNumber:function(e){"use strict";if(this.options.rowLimit>0){var t=this._domainType[this.options.subDomain].maxItemNumber;return typeof t=="function"&&(t=t(e)),Math.ceil(t/this.options.rowLimit)}var n=this._domainType[this.options.subDomain].defaultColumnNumber;return typeof n=="function"&&(n=n(e)),this.options.colLimit||n},getSubDomainRowNumber:function(e){"use strict";if(this.options.colLimit>0){var t=this._domainType[this.options.subDomain].maxItemNumber;return typeof t=="function"&&(t=t(e)),Math.ceil(t/this.options.colLimit)}var n=this._domainType[this.options.subDomain].defaultRowNumber;return typeof n=="function"&&(n=n(e)),this.options.rowLimit||n},getHighlightClassName:function(e){"use strict";if(e=new Date(e),this.options.highlight.length>0){for(var t in this.options.highlight)if(this.dateIsEqual(this.options.highlight[t],e))return this.isNow(this.options.highlight[t])?" highlight-now":" highlight"}return""},isNow:function(e){"use strict";return this.dateIsEqual(e,this.options.today)},dateIsEqual:function(e,t){"use strict";switch(e instanceof Date||(e=new Date(e)),t instanceof Date||(t=new Date(t)),this.options.subDomain){case"x_min":case"min":return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()&&e.getHours()===t.getHours()&&e.getMinutes()===t.getMinutes();case"x_hour":case"hour":return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()&&e.getHours()===t.getHours();case"x_day":case"day":return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate();case"x_week":case"week":return e.getFullYear()===t.getFullYear()&&this.getWeekNumber(e)===this.getWeekNumber(t);case"x_month":case"month":return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth();default:return!1}},dateIsLessThan:function(e,t){"use strict";e instanceof Date||(e=new Date(e)),t instanceof Date||(t=new Date(t));function n(o,l){switch(l){case"x_min":case"min":return new Date(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes()).getTime();case"x_hour":case"hour":return new Date(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours()).getTime();case"x_day":case"day":return new Date(o.getFullYear(),o.getMonth(),o.getDate()).getTime();case"x_week":case"week":case"x_month":case"month":return new Date(o.getFullYear(),o.getMonth()).getTime();default:return o.getTime()}}return n(e,this.options.subDomain)<n(t,this.options.subDomain)},getDayOfYear:d.time.format("%j"),getWeekNumber:function(e){"use strict";var t=this.options.weekStartOnMonday===!0?d.time.format("%W"):d.time.format("%U");return t(e)},getMonthWeekNumber:function(e){"use strict";typeof e=="number"&&(e=new Date(e));var t=this.getWeekNumber(new Date(e.getFullYear(),e.getMonth()));return this.getWeekNumber(e)-t-1},getWeekNumberInYear:function(e){"use strict";typeof e=="number"&&(e=new Date(e))},getDayCountInMonth:function(e){"use strict";return this.getEndOfMonth(e).getDate()},getDayCountInYear:function(e){"use strict";return typeof e=="number"&&(e=new Date(e)),new Date(e.getFullYear(),1,29).getMonth()===1?366:365},getWeekDay:function(e){"use strict";return this.options.weekStartOnMonday===!1?e.getDay():e.getDay()===0?6:e.getDay()-1},getEndOfMonth:function(e){"use strict";return typeof e=="number"&&(e=new Date(e)),new Date(e.getFullYear(),e.getMonth()+1,0)},jumpDate:function(e,t,n){"use strict";var o=new Date(e);switch(n){case"hour":o.setHours(o.getHours()+t);break;case"day":o.setHours(o.getHours()+t*24);break;case"week":o.setHours(o.getHours()+t*24*7);break;case"month":o.setMonth(o.getMonth()+t);break;case"year":o.setFullYear(o.getFullYear()+t)}return new Date(o)},getMinuteDomain:function(e,t){"use strict";var n=new Date(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours()),o=null;return t instanceof Date?o=new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours()):o=new Date(+n+t*1e3*60),d.time.minutes(Math.min(n,o),Math.max(n,o))},getHourDomain:function(e,t){"use strict";var n=new Date(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours()),o=null;t instanceof Date?o=new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours()):(o=new Date(n),o.setHours(o.getHours()+t));var l=d.time.hours(Math.min(n,o),Math.max(n,o)),r=0,i=l.length;for(r=0;r<i;r++)if(r>0&&l[r].getHours()===l[r-1].getHours()){this.DSTDomain.push(l[r].getTime()),l.splice(r,1);break}return typeof t=="number"&&l.length>Math.abs(t)&&l.splice(l.length-1,1),l},getDayDomain:function(e,t){"use strict";var n=new Date(e.getFullYear(),e.getMonth(),e.getDate()),o=null;return t instanceof Date?o=new Date(t.getFullYear(),t.getMonth(),t.getDate()):(o=new Date(n),o=new Date(o.setDate(o.getDate()+parseInt(t,10)))),d.time.days(Math.min(n,o),Math.max(n,o))},getWeekDomain:function(e,t){"use strict";var n;this.options.weekStartOnMonday===!1?n=new Date(e.getFullYear(),e.getMonth(),e.getDate()-e.getDay()):e.getDay()===1?n=new Date(e.getFullYear(),e.getMonth(),e.getDate()):e.getDay()===0?(n=new Date(e.getFullYear(),e.getMonth(),e.getDate()),n.setDate(n.getDate()-6)):n=new Date(e.getFullYear(),e.getMonth(),e.getDate()-e.getDay()+1);var o=new Date(n),l=t;return typeof t!="object"&&(l=new Date(o.setDate(o.getDate()+t*7))),this.options.weekStartOnMonday===!0?d.time.mondays(Math.min(n,l),Math.max(n,l)):d.time.sundays(Math.min(n,l),Math.max(n,l))},getMonthDomain:function(e,t){"use strict";var n=new Date(e.getFullYear(),e.getMonth()),o=null;return t instanceof Date?o=new Date(t.getFullYear(),t.getMonth()):(o=new Date(n),o=o.setMonth(o.getMonth()+t)),d.time.months(Math.min(n,o),Math.max(n,o))},getYearDomain:function(e,t){"use strict";var n=new Date(e.getFullYear(),0),o=null;return t instanceof Date?o=new Date(t.getFullYear(),0):o=new Date(e.getFullYear()+t,0),d.time.years(Math.min(n,o),Math.max(n,o))},getDomain:function(e,t){"use strict";switch(typeof e=="number"&&(e=new Date(e)),arguments.length<2&&(t=this.options.range),this.options.domain){case"hour":var n=this.getHourDomain(e,t);return typeof t=="number"&&n.length<t&&(t>0?n.push(this.getHourDomain(n[n.length-1],2)[1]):n.shift(this.getHourDomain(n[0],-2)[0])),n;case"day":return this.getDayDomain(e,t);case"week":return this.getWeekDomain(e,t);case"month":return this.getMonthDomain(e,t);case"year":return this.getYearDomain(e,t)}},getSubDomain:function(e){"use strict";typeof e=="number"&&(e=new Date(e));var t=this,n=function(i,a){switch(a){case"year":return t.getDayCountInYear(i);case"month":return t.getDayCountInMonth(i);case"week":return 7}},o=function(i,a){switch(a){case"hour":return 60;case"day":return 1440;case"week":return 1440*7}},l=function(i,a){switch(a){case"day":return 24;case"week":return 168;case"month":return t.getDayCountInMonth(i)*24}},r=function(i,a){if(a==="month"){var c=new Date(i.getFullYear(),i.getMonth()+1,0),u=t.getWeekNumber(c),m=t.getWeekNumber(new Date(i.getFullYear(),i.getMonth()));return m>u&&(m=0,u++),u-m+1}else if(a==="year")return t.getWeekNumber(new Date(i.getFullYear(),11,31))};switch(this.options.subDomain){case"x_min":case"min":return this.getMinuteDomain(e,o(e,this.options.domain));case"x_hour":case"hour":return this.getHourDomain(e,l(e,this.options.domain));case"x_day":case"day":return this.getDayDomain(e,n(e,this.options.domain));case"x_week":case"week":return this.getWeekDomain(e,r(e,this.options.domain));case"x_month":case"month":return this.getMonthDomain(e,12)}},getNextDomain:function(e){"use strict";return arguments.length===0&&(e=1),this.getDomain(this.jumpDate(this.getDomainKeys().pop(),e,this.options.domain),1)[0]},getPreviousDomain:function(e){"use strict";return arguments.length===0&&(e=1),this.getDomain(this.jumpDate(this.getDomainKeys().shift(),-e,this.options.domain),1)[0]},getDatas:function(e,t,n,o,l,r){"use strict";var i=this;arguments.length<5&&(l=!0),arguments.length<6&&(r=this.APPEND_ON_UPDATE);var a=function(b,h){l!==!1?typeof l=="function"?h=l(h):typeof i.options.afterLoadData=="function"?h=i.options.afterLoadData(h):console.log("Provided callback for afterLoadData is not a function."):(i.options.dataType==="csv"||i.options.dataType==="tsv")&&(h=this.interpretCSV(h)),i.parseDatas(h,r,t,n),typeof o=="function"&&o()};switch(typeof e){case"string":if(e==="")return a(null,{}),!0;var c=this.parseURI(e,t,n),u="GET";i.options.dataPostPayload!==null&&(u="POST");var m=null;i.options.dataPostPayload!==null&&(m=this.parseURI(i.options.dataPostPayload,t,n));var g=null;switch(this.options.dataType){case"json":g=d.json(c);break;case"csv":g=d.csv(c);break;case"tsv":g=d.tsv(c);break;case"txt":g=d.text(c,"text/plain");break}if(i.options.dataRequestHeaders!==null)for(var p in i.options.dataRequestHeaders)i.options.dataRequestHeaders.hasOwnProperty(p)&&g.header(p,i.options.dataRequestHeaders[p]);return g.send(u,m,a),!1;case"object":if(e===Object(e))return a(null,e),!1;default:return a(null,{}),!0}},parseDatas:function(e,t,n,o){"use strict";t===this.RESET_ALL_ON_UPDATE&&this._domains.forEach(function(g,p){p.forEach(function(b,h,y){y[h].v=null})});var l={},r=function(g){return g.t};for(var i in e){var a=new Date(i*1e3),c=this.getDomain(a)[0].getTime();if(this.DSTDomain.indexOf(c)>=0&&this._domains.has(c-3600*1e3)&&(c-=3600*1e3),!(isNaN(i)||!e.hasOwnProperty(i)||!this._domains.has(c)||!(c>=+n&&c<+o))){var u=this._domains.get(c);l.hasOwnProperty(c)||(l[c]=u.map(r));var m=l[c].indexOf(this._domainType[this.options.subDomain].extractUnit(a));t===this.RESET_SINGLE_ON_UPDATE||isNaN(u[m].v)?u[m].v=e[i]:u[m].v+=e[i]}}},parseURI:function(e,t,n){"use strict";return e=e.replace(/\{\{t:start\}\}/g,t.getTime()/1e3),e=e.replace(/\{\{t:end\}\}/g,n.getTime()/1e3),e=e.replace(/\{\{d:start\}\}/g,t.toISOString()),e=e.replace(/\{\{d:end\}\}/g,n.toISOString()),e},interpretCSV:function(e){"use strict";var t={},n=Object.keys(e[0]),o,l;for(o=0,l=e.length;o<l;o++)t[e[o][n[0]]]=+e[o][n[1]];return t},resize:function(){"use strict";var e=this,t=e.options,n=t.displayLegend?e.Legend.getDim("width")+t.legendMargin[1]+t.legendMargin[3]:0,o=t.displayLegend?e.Legend.getDim("height")+t.legendMargin[0]+t.legendMargin[2]:0,l=e.graphDim.width-t.domainGutter-t.cellPadding,r=e.graphDim.height-t.domainGutter-t.cellPadding,i=0;t.dayLabel&&t.domain==="month"&&t.subDomain==="day"&&(i=t.cellSize+t.cellPadding),this.root.transition().duration(t.animationDuration).attr("width",function(){return t.legendVerticalPosition==="middle"||t.legendVerticalPosition==="center"?l+n+i:Math.max(l,n)+i}).attr("height",function(){return t.legendVerticalPosition==="middle"||t.legendVerticalPosition==="center"?Math.max(r,o):r+o}),this.root.select(".graph").transition().duration(t.animationDuration).attr("y",function(){return t.legendVerticalPosition==="top"?o:0}).attr("x",function(){return(t.legendVerticalPosition==="middle"||t.legendVerticalPosition==="center")&&t.legendHorizontalPosition==="left"?n+i:i})},next:function(e){"use strict";return arguments.length===0&&(e=1),this.loadNextDomain(e)},previous:function(e){"use strict";return arguments.length===0&&(e=1),this.loadPreviousDomain(e)},jumpTo:function(e,t){"use strict";arguments.length<2&&(t=!1);var n=this.getDomainKeys(),o=n[0],l=n[n.length-1];return e<o?this.loadPreviousDomain(this.getDomain(o,e).length):t?this.loadNextDomain(this.getDomain(o,e).length):e>l?this.loadNextDomain(this.getDomain(l,e).length):!1},rewind:function(){"use strict";this.jumpTo(this.options.start,!0)},update:function(e,t,n){"use strict";arguments.length===0&&(e=this.options.data),arguments.length<2&&(t=!0),arguments.length<3&&(n=this.RESET_ALL_ON_UPDATE);var o=this.getDomainKeys(),l=this;this.getDatas(e,new Date(o[0]),this.getSubDomain(o[o.length-1]).pop(),function(){l.fill(),l.afterUpdate()},t,n)},setLegend:function(){"use strict";var e=this.options.legend.slice(0);arguments.length>=1&&Array.isArray(arguments[0])&&(this.options.legend=arguments[0]),arguments.length>=2&&(Array.isArray(arguments[1])&&arguments[1].length>=2?this.options.legendColors=[arguments[1][0],arguments[1][1]]:this.options.legendColors=arguments[1]),(arguments.length>0&&!E(e,this.options.legend)||arguments.length>=2)&&(this.Legend.buildColors(),this.fill()),this.Legend.redraw(this.graphDim.width-this.options.domainGutter-this.options.cellPadding)},removeLegend:function(){"use strict";return this.options.displayLegend?(this.options.displayLegend=!1,this.Legend.remove(),!0):!1},showLegend:function(){"use strict";return this.options.displayLegend?!1:(this.options.displayLegend=!0,this.Legend.redraw(this.graphDim.width-this.options.domainGutter-this.options.cellPadding),!0)},highlight:function(e){"use strict";return(this.options.highlight=this.expandDateSetting(e)).length>0?(this.fill(),!0):!1},destroy:function(e){"use strict";return this.root.transition().duration(this.options.animationDuration).attr("width",0).attr("height",0).remove().each("end",function(){typeof e=="function"?e():typeof e!="undefined"&&console.log("Provided callback for destroy() is not a function.")}),null},getSVG:function(){"use strict";for(var e={".cal-heatmap-container":{},".graph":{},".graph-rect":{},"rect.highlight":{},"rect.now":{},"rect.highlight-now":{},"text.highlight":{},"text.now":{},"text.highlight-now":{},".domain-background":{},".graph-label":{},".subdomain-text":{},".q0":{},".qi":{}},t=1,n=this.options.legend.length+1;t<=n;t++)e[".q"+t]={};var o=this.root,l=["stroke","stroke-width","stroke-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-miterlimit","fill","fill-opacity","fill-rule","marker","marker-start","marker-mid","marker-end","alignement-baseline","baseline-shift","dominant-baseline","glyph-orientation-horizontal","glyph-orientation-vertical","kerning","text-anchor","shape-rendering","text-transform","font-family","font","font-size","font-weight"],r=function(L,S,N){l.indexOf(S)!==-1&&(e[L][S]=N)},i=function(L){return o.select(L)[0][0]};for(var a in e)if(e.hasOwnProperty(a)){var c=i(a);if(c!==null){if("getComputedStyle"in window){var u=getComputedStyle(c,null);if(u.length!==0)for(var m=0;m<u.length;m++)r(a,u.item(m),u.getPropertyValue(u.item(m)));else for(var g in u)u.hasOwnProperty(g)&&r(a,g,u[g])}else if("currentStyle"in c){var p=c.currentStyle;for(var b in p)r(a,b,p[b])}}}var h='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css"><![CDATA[ ';for(var y in e){h+=y+` {
`;for(var x in e[y])h+="	"+x+":"+e[y][x]+`;
`;h+=`}
`}return h+="]]></style>",h+=new XMLSerializer().serializeToString(this.root[0][0]),h+="</svg>",h}};var _=function(){"use strict";this.positions=d.map()};_.prototype.getPosition=function(e){"use strict";return this.positions.get(e)};_.prototype.getPositionFromIndex=function(e){"use strict";var t=this.getKeys();return this.positions.get(t[e])};_.prototype.getLast=function(){"use strict";var e=this.getKeys();return this.positions.get(e[e.length-1])};_.prototype.setPosition=function(e,t){"use strict";this.positions.set(e,t)};_.prototype.shiftRightBy=function(e){"use strict";this.positions.forEach(function(n,o){this.set(n,o-e)});var t=this.getKeys();this.positions.remove(t[0])};_.prototype.shiftLeftBy=function(e){"use strict";this.positions.forEach(function(n,o){this.set(n,o+e)});var t=this.getKeys();this.positions.remove(t[t.length-1])};_.prototype.getKeys=function(){"use strict";return this.positions.keys().sort(function(e,t){return parseInt(e,10)-parseInt(t,10)})};var M=function(e){"use strict";this.calendar=e,this.computeDim(),e.options.legendColors!==null&&this.buildColors()};M.prototype.computeDim=function(){"use strict";var e=this.calendar.options;this.dim={width:e.legendCellSize*(e.legend.length+1)+e.legendCellPadding*e.legend.length,height:e.legendCellSize}};M.prototype.remove=function(){"use strict";this.calendar.root.select(".graph-legend").remove(),this.calendar.resize()};M.prototype.redraw=function(e){"use strict";if(!this.calendar.options.displayLegend)return!1;var t=this,n=this.calendar,o=n.root,l,r=n.options;this.computeDim();var i=r.legend.slice(0);i.push(i[i.length-1]+1);var a=n.root.select(".graph-legend");a[0][0]!==null?(o=a,l=o.select("g").selectAll("rect").data(i)):(o=r.legendVerticalPosition==="top"?o.insert("svg",".graph"):o.append("svg"),o.attr("x",u()).attr("y",m()),l=o.attr("class","graph-legend").attr("height",t.getDim("height")).attr("width",t.getDim("width")).append("g").selectAll().data(i)),l.enter().append("rect").call(c).attr("class",function(g){return n.Legend.getClass(g,n.legendScale===null)}).attr("fill-opacity",0).call(function(g){n.legendScale!==null&&r.legendColors!==null&&r.legendColors.hasOwnProperty("base")&&g.attr("fill",r.legendColors.base)}).append("title"),l.exit().transition().duration(r.animationDuration).attr("fill-opacity",0).remove(),l.transition().delay(function(g,p){return r.animationDuration*p/10}).call(c).attr("fill-opacity",1).call(function(g){g.attr("fill",function(p,b){return n.legendScale===null?"":b===0?n.legendScale(p-1):n.legendScale(r.legend[b-1])}),g.attr("class",function(p){return n.Legend.getClass(p,n.legendScale===null)})});function c(g){g.attr("width",r.legendCellSize).attr("height",r.legendCellSize).attr("x",function(p,b){return b*(r.legendCellSize+r.legendCellPadding)})}l.select("title").text(function(g,p){return p===0?n.formatStringWithObject(r.legendTitleFormat.lower,{min:r.legend[p],name:r.itemName[1]}):p===i.length-1?n.formatStringWithObject(r.legendTitleFormat.upper,{max:r.legend[p-1],name:r.itemName[1]}):n.formatStringWithObject(r.legendTitleFormat.inner,{down:r.legend[p-1],up:r.legend[p],name:r.itemName[1]})}),o.transition().duration(r.animationDuration).attr("x",u()).attr("y",m()).attr("width",t.getDim("width")).attr("height",t.getDim("height")),o.select("g").transition().duration(r.animationDuration).attr("transform",function(){return r.legendOrientation==="vertical"?"rotate(90 "+r.legendCellSize/2+" "+r.legendCellSize/2+")":""});function u(){switch(r.legendHorizontalPosition){case"right":return r.legendVerticalPosition==="center"||r.legendVerticalPosition==="middle"?e+r.legendMargin[3]:e-t.getDim("width")-r.legendMargin[1];case"middle":case"center":return Math.round(e/2-t.getDim("width")/2);default:return r.legendMargin[3]}}function m(){return r.legendVerticalPosition==="bottom"?n.graphDim.height+r.legendMargin[0]-r.domainGutter-r.cellPadding:r.legendMargin[0]}n.resize()};M.prototype.getDim=function(e){"use strict";var t=this.calendar.options.legendOrientation==="horizontal";switch(e){case"width":return this.dim[t?"width":"height"];case"height":return this.dim[t?"height":"width"]}};M.prototype.buildColors=function(){"use strict";var e=this.calendar.options;if(e.legendColors===null)return this.calendar.legendScale=null,!1;var t=[];if(Array.isArray(e.legendColors))t=e.legendColors;else if(e.legendColors.hasOwnProperty("min")&&e.legendColors.hasOwnProperty("max"))t=[e.legendColors.min,e.legendColors.max];else return e.legendColors=null,!1;var n=e.legend.slice(0);n[0]>0?n.unshift(0):n[0]<=0&&n.unshift(n[0]-(n[n.length-1]-n[0])/n.length);var o=d.scale.linear().range(t).interpolate(d.interpolateHcl).domain([d.min(n),d.max(n)]),l=n.map(function(r){return o(r)});return this.calendar.legendScale=d.scale.threshold().domain(e.legend).range(l),!0};M.prototype.getClass=function(e,t){"use strict";if(e===null||isNaN(e))return"";for(var n=[this.calendar.options.legend.length+1],o=0,l=this.calendar.options.legend.length-1;o<=l;o++){if(this.calendar.options.legend[0]>0&&e<0){n=["1","i"];break}if(e<=this.calendar.options.legend[o]){n=[o+1];break}}return e===0&&n.push(0),n.unshift(""),(n.join(" r")+(t?n.join(" q"):"")).trim()};function H(e,t){"use strict";for(var n in t)try{t[n].constructor===Object?e[n]=H(e[n],t[n]):e[n]=t[n]}catch(o){e[n]=t[n]}return e}function E(e,t){"use strict";if(!t||!e||e.length!==t.length)return!1;for(var n=0;n<e.length;n++)if(e[n]instanceof Array&&t[n]instanceof Array){if(!E(e[n],t[n]))return!1}else if(e[n]!==t[n])return!1;return!0}typeof define=="function"&&define.amd?define(["d3"],function(){"use strict";return T}):typeof module=="object"&&module.exports?module.exports=T:window.CalHeatMap=T;function k(e){return pycmd(e)}function q(e){let t=new Date(e);return new Date(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate(),0,0,0,0)}function I(e){return Math.floor(q(e*1e3).getTime()/1e3)}var O="review-heatmap-style";function W(){if(document.getElementById(O))return;let e=document.createElement("style");e.id=O,e.textContent=P+`
`+F,document.head.appendChild(e)}var C=class{constructor(t){this.options=t;this.heatmap=null}create(t){W();let n=q(this.options.today),o=q(this.options.start),l=q(this.options.stop),r=new Date(n);if(this.options.domain==="month"){let a=this.options.range/2,c=Math.round(a-1),u=Math.round(a+1);r.setMonth(r.getMonth()-c),r.setDate(1),o.getTime()>r.getTime()&&(r=o);let m=new Date(n);m.setMonth(m.getMonth()+u),m.setDate(1),m.getTime()>l.getTime()&&(l=m)}let i=new T;i.init({domain:this.options.domain,subDomain:this.options.subdomain,range:this.options.range,minDate:o,maxDate:l,cellSize:10,verticalOrientation:!1,dayLabel:!0,domainMargin:[1,1,1,1],itemName:["card","cards"],highlight:n,today:n,start:r,legend:this.options.legend,displayLegend:!1,domainLabelFormat:this.options.domLabForm,tooltip:!0,subDomainTitleFormat:(a,c,u)=>{let m,g=c.count;if(g!==void 0&&g.startsWith("-")&&(g=g.substring(1)),a)m=`<b>No</b> ${Date.now()<u.t?"cards due":"reviews"} on ${c.date}`;else{let p=Math.abs(u.v)==1?"card":"cards";m=`<b>${g}</b> ${p} <b>${u.v<0?"due":"reviewed"}</b> ${c.connector} ${c.date}`}return m},onClick:(a,c)=>{if(c===null||c==0){i.highlight(n);return}let u=c>=0,m=this.options.whole?"":"deck:current ",g=new Date(n);g.setHours(0,0,0);let p=Math.abs(g.getTime()-a.getTime())/1e3,b=Math.round(p/86400);if(c>=0)if(window.rhNewFinderAPI)m+="prop:rated="+(b?-b:0);else{let h=a.getTime()+this.options.offset*3600*1e3,y=h+86400*1e3;m+="rid:"+h+":"+y}else m+="prop:due="+b;k("revhm_browse:"+m),i.highlight([n,a])},afterLoadData:function(c){let u={};for(let m in c){let g=c[m],p=parseInt(m,10);u[I(p)]=g}return u},data:t}),this.heatmap=i}onHmHome(t,n){t.shiftKey?k("revhm_modeswitch"):this.heatmap.rewind()}onHmNavigate(t,n,o){o==="next"?t.shiftKey?this.heatmap.jumpTo(this.heatmap.options.maxDate,!1):this.heatmap.next(this.heatmap.options.range):t.shiftKey?this.heatmap.jumpTo(this.heatmap.options.minDate,!1):this.heatmap.previous(this.heatmap.options.range)}onHmOpts(t,n){t.shiftKey?k("revhm_themeswitch"):k("revhm_opts")}onHmContrib(t,n){t.shiftKey?k("revhm_snanki"):k("revhm_contrib")}};globalThis.ReviewHeatmap=C;})();
