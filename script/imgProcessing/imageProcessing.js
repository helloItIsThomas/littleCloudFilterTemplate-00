import { sv } from "../utils/variables.js";
import { fitImageToWindow } from "../utils/utils.js";
import { Still } from "./Stills.js";

export function updateCellData() {
  console.log("running updateCellData");
  let _imgs = Array.isArray(sv.animUnderImgs)
    ? sv.animUnderImgs
    : [sv.animUnderImgs]; // Ensure _imgs is always an array

  // Preprocess images
  const processedImages = _imgs.map((img) => {
    img = fitImageToWindow(img);
    const processed = img.get();
    processed.filter(sv.p.GRAY);
    return processed;
  });

  console.log(processedImages.length);

  sv.stills = [];

  sv.stills = processedImages.map((image, i) => {
    const still = new Still();
    still.processedImage = image;
    still.populateGrid(image, sv);
    still.currentImageIndex = i;
    return still;
  });

  console.log(sv.stills[0]);

  sv.pApp.renderer.resize(sv.gridW, sv.gridH);
}
