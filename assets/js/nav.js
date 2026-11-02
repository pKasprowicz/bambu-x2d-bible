/* Single source of truth for the site map.
   Every page listed here MUST exist (scripts/check_site.py verifies this).
   level: 1 = beginner, 2 = intermediate, 3 = advanced, 0 = all levels */
window.C3D_NAV = {
  title: "The 3D Printing Compendium",
  short: "3D Printing Compendium",
  parts: [
    {
      id: "start", title: "Start here", icon: "🧭", color: "orange",
      pages: [
        { f: "start-here.html", t: "How to use this compendium", d: "Learning paths for every level, conventions and icons", level: 0 }
      ]
    },
    {
      id: "foundations", title: "1 · Foundations", icon: "🧱", color: "blue",
      pages: [
        { f: "foundations/what-is-3d-printing.html", t: "What is 3D printing?", d: "Additive manufacturing, the full workflow, history and terms", level: 1 },
        { f: "foundations/printing-processes.html", t: "Printing processes compared", d: "FDM, resin (SLA/MSLA/DLP), SLS, MJF, metal and more", level: 1 },
        { f: "foundations/printer-anatomy.html", t: "Anatomy of an FDM printer", d: "Motion systems, hotends, extruders, beds, electronics", level: 1 },
        { f: "foundations/first-print.html", t: "Your first print", d: "From unboxing to a successful first model, step by step", level: 1 },
        { f: "foundations/safety-and-workspace.html", t: "Safety & workspace", d: "Fumes, fire, ventilation, enclosures, tools and set-up", level: 1 },
        { f: "foundations/buying-guide.html", t: "Choosing a printer", d: "What to look for, categories, budgets and trade-offs", level: 1 }
      ]
    },
    {
      id: "materials", title: "2 · Materials", icon: "🧵", color: "green",
      pages: [
        { f: "materials/overview.html", t: "Filament overview & comparison", d: "Properties, charts and a decision framework", level: 1 },
        { f: "materials/everyday-plastics.html", t: "PLA, PETG & everyday plastics", d: "PLA variants, PETG, PCTG, how to tune each", level: 1 },
        { f: "materials/engineering-plastics.html", t: "Engineering plastics", d: "ABS, ASA, PC, nylons, PET, PPS, composites (CF/GF)", level: 2 },
        { f: "materials/flexibles-and-specialty.html", t: "Flexibles & specialty filaments", d: "TPU/TPE, supports (PVA/BVOH/HIPS), silk, wood, glow, metal-fill", level: 2 },
        { f: "materials/drying-and-storage.html", t: "Drying & storage", d: "Moisture science, temperatures, dryers and desiccant", level: 1 }
      ]
    },
    {
      id: "software", title: "3 · Software", icon: "💻", color: "purple",
      pages: [
        { f: "software/slicers.html", t: "Slicers compared", d: "Bambu Studio, OrcaSlicer, PrusaSlicer, Cura and friends", level: 1 },
        { f: "software/slicer-settings.html", t: "Slicer settings explained", d: "Every important setting, what it does and when to change it", level: 1 },
        { f: "software/cad-modeling.html", t: "CAD & modeling software", d: "Tinkercad, Fusion, FreeCAD, Onshape, OpenSCAD, Blender", level: 1 },
        { f: "software/files-and-meshes.html", t: "File formats & mesh repair", d: "STL, 3MF, STEP, OBJ, repair, scanning, repositories", level: 2 },
        { f: "software/gcode-and-firmware.html", t: "G-code, firmware & ecosystem", d: "G-code primer, Marlin, Klipper, Bambu firmware, OctoPrint", level: 3 }
      ]
    },
    {
      id: "techniques", title: "4 · Techniques", icon: "🛠️", color: "orange",
      pages: [
        { f: "techniques/first-layer-and-adhesion.html", t: "First layer & bed adhesion", d: "Squish, plates, glue, brims, warping", level: 1 },
        { f: "techniques/supports-bridges-overhangs.html", t: "Supports, bridges & overhangs", d: "When, how and what kind of support to use", level: 1 },
        { f: "techniques/speed-cooling-quality.html", t: "Speed, cooling & quality", d: "Volumetric flow, acceleration, input shaping, cooling", level: 2 },
        { f: "techniques/multi-color-and-multi-material.html", t: "Multi-color & multi-material", d: "AMS, purge/flush, painting, tool changers, waste reduction", level: 2 },
        { f: "techniques/calibration.html", t: "Calibration playbook", d: "Flow, pressure advance, temperature, retraction, shrinkage", level: 2 },
        { f: "techniques/advanced-techniques.html", t: "Advanced techniques", d: "Vase mode, modifiers, variable layer height, inserts and more", level: 3 },
        { f: "techniques/post-processing.html", t: "Post-processing", d: "Sanding, smoothing, painting, annealing, assembly", level: 2 },
        { f: "techniques/troubleshooting.html", t: "Troubleshooting gallery", d: "Illustrated defect diagnosis and fixes", level: 1 },
        { f: "techniques/maintenance.html", t: "Maintenance schedule", d: "Keep any printer healthy for years", level: 1 }
      ]
    },
    {
      id: "design", title: "5 · Design for printing", icon: "📐", color: "teal",
      pages: [
        { f: "design/principles.html", t: "Design principles (DfAM)", d: "Orientation, overhangs, walls, features that print well", level: 1 },
        { f: "design/tolerances-and-fits.html", t: "Tolerances & fits", d: "Clearances, press fits, holes, shrinkage, test coupons", level: 2 },
        { f: "design/joints-and-fasteners.html", t: "Joints & fasteners", d: "Snap fits, screws, heat-set inserts, threads, hinges", level: 2 },
        { f: "design/strength-and-orientation.html", t: "Strength & orientation", d: "Anisotropy, load paths, infill, stress concentrations", level: 2 },
        { f: "design/design-patterns.html", t: "Design patterns & recipes", d: "Print-in-place, enclosures, text, splitting, organizers", level: 2 },
        { f: "design/parametric-cad-workflow.html", t: "Parametric CAD workflow", d: "Sketch-to-part habits, OpenSCAD & CadQuery examples", level: 2 }
      ]
    },
    {
      id: "x2d", title: "6 · Bambu X2D + AMS 2 Pro", icon: "🖨️", color: "red",
      pages: [
        { f: "x2d/overview.html", t: "X2D overview & specs", d: "What it is, key numbers, how it compares", level: 0 },
        { f: "x2d/hardware-tour.html", t: "Hardware tour", d: "Toolhead, auxiliary extruder, chamber, filtration, sensors", level: 1 },
        { f: "x2d/ams-2-pro.html", t: "AMS 2 Pro deep dive", d: "Slots, drying, humidity, connecting several units", level: 1 },
        { f: "x2d/setup-and-first-print.html", t: "Set-up & first print", d: "Unboxing, calibration, loading and first job", level: 1 },
        { f: "x2d/dual-nozzle-printing.html", t: "Dual-nozzle printing", d: "Main vs auxiliary nozzle, strategies, limits and build area", level: 2 },
        { f: "x2d/filament-compatibility.html", t: "Filament compatibility", d: "What to run on which nozzle, with AMS or external", level: 1 },
        { f: "x2d/settings-and-profiles.html", t: "Bambu Studio settings & profiles", d: "Process settings, calibration, flush and presets", level: 2 },
        { f: "x2d/engineering-and-chamber.html", t: "Engineering materials & chamber", d: "65 °C chamber, ABS/ASA/PA/PC workflows", level: 3 },
        { f: "x2d/tpu-and-flexibles.html", t: "TPU & flexibles on X2D", d: "Practical guide to soft materials", level: 2 },
        { f: "x2d/maintenance-and-troubleshooting.html", t: "Maintenance & troubleshooting", d: "Schedules, nozzle care, common faults and fixes", level: 2 },
        { f: "x2d/recipes.html", t: "Project recipes", d: "Complete, proven workflows for typical projects", level: 2 }
      ]
    },
    {
      id: "exercises", title: "7 · Practice & exercises", icon: "🎯", color: "pink",
      pages: [
        { f: "exercises/index.html", t: "Practice hub & progress", d: "Pick your level and track your progress", level: 0 },
        { f: "exercises/level-1-beginner.html", t: "Level 1 · Beginner", d: "Ten guided exercises to build confidence", level: 1 },
        { f: "exercises/level-2-intermediate.html", t: "Level 2 · Intermediate", d: "Design, tune and assemble functional parts", level: 2 },
        { f: "exercises/level-3-advanced.html", t: "Level 3 · Advanced", d: "Engineering-grade projects and optimization", level: 3 },
        { f: "exercises/level-4-expert.html", t: "Level 4 · Expert", d: "Open-ended challenges for masters", level: 3 },
        { f: "exercises/x2d-challenges.html", t: "X2D + AMS 2 Pro challenges", d: "Exercises that exploit the dual nozzle and AMS 2 Pro", level: 2 },
        { f: "exercises/quizzes.html", t: "Knowledge quizzes", d: "Self-test with instant feedback", level: 0 },
        { f: "exercises/models.html", t: "Downloadable test models", d: "Parametric OpenSCAD calibration and practice models", level: 0 }
      ]
    },
    {
      id: "tools", title: "8 · Interactive tools", icon: "🧮", color: "teal",
      pages: [
        { f: "tools/calculators.html", t: "Calculators", d: "Cost, flow, shrinkage, drying, time and weight estimators", level: 0 },
        { f: "tools/material-picker.html", t: "Material picker", d: "Answer a few questions, get a recommendation", level: 0 },
        { f: "tools/visual-lab.html", t: "Visual lab", d: "Interactive diagrams: layers, overhangs, infill, flow", level: 0 }
      ]
    },
    {
      id: "reference", title: "9 · Reference", icon: "📚", color: "gray",
      pages: [
        { f: "reference/glossary.html", t: "Glossary", d: "A–Z of 3D printing terms", level: 0 },
        { f: "reference/cheat-sheets.html", t: "Cheat sheets", d: "Printable one-page summaries", level: 0 },
        { f: "reference/faq.html", t: "FAQ", d: "Quick answers to the questions everyone asks", level: 0 },
        { f: "reference/applications.html", t: "Applications & project ideas", d: "Functional, cosplay, miniatures, RC, home, education", level: 0 },
        { f: "reference/economics-and-ethics.html", t: "Economics, licensing & sustainability", d: "Cost of printing, selling prints, licenses, recycling", level: 2 },
        { f: "reference/resources.html", t: "Resources & communities", d: "Repositories, channels, books, tools and standards", level: 0 }
      ]
    }
  ]
};
