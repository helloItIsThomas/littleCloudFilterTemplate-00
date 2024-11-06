import { sv } from "../utils/variables.js";
import { calculateAverageBrightnessP5 } from "../utils/calculateAverageBrightnessP5.js";
import { fitImageToWindow } from "../utils/utils.js";

export function updateCellData() {
  console.log("running updateCellData");
  let _imgs = Array.isArray(sv.animUnderImgs)
    ? sv.animUnderImgs
    : [sv.animUnderImgs]; // Ensure _imgs is always an array

  const p = sv.p;
  sv.cells = []; // Clear and redefine the array

  // Preprocess images
  const processedImages = _imgs.map((img) => {
    img = fitImageToWindow(img);
    const processed = img.get();
    processed.filter(p.GRAY);
    return processed;
  });

  let gridIndex = 0;

  sv.bb = sv.p.createGraphics(sv.gridResolution, sv.gridResolution);
  sv.bb.pixelDensity(1);
  sv.bb.clear();

  for (let y = 0; y < sv.rowCount; y++) {
    for (let x = 0; x < sv.colCount; x++) {
      let xPos = x * sv.cellW;
      let yPos = y * sv.cellH;

      let brightnessValues = processedImages.map((image) => {
        let cell = image.get(xPos, yPos, sv.cellW, sv.cellH);
        return calculateAverageBrightnessP5(p, cell);
      });

      // below should be changed later to support 2 or more images
      sv.bb.set(
        x,
        y,
        sv.p.color(
          brightnessValues[0],
          brightnessValues[0],
          brightnessValues[0]
        )
      );

      // Create cell once
      sv.cells[gridIndex++] = {
        gridIndex,
        currentImgIndex: 0,
        brightness: brightnessValues,
        x: xPos,
        y: yPos,
        width: sv.cellW,
        height: sv.cellH,
      };
    }
  }
  sv.bb.updatePixels();
  sv.bb.save();
  console.log("sv.cells.length: ", sv.cells.length);

  // time to create the brightness texture here

  sv.pApp.renderer.resize(sv.gridW, sv.gridH);
}
