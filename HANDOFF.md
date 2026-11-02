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
| 5 · Design (DfAM) | 6 | Principles, tolerances, joints, strength, patterns, parametric CAD |
| 6 · Bambu X2D + AMS 2 Pro | 11 | Overview, hardware, AMS 2 Pro, setup, dual-nozzle, compatibility, settings, chamber, TPU, maintenance, recipes |
| 7 · Exercises | 8 | Levels 1–4, X2D challenges (X-1…X-12), quizzes, models gallery |
| `exercises/models/*.scad` | 14 | Parametric OpenSCAD test models |
| 8 · Tools | 3 | Calculators, material picker, visual lab (animations) |
| 9 · Reference | 6 | Glossary (219 terms), cheat sheets, FAQ (120 Q), applications, economics & ethics, resources |

Totals at last check: **62 pages, ~276k words, 662 SVG figures**, `check_site.py` → 0 errors, 1 warning (start-here has fewer figures than the 4+ target; intentional).

## Architecture

- `assets/js/nav.js` — single source of truth for the site map (sidebar, pager, search index, checker).
- `assets/js/site.js` — injects header, sidebar, TOC, search (`/`), dark mode, lightbox, quizzes, checklists, exercise progress. Page scripts must listen for the `c3d:ready` event.
- `assets/css/style.css` — design system (themes, components, SVG utility classes).
- `CONTRIBUTING.md` — page skeleton and component reference (follow it when adding pages).
- `scripts/check_site.py` — validates links, anchors, SVG XML, structure, `data-page`.
- `scripts/build_search_index.py` — generates `assets/search-index.json` (committed; also rebuilt in CI).
- `.github/workflows/pages.yml` — builds index, validates, deploys via GitHub Actions on push to `master`/`main`.

## Verification done

- `python scripts/check_site.py` — 0 errors.
- Headless Chromium (Playwright) loaded 12 pages in light and dark: no JS exceptions, no failed requests, no horizontal overflow. Pages covered: home, start-here, calculators, material-picker, visual-lab, troubleshooting, glossary, FAQ, quizzes, exercises index, X2D overview, design principles.

## Known gaps / risks

1. **Deployed.** Merged to `master`; the Pages workflow succeeded and the site is live at https://pkasprowicz.github.io/bambu-x2d-bible/ (Pages source is GitHub Actions).
2. **Not exhaustively browser-tested.** Only the 12 pages above were opened; interactive widgets were loaded but not clicked through (calculator math, picker scoring, animations, quiz scoring should get a manual pass).
3. **OpenSCAD models and code samples unverified** — `openscad` is not installed here; the `.scad` files and the OpenSCAD/CadQuery/build123d snippets in the pages were reviewed, not compiled.
4. **X2D facts** come from Bambu's public wiki/store pages (fetched during research). Anything not supported was labelled "typical" or "check the wiki". Unboxing/transport-lock details and per-material drying tables for the AMS 2 Pro were not in the research and defer to the manual. Re-verify against the wiki when firmware/hardware changes. No prices are included by design.
5. **External links** (resources page) are well-known homepages but were not checked live.
6. **Several pages carry page-local `<style>` blocks** (`ts-`, `cs-`, `faq-`, `app-`, `dp-`, `pc-`, `ss-`, `tol-`, `jf-`, `so-` …). Candidates to promote to `style.css`: `.no-print`, `.muted`, `.sr-only`, glossary jump-bar/filter, `.tol-note`, equation style.
7. Some pages sit near the lower word targets (cheat sheets ~3.7k, troubleshooting ~5.4k words but with 40 card SVGs). Content is complete; expansion is optional.
8. `ams-2-pro.html` may start with a harmless UTF-8 BOM.
9. Numeric values throughout are starting points and intentionally caveated; a domain expert review would be valuable.

## Next steps

1. Manual QA of the live site: interactive tools, exercise/quiz progress persistence, mobile layout.
2. Compile all `.scad` files with OpenSCAD and fix any errors.
3. Verify external links and re-check X2D facts against wiki.bambulab.com.
4. Optionally consolidate page-local CSS into `style.css`.

## Git identity

Commits in this worktree use `Piotr Kasprowicz <kasprowiczpiotr@gmail.com>` (worktree-scoped config).
