// ---------------------------------------------------------------
// ringing_tower.scad  -  surface ripples ("ghosting") test
// Used in: Level 3 exercise L3-2
//
// A tall block with sharp vertical edges, a notch and raised text on
// one side.  Ringing shows as repeating ripples that echo the sharp
// features along the X and Y faces after fast direction changes.
// Print at normal speed/acceleration, inspect, then change
// acceleration or input-shaping settings and compare.
// Units: millimeters.
// ---------------------------------------------------------------

width   = 30;     // X size
depth   = 30;     // Y size
height  = 50;     // Z size
notch_w = 6;      // width of the square notch cut into the +X face
notch_d = 4;      // depth of the notch
text_h  = 6;      // text size
relief  = 0.6;    // raised text height
label_x = "X";    // letter on the +X face
label_y = "Y";    // letter on the +Y face

difference() {
    cube([width, depth, height]);
    // vertical notch on the +X face to create sharp inside corners
    translate([width - notch_d, depth / 2 - notch_w / 2, -1])
        cube([notch_d + 1, notch_w, height + 2]);
}

// raised letters repeated along the height so each shows ringing echoes
for (z = [10 : 15 : height - 10]) {
    // on the +Y face
    translate([width / 2, depth - 0.01, z])
        rotate([90, 0, 180])
            linear_extrude(relief)
                text(label_y, size = text_h, halign = "center", valign = "center");
}
for (z = [10 : 15 : height - 10]) {
    // on the +X face, left of the notch (toward y = 0)
    translate([width - 0.01, depth / 4, z])
        rotate([90, 0, 90])
            linear_extrude(relief)
                text(label_x, size = text_h, halign = "center", valign = "center");
}
