import { sv } from "../utils/variables.js";
import { calculateAverageBrightnessP5 } from "../utils/calculateAverageBrightnessP5";

export function populateGridNoWebWorker(thisStill, image) {
  // console.log("•• • RUN POPULATE GRID • ••");
  const tempCanv = sv.p.createGraphics(sv.gridResolution, sv.gridResolution);
  tempCanv.pixelDensity(1);
  tempCanv.clear();

  for (let y = 0; y < sv.rowCount; y++) {
    for (let x = 0; x < sv.colCount; x++) {
      const xPos = x * sv.cellW;
      const yPos = y * sv.cellH;
      const cellImage = image.get(xPos, yPos, sv.cellW, sv.cellH);

      const aveBrightnessOfCell = calculateAverageBrightnessP5(sv.p, cellImage);
      const brightness = aveBrightnessOfCell;

      tempCanv.set(x, y, sv.p.color(brightness, brightness, brightness));

      // Populate cells
      thisStill.cells.push({
        gridIndex: y * sv.colCount + x,
        x: xPos,
        y: yPos,
        width: sv.cellW,
        height: sv.cellH,
      });
    }
  }
  tempCanv.updatePixels();
  //   tempCanv.save();
  const returnCanv = tempCanv.canvas;
  //   console.log(returnCanv);
  thisStill.brightnessTex = returnCanv;
}
