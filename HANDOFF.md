# Handoff — The 3D Printing Compendium

Status: **content complete, validated, merged to `master` and deployed** at https://pkasprowicz.github.io/bambu-x2d-bible/.

## What exists

A zero-build static site (plain HTML/CSS/JS, inline SVG, no external assets) for GitHub Pages.

| Area | Pages | Notes |
|------|-------|-------|
| Home / Start here / 404 | 2 + 404 | Learning paths, legend of components |
| 1 · Foundations | 6 | Processes, printer anatomy, first print, safety, buying |
| 2 · Materials | 5 | Overview, PLA/PETG, engineering, flexibles, drying |
| 3 · Software | 5 | Slicers, settings, CAD, meshes, G-code/firmware |
| 4 · Techniques | 9 | First layer … troubleshooting gallery, maintenance |
| 5 · Design (DfAM) | 7 | Principles, tolerances, joints, strength, patterns, mechanism catalog, parametric CAD |
| 6 · Bambu X2D + AMS 2 Pro | 11 | Overview, hardware, AMS 2 Pro, setup, dual-nozzle, compatibility, settings, chamber, TPU, maintenance, recipes |
| 7 · Exercises | 8 | Levels 1–4, X2D challenges (X-1…X-12), quizzes, models gallery |
| `exercises/models/*.scad` | 14 | Parametric OpenSCAD test models |
| 8 · Tools | 3 | Calculators, material picker, visual lab (animations) |
| 9 · Reference | 6 | Glossary (219 terms), cheat sheets, FAQ (120 Q), applications, economics & ethics, resources |

Totals at last check (v1.1.0, 2026-11-10): **63 pages, ~288k words, 722 figures**, `check_site.py` → 0 errors, 1 warning (start-here has fewer figures than the 4+ target; intentional).

## Architecture

- `assets/js/nav.js` — single source of truth for the site map (sidebar, pager, search index, checker).
- `assets/js/site.js` — injects header, sidebar, TOC, search (`/`), dark mode, lightbox, quizzes, checklists, exercise progress. Page scripts must listen for the `c3d:ready` event.
- `assets/css/style.css` — design system (themes, components, SVG utility classes).
- `CONTRIBUTING.md` — page skeleton and component reference (follow it when adding pages).
- `scripts/check_site.py` — validates links, anchors, SVG XML, structure, `data-page`.
- `scripts/check_charts.py` — review aid that flags charts drawn off their own scale (heuristic, not in CI).
- `scripts/build_search_index.py` — generates `assets/search-index.json` (committed; also rebuilt in CI).
- `.github/workflows/pages.yml` — builds index, validates, deploys via GitHub Actions on push to `master`/`main`.

## Verification done

- `python scripts/check_site.py` — 0 errors.
- Headless Chromium (Playwright) loaded 12 pages in light and dark: no JS exceptions, no failed requests, no horizontal overflow. Pages covered: home, start-here, calculators, material-picker, visual-lab, troubleshooting, glossary, FAQ, quizzes, exercises index, X2D overview, design principles.

## Workflow and versions

GitHub Flow: short branches into `master` via pull request (CI runs the checker), `master` deploys. Numbered editions use `VERSION` + `nav.js` + `CHANGELOG.md` (kept consistent by `check_site.py`); pushing tag `vX.Y.Z` publishes a GitHub Release with an offline zip. Details: `docs/github-flow-and-versioning.md`.

Released editions: **v1.0.0** (first edition), **v1.0.1** (muted colour palette with `--*-ink` text variants and `--on-brand` button text; version shown in the header and home hero; SVG text fixes for dark mode) and **v1.1.0** (2026-11-10: mechanism catalog, expanded short pages, numeric review fixes). See `CHANGELOG.md`.

## QA log (2026-11-02)

