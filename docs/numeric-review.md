# Numeric guidance review

A running log of the review of numbers in the Compendium (temperatures, times, dimensions, speeds, ratios). The site has roughly 4,000 numeric claims across 62 pages, so the review goes in batches, highest-risk first. Each batch records what was checked, the sources, what changed and what was left open.

## Method

1. Extract every table row that names a material and compare the same value across pages. Pages that disagree are a signal even before any source is checked.
2. Check the values against manufacturer data, Bambu Lab first. Where Bambu publishes a figure for its own filament, use it and say so on the page. Otherwise keep a typical range.
3. Check charts against their own axes: work out the pixel scale from the grid and confirm each bar or marker lands on the value it claims.
4. Fix clear errors and inconsistencies. Small spreads (a few °C or an hour) that are all within accepted practice are logged, not churned.

Canonical pages: `materials/drying-and-storage.html` for drying, `materials/overview.html` for the master material table. Other pages should agree with them.

## Batch 1 — material temperatures and drying (2026-11-10)

**Scope:** nozzle, bed, chamber and drying values for every material row on every page; the drying charts on the AMS 2 Pro page and the cheat sheets; the material picker's `dryT` data.

**Sources:** Bambu Lab filament specs as reproduced by retailers and Bambu's filament guide (quoted in search results; `cdn1.bambulab.com` and `wiki.bambulab.com` are not reachable from the review environment, so the PDF itself was not read):

- PC: 80 °C, 8 h in a blast drying oven (heatbed alternative 90–100 °C, 12 h).
- PA6-CF / PAHT-CF: 80 °C, 8–12 h.
- PPS-CF: 100–140 °C, 8–12 h; do not exceed 160 °C for the spool.

**Fixed:**

| Where | Was | Now | Why |
|-------|-----|-----|-----|
| `x2d/ams-2-pro.html` Figure 4 | "AMS 2 Pro max 65 °C" line drawn at 60 °C | Line at 65 °C | Chart scale is 10 px/°C from 40 °C; line was at x=370 (60 °C). It made PETG look undryable in the AMS. |
| `x2d/ams-2-pro.html` Figure 4 | PETG 55–65, ABS/ASA 65–80, PC 70–90, PA 70–90 | 60–65, 70–80, 80 (Bambu), 80–90 | Match the drying table and Bambu. |
| `reference/cheat-sheets.html` Figure 1 | Bars for PETG, ABS/ASA, nylon, PC drawn 10–20 °C below the table values; axis could not reach 300 °C | Axis rescaled to 5 px/°C, 180–300 °C; every bar redrawn from the table | Chart contradicted the table next to it. |
| PC drying (drying page, engineering page, overview, cheat sheet) | 70–80 °C · 6–8 h (three pages), 80–100 °C · 6–8 h (cheat sheet) | 80 °C · 8 h | Bambu figure; pages disagreed. |
| PPS-CF drying (drying page, engineering page, overview) | 80–100 °C · 6–8 h / 100–120 °C · 8 h+ | 100–140 °C · 8–12 h | 80–100 °C is below Bambu's minimum. |
| Nylon drying (drying page, cheat sheet) | 75–90 / 70–90 °C | 80–90 °C | Bambu gives 80 °C; engineering page and overview already said 80–90. |
| ABS/ASA drying (cheat sheet) | 65–80 °C | 70–80 °C | Agree with every other page. |
| PC nozzle type (engineering page) | "Hardened preferred" | "Brass / steel" | Unfilled PC is not abrasive; overview already said no hardened nozzle. |

**Checked, no change:** PLA, PETG, ABS, ASA, TPU, PVA, PP nozzle and bed ranges agree across pages within accepted practice. Material picker `dryT` values already match the corrected figures. X2D limits (300 °C nozzle, 65 °C chamber, AMS 2 Pro 65 °C) are consistent everywhere.

**Open (small spreads, logged not changed):**

- PETG drying time 6–8 h (overview) vs 4–8 h (drying page, cheat sheet).
- TPU drying 55–60 °C (overview) vs 50–65 °C (drying page, cheat sheet); Bambu gives 70 °C, 8 h in an oven for its TPU (already noted on the AMS 2 Pro page).
- PET-CF drying 70–80 °C · 8–12 h (overview) vs 65–80 °C · 6–10 h (drying and engineering pages). Needs Bambu's PET-CF figure.
- HIPS drying 60–70 °C (overview) vs 60–65 °C (drying page).
- PLA bed 25–60 (overview) vs 35–60 (cheat sheet) vs 45–65 °C (first-layer page).
- PC nozzle 260–310 °C (overview, engineering prose) vs 260–300 °C elsewhere; the X2D tops out at 300 °C.
- PVA heat column "~60 °C (then sticky)" (overview) vs Tg ≈ 75 °C (drying page).
- `materials/drying-and-storage.html` gives a dryer price ("≈ US$100–250") although the site avoids prices.

## Next batches

1. **Chart scales site-wide.** Two of the first charts checked were drawn off their own axes, so this is likely systemic. Script it: parse grid lines and axis labels, derive the scale, compare bars and markers with their labels or the adjacent table.
2. **X2D settings and recipes** (`x2d/settings-and-profiles.html`, `x2d/recipes.html`, `x2d/engineering-and-chamber.html`): plate and bed temperatures, chamber setpoints, speeds.
3. **Design numbers** (`design/tolerances-and-fits.html`, `design/joints-and-fasteners.html`, `design/design-patterns.html`): clearances, wall thicknesses, snap-fit strain, heat-set insert holes.
4. **Slicer settings and speed/cooling** (`software/slicer-settings.html`, `techniques/speed-cooling-quality.html`): volumetric flow, retraction, cooling.
5. **Safety** (`foundations/safety-and-workspace.html`): emission and temperature claims.
6. **Calculators**: formulas were hand-checked in the 2026-11-02 QA; re-check default constants (densities, costs per unit) against the material tables.
