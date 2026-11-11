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

## Batch 4 — design numbers (2026-11-10)

**Scope:** fit classes and clearances, snap-fit strain limits, minimum walls and features, overhang and bridge rules, fastener tables (clearance holes, heads, nuts, tap drills), magnet pockets, on the design pages, the cheat sheets, the techniques pages and the calculators' data.

**Fixed:**

| Where | Was | Now | Why |
|-------|-----|-----|-----|
| `reference/cheat-sheets.html` tolerance table | Per-side gaps about one class looser than the fit classes on `design/tolerances-and-fits.html` (e.g. "sliding 0.15–0.30 mm per side" = 0.30–0.60 mm diametral, against 0.30–0.40 mm) and no slip class | Same five classes as the design page, with diametral clearance and per-side gap in separate columns | A reader copying "0.3" between pages could be off by a factor of two. |
| `tools/calculators.html` snap-fit calculator | Allowed strain above the design page's conservative one-off limits: PLA 1.5 % (page 0.8–1.0), PETG 3.0 % (2.0), PC 3.0 % (2.5), PP 6 % (4), TPU 95A 15 % (5–8), CF grades 1.2 % (0.5–1.0) | One-off limits from the page (PLA 0.9, PETG 2.0, ABS/ASA 1.8, PC 2.5, nylon 3.5, PP 4.0, CF grades 0.8–1.0, TPU 95A 8 %); the "repeated" option still halves them, matching the page's repeated column | The calculator passed snap arms the page says will crack (a 1.2 % PLA arm). Materials not on the page set by judgement: PLA+ 1.5, silk PLA 0.7, TPU 85A 10, HIPS 1.5, PVA 1.0. Tested in Chromium. |

**Checked, no change:**

- Fit classes on `design/tolerances-and-fits.html` and the calculator agree. The calculator's clearances are the gap wanted in the printed part and its hole compensation (0.1–0.2 mm) is added separately; its output shows both.
- Snap-fit examples: annular snap ε = y / r = 0.2 / 10 = 2 % ("PETG ok, PLA cracks") and the design-patterns figures (PETG 1 %, PLA 0.4 % for repeated flexing) match the strain table.
- Minimum wall (two lines, 0.8–1.2 mm for a 0.4 mm nozzle), minimum feature, overhang (45°, 60° with good cooling) agree across pages.
- Bridging: pages frame it consistently: design rule ≤ 10–15 mm when function matters, ≤ 30 mm for appearance; PLA with good cooling reaches 30–50 mm; beyond 50 mm needs support.
- Fastener tables match ISO dimensions: socket heads (ISO 4762), nuts (DIN 934 on the design page, ISO 4032 in the calculator; M5 height 4.0 vs 4.7 mm, both valid), tap drills, clearance holes (ISO 273 fine/medium/coarse).
- Magnet pockets (+0.2 mm glue, +0.1 mm press) and nut pockets (+0.2–0.3 mm) agree with the fit classes.

## Batch 5 — slicer settings, speed and cooling (2026-11-10)

**Scope:** `software/slicer-settings.html` and `techniques/speed-cooling-quality.html` (per-feature speeds and accelerations, volumetric flow by hotend and material, max-speed table, material profiles, fan and retraction); layer-height and line-width rules on every page.

**Fixed:**

| Where | Was | Now | Why |
|-------|-----|-----|-----|
| `software/slicer-settings.html` max feed speed chart legend | 12 mm³/s labelled "PLA, standard hotend" and 18 mm³/s "high-flow hotend" | 8 = basic hotend PETG/ABS, 12 = basic hotend PLA or standard PETG, 18 = standard hotend PLA | The flow table on the speed page gives a standard hotend 15–25 mm³/s with PLA and high-flow 25–40; the curves themselves were right. |

**Checked, no change:** the max-speed table (speed = flow ÷ (0.42 × layer height)) is exact for all ten values. Retraction (PLA 0.8 mm direct drive), fan by material, per-feature speeds and the two acceleration tables are consistent (one is a general strategy, the other a starting point for an enclosed CoreXY printer and sits inside the first). Layer height 25–75 % and line width 100–125 % of the nozzle agree on every page; the "≤ 60 %" on the troubleshooting page is a deliberate strength recommendation.

## Batch 6 — safety (2026-11-10)

**Scope:** `foundations/safety-and-workspace.html` and every other page with temperatures, first aid, fire or chemical guidance.

**Fixed:**

| Where | Was | Now | Why |
|-------|-----|-----|-----|
| `foundations/safety-and-workspace.html` burns | "cool running water for at least 10 minutes" | "straight away, for at least 20 minutes (British and Australian Red Cross guidance)" | Current Red Cross (UK and Australia) and NHS first-aid guidance. |

**Checked, no change:** emissions are described qualitatively (no exposure figures to verify). Resin curing wavelengths (365–405 nm) are correct. Acetone vapor-smoothing times are framed as minutes with a flammability warning.

