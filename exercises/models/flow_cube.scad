// ---------------------------------------------------------------
// flow_cube.scad  -  thin-wall open box for flow-ratio calibration
// Used in: Level 2 exercise L2-3
//
// Slice with: 2 walls (or 1 wall in "classic" mode), 0% infill,
// 0 top layers, and your normal layer height.  Measure the wall
// thickness at several points with calipers and compare it with the
// expected value (2 x line width).  Wall thickness that is thicker than
// expected = over-extrusion; thinner = under-extrusion.
// Units: millimeters.
// ---------------------------------------------------------------

size        = 20;     // outer edge length
height      = 20;     // outer height
wall        = 0.84;   // modeled wall thickness (2 x 0.42 mm line width)
bottom      = 1.0;    // solid floor so the walls are connected
corner_r    = 0;      // optional vertical corner radius (0 = sharp)
$fn         = 48;

module footprint(s) {
    if (corner_r > 0) {
        offset(r = corner_r) offset(delta = -corner_r) square(s);
    } else {
        square(s);
    }
}

difference() {
    linear_extrude(height) footprint(size);
    // open-top cavity
    translate([wall, wall, bottom])
        linear_extrude(height) footprint(size - 2 * wall);
}
