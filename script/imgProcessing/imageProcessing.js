import { sv } from "../utils/variables.js";
import { calculateAverageBrightnessP5 } from "../utils/calculateAverageBrightnessP5.js";
import { fitImageToWindow } from "../utils/utils.js";
import { Still } from "./Stills.js";

export function updateCellData() {
  console.log("running updateCellData");
  let _imgs = Array.isArray(sv.animUnderImgs)
    ? sv.animUnderImgs
    : [sv.animUnderImgs]; // Ensure _imgs is always an array

  const p = sv.p;

  // Preprocess images
  const processedImages = _imgs.map((img) => {
    img = fitImageToWindow(img);
    const processed = img.get();
    processed.filter(p.GRAY);
    return processed;
  });

  sv.stills = [];

  sv.stills = processedImages.map((image, i) => {
    const still = new Still();
    still.processedImage = image;
    still.populateGrid(image, sv, calculateAverageBrightnessP5);
    still.currentImageIndex = i;
    return still;
  });
  // Create cell once
  // sv.cells[gridIndex++] = {
  // gridIndex,
  // currentImgIndex: 0,
  // brightness: brightnessValues,
  // x: xPos,
  // y: yPos,
  // width: sv.cellW,
  // height: sv.cellH,
  // };
  // sv.bb.updatePixels();

  sv.pApp.renderer.resize(sv.gridW, sv.gridH);
}
