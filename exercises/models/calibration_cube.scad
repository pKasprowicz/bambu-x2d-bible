// ---------------------------------------------------------------
// calibration_cube.scad  -  XYZ calibration cube (default 20 mm)
// Used in: Level 1 exercises L1-2 and L1-7, Level 2 exercise L2-3
//
// Print it, measure each axis with calipers and compare with `size`.
// The engraved X / Y / Z letters tell you which face is which, and the
// letter edges make a handy sharpness check for corners and details.
// Units: millimeters.  No external libraries needed.
// ---------------------------------------------------------------

size       = 20;    // edge length of the cube
letter_h   = 10;    // letter height (text size in mm)
engrave    = 0.6;   // depth of the engraved letters
chamfer    = 0;     // optional 45 degree chamfer on the bottom edges (0 = off)
                    // a small chamfer (0.4-0.6) hides "elephant foot"
$fn        = 24;

module letter(t) {
    // extruded text, slightly deeper than `engrave` so the cut is clean
    linear_extrude(height = engrave + 0.01)
        text(t, size = letter_h, halign = "center", valign = "center");
}

module body() {
    if (chamfer > 0) {
        hull() {
            translate([chamfer, chamfer, 0]) cube([size - 2 * chamfer, size - 2 * chamfer, 0.01]);
            translate([0, 0, chamfer]) cube([size, size, size - chamfer]);
        }
    } else {
        cube(size);
    }
}

difference() {
    body();
    // X on the front face (y = 0), reads left-to-right when viewed from the front
    translate([size / 2, engrave, size / 2]) rotate([90, 0, 0]) letter("X");
    // Y on the right face (x = size)
    translate([size - engrave, size / 2, size / 2]) rotate([90, 0, 90]) letter("Y");
    // Z on the top face
    translate([size / 2, size / 2, size - engrave]) letter("Z");
}
