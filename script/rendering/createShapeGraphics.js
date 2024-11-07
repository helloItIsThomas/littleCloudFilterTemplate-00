import { sv } from "../utils/variables.js";

export function createAllThreeGraphics() {
  if (sv.circleGraphicLeft) sv.circleGraphicLeft.remove();
  if (sv.circleGraphicRight) sv.circleGraphicRight.remove();
  if (sv.customShapeGraphics) sv.customShapeGraphics.remove();
  sv.circleGraphicLeft = createLeftCircle(sv.cellW);
  sv.circleGraphicRight = createRightCircle(sv.cellW);
  sv.customShapeGraphics = createShapeGraphic(sv.cellW / 2);
}

export function createLeftCircle(size) {
  console.log("running createLeftCircle");
  const w = size * 2;
  const h = size;
  const pg = sv.p.createGraphics(w, h);
  pg.pixelDensity(3);
  pg.noStroke();
  pg.fill(0);
  pg.background(0, 255, 0);
  pg.clear();
  pg.ellipseMode(sv.p.CENTER);
  const circleDiameter = h * 0.4; // Adjust the scale as needed
  pg.translate(circleDiameter * 0.5, h / 2);
  pg.ellipse(0.0, 0.0, circleDiameter, circleDiameter);
  return pg;
}

export function createRightCircle(size) {
  console.log("running createRightCircle");
  const w = size * 2;
  const h = size;
  const pg = sv.p.createGraphics(w, h);
  pg.pixelDensity(3);
  pg.noStroke();
  pg.fill(0);
  pg.background(0, 255, 0);
  pg.clear();
  pg.ellipseMode(sv.p.CENTER);
  const circleDiameter = h * 0.4; // Adjust the scale as needed
  pg.translate(w - circleDiameter * 0.5, h / 2);
  pg.ellipse(0.0, 0.0, circleDiameter, circleDiameter);
  return pg;
}

export function createShapeGraphic(size) {
  console.log("running createCustomShapeGraphics");
  const width = size * 2;
  const height = size;
  const pg = sv.p.createGraphics(width, height);
  pg.pixelDensity(3);

  pg.noStroke();
  pg.fill(0);
  // pg.noFill();
  // pg.stroke(0, 0, 255);

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
