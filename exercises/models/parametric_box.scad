// ---------------------------------------------------------------
// parametric_box.scad  -  rounded box with a lipped lid
// Used in: Level 2 exercise L2-7 (reference solution) and L2-14
//
// part = "base" | "lid" | "both" | "preview" (lid placed on the base)
// The lid has a lip that fits inside the box wall with `clearance` on
// every side.  Optional corner posts (for screws or heat-set inserts)
// are included in the base.  Print both parts with the open side up
// (base) and the flat side down (lid): no supports are needed.
// Units: millimeters.
// ---------------------------------------------------------------

part        = "both";   // "base", "lid", "both" or "preview"
inner_x     = 60;       // inside length
inner_y     = 40;       // inside width
inner_z     = 25;       // inside height of the base
wall        = 2.0;      // wall thickness (a multiple of the line width works best)
floor_t     = 2.0;      // floor and lid thickness
corner_r    = 4;        // outside corner radius (>= wall)
lip_h       = 4;        // height of the lid lip
lip_t       = 1.2;      // thickness of the lid lip
clearance   = 0.25;     // gap between lip and wall
posts       = true;     // corner posts for screws / inserts
post_d      = 7;        // post outer diameter
hole_d      = 4.2;      // hole for an M3 heat-set insert (check your insert's datasheet)
post_h      = 12;       // post height above the floor
$fn         = 48;

out_x = inner_x + 2 * wall;
out_y = inner_y + 2 * wall;

module rrect(x, y, r) {
    offset(r = r) offset(delta = -r) square([x, y]);
}

module base() {
    difference() {
        linear_extrude(floor_t + inner_z) rrect(out_x, out_y, corner_r);
        translate([wall, wall, floor_t])
            linear_extrude(inner_z + 1) rrect(inner_x, inner_y, max(corner_r - wall, 0.01));
    }
    if (posts)
        for (x = [wall + post_d / 2 - 0.5, out_x - wall - post_d / 2 + 0.5],
             y = [wall + post_d / 2 - 0.5, out_y - wall - post_d / 2 + 0.5])
            translate([x, y, floor_t - 0.01])
                difference() {
                    cylinder(d = post_d, h = post_h);
                    translate([0, 0, 1]) cylinder(d = hole_d, h = post_h);
                }
}

module lid() {
    // plate
    linear_extrude(floor_t) rrect(out_x, out_y, corner_r);
    // lip that drops inside the base walls
    translate([wall + clearance, wall + clearance, floor_t - 0.01])
        linear_extrude(lip_h)
            difference() {
                rrect(inner_x - 2 * clearance, inner_y - 2 * clearance, max(corner_r - wall, 0.01));
                translate([lip_t, lip_t])
                    rrect(inner_x - 2 * clearance - 2 * lip_t, inner_y - 2 * clearance - 2 * lip_t, 0.01);
            }
}

if (part == "base" || part == "both") base();
if (part == "lid") lid();
if (part == "both") translate([out_x + 10, 0, 0]) lid();
if (part == "preview") {
    base();
    // lid flipped over and sitting on the base
    translate([0, out_y, floor_t + inner_z + floor_t])
        rotate([180, 0, 0]) lid();
}
