import { sv } from "../utils/variables.js";

const cDiamMult = 0.5;
const scaleAmount = 0.9;

export function createAllThreeGraphics() {
  if (sv.circleGraphicLeft) sv.circleGraphicLeft.remove();
  if (sv.circleGraphicRight) sv.circleGraphicRight.remove();
  if (sv.customShapeGraphics) sv.customShapeGraphics.remove();
  sv.circleGraphicLeft = createLeftCircle(sv.cellW);
  sv.circleGraphicRight = createRightCircle(sv.cellW);
  sv.customShapeGraphics = createShapeGraphic(sv.cellW);
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
  // pg.stroke(255, 0, 0);
  pg.background(0, 255, 0);
  pg.clear();
  pg.ellipseMode(sv.p.CENTER);
  const circleDiameter = h * cDiamMult;
  pg.push();
  pg.translate(0.0, h * 0.5 - circleDiameter * scaleAmount);
  pg.scale(scaleAmount); // Scale down all elements
  pg.translate(circleDiameter * 0.5, h / 2);
  pg.ellipse(0.0, 0.0, circleDiameter, circleDiameter);
  pg.pop();
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
  // pg.stroke(255, 0, 0);
  pg.background(0, 255, 0);
  pg.clear();
  pg.ellipseMode(sv.p.CENTER);
  const circleDiameter = h * cDiamMult; // Adjust the scale as needed

  pg.push();
  pg.translate(0.0, h * 0.5 - circleDiameter * scaleAmount);
  pg.scale(scaleAmount); // Scale down all elements
  pg.translate(w * 0.5 - circleDiameter * 0.5, h / 2);
  pg.ellipse(0.0, 0.0, circleDiameter, circleDiameter);
  pg.pop();
  return pg;
}

export function createShapeGraphic(size) {
  // const scaleAmount = 0.95;
  console.log("running createShapeGraphic");

  // Define quad dimensions
  const width = size * 2;
  const height = size;
  const pg = sv.p.createGraphics(width, height);
  // const cDiameter = height * cDiamMult * scaleAmount;
  const cDiameter = height * cDiamMult;
  pg.pixelDensity(3);
  pg.fill(0);
  pg.noStroke();

  const borderOffset = 0.0;

  pg.push();
  pg.translate(0.0, height * 0.5 - cDiameter * scaleAmount);
  pg.scale(scaleAmount); // Scale down all elements
  // Draw quad with padding
  pg.beginShape();
  pg.vertex(borderOffset, borderOffset);
  pg.vertex(width * 0.5 - borderOffset, borderOffset);
  pg.vertex(width * 0.5 - borderOffset, height - borderOffset);
  pg.vertex(borderOffset, height - borderOffset);
  pg.endShape(sv.p.CLOSE);

  // Draw two circular cutouts, centered vertically with padding adjustments
  pg.erase();
  pg.circle(borderOffset, height * 0.5, cDiameter - 2 * borderOffset); // Left circle
  pg.circle(
    width * 0.5 - borderOffset,
    height * 0.5,
    cDiameter - 2 * borderOffset
  ); // Right circle
  pg.noErase();
  pg.pop();

  return pg;
}
