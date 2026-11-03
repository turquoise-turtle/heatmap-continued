"use strict";(()=>{var M=`/* 
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

/* Calendar */
/* ################################################################### */

#rh-calendar {
    position: relative;
}
.rh-calendar {
    display: block;
    shape-rendering: crispedges;
}
.rh-calendar text {
    font-size: 10px;
}
.rh-calendar .rh-domain-label {
    fill: #808080;
}
.rh-calendar .rh-day-names text {
    fill: #999;
}

/* Day cells. Order matters: today's outline wins over the selected day's,
   and both win over the hover outline. */
.rh-calendar .rh-day {
    fill: #eaeaea;
    cursor: pointer;
}
:is(.night_mode, .night-mode) .rh-calendar .rh-day {
    fill: #222222;
}
.rh-calendar .rh-leaving {
    pointer-events: none;
}
.rh-calendar .rh-day:hover {
    stroke: #000;
    stroke-width: 1px;
}
.rh-calendar .rh-day.rh-selected {
    stroke: #E9002E;
    stroke-width: 1px;
}
.rh-calendar .rh-day.rh-today {
    stroke: black;
    stroke-width: 1px;
}

/* Heatmap hover tooltip */
/* ################################################################### */

.rh-tooltip {
    display: none;
    position: absolute;
    z-index: 99999;
    box-sizing: border-box;
    width: 140px;
    padding: 10px;
    border-radius: 2px;
    background: #222;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
    color: rgb(240, 240, 240);
    font-size: 12px;
    line-height: 1.4;
    text-align: center;
    pointer-events: none;
    animation: 0.5s ease 0s normal forwards 1 rh-fadein;
}
.rh-tooltip::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 50%;
    margin-left: -6px;
    border-style: solid;
    border-width: 6px 6px 0;
    border-color: #222 transparent transparent;
}
/* Delay the tooltip by fading it in */
@keyframes rh-fadein {
    0% { opacity: 0; }
    66% { opacity: 0; }
    100% { opacity: 0.9; }
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
.rh-calendar .rh-q1{fill: #525252}
.rh-calendar .rh-q2{fill: #616161}
.rh-calendar .rh-q3{fill: #707070}
.rh-calendar .rh-q4{fill: #7F7F7F}
.rh-calendar .rh-q5{fill: #8E8E8E}
.rh-calendar .rh-q6{fill: #9D9D9D}
.rh-calendar .rh-q7{fill: #ACACAC}
.rh-calendar .rh-q8{fill: #BBBBBB}
.rh-calendar .rh-q9{fill: #CACACA}
.rh-calendar .rh-q10{fill: #D9D9D9}

:is(.night_mode, .night-mode) .rh-calendar .rh-q1{fill: #5d5f5f}
:is(.night_mode, .night-mode) .rh-calendar .rh-q2{fill: #585a5a}
:is(.night_mode, .night-mode) .rh-calendar .rh-q3{fill: #535555}
:is(.night_mode, .night-mode) .rh-calendar .rh-q4{fill: #4e5050}
:is(.night_mode, .night-mode) .rh-calendar .rh-q5{fill: #494b4b}
:is(.night_mode, .night-mode) .rh-calendar .rh-q6{fill: #444646}
:is(.night_mode, .night-mode) .rh-calendar .rh-q7{fill: #3f4141}
:is(.night_mode, .night-mode) .rh-calendar .rh-q8{fill: #3a3c3c}
:is(.night_mode, .night-mode) .rh-calendar .rh-q9{fill: #353737}
:is(.night_mode, .night-mode) .rh-calendar .rh-q10{fill: #313232}

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

.rh-container .rh-calendar .rh-q11{fill: var(--rh-l1)}
.rh-container .rh-calendar .rh-q12{fill: var(--rh-l2)}
.rh-container .rh-calendar .rh-q13{fill: var(--rh-l3)}
.rh-container .rh-calendar .rh-q14{fill: var(--rh-l4)}
.rh-container .rh-calendar .rh-q15{fill: var(--rh-l5)}
.rh-container .rh-calendar .rh-q16{fill: var(--rh-l6)}
.rh-container .rh-calendar .rh-q17{fill: var(--rh-l7)}
.rh-container .rh-calendar .rh-q18{fill: var(--rh-l8)}
.rh-container .rh-calendar .rh-q19{fill: var(--rh-l9)}
.rh-container .rh-calendar .rh-q20{fill: var(--rh-l10)}

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

/* Optional backing panel, for readability over background images */
.rh-container.rh-panel {
    display: inline-block;
    padding: 0.75em 1.25em 1em;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.82);
    color: #222;
}
:is(.night_mode, .night-mode) .rh-container.rh-panel {
    background: rgba(20, 20, 20, 0.75);
    color: #ddd;
}

/* Finished-deck (congratulations) screen host */
.rh-host {
    text-align: center;
    margin-top: 1.5em;
}
`;function y(r){let e=new Date(r);return new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),0,0,0,0)}function u(r){let e=t=>t<10?"0"+t:""+t;return`${r.getFullYear()}-${e(r.getMonth()+1)}-${e(r.getDate())}`}function C(r,e){let t=Date.UTC(r.getFullYear(),r.getMonth(),r.getDate()),n=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((n-t)/864e5)}function S(r){return new Date(r.getFullYear(),r.getMonth(),r.getDate(),0,0,0,0)}var g=10,A=2,f=g+A,L=4,$=7*f,I=$+13.5,R=$+25,D=["January","February","March","April","May","June","July","August","September","October","November","December"],O=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],Y=["M","T","W","T","F","S","S"];function w(r,e){return e==="year"?r.getFullYear():r.getFullYear()*12+r.getMonth()}function B(r,e){return e==="year"?new Date(r,0,1):new Date(Math.floor(r/12),r%12,1)}function G(r,e){let t=B(r,e),n=e==="year"?new Date(r+1,0,1):new Date(t.getFullYear(),t.getMonth()+1,1),o=[];for(let l=0;;l++){let i=new Date(t.getFullYear(),t.getMonth(),t.getDate()+l);if(i>=n)return o;o.push(i)}}function E(r){return(r.getDay()+6)%7}function T(r,e){return Math.floor((r+e)/7)}function N(r,e){if(r==null||r===0||isNaN(r))return 0;for(let t=0;t<e.length;t++)if(r<=e[t])return t+1;return e.length+1}function U(r,e){return e.replace(/%([YybBm%])/g,(t,n)=>{switch(n){case"Y":return String(r.getFullYear());case"y":return String(r.getFullYear()%100).padStart(2,"0");case"b":return D[r.getMonth()].slice(0,3);case"B":return D[r.getMonth()];case"m":return String(r.getMonth()+1).padStart(2,"0");default:return"%"}})}function H(r){return`${O[r.getDay()]} ${r.getDate()} ${D[r.getMonth()]} ${r.getFullYear()}`}function W(r,e,t,n,o){let l=o?f:0,i=[],h=0;for(let a=r;a<r+e;a++){let s=G(a,t),c=E(s[0]),d=s.map((x,q)=>({date:x,iso:u(x),x:T(q,c)*f,y:E(x)*f})),p=(T(s.length-1,c)+1)*f+L;i.push({key:a,x:h,width:p,label:U(s[0],n),cells:d}),h+=p}return{width:l+h-L,height:R,graphX:l,domains:i}}function _(r){return r.domains.reduce((e,t)=>e+t.width,0)}function P(r,e){let t=e.domains[0].key>r.domains[0].key,n=new Map(r.domains.map(a=>[a.key,a.x])),o=new Set(e.domains.map(a=>a.key)),l=_(r),i=_(e),h=e.domains.map(a=>{var s;return{domain:a,from:(s=n.get(a.key))!=null?s:t?l:-a.width,to:a.x,leaving:!1}});for(let a of r.domains)o.has(a.key)||h.push({domain:a,from:a.x,to:t?-a.width:Math.min(l,i),leaving:!0});return h}var V="http://www.w3.org/2000/svg",z="cubic-bezier(0.65, 0, 0.35, 1)";function X(){return typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches}function J(r){return r.replace(/[&<>"']/g,e=>`&#${e.charCodeAt(0)};`)}var v=class{constructor(e,t){this.selectedIso=null;this.cells=[];this.layout=null;this.animations=[];this.renders=0;this.host=e,this.options=t;let{mode:n}=t;this.startKey=w(t.start,n),this.minKey=Math.min(w(t.minDate,n),this.startKey),this.maxKey=Math.max(w(t.maxDate,n),this.startKey+t.range-1),this.firstKey=this.startKey,this.todayIso=u(t.today),e.textContent="",this.graph=document.createElement("div"),this.tip=document.createElement("div"),this.tip.className="rh-tooltip",e.append(this.graph,this.tip),e.addEventListener("mouseover",o=>this.onHover(o)),e.addEventListener("mouseout",()=>this.hideTooltip()),e.addEventListener("click",o=>this.onCellClick(o)),this.render()}get lastKey(){return this.firstKey+this.options.range-1}next(){return this.lastKey>=this.maxKey?!1:this.show(Math.min(this.firstKey+this.options.range,this.maxKey-this.options.range+1))}previous(){return this.firstKey<=this.minKey?!1:this.show(Math.max(this.firstKey-this.options.range,this.minKey))}toEnd(){return this.show(Math.max(this.firstKey,this.maxKey-this.options.range+1))}toStart(){return this.show(Math.min(this.firstKey,this.minKey))}home(){return this.show(this.startKey)}select(e){this.selectedIso=e?u(e):null;for(let t of this.graph.querySelectorAll("rect.rh-day[data-i]")){let n=this.cells[Number(t.dataset.i)];t.classList.toggle("rh-selected",n.iso===this.selectedIso&&n.iso!==this.todayIso)}}show(e){return e===this.firstKey?!1:(this.firstKey=e,this.render(this.layout),!0)}render(e=null){for(let m of this.animations)m.cancel();this.animations=[];let t=++this.renders,{mode:n,range:o,labelFormat:l,dayLabels:i,animationMs:h}=this.options,a=W(this.firstKey,o,n,l,i),s=e&&h>0&&!X()?P(e,a):null,c=[],d=[`<svg xmlns="${V}" class="rh-calendar" width="${a.width}" height="${a.height}">`];i&&(d.push('<g class="rh-day-names">'),Y.forEach((m,p)=>{d.push(`<text x="0" y="${p*f+g/2}" dominant-baseline="central">${m}</text>`)}),d.push("</g>")),d.push(`<svg x="${a.graphX}" y="0" class="rh-graph">`);for(let m of a.domains)d.push(this.domainMarkup(m,m.x,c));for(let m of s?s.filter(p=>p.leaving):[])d.push(this.domainMarkup(m.domain,m.to,null));d.push("</svg></svg>"),this.hideTooltip(),this.cells=c,this.layout=a,this.graph.innerHTML=d.join(""),s&&e&&this.animate(s,e.width,a.width,t)}domainMarkup(e,t,n){let{legend:o,data:l}=this.options,i=[`<g class="rh-domain${n?"":" rh-leaving"}" data-key="${e.key}" transform="translate(${t},0)"><g transform="translate(1,1)">`];for(let h of e.cells){let a=l.has(h.iso)?l.get(h.iso):null,s=N(a,o),c="rh-day";s&&(c+=` rh-q${s}`),h.iso===this.todayIso?c+=" rh-today":h.iso===this.selectedIso&&(c+=" rh-selected");let d=n?` data-i="${n.push({date:h.date,iso:h.iso,value:a})-1}"`:"";i.push(`<rect class="${c}" width="${g}" height="${g}" x="${h.x}" y="${h.y}"${d}></rect>`)}return i.push(`</g><text class="rh-domain-label" x="${(e.width-2)/2}" y="${I}" text-anchor="middle" dominant-baseline="middle">${J(e.label)}</text></g>`),i.join("")}animate(e,t,n,o){let l=this.graph.querySelector("svg.rh-calendar");if(!l||typeof l.animate!="function"){this.removeLeaving();return}let i={duration:this.options.animationMs,easing:z},h=[l.animate([{width:`${t}px`},{width:`${n}px`}],i)];for(let s of e){let c=`g.rh-domain${s.leaving?".rh-leaving":":not(.rh-leaving)"}[data-key="${s.domain.key}"]`,d=this.graph.querySelector(c);d&&s.from!==s.to&&h.push(d.animate([{transform:`translate(${s.from}px, 0)`},{transform:`translate(${s.to}px, 0)`}],i))}let a=()=>{o===this.renders&&this.removeLeaving()};h[0].onfinish=a,setTimeout(a,this.options.animationMs+50),this.animations=h}removeLeaving(){for(let e of this.graph.querySelectorAll(".rh-leaving"))e.remove()}cellFor(e){let t=e.target;if(!t||!(t instanceof SVGRectElement)||!t.classList.contains("rh-day"))return null;let n=this.cells[Number(t.dataset.i)];return n?{rect:t,cell:n}:null}onHover(e){let t=this.cellFor(e);if(!t)return;let n=this.tip;n.textContent="";for(let i of this.options.tooltip(t.cell.date,t.cell.value))if(typeof i=="string")n.append(i);else{let h=document.createElement("b");h.textContent=i.bold,n.append(h)}n.style.display="block";let o=t.rect.getBoundingClientRect(),l=this.host.getBoundingClientRect();n.style.left=`${o.left-l.left+g/2-n.offsetWidth/2}px`,n.style.top=`${o.top-l.top-n.offsetHeight-g/2}px`}hideTooltip(){this.tip.style.display="none"}onCellClick(e){let t=this.cellFor(e);t&&this.options.onClick(t.cell.date,t.cell.value)}};function b(r){return pycmd(r)}var K="review-heatmap-style",j="rh-calendar";function Q(){if(document.getElementById(K))return;let r=document.createElement("style");r.id=K,r.textContent=M,document.head.appendChild(r)}var Z=new Intl.NumberFormat("en-AU"),k=class{constructor(e){this.calendar=null;this.options=e,this.today=y(e.today)}create(e){var a,s;Q();let t=document.getElementById(j);if(!t)return;let n=this.today,o=y((a=this.options.start)!=null?a:this.options.today),l=y((s=this.options.stop)!=null?s:this.options.today),i=new Date(n);if(this.options.domain==="month"){let c=this.options.range/2,d=Math.round(c-1),m=Math.round(c+1);i=new Date(n.getFullYear(),n.getMonth()-d,1),o.getTime()>i.getTime()&&(i=o);let p=new Date(n.getFullYear(),n.getMonth()+m,1);p.getTime()>l.getTime()&&(l=p)}let h=new Map;for(let c in e)h.set(new Date(Number(c)*1e3).toISOString().slice(0,10),e[c]);this.calendar=new v(t,{mode:this.options.domain,range:this.options.range,minDate:o,maxDate:l,start:i,today:n,legend:this.options.legend,labelFormat:this.options.domLabForm,dayLabels:this.options.domain==="month",animationMs:300,data:h,tooltip:(c,d)=>this.tooltip(c,d),onClick:(c,d)=>this.onClick(c,d)})}tooltip(e,t){let n=this.options.unit||"card",o=this.options.verb||"reviewed",l=` on ${H(e)}`;if(t===null||t===0){let s=e.getTime()>this.today.getTime();return[{bold:"No"},s?" cards due":` ${n}s ${o}`,l]}let i=t<0,h=Math.abs(t),a=(i?"card":n)+(h===1?"":"s");return[{bold:Z.format(h)},` ${a} `,{bold:i?"due":o},l]}onClick(e,t){var l,i;if(t===null||t===0){(l=this.calendar)==null||l.select(null);return}let n=S(e),o=this.options.whole?"":"deck:current ";t>0?o+=(this.options.token||"rid")+":"+u(n):o+="prop:due="+C(this.today,n),b("revhm_browse:"+o),(i=this.calendar)==null||i.select(n)}onHmHome(e,t){var n;if(e.shiftKey){b("revhm_modeswitch");return}if(e.altKey){b("revhm_activityswitch");return}(n=this.calendar)==null||n.home()}onHmNavigate(e,t,n){let o=this.calendar;o&&(n==="next"?e.shiftKey?o.toEnd():o.next():e.shiftKey?o.toStart():o.previous())}onHmOpts(e,t){b(e.shiftKey?"revhm_themeswitch":"revhm_opts")}onHmContrib(e,t){b(e.shiftKey?"revhm_snanki":"revhm_about")}};globalThis.ReviewHeatmap=k;})();
