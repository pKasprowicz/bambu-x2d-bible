// ---------------------------------------------------------------
// text_label_test.scad  -  minimum readable text, raised and engraved
// Used in: Level 1 exercise L1-15 (optional), Level 2 exercise L2-10,
//          Level 2 exercise L2-15 (two-color text)
//
// A plate with raised text rows (left half) and engraved text rows
// (right half) in several sizes.  Find the smallest size and stroke
// width that stay legible with your nozzle and layer height.
// Rule of thumb: strokes thinner than ~2 line widths (about 0.8 mm
// for a 0.4 mm nozzle) print poorly.  Use a bold font for small text.
// Units: millimeters.
// ---------------------------------------------------------------

sizes      = [3, 4, 5, 6, 8, 10];   // text heights to test
sample     = "Print 123";           // text to render
bold       = true;                  // bold font is more robust at small sizes
relief     = 0.6;                   // height of raised text / depth of engraving
plate_t    = 2.4;                   // plate thickness (engraving needs depth)
row_h      = 14;                    // height of one row
col_w      = 70;                    // width of each column

font = bold ? "Liberation Sans:style=Bold" : "Liberation Sans";
n    = len(sizes);

module txt(s) {
    text(sample, size = s, font = font, halign = "left", valign = "center");
}

difference() {
    union() {
        cube([2 * col_w + 6, n * row_h + 2, plate_t]);
        // raised column (left): add relief above the plate
        for (i = [0 : n - 1])
            translate([3, row_h / 2 + 1 + i * row_h, plate_t - 0.01])
                linear_extrude(relief + 0.01) txt(sizes[i]);
    }
    // engraved column (right): cut into the plate
    for (i = [0 : n - 1])
        translate([col_w + 3, row_h / 2 + 1 + i * row_h, plate_t - relief])
            linear_extrude(relief + 0.1) txt(sizes[i]);
}
