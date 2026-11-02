// ---------------------------------------------------------------
// hinge_test.scad  -  print-in-place hinge (two leaves, one pin)
// Used in: Level 3 exercise L3-4, Level 2 exercise L2-6 (clearance)
//
// Knuckles alternate between leaf A and leaf B along the Y axis.
// The pin is fused to the A knuckles; the B knuckles are bored out
// with `clearance` all around so they can turn.  Axial gaps between the
// knuckles are also `clearance`.  Print flat on the bed, hinge axis
// along Y, with NO supports.  After printing, rotate the leaves back and
// forth a few times to break the thin layer bonds across the gaps.
// Units: millimeters.
// ---------------------------------------------------------------

knuckles   = 5;      // number of knuckles (use an odd number: A B A B A)
seg        = 8;      // length of one knuckle along Y
R          = 5;      // knuckle outer radius
pin_r      = 2;      // pin radius
clearance  = 0.4;    // radial and axial clearance
leaf_w     = 25;     // leaf width (X) measured from the axis
leaf_t     = 3;      // leaf thickness
split      = 0.4;    // X gap between the two leaves at the axis
$fn        = 64;

total_len = knuckles * seg + (knuckles - 1) * clearance;

function y0(i) = i * (seg + clearance);   // start of knuckle i along Y

// cylinder along +Y, axis at height R
module cyl_y(r, start, len) {
    translate([0, start, R]) rotate([-90, 0, 0]) cylinder(r = r, h = len);
}

// one leaf; side = -1 for A (left), +1 for B (right); owns knuckles with parity `own`
module leaf(side, own) {
    difference() {
        union() {
            // full-length plate on this side of the axis
            if (side < 0)
                translate([-leaf_w, 0, 0]) cube([leaf_w - split / 2, total_len, leaf_t]);
            else
                translate([split / 2, 0, 0]) cube([leaf_w - split / 2, total_len, leaf_t]);
            // own knuckles
            for (i = [0 : knuckles - 1])
                if (i % 2 == own) cyl_y(R, y0(i), seg);
        }
        // carve clearance around the OTHER leaf's knuckles
        for (i = [0 : knuckles - 1])
            if (i % 2 != own)
                cyl_y(R + clearance, y0(i) - clearance, seg + 2 * clearance);
        // bore for the pin in B knuckles
        if (own == 1)
            cyl_y(pin_r + clearance, -0.1, total_len + 0.2);
    }
}

leaf(-1, 0);   // leaf A with knuckles 0, 2, 4
leaf( 1, 1);   // leaf B with knuckles 1, 3

// pin: fused to the A knuckles, passes through the bored B knuckles
cyl_y(pin_r, 0, total_len);
