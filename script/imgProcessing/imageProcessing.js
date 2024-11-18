import { sv } from "../utils/variables.js";
import { fitImageToWindow } from "../utils/utils.js";
import { Still } from "./Stills.js";
import { shaderRendering } from "../rendering/shaderRendering.js";
import { createAllThreeGraphics } from "../rendering/createShapeGraphics.js";
import { hideLoadIcon } from "../utils/icons.js";

export async function updateCellData() {
  const promises = [];
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

  sv.stills = [];

  for (const [i, image] of processedImages.entries()) {
    const still = new Still();
    still.processedImage = image;

    promises.push(
      still.populateGridWithWorker(image).then(() => {
        still.currentImageIndex = i;
        sv.stills.push(still);
      })
    );

    // still.populateGrid(image, sv);
    // still.currentImageIndex = i;
    // sv.stills.push(still);
  }
  await Promise.all(promises).then(() => {
    createAllThreeGraphics();
    shaderRendering();
    setTimeout(() => {
      sv.workerDone = true;
      hideLoadIcon();
    }, 1000);
    sv.pApp.renderer.resize(sv.gridW, sv.gridH);
  });
}
