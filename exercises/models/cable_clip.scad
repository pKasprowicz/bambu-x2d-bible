// ---------------------------------------------------------------
// cable_clip.scad  -  screw-on cable clip, prints flat with no supports
// Used in: Level 1 exercise L1-9, Level 2 exercise L2-14 (variant)
//
// A C-shaped ring holds a cable; a flat foot carries two countersunk
// screw holes.  The ring axis is vertical (Z) so the part prints flat on
// the bed with no supports.  Set `cable_d` to your cable diameter and
// keep `opening` a bit smaller than the cable so it snaps in.
// Units: millimeters.
// ---------------------------------------------------------------

cable_d    = 5;      // cable diameter
fit        = 0.3;    // extra clearance added to the cable diameter
wall       = 2.4;    // wall thickness of the ring and the foot
opening    = 3.6;    // width of the slot; < cable_d for a snap-in grip
width      = 10;     // clip height (Z), the dimension along the cable
foot_w     = 36;     // total width of the foot
screw_d    = 3.5;    // screw clearance hole diameter
head_d     = 7;      // countersink head diameter
$fn        = 64;

inner_r = (cable_d + fit) / 2;
outer_r = inner_r + wall;

// 2D profile in X-Y: ring on top of a foot whose bottom is at y = -outer_r
module profile() {
    difference() {
        union() {
            circle(r = outer_r);
            translate([-foot_w / 2, -outer_r]) square([foot_w, wall]);
        }
        circle(r = inner_r);
        // slot opening toward +Y
        translate([-opening / 2, 0]) square([opening, outer_r + 1]);
    }
}

difference() {
    linear_extrude(width) profile();
    // two countersunk screw holes through the foot (axis along Y)
    for (sx = [-1, 1])
        translate([sx * (foot_w / 2 - 5), -outer_r - 0.1, width / 2])
            rotate([-90, 0, 0]) {
                cylinder(d = screw_d, h = wall + 0.2);
                // countersink opens on the +Y side of the foot
                translate([0, 0, wall - (head_d - screw_d) / 2 + 0.1])
                    cylinder(d1 = screw_d, d2 = head_d, h = (head_d - screw_d) / 2 + 0.05);
            }
}
