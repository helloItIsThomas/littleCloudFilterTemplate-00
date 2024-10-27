import { sv } from "./variables.js";
import { map2 } from "./easing.js";
import { drawShapeInCell } from "./drawShapeInCell.js";

export function redrawSlidingTiles() {
  for (let n = 0; n < sv.totalCells; n++) {
    const cell = sv.cells[n];

    const noisyValue = sv.p.noise(n);

    const thisClock = map2(
      sv.p.sin(noisyValue * sv.noiseOffset + sv.p.frameCount * sv.speed * 2),
      -1.0,
      1,
      0,
      1,
      4,
      2
    );

    let thisBrightness = cell.brightness[0] / 255;

    if (cell.brightness.length > 1) {
      thisBrightness = sv.p.lerp(
        cell.brightness[0] / 255,
        cell.brightness[1] / 255,
        thisClock
      );
    }

    thisBrightness = sv.p.map(thisBrightness, 0, 1, -1, 1);

    if (thisBrightness) {
      webEditorDrawing(cell, n, thisBrightness);
    }
  }
}

function webEditorDrawing(_cell, n, _thisBrightness) {
  const time = _thisBrightness;
  const shapeSize = sv.cellW * sv.manualScale;

  const newClock = sv.p.constrain(map2(sv.p.sin(time), 0, 1, 0, 1, 2, 2), 0, 1);
  const newClock2 = sv.p.constrain(
    map2(sv.p.sin(time), -1, 0.5, 0, 1, 2, 2),
    0,
    1
  );

  const cellX = _cell.x;
  const cellY = _cell.y;

  // Hourglass 1 shape movement
  const shape1X = sv.cellW * 0.5 + sv.cellW * 0.5 * (1.0 - newClock);
  const shape1Y = (sv.cellH - shapeSize) / 2;

  // Circle shape movement
  const shape2X = sv.cellW * 0.8 * (1.0 - newClock2);
  const shape2Y = (sv.cellH - shapeSize) / 2;

  // Hourglass 2 shape movement
  const shape3X = -sv.cellW * 1.0 + sv.cellW * 0.5 * newClock;
  const shape3Y = (sv.cellH - shapeSize) / 2;

  // Draw the hourglass shape
  drawShapeInCell(
    sv.customShapeGraphics,
    cellX,
    cellY,
    shape1X,
    shape1Y,
    shapeSize,
    shapeSize,
    sv.cellW,
    sv.cellH
  );
  drawShapeInCell(
    sv.customShapeGraphics,
    cellX,
    cellY,
    shape3X,
    shape3Y,
    shapeSize,
    shapeSize,
    sv.cellW,
    sv.cellH
  );

  // Draw the circle shape
  drawShapeInCell(
    sv.circleGraphics,
    cellX,
    cellY,
    shape2X,
    shape2Y,
    shapeSize,
    shapeSize,
    sv.cellW,
    sv.cellH
  );
}
