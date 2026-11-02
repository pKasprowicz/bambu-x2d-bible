# Changelog

All notable changes to the Compendium. Format: [Keep a Changelog](https://keepachangelog.com), versioning described in [docs/github-flow-and-versioning.md](docs/github-flow-and-versioning.md).

## [Unreleased]

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

[Unreleased]: https://github.com/pKasprowicz/bambu-x2d-bible/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/pKasprowicz/bambu-x2d-bible/releases/tag/v1.0.0