## Batch 7 — calculator constants (2026-11-10)

**Scope:** the shared `MATS` table in `tools/calculators.html` (density, shrinkage, drying temperature, time and maximum, modulus, strength, flow factor), the hotend flow bases and the screw table.

**Fixed:**

| Where | Was | Now | Why |
|-------|-----|-----|-----|
| Drying calculator, TPU 95A | Maximum safe dryer temperature 60 °C, so it warned against Bambu's own 70 °C | 70 °C | Bambu: TPU 70 °C, 8 h in an oven (quoted on the AMS 2 Pro page). Tested in Chromium. |
| Drying calculator, PP | 6 h | 4 h | Drying page and engineering page: 3–4 h. |

Earlier batches also changed this table: snap-fit strain limits (batch 4) and the insert data (batch 3).

**Checked, no change:** densities (PLA 1.24, PETG 1.27, ABS 1.04, ASA 1.07, PC 1.20, PA6 1.14, PA12 1.02, TPU 1.21, PP 0.90 g/cm³ and the filled grades) match published values; drying temperatures and times match the batch 1 figures; hotend flow bases (generic 11, standard 21, high-flow 30 mm³/s for PLA) sit inside the flow table's ranges, and the material flow factors match its ratios; moduli and strengths are reasonable printed-part values.

**Open:** shrinkage in the calculator (PLA 0.3, PA12 1.0 %) sits at the upper end of typical ranges and the shrinkage chart on the engineering page (PLA ≈ 0.2, PA12 ≈ 0.6 %) at the lower end. Both are inside published ranges and both pages call them approximate.

## Batch 8 — closing the open spreads (2026-11-11)

**Scope:** every item logged as open in batches 1, 3 and 7. Rule applied: the canonical pages win (`materials/drying-and-storage.html` for drying, the X2D limits for nozzle temperature), and a range that only differed in its edges was widened or narrowed to one shared range rather than adding a new value.

**Fixed:**

| Where | Was | Now | Why |
|-------|-----|-----|-----|
| `materials/overview.html` PETG drying | 60–65 °C · 6–8 h | 60–65 °C · 4–8 h | Drying page and cheat sheet. PETG-CF keeps 6–8 h (filled grade, not in the drying table). |
| `materials/overview.html` TPU 95A, TPU 85A, TPE drying | 55–60 °C · 6–8 h / 8 h | 50–65 °C · 6–10 h | Drying page row “TPU / TPE”. Bambu's 70 °C for its own TPU stays on the X2D pages and is covered by “some vendors up to 70” on the drying page. |
| `reference/cheat-sheets.html` TPU drying time | 6–8 h | 6–10 h | Drying page. |
| `materials/overview.html` PET-CF drying | 70–80 °C · 8–12 h | 65–80 °C · 6–10 h | Drying and engineering pages. Bambu's own PET-CF figure is still not checked (Bambu sites not reachable from the review environment). |
| `materials/overview.html` HIPS drying | 60–70 °C | 60–65 °C | Drying page. |
| PLA bed (overview 25–60, cheat sheet 35–60, first-layer table 45–65) | three ranges | 35–65 °C on all three | Matches the first-layer page's bar chart, which already said 35–65 °C; low end is a cool plate (Bambu's X2D guidance 35–45 °C), high end textured PEI. The first-layer table now says so. |
| PC nozzle (overview, engineering prose, safety emissions table) | 260–310 °C | 260–300 °C | Every other page, and the X2D tops out at 300 °C. PPS-CF's 310 °C in the material picker is correct and unchanged. |
| `materials/overview.html` PVA heat column | “~60 °C (then sticky)” | “≈ 75 °C (Tg); sticky when damp” | Drying page gives Tg ≈ 75 °C; stickiness is a moisture effect. |

**Reviewed, no change:**

- Dryer prices on the drying page: the “no prices” rule in the handoff is about Bambu products. Generic cost examples (filament per kg, dryers, the economics page) are deliberate and stay.
- M2.5 and M8 insert sizes (joints page vs cheat sheet): brands genuinely differ and both pages already say to check the supplier's datasheet.
- Shrinkage in the calculator (PLA 0.3 %, PA12 1.0 %) vs the engineering chart (≈ 0.2 %, ≈ 0.6 %): both inside published ranges and both labelled approximate.
- The mock spool label in the level 1 exercise (bed 45–65 °C) is an example of a real label, not site guidance.

## Status

All planned batches are done, and batch 8 closed the open spreads. The review was a cross-check by consistency, manufacturer data and published standards, not a review by a printing specialist; a domain expert could still add value, especially on the values logged as open and on the materials not covered by a manufacturer figure.

Run `python scripts/check_charts.py` after editing any chart, and keep drying figures in step with `materials/drying-and-storage.html`.
