import { sv } from "../utils/variables.js";
import { map2 } from "../utils/easing.js";
import { Application, Assets, Texture, Sprite } from "pixi.js";

export function redrawSlidingTiles() {
  console.log("• running redrawSlidingTiles() •");
  let debugClock = sv.p.sin(sv.p.millis() * 0.001);
  let thisClock = debugClock;

  let mouseValNorm = debugClock;

  for (let n = 0; n < sv.totalCells; n++) {
    const cell = sv.cells[n];
    sv.shapes[n].x = 10000;
    sv.shapes2[n].x = 10000;

    const noisyValue = sv.p.noise(n);

    let thisBrightness = cell.brightness[0] / 255;

    thisClock = 1.0;

    if (cell.brightness.length > 1) {
      thisBrightness = sv.p.lerp(
        cell.brightness[0] / 255,
        cell.brightness[1] / 255,
        mouseValNorm
      );
    }

    if (thisBrightness) {
      const shapeSize = sv.cellW * sv.manualScale;

      const shapes = [
        {
          graphic: sv.circles[n],
          x: sv.cellW * 0.8 * (1.0 - thisBrightness),
          y: (sv.cellH - shapeSize) / 2,
        },
        {
          graphic: sv.shapes[n],
          x: sv.cellW * 0.5 + sv.cellW * 0.5 * (1.0 - thisBrightness),
          y: (sv.cellH - shapeSize) / 2,
        },
        {
          graphic: sv.shapes2[n],
          x: -sv.cellW * 1.0 + sv.cellW * 0.5 * thisBrightness,
          y: (sv.cellH - shapeSize) / 2,
        },
      ];

      drawShapeInCell(
        sv.circles[n],
        cell.x,
        cell.y,
        shapes[0].x,
        shapes[0].y,
        shapeSize,
        shapeSize,
        cell.width,
        cell.height
      );
    }
  }
}

function drawShapeInCell(
  img,
  cellX,
  cellY,
  shapeX,
  shapeY,
  shapeWidth,
  shapeHeight,
  cellWidth,
  cellHeight
) {
  // Compute the shape's position on the canvas
  const shapeCanvasX = cellX + shapeX;
  const shapeCanvasY = cellY + shapeY;

  // Compute the overlapping area between the shape and the cell
  const overlapX = sv.p.max(cellX, shapeCanvasX);
  const overlapY = sv.p.max(cellY, shapeCanvasY);
  const overlapX2 = sv.p.min(cellX + cellWidth, shapeCanvasX + shapeWidth);
  const overlapY2 = sv.p.min(cellY + cellHeight, shapeCanvasY + shapeHeight);

  const overlapWidth = overlapX2 - overlapX;
  const overlapHeight = overlapY2 - overlapY;

  if (overlapWidth > 0 && overlapHeight > 0) {
    // Compute source rectangle in the shape image
    const srcX = overlapX - shapeCanvasX;
    const srcY = overlapY - shapeCanvasY;
    const srcWidth = overlapWidth;
    const srcHeight = overlapHeight;

    const sprite = img;
    sprite.x = overlapX;
    sprite.y = overlapY;
    sprite.width = overlapWidth;
    sprite.height = overlapHeight;
  }
}
