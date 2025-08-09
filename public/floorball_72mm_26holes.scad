
// Floorball-style ball (parameterized)
// Units: millimeters
sphere_d = 72;          // outer diameter of the ball
thickness = 1.2;        // shell thickness (tweak for your printer)
hole_d = 10;            // hole diameter
n_holes = 26;           // number of holes (standard: 26)
hole_clearance = 0.2;   // slight oversize so holes print cleanly

R = sphere_d/2;

$fn = 160;              // mesh resolution (increase for smoother surface)

module hole_at(lat, lon) {
    // Places a through-hole (cylinder) oriented by latitude/longitude
    // Cylinder is centered and long enough to cut through the shell.
    rotate([ -lat, lon, 0 ])  // -lat because OpenSCAD's rotate X is opposite of latitude sign
        translate([0, 0, R])
            cylinder(h = 2*R + 2, d = hole_d + hole_clearance, center = true);
}

module shell() {
    // Thin spherical shell
    difference() {
        sphere(d = sphere_d);
        sphere(d = sphere_d - 2*thickness);
    }
}

golden_angle = 180 * (3 - sqrt(5));  // ~137.50776 deg

module holes() {
    // Evenly distribute hole centers using a Fibonacci sphere
    for (i = [0 : n_holes - 1]) {
        ay = 1 - (i/(n_holes - 1)) * 2;    // y from +1 to -1
        ar = sqrt(max(0, 1 - ay*ay));      // projected radius
        theta = golden_angle * i;

        x = cos(theta) * ar;
        z = sin(theta) * ar;
        y = ay;

        lat = asin(y) * 180 / PI;          // latitude in degrees
        lon = atan2(x, z) * 180 / PI;      // longitude in degrees (note: x,z order to align Z as "north")

        hole_at(lat, lon);
    }
}

difference() {
    shell();
    holes();
}
