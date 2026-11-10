# Changelog

All notable changes to the Compendium. Format: [Keep a Changelog](https://keepachangelog.com), versioning described in [docs/github-flow-and-versioning.md](docs/github-flow-and-versioning.md).

## [Unreleased]

### Fixed
- Removed a stray UTF-8 byte-order mark at the start of the AMS 2 Pro page.
- AMS 2 Pro drying chart: the 65 °C limit line was drawn at 60 °C, which made PETG look as if it could not be dried in the unit.
- Cheat-sheet nozzle temperature chart: bars for PETG, ABS/ASA, nylon and PC sat 10–20 °C below the values in the table beside them; the axis now runs 180–300 °C.
- Drying figures now agree across pages and with Bambu Lab's published values: PC 80 °C for 8 h, nylon 80–90 °C, PPS-CF 100–140 °C for 8–12 h (was as low as 80 °C).
- Unfilled PC no longer listed as preferring a hardened nozzle.
- Eight more charts were drawn off their own axes and now read correctly: the filament-compatibility drying chart (65 °C line again drawn at 60 °C), the overhang angle scale, the chamber-temperature and wood-fill colour charts, the moisture and shrinkage bar charts, the moisture-uptake curve and the maximum feed speed chart (y labels made the curves read too slow).
- Bed-temperature bars: TPU no longer drawn longer than PLA. The smallest-feature bars are now labelled as not to scale.
- Heat-set insert calculator: most insert outer diameters were actually hole sizes, so M4–M8 holes came out 0.3–0.4 mm too tight and M3 0.3 mm too loose. It now uses each size's real outer diameter and the maker's recommended hole, with interference as an optional override.
- Heat-set insert holes on the post-processing page no longer run up to the insert's own diameter (M3 was 4.0–4.6 mm, now 4.0–4.2 mm), and the X2D enclosure recipe uses the same guidance.

### Added
- `scripts/check_charts.py`, a review aid that flags charts whose bars or ticks do not match their own scale.

## [1.0.1] - 2026-11-02

### Changed
- Quieter colour palette: about 40% less colour intensity in light and dark themes, with a darker "ink" variant for coloured text on tinted backgrounds (text on tints now meets 4.5:1). Hues stay as easy to tell apart as before. Brand orange is now a muted terracotta.
- Small grey text is slightly darker in light mode.
- The version is now shown in the header of every page (desktop) and in the home page hero, not only in the footer.

### Fixed
- SVG labels without a colour class were near-invisible in dark mode; they now follow the theme.
- Buttons and chips that use the brand colour switch their text colour so they stay readable in dark mode.

## [1.0.0] - 2026-11-02

First numbered edition.

### Added
- 62 pages in nine parts: foundations, materials, software, techniques, design for additive manufacturing, Bambu X2D + AMS 2 Pro, exercises, tools, reference.
- 17 calculators, a material picker, a visual lab, 90 quiz questions, 14 parametric OpenSCAD test models.
- Full-text search, dark mode, exercise progress tracking.

### Fixed
- Quiz answers are shuffled on load (the correct option was mostly in slot 2).
- Visual lab wall builder no longer produces NaN when walls, top/bottom layers and infill are all zero.
- Header and several pages no longer overflow on phone widths (320-414 px); the search icon is visible on mobile.
- Replaced a broken external link (Formnext).

### Verified
- All OpenSCAD models compile; X2D headline specifications match Bambu Lab's published spec sheet (2026-11-02).

[Unreleased]: https://github.com/pKasprowicz/bambu-x2d-bible/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/pKasprowicz/bambu-x2d-bible/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/pKasprowicz/bambu-x2d-bible/releases/tag/v1.0.0
