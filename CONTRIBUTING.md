# Authoring guide — The 3D Printing Compendium

This site is **plain static HTML + CSS + JS** (no build step, no framework) so it runs on GitHub Pages as-is.
The page chrome (header, sidebar, table of contents, previous/next pager, search, dark mode) is injected by
`assets/js/site.js` from the site map in `assets/js/nav.js`.

## Page skeleton (copy exactly)

Replace `DEPTH` with `../` for pages in a sub-folder (all pages except `index.html` and `start-here.html`, which use an empty string).

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PAGE TITLE · 3D Printing Compendium</title>
  <meta name="description" content="One-sentence description (used by search).">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/nav.js" defer></script>
  <script src="../assets/js/site.js" defer></script>
</head>
<body data-page="foundations/first-print.html">
<main class="content">

  <header class="hero">
    <div class="kicker">Part 1 · Foundations</div>
    <h1>Page title</h1>
    <p class="lead">One or two sentence promise of what the reader will learn.</p>
    <div class="meta"><span class="badge beginner">Beginner</span><span class="badge time">⏱ 20 min read</span></div>
  </header>

  <h2>First section</h2>
  …
</main>
</body>
</html>
```

* `data-page` **must** equal the file's path as listed in `assets/js/nav.js` (the `f:` field).
* Use `<h2>` for sections and `<h3>` for sub-sections (they feed the table of contents). Do not use a second `<h1>`.
* Page-specific JavaScript: put it in a `<script>` at the bottom of `<main>` and wrap in
  `document.addEventListener("c3d:ready", function () { … })`. Helpers: `C3D.$`, `C3D.$$`, `C3D.store`.
* Link between pages with **relative paths** (`../materials/overview.html#pla`). Never use absolute `/` paths.
  Every link and every `#anchor` must resolve — run `python scripts/check_site.py`.
* All text in **English**. Metric units (mm, °C, g) first. Use **American spelling** (color, optimization, organizer, license).

## Components (all styled in `assets/css/style.css`)

### Callouts
```html
<div class="callout tip"><span class="callout-title">Tip</span><p>…</p></div>
```
Types: `tip` (green), `info` (blue), `warn` (yellow), `danger` (red, safety!), `trick` (purple, pro tricks),
`fact` (teal, science), `x2d` (red, Bambu X2D / AMS 2 Pro specifics), `goal` (pink, learning goals).

### Figures with inline SVG (the main visual tool — create LOTS of these)
```html
<figure class="fig">
  <svg class="diagram" viewBox="0 0 640 300" role="img" aria-label="Short accessible description">
    <rect class="f-blue" x="20" y="20" width="160" height="60" rx="10"/>
    <text class="t t-c t-b" x="100" y="56">Hotend</text>
    <path class="d-ink arrow" d="M180 50 H260"/>
  </svg>
  <figcaption><b>Figure 1.</b> Caption explaining what to notice.</figcaption>
</figure>
```
* Figures are click-to-zoom automatically. Add class `no-zoom` to disable.
* **Always** style SVG with the utility classes below (never hard-code `#000`/`#fff` for ink/background) so diagrams work in dark mode.
  * Strokes: `d-ink` (2px), `d-thin`, `d-mute`, `d-dash`, `d-grid`. Add class `arrow` to a path/line for an arrow head at the end, `arrow-start` for the start.
  * Fills: `d-surface`, `d-surface2`, `d-plastic` (orange filament), `d-plastic2`, `d-metal`, `d-metal2`, `d-hot`, `d-cool`, `d-solid`.
  * Coloured: `f-<c>` (soft fill + coloured stroke), `s-<c>` (solid fill), `k-<c>` (coloured stroke line, no fill), `c-<c>` (text/shape fill colour) where `<c>` ∈ `blue green orange red purple teal yellow pink gray`. Also `s-white`, `s-black`, `s-none`.
  * Text: `t` (14px), `t-sm` (12px), `t-xs` (10.5px), `t-lg`, `t-xl`, modifiers `t-b` bold, `t-m` muted, `t-c` centred (text-anchor middle), `t-r` right-aligned, `t-w` white, `t-mono`.
* Keep `viewBox` widths around 600–900; keep text ≥ 11px at that scale; always give `role="img"` + `aria-label`.
* The SVG must be well-formed XML (self-close `<rect/>`, escape `&` as `&amp;`, `<` as `&lt;`). `check_site.py` parses them.
* Good diagram ideas: cross-sections, labelled anatomy, process flows, comparison charts, decision trees, layer/stack illustrations, temperature ladders, annotated defects, tolerance gaps, force-direction arrows.

### Cards & grids
```html
<div class="grid cols-3">
  <a class="card accent-blue" href="../materials/overview.html"><span class="ico">🧵</span><h3>Title</h3><p>Text</p></a>
  <div class="card accent-green"><h3>Static card</h3><p>…</p></div>
</div>
```
`grid cols-2|cols-3|cols-4`. Accent colours: `accent-blue|green|orange|red|purple|teal|pink|yellow|gray`.

### Stats row
```html
<div class="stats"><div class="stat"><b>256 × 256 × 260</b><span>mm build volume</span></div>…</div>
```

