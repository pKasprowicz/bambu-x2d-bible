// ---------------------------------------------------------------
// retraction_test.scad  -  stringing test with travel moves
// Used in: Level 2 exercise L2-2, Level 1 exercise L1-11 (optional)
//
// Several thin towers stand on a thin base plate.  The print head must
// travel across open air between the towers on every layer, so any ooze
// shows up as fine strings between them.  Change ONE retraction setting
// at a time (length, speed, temperature) between prints, or use
// the slicer's layer-based retraction override to test several values
// in one print.
// Units: millimeters.
// ---------------------------------------------------------------

towers   = 4;      // number of towers in a row
tower_d  = 8;      // tower diameter
tower_h  = 40;     // tower height
spacing  = 30;     // center distance between towers
base_h   = 1.2;    // thin base plate (keeps the towers together)
base_w   = 14;     // base plate width
$fn      = 48;

base_len = (towers - 1) * spacing + tower_d + 8;

// thin base plate
translate([-tower_d / 2 - 4, -base_w / 2, 0])
    cube([base_len, base_w, base_h]);

for (i = [0 : towers - 1])
    translate([i * spacing, 0, base_h - 0.01]) {
        cylinder(d = tower_d, h = tower_h);
        // a small cone on top avoids a flat blob at the end of the print
        translate([0, 0, tower_h]) cylinder(d1 = tower_d, d2 = 2, h = 4);
    }
