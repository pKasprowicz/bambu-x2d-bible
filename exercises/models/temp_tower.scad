// ---------------------------------------------------------------
// temp_tower.scad  -  temperature tower with bridge + overhang per tier
// Used in: Level 1 exercise L1-11, Level 2 exercise L2-1
//
// Every tier is a block with (a) a bridge opening at the bottom,
// (b) a 45 degree overhang fin on the right and (c) the engraved
// temperature of that tier.  Change the nozzle temperature in the slicer
// at each tier boundary (Bambu Studio / OrcaSlicer: add a "custom G-code
// at layer change" or use the built-in temperature calibration).
//
// The hottest tier is at the BOTTOM, matching the usual convention.
// Units: millimeters.
// ---------------------------------------------------------------

start_temp  = 220;   // temperature of the bottom tier (deg C)
step        = 5;     // temperature drop per tier
tiers       = 7;     // number of tiers

tier_h      = 10;    // height of one tier
block_w     = 30;    // X size of the block
block_d     = 12;    // Y size (depth)
bridge_gap  = 16;    // width of the bridge opening
bridge_h    = 5;     // height of the bridge opening
fin_len     = 10;    // how far the fin sticks out (= tier_h gives 45 degrees)
base_h      = 1.2;   // thin base plate
text_size   = 4;     // engraved text size
engrave     = 0.5;   // engraving depth

module fin() {
    // 45 degree overhang fin: solid wedge whose underside leans 45 degrees
    translate([block_w - 0.01, block_d, 0])
        rotate([90, 0, 0])
            linear_extrude(block_d)
                polygon([[0, 0], [fin_len, tier_h], [0, tier_h]]);
}

module tier(temp) {
    difference() {
        union() {
            cube([block_w, block_d, tier_h]);
            fin();
        }
        // bridge opening runs through the full depth
        translate([(block_w - bridge_gap) / 2, -1, -0.01])
            cube([bridge_gap, block_d + 2, bridge_h]);
        // engraved temperature on the front face (y = 0)
        translate([block_w / 2, engrave, tier_h / 2 + bridge_h / 2])
            rotate([90, 0, 0])
                linear_extrude(engrave + 0.01)
                    text(str(temp), size = text_size, halign = "center", valign = "center");
    }
}

// base plate
cube([block_w + fin_len, block_d, base_h]);

for (i = [0 : tiers - 1])
    translate([0, 0, base_h + i * tier_h])
        tier(start_temp - i * step);