- **OpenSCAD 2021.01** installed; all 14 `exercises/models/*.scad` (plus the `part` variants of `parametric_box`, `snap_fit_test`, `tolerance_gauge`) and the 3 OpenSCAD snippets in pages compile with no warnings; STLs are valid solids. Python snippets (CadQuery/build123d) parse.
- **Calculators:** all 17 load; outputs for 10 of them hand-checked against the formulas (filament, cost, time, flow, spool, beam, motion, e-steps, Z, flush); bad/empty input shows a message, never NaN. Material picker rankings respond sensibly.
- **Fixed:** quiz answers sat mostly in option 2 (now shuffled at load in `site.js`); visual-lab wall builder NaN at zero material; header overflowed and the search icon vanished on phones; picker chips and cheat-sheet/pattern grids overflowed narrow screens; dead Formnext link; two duplicated page-local CSS rules moved to `style.css`.
- **Layout sweep:** all 62 pages (at the time) have no horizontal overflow at 320, 375 and 414 px.
- **External links:** 43 checked; all return 200 or a bot-blocking 403.
- **X2D specs** (build volumes, 300/120/65 degC, size/weight, speeds, power, cameras, screen) match the spec sheet at bambulab.com/en/x2d/specs. `wiki.bambulab.com` could not be fetched directly (HTTP 402).

## Known gaps / risks

1. Visual-lab animations, dark-mode toggle and search were not exercised by hand beyond load/console checks.
2. Facts not on Bambu's public spec pages (unboxing/transport-lock steps, per-material AMS 2 Pro drying tables) defer to the manual. Re-verify when firmware/hardware changes. No prices by design.
3. Remaining page-local `<style>` blocks are namespaced per page (`ts-`, `cs-`, `faq-` ...) and not duplicated; leaving them is fine.
4. Numeric values are caveated starting points. A systematic review (consistency, manufacturer data, standards, chart scales) was done on 2026-11-10 and is logged in `docs/numeric-review.md`, with the items left open; a printing specialist could still add value there.

## In v1.1.0 (2026-11-10)

- Removed the UTF-8 BOM from `x2d/ams-2-pro.html` (no other HTML file has one).
- New page `design/mechanisms.html`: a catalog of 50 mechanisms by job (hinges, latches, mounts, slides, rotary, clamps, springs), checked in Chromium (no errors, no overflow at 375 px, light and dark).
- Expanded pages: cheat sheets (new sheets 15 and 21), first print (preview routine; pause, runout, color change, power cuts), safety (printed parts in use; remote printing).
- Expanded X2D pages: dual-nozzle (design for two nozzles, measuring the saving), maintenance (recalibration matrix and symptom index added as sections 9–10; later sections renumbered 11–13), filament compatibility (three gates for two-filament jobs), TPU (softer by design).
- Numeric review (seven batches): wrong charts, drying figures, insert and snap-fit calculator data, fit classes and first aid fixed; see `CHANGELOG.md` and `docs/numeric-review.md`.

## Next steps

1. Optional: have a printing specialist look at the open items in `docs/numeric-review.md`; spot-check Bambu figures against the Bambu wiki when it is reachable (it was not from the review environment, and in the 2026-11-10 session the proxy refused bambulab.com and wiki.bambulab.com).
2. Optional: keep expanding the shorter content pages. Done in v1.1.0: cheat sheets, first print, safety, and the X2D maintenance, filament-compatibility, dual-nozzle and TPU pages. The X2D additions only combine facts already on those pages with general practice. Next candidates by length: `tools/visual-lab.html`, `x2d/setup-and-first-print.html`, `x2d/hardware-tour.html`, `foundations/buying-guide.html`. Navigation pages (home, start-here, tools and exercises index, models gallery) are short by design.
3. To confirm in Bambu Studio (stated on the dual-nozzle page from general knowledge, not a Bambu source): the slice summary lists flushed and prime-tower amounts, and the preview can color paths by filament.
4. Open small spreads from the numeric review (PETG/TPU/PET-CF/HIPS drying, PLA bed, PC nozzle top, PVA heat) could be aligned with the canonical drying and overview pages in a PATCH release.

## Git identity

Commits in this worktree use `Piotr Kasprowicz <kasprowiczpiotr@gmail.com>` (worktree-scoped config).