### Tables (always wrap)
```html
<div class="table-wrap"><table class="data"><thead><tr><th>Material</th>…</tr></thead><tbody>…</tbody></table></div>
```
Add `compact` class for dense tables. Inside cells: `<span class="chip green">Easy</span>` (chip colours: green yellow red blue purple orange teal),
`<span class="rate"><i class="on"></i><i class="on"></i><i></i><i></i><i></i></span>` for 5-dot ratings (`rate g` for green dots).

### Bar charts (pure CSS)
```html
<div class="bars"><div class="bars-title">Heat resistance (°C)</div>
  <div class="bar"><span>PLA</span><i style="--v:30%"></i><em>55 °C</em></div>
  <div class="bar red"><span>ABS</span><i style="--v:70%"></i><em>100 °C</em></div></div>
```
Bar colour classes: default orange, `blue green red purple teal yellow`.

### Steps / flow / timeline
```html
<ol class="steps"><li><strong>Step title</strong>Details…</li></ol>
<ol class="flow"><li>Design</li><li>Slice</li><li>Print</li></ol>
<ul class="timeline"><li><b>1984</b> — Event</li></ul>
```

### Pros / cons
```html
<div class="pros-cons"><div class="pros"><h4>Pros</h4><ul><li>…</li></ul></div><div class="cons"><h4>Cons</h4><ul><li>…</li></ul></div></div>
```

### Tabs and accordions
```html
<div class="tabs">
  <div class="tab" data-title="PLA">…</div>
  <div class="tab" data-title="PETG">…</div>
</div>
<details class="accordion"><summary>Question or topic</summary><p>…</p></details>
```

### Badges / tags
`<span class="badge beginner|intermediate|advanced|expert|x2d|time">…</span>`, `<ul class="tags"><li class="tag">PLA</li></ul>`.

### Exercises (practice pages)
```html
<section class="exercise" id="L1-03">          <!-- id prefix L1- / L2- / L3- / L4- / X- ; progress is saved in the browser -->
  <header><span class="badge beginner">Level 1</span><h3>Exercise 3 — Calibration cube</h3><span class="badge time">⏱ 1 h</span></header>
  <div class="ex-body">
    <span class="ex-label">Goal</span><p>…</p>
    <span class="ex-label">You will need</span><ul><li>…</li></ul>
    <span class="ex-label">Steps</span><ol class="steps"><li>…</li></ol>
    <span class="ex-label">Success criteria</span>
    <ul class="checklist"><li>Measured X within ±0.2 mm</li></ul>
    <details class="hint"><summary>Hint</summary><p>…</p></details>
    <details class="solution"><summary>Worked solution / what good looks like</summary><p>…</p></details>
  </div>
  <footer></footer>   <!-- "Mark as completed" checkbox is injected -->
</section>
```
Progress bars: `<div class="progress-summary" data-prefix="L1-" data-total="10" data-label="Level 1"></div>`.

### Quizzes
```html
<div class="quiz"><p class="q">Which …?</p>
  <ul class="options"><li>Wrong</li><li data-correct>Right</li><li>Wrong</li></ul>
  <p class="explain">Why the right answer is right.</p></div>
```
Put `<div class="score-board"></div>` once at the top of a quiz page.

### Checklists
`<ul class="checklist"><li>Item</li></ul>` — checkboxes are injected and persisted in the browser.

### Interactive tools
Wrap in `<div class="tool"><h3>Title</h3><div class="tool-body"><div> …inputs… </div><div class="result"> …outputs… </div></div></div>`;
inputs use `<div class="field"><label>Name <output id="x-out"></output></label><input type="range|number|text" id="x"></div>`.

## Quality bar

* **Teach from zero to expert**: define every term the first time, then go deep. Mark the level (`badge`) at the top and use "🔰 Beginner / 🔧 Intermediate / 🚀 Advanced" sub-headings or callouts inside long pages.
* **Visual first**: at least **4–6 original SVG figures per page** (more on technique/design pages), plus tables, bars, steps and callouts. No walls of text.
* **Numbers must be realistic and caveated**. Give ranges, not false precision (e.g. "PLA nozzle 190–230 °C"). Prefer "typical" and "start with". When unsure, say so.
* **Include practical tricks**, common mistakes (`warn`), pro tips (`trick`) and "why it works" (`fact`).
* Cross-link generously to other pages of the compendium (relative links).
* Do not copy copyrighted text; write original explanations. Link out to official docs where useful (Bambu Lab wiki: https://wiki.bambulab.com).
* Do not mention internal tooling. Do not write placeholder text ("TODO", "Lorem ipsum", "coming soon").
* Run `python scripts/check_site.py` before finishing; fix every error in the pages you own.

## Workflow and versions

* `master` is the live site. Work on a short branch (`feature/…`, `fix/…`, `content/…`, `docs/…`), open a pull request into `master`, squash-merge when CI is green.
* Add a line under `## [Unreleased]` in `CHANGELOG.md` for every change a reader would notice.
* Releases are numbered `MAJOR.MINOR.PATCH` (see [docs/github-flow-and-versioning.md](docs/github-flow-and-versioning.md)). `VERSION`, the `version` in `assets/js/nav.js` and the newest `CHANGELOG.md` heading must agree; `check_site.py` enforces it.
* Tagging `vX.Y.Z` on `master` publishes a GitHub Release with an offline zip.
