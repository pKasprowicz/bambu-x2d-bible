// ---------------------------------------------------------------
// hole_gauge.scad  -  how accurate are your holes?
// Used in: Level 1 exercise L1-2 (optional), Level 2 exercise L2-6,
//          Level 4 exercise L4-5
//
// A block with vertical holes of several nominal diameters plus a row of
// horizontal holes (axis along Y).  Measure each hole with calipers or
// drill bits / pin gauges and note the difference to nominal.  Printed
// holes usually come out 0.1-0.3 mm too small; horizontal holes are
// often more oval than vertical holes.
// Units: millimeters.
// ---------------------------------------------------------------

diameters = [3, 4, 5, 6, 8, 10];   // nominal hole diameters
comp      = 0;                     // optional diameter compensation added to every hole
height    = 14;                    // block height (must be > largest diameter + 3)
gap       = 4;                     // material between holes
text_size = 3;
engrave   = 0.4;
$fn       = 64;

n = len(diameters);

// X position of hole i (cumulative so large holes get more room)
function xpos(i) = (i == 0) ? gap + diameters[0] / 2
                            : xpos(i - 1) + diameters[i - 1] / 2 + gap + diameters[i] / 2;

total_len = xpos(n - 1) + diameters[n - 1] / 2 + gap;
row_y     = 12;     // Y of the vertical-hole row
plate_wid = 36;

difference() {
    cube([total_len, plate_wid, height]);

    // vertical holes
    for (i = [0 : n - 1])
        translate([xpos(i), row_y, -0.1])
            cylinder(d = diameters[i] + comp, h = height + 0.2);

    // horizontal holes (axis along Y), centered in the height
    for (i = [0 : n - 1])
        translate([xpos(i), plate_wid + 0.1, height / 2])
            rotate([90, 0, 0])
                cylinder(d = diameters[i] + comp, h = 15);

    // labels engraved on the top face between the two rows
    for (i = [0 : n - 1])
        translate([xpos(i), 21, height - engrave])
            linear_extrude(engrave + 0.1)
                text(str(diameters[i]), size = text_size, halign = "center", valign = "center");
}
