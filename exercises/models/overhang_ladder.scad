// ---------------------------------------------------------------
// overhang_ladder.scad  -  overhang angles from 30 to 80 degrees
// Used in: Level 2 exercise L2-5
//
// A spine carries solid wedges whose undersides lean away from vertical
// by 30, 40, ... 80 degrees (0 = vertical wall, 90 = flat ceiling).
// Print WITHOUT supports and note the first angle where the underside
// becomes rough, droopy or fails.  That is your practical overhang limit.
// Units: millimeters.
// ---------------------------------------------------------------

angles    = [30, 40, 50, 60, 70, 80];  // angle of the underside from vertical
slope_len = 14;                        // length of the sloped underside
wedge_w   = 10;                        // wedge width (Y)
pitch     = 14;                        // spacing between wedges
spine_w   = 4;                         // spine thickness (X)
spine_h   = 16;                        // spine height
base_h    = 1.2;
text_size = 4;
engrave   = 0.4;

n        = len(angles);
base_len = spine_w + slope_len + 16;   // room for the labels on the right

// base plate
cube([base_len, n * pitch, base_h]);

// spine
translate([0, 0, base_h]) cube([spine_w, n * pitch, spine_h]);

for (i = [0 : n - 1]) {
    a = angles[i];
    y = i * pitch + (pitch - wedge_w) / 2;
    dx = slope_len * sin(a);   // horizontal reach of the underside
    dz = slope_len * cos(a);   // vertical rise of the underside
    // wedge profile in the X-Z plane, extruded along Y
    translate([spine_w - 0.01, y + wedge_w, base_h])
        rotate([90, 0, 0])
            linear_extrude(wedge_w)
                polygon([[0, 0], [dx, dz], [0, dz]]);
    // angle label on the base plate
    translate([spine_w + slope_len + 3, i * pitch + pitch / 2, base_h])
        linear_extrude(engrave)
            text(str(a), size = text_size, halign = "left", valign = "center");
}
