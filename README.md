# 📚 The 3D Printing Compendium

> From first print to expert — a free, illustrated, interactive guide to 3D printing, with a dedicated **Bambu Lab X2D + AMS 2 Pro** section.

**Live site:** <https://pkasprowicz.github.io/bambu-x2d-bible/> · **Downloads and changelog:** [Releases](https://github.com/pKasprowicz/bambu-x2d-bible/releases) · [`CHANGELOG.md`](CHANGELOG.md)

## What's inside

| Part | Contents |
|------|----------|
| **Start here** | Learning paths for beginners, intermediate printers, designers and X2D owners |
| **1 · Foundations** | What 3D printing is, processes, printer anatomy, first print, safety, buying guide |
| **2 · Materials** | Filament overview, PLA/PETG, engineering plastics, flexibles & specialty, drying & storage |
| **3 · Software** | Slicers, every slicer setting, CAD, file formats & meshes, G-code & firmware |
| **4 · Techniques** | First layer, supports, speed/cooling, multi-color, calibration, advanced techniques, post-processing, troubleshooting gallery, maintenance |
| **5 · Design (DfAM)** | Principles, tolerances, joints, strength & orientation, design patterns, parametric CAD |
| **6 · Bambu X2D + AMS 2 Pro** | Overview, hardware, AMS 2 Pro, setup, dual-nozzle printing, compatibility, settings, chamber, TPU, maintenance, recipes |
| **7 · Exercises** | Four expertise levels, X2D challenges, quizzes, parametric OpenSCAD test models |
| **8 · Tools** | Calculators, material picker, visual lab (animations) |
| **9 · Reference** | Glossary, cheat sheets, FAQ, applications, economics & ethics, resources |

Hundreds of original inline SVG diagrams, CSS charts, interactive calculators, quizzes and exercise trackers (progress is stored in the visitor's browser only).

## Publishing on GitHub Pages

The site is plain static HTML/CSS/JS — no build framework.

1. Merge to the default branch (`master`).
2. In the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. The workflow `.github/workflows/pages.yml` builds the search index, validates the site and deploys it.

To preview locally:

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the page skeleton, components and quality bar.

```bash
python scripts/build_search_index.py   # regenerate assets/search-index.json
python scripts/check_site.py           # validate links, anchors, SVG, structure
```

Branching, pull requests and version numbers are described in [`docs/github-flow-and-versioning.md`](docs/github-flow-and-versioning.md).

New pages must be added to `assets/js/nav.js` (the single source of truth for navigation, search and the pager).

## Disclaimer

Independent educational resource. **Not affiliated with, endorsed by or sponsored by Bambu Lab** or any other manufacturer; all product names are trademarks of their respective owners. Specifications come from public documentation at the time of writing and may change — consult official manuals and follow the manufacturer's safety instructions. Nothing here is legal, medical or professional engineering advice.
