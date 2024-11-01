import { sv } from "../utils/variables.js";

export function createCircleGraphics(size) {
  console.log("running createCircleGraphics");
  const pg = sv.p.createGraphics(size, size);

  pg.noStroke();
  pg.fill(0);

  pg.clear();

  pg.ellipseMode(sv.p.CENTER);
  pg.translate(size / 2, size / 2);

  const circleDiameter = size * 0.45; // Adjust the scale as needed

  pg.ellipse(-size * 0.25, -size * 0.25, circleDiameter, circleDiameter);

  return pg;
}

export function createCustomShapeGraphics(size) {
  console.log("running createCustomShapeGraphics");
  const pg = sv.p.createGraphics(size, size);

  pg.noStroke();
  pg.fill(0);

  pg.clear();

  // Compute scaling factor based on the original shape size (65.83)
  const scaleFactor = size / 65.83;

  pg.push();
  pg.translate(size / 2, size / 2);
  pg.scale(scaleFactor);
  pg.translate(-65.83 / 2, -65.83 / 2);

  let r = (51.11 - 14.71) / 2; // Radius of the half circles
  let h = (4 * r) / 3; // Control point offset for a perfect half circle

  pg.beginShape();

  // Right side half circle
  pg.vertex(65.83, 51.11);
  pg.bezierVertex(65.83 - h, 51.11, 65.83 - h, 14.71, 65.83, 14.71);

  // Top edge
  pg.vertex(65.83, 0);
  pg.vertex(0, 0);

  // Left side half circle
  pg.vertex(0, 14.71);
  pg.bezierVertex(0 + h, 14.71, 0 + h, 51.11, 0, 51.11);

  // Bottom edge
  pg.vertex(0, 65.83);
  pg.vertex(65.83, 65.83);

  // Closing the shape
  pg.vertex(65.83, 51.11);
  pg.endShape(sv.p.CLOSE);

  pg.pop();

  return pg;
}
