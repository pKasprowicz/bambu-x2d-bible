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

## Batch 2 — chart scales (2026-11-10)

**Scope:** every SVG chart with a numeric axis (horizontal and vertical) and every CSS bar chart (`.bars`) on all 62 pages. Done with `scripts/check_charts.py`, then each flag triaged by hand and every changed chart rendered in Chromium to confirm it.

**Fixed:**

| Where | Problem | Fix |
|-------|---------|-----|
| `x2d/filament-compatibility.html` drying chart | Same bug as the AMS 2 Pro chart: "65 °C maximum" line drawn at 60 °C; every bar ended 2.5–5 °C short of its label | Line at 65 °C; bars end at the top of each range; PETG 60–65, ABS/ASA 70–80, PC 80 (Bambu) |
| `techniques/supports-bridges-overhangs.html` overhang scale | 30°, 45°, 60° placed unevenly on a 0–90° scale (30° sat at about 22°) | Zones and ticks on a linear scale |
| `materials/engineering-plastics.html` chamber chart | Evenly spaced ticks labelled 25, 40, 55, 65 °C (last step 10 °C, not 15) | Ticks moved to a linear scale; overlapping note moved clear of the PC label |
| `materials/flexibles-and-specialty.html` wood-fill chart | Evenly spaced ticks labelled 190, 205, 220, 240 °C; the "burn above 230 °C" marker only fits a linear scale | Ticks moved to a linear scale |
| `materials/drying-and-storage.html` moisture bar chart | Bars drawn at 25 px/%, but gridlines and labels used a 30 px first step then 50 px steps, so PA6 (≈ 3 %) read as 4 % | Gridlines and labels at 25 px/%; PVA and BVOH bars topped out at "8 %+" to match the 8–15 % in the description |
| `materials/drying-and-storage.html` moisture uptake chart (illustrative) | "50" label off-centre; y-axis title clipped | Label and gridlines evened out; title moved into view |
| `materials/engineering-plastics.html` shrinkage chart | Same uneven grid as the moisture chart, so bars read about 0.1–0.2 % high | Gridlines and labels at the bars' own scale (125 px/%) |
| `software/slicer-settings.html` max feed speed chart | Curves drawn exactly from speed = flow ÷ (0.42 × layer height), but y labels 200/280/380 sat 10–21 px too high, so the curves read slow | Axis relabelled 0–400 mm/s at the curves' scale |
| `techniques/first-layer-and-adhesion.html` bed temperature bars | TPU drawn longer than PLA though its range is lower; ABS/ASA short | Bars proportional to range midpoints |
| `foundations/printing-processes.html` smallest-feature bars | No consistent scale (open-ended "2+" for pellet printers) | Title now says bar lengths are not to scale |

**Checked, no change:** the remaining flags are tables (flush matrix), timelines with deliberately even spacing, categorical axes (wall counts, infill steps, months), UI mock-ups and drawings of test models. CSS bar charts for print time, heat resistance, stiffness and price (log scale) are within a few percent of proportional.

## Batch 3 — X2D settings and recipes (2026-11-10)

**Scope:** every numeric table row and recipe setting on `x2d/settings-and-profiles.html`, `x2d/recipes.html` and `x2d/engineering-and-chamber.html`; the X2D headline figures (build volumes, temperature limits, speeds, accelerations) on every page that quotes them.

**Sources:** `bambulab.com` and `wiki.bambulab.com` are not reachable from the review environment, so figures were checked through search results quoting Bambu's spec sheet, the AMS 2 Pro wiki and distributor spec tables.

**Verified, no change:**

- Build volume 256 × 256 × 260 mm (left/main nozzle only) and 235.5 × 256 × 256 mm (both nozzles): consistent on all 17 pages that quote them, and with distributor spec tables.
- Limits 300 °C nozzle, 120 °C bed, 65 °C chamber: consistent everywhere.
- Right (auxiliary) nozzle capped at 200 mm/s and about 1000 mm/s², main 1000 mm/s and 20 000 mm/s²: consistent; the auxiliary limits come from third-party sources, not Bambu's spec page.
- AMS 2 Pro rotating drying turns the spool 30° every 5 minutes (Bambu wiki, via search).
- Speed modes 50 / 100 / 124 / 166 %.
- Recipe settings (layer heights, walls, infill, bed temperatures, hinge clearance, lithophane thickness) agree with the material tables from batch 1 and with common practice.

**Not independently confirmed (left as marked "doc" on the page):** TPU on the X2D at 225 °C nozzle and 30–35 °C bed. Bambu's TPU for AMS datasheet gives 230 °C and 35 °C, so the page's values are in the same range. The X2D PC bed of 100–110 °C was also not found in public sources.

**Fixed (found while checking recipe 14):** heat-set insert hole sizes.

| Where | Was | Now | Why |
|-------|-----|-----|-----|
| `tools/calculators.html` insert calculator | Insert ODs for M2, M2.5, M4–M8 were the maker's recommended *hole* sizes; default interference 0.3 mm was then subtracted, so M4 came out 5.3 mm (0.3–0.4 mm too tight) and M3 4.3 mm (0.3 mm too loose) | Real ODs plus the maker's hole per size (M2 3.2, M2.5 4.0, M3 4.0, M4 5.7, M5 6.5, M6 8.1, M8 9.7 mm); interference is an optional override; result shows the interference used | CNC Kitchen insert table: M3 OD 4.6 / hole 4.0, M4 6.3 / 5.6–5.7, M5 7.1 / 6.4–6.5, M6 8.7 / 8.0–8.1, M8 10.2 / 9.7. Tested in Chromium for every size and both overrides. |
| `techniques/post-processing.html` thread table | Insert holes M3 4.0–4.6, M4 5.6–6.0, M5 6.4–7.0, M6 8.0–8.4 mm; the upper ends equal the insert OD, so the insert would not grip | 4.0–4.2, 5.4–5.7, 6.3–6.5, 7.8–8.1 mm | Agree with the cheat sheet and the design page. |
| `x2d/recipes.html` recipe 14 | Holes "about 0.2–0.4 mm under the insert's outer diameter" | "the insert maker's size (typically 0.4–0.65 mm under), for example 4.0 mm for a 4.6 mm M3 insert" | Same source. |

**Open:** `design/joints-and-fasteners.html` and `reference/cheat-sheets.html` give slightly different insert ODs and holes for M2.5 and M8 (insert brands differ: some M2.5 inserts share the M3 body, M8 holes range 9.7–10.4 mm). Both already say to check the supplier's datasheet.

## Next batches

Run `python scripts/check_charts.py` after editing any chart.

1. **Design numbers** (`design/tolerances-and-fits.html`, `design/joints-and-fasteners.html`, `design/design-patterns.html`): clearances, wall thicknesses, snap-fit strain. Heat-set insert holes were done in batch 3.
2. **Slicer settings and speed/cooling** (`software/slicer-settings.html`, `techniques/speed-cooling-quality.html`): volumetric flow, retraction, cooling.
3. **Safety** (`foundations/safety-and-workspace.html`): emission and temperature claims.
4. **Calculators**: formulas were hand-checked in the 2026-11-02 QA; re-check default constants (densities, costs per unit) against the material tables.
