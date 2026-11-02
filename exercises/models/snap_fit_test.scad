// ---------------------------------------------------------------
// snap_fit_test.scad  -  cantilever snap-fit clip and matching slot
// Used in: Level 3 exercise L3-5 (strain calculation), Level 2 exercise L2-14
//
// part = "clip"   : base block with a cantilever beam and a hook
// part = "socket" : plate with a rectangular slot the hook snaps through
// part = "both"   : both parts side by side
//
// Strain at the root of a rectangular cantilever deflected by h:
//     strain = 1.5 * h * t / L^2
// The script prints it with echo().  Keep it below the material's
// permissible strain (rough guide: PLA ~1.5 %, PETG ~3 %, nylon ~4 %+;
// always test, layer lines weaken the beam if they run across it).
// Orient the clip so layer lines run ALONG the beam (print the clip
// lying on its side, beam flat on the plate).
// Units: millimeters.
// ---------------------------------------------------------------

part       = "both";   // "clip", "socket" or "both"
beam_t     = 1.6;      // beam thickness in the bending direction (X)
beam_w     = 6;        // beam width (Y)
beam_l     = 14;       // free beam length (Z), from base to tip
hook_h     = 1.0;      // hook protrusion = beam deflection while snapping
hook_ramp  = 3;        // length of the lead-in ramp
hook_lip   = 0.8;      // thickness of the flat retaining face
base_t     = 3;        // thickness of the clip's base block
base_w     = 14;       // X size of the base block
clearance  = 0.25;     // gap around the beam in the slot
$fn        = 32;

// where the hook's retaining face sits above the base
catch_z   = beam_l - hook_ramp - hook_lip;
plate_t   = catch_z - 0.4;               // socket plate leaves a 0.4 mm play along Z
slot_x    = beam_t + hook_h + clearance; // room for the beam to bend inward
slot_y    = beam_w + 2 * clearance;

echo(str("Root strain = ", 150 * hook_h * beam_t / (beam_l * beam_l), " %"));

module clip() {
    // base block
    translate([-base_w / 2, 0, 0]) cube([base_w, beam_w, base_t]);
    // beam and hook, profile in X-Z extruded along Y
    translate([0, beam_w, base_t - 0.01])
        rotate([90, 0, 0])
            linear_extrude(beam_w)
                union() {
                    translate([-beam_t / 2, 0]) square([beam_t, beam_l]);
                    polygon([
                        [ beam_t / 2 - 0.01, beam_l],
                        [ beam_t / 2 + hook_h, beam_l - hook_ramp],
                        [ beam_t / 2 + hook_h, beam_l - hook_ramp - hook_lip],
                        [ beam_t / 2 - 0.01, beam_l - hook_ramp - hook_lip]
                    ]);
                }
}

module socket() {
    sw = slot_x + 14;       // plate width in X
    sl = slot_y + 10;       // plate length in Y
    difference() {
        cube([sw, sl, plate_t]);
        // slot: beam sits against its +X wall, free space on the -X side
        translate([(sw - slot_x) / 2, (sl - slot_y) / 2, -0.1])
            cube([slot_x, slot_y, plate_t + 0.2]);
    }
}

if (part == "clip" || part == "both") clip();
if (part == "socket") socket();
if (part == "both") translate([base_w, 0, 0]) socket();
