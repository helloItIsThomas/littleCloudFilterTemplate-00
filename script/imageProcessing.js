import { sv } from "./variables.js";

export function updateCellData() {
  let _imgs = Array.isArray(sv.animUnderImgs)
    ? sv.animUnderImgs
    : [sv.animUnderImgs]; // Ensure _imgs is always an array
  const p = sv.p;
  sv.cells = []; // Clear and redefine the array

  // Preprocess images
  const processedImages = _imgs.map((img) => {
    const processed = img.get();
    processed.filter(p.GRAY);
    return processed;
  });

  let gridIndex = 0;

  for (let y = 0; y < sv.rowCount; y++) {
    for (let x = 0; x < sv.colCount; x++) {
      let xPos = x * sv.cellW;
      let yPos = y * sv.cellH;

      let brightnessValues = processedImages.map((image) => {
        let cell = image.get(xPos, yPos, sv.cellW, sv.cellH);
        return calculateAverageBrightness(p, cell);
      });

      // Create cell once
      sv.cells[gridIndex++] = {
        gridIndex,
        currentImgIndex: 0,
        brightness: brightnessValues, // Array of brightness values for all images or single value if only one image
        x: xPos,
        y: yPos,
        width: sv.cellW,
        height: sv.cellH,
      };
    }
  }
}

function calculateAverageBrightness(p, imgSection) {
  imgSection.loadPixels();
  let sumBrightness = 0;
  for (let i = 0; i < imgSection.pixels.length; i += 4) {
    sumBrightness += imgSection.pixels[i];
  }
  let avgBrightness = sumBrightness / (imgSection.pixels.length / 4);
  return avgBrightness;
}
