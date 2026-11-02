// ---------------------------------------------------------------
// tolerance_gauge.scad  -  pegs and holes with graded clearance
// Used in: Level 2 exercise L2-6, Level 3 exercises L3-4 and L3-5
//
// Part "plate" : a plate with round holes. Hole diameter = peg_d + clearance.
// Part "pegs"  : loose pegs with the nominal diameter (one per hole).
// Part "both"  : plate and pegs side by side (print as one job).
// Try each peg in each hole: the smallest clearance where the peg slides
// freely (but without wobble) is your design clearance for that printer,
// material and orientation.
// Units: millimeters.
// ---------------------------------------------------------------

part         = "both";                          // "plate", "pegs" or "both"
peg_d        = 8;                               // nominal peg diameter
clearances   = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5];  // added to the hole DIAMETER
plate_t      = 4;                               // plate thickness
peg_h        = 8;                               // peg height
pitch        = peg_d + 8;                       // spacing between holes
margin       = 4;
text_size    = 3;
engrave      = 0.4;
edge_chamfer = 0.4;                             // lead-in chamfer on the pegs
$fn          = 48;

n         = len(clearances);
plate_len = n * pitch + 2 * margin;
plate_wid = pitch + 6;

function cx(i) = margin + pitch / 2 + i * pitch;   // X center of hole / peg i

module plate() {
    difference() {
        cube([plate_len, plate_wid, plate_t]);
        for (i = [0 : n - 1]) {
            translate([cx(i), plate_wid - pitch / 2 - 1, -0.1])
                cylinder(d = peg_d + clearances[i], h = plate_t + 0.2);
            // engraved clearance value under each hole
            translate([cx(i), 3.5, plate_t - engrave])
                linear_extrude(engrave + 0.1)
                    text(str(clearances[i]), size = text_size, halign = "center", valign = "center");
        }
    }
}

module peg() {
    cylinder(d1 = peg_d - 2 * edge_chamfer, d2 = peg_d, h = edge_chamfer);
    translate([0, 0, edge_chamfer - 0.01])
        cylinder(d = peg_d, h = peg_h - 2 * edge_chamfer + 0.02);
    translate([0, 0, peg_h - edge_chamfer])
        cylinder(d1 = peg_d, d2 = peg_d - 2 * edge_chamfer, h = edge_chamfer);
}

module pegs() {
    for (i = [0 : n - 1])
        translate([cx(i), peg_d / 2, 0]) peg();
}

if (part == "plate" || part == "both") plate();
if (part == "pegs") pegs();
if (part == "both") translate([0, plate_wid + 4, 0]) pegs();
