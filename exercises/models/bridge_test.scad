// ---------------------------------------------------------------
// bridge_test.scad  -  bridges of increasing span
// Used in: Level 2 exercise L2-4
//
// Each bridge is a flat deck resting on two pillars.  Look at the
// underside of every deck: sagging, drooping strands or fuzz show
// where your bridging settings and cooling reach their limit.
// Units: millimeters.
// ---------------------------------------------------------------

spans      = [10, 20, 30, 40, 50];  // free span (gap between pillars)
pillar_w   = 6;                      // pillar size along X
pillar_h   = 10;                     // pillar height
deck_t     = 1.2;                    // deck thickness (3-4 layers at 0.3 mm)
depth      = 10;                     // Y size of every bridge
pitch      = 14;                     // spacing between bridges along Y
base_h     = 1.2;
margin     = 4;
text_size  = 4;
engrave    = 0.4;

max_span   = max(spans);
base_len   = max_span + 2 * pillar_w + 2 * margin + 14;  // room for the labels

// base plate
cube([base_len, len(spans) * pitch, base_h]);

for (i = [0 : len(spans) - 1]) {
    s = spans[i];
    y = i * pitch + (pitch - depth) / 2;
    x0 = margin;
    translate([0, y, base_h - 0.01]) {
        // left pillar (0.01 mm overlap into the base plate so the solids fuse)
        translate([x0, 0, 0]) cube([pillar_w, depth, pillar_h + 0.01]);
        // right pillar
        translate([x0 + pillar_w + s, 0, 0]) cube([pillar_w, depth, pillar_h + 0.01]);
        // deck
        translate([x0, 0, pillar_h]) cube([2 * pillar_w + s, depth, deck_t + 0.01]);
    }
    // label raised on the base plate to the right of the bridge
    translate([x0 + 2 * pillar_w + s + 3, i * pitch + pitch / 2, base_h - 0.01])
        linear_extrude(engrave + 0.01)
            text(str(s), size = text_size, halign = "left", valign = "center");
}
