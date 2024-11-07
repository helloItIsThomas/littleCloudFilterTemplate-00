import { sv } from "../utils/variables.js";

const cDiamMult = 0.5;

export function createAllThreeGraphics() {
  if (sv.circleGraphicLeft) sv.circleGraphicLeft.remove();
  if (sv.circleGraphicRight) sv.circleGraphicRight.remove();
  if (sv.customShapeGraphics) sv.customShapeGraphics.remove();
  sv.circleGraphicLeft = createLeftCircle(sv.cellW);
  sv.circleGraphicRight = createRightCircle(sv.cellW);
  sv.customShapeGraphics = createShapeGraphic(sv.cellW / 2);
  // sv.circleGraphicLeft.save();
  // sv.circleGraphicRight.save();
}

export function createLeftCircle(size) {
  console.log("running createLeftCircle");
  const w = size * 2;
  const h = size;
  const pg = sv.p.createGraphics(w, h);
  pg.pixelDensity(3);
  pg.noStroke();
  pg.fill(0);
  pg.strokeWeight(2);
  pg.stroke(0, 255, 0);
  pg.background(0, 255, 0);
  pg.clear();
  pg.ellipseMode(sv.p.CENTER);
  const circleDiameter = h * cDiamMult;
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
  pg.strokeWeight(2);
  pg.stroke(0, 255, 0);
  pg.background(0, 255, 0);
  pg.clear();
  pg.ellipseMode(sv.p.CENTER);
  const circleDiameter = h * cDiamMult; // Adjust the scale as needed
  pg.translate(w * 0.5 - circleDiameter * 0.5, h / 2);
  pg.ellipse(0.0, 0.0, circleDiameter, circleDiameter);
  return pg;
}

export function createShapeGraphic(size) {
  console.log("running createCustomShapeGraphics");
  const width = size * 2;
  const height = size;
  const pg = sv.p.createGraphics(width, height);
  const cDiameter = height * cDiamMult;
  pg.pixelDensity(3);
  pg.fill(0);
  pg.noStroke();

  const borderOff = 1;
  // Draw quad
  pg.beginShape();
  pg.vertex(borderOff, borderOff * 2);
  pg.vertex(width * 0.5 - borderOff * 0.5, borderOff * 2);
  pg.vertex(width * 0.5 - borderOff * 0.5, height - borderOff * 0.5);
  pg.vertex(borderOff, height - borderOff * 0.5);
  pg.endShape(sv.p.CLOSE);

  // Draw two circular cutouts
  pg.erase();
  pg.circle(0.0, height * 0.5, cDiameter); // Left circle
  pg.circle(width * 0.5, height * 0.5, cDiameter); // Right circle
  pg.noErase();
  pg.noFill();
  // pg.stroke(0);
  // pg.circle(width * 0.5, height * 0.5, cDiameter); // Right circle
  // pg.circle(0.0, height * 0.5, cDiameter); // Left circle

  return pg;
}
