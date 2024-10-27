import { sv } from "./variables.js";

export function drawShapeInCell(
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

    // Draw the visible part of the shape
    sv.printBuffer.image(
      img,
      overlapX,
      overlapY, // Destination position on canvas
      overlapWidth,
      overlapHeight, // Destination size on canvas
      srcX,
      srcY, // Source position in the image
      srcWidth,
      srcHeight // Source size in the image
    );
  }
}
