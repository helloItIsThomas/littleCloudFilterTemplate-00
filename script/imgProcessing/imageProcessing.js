import { sv } from "../utils/variables.js";
import { Still } from "./Stills.js";
import { shaderRendering } from "../rendering/shaderRendering.js";
import {
  createGraphicsForSingleImage,
  createGraphicsForMultipleImages,
} from "../rendering/createShapeGraphics.js";
import { hideLoadIcon } from "../utils/icons.js";
import { downloadCanvas } from "../utils/utils.js";

export async function updateCellData(_processedImgs) {
  sv.stills = [];
  const promises = [];

  for (const [i, image] of _processedImgs.entries()) {
    const still = new Still();
    still.processedImage = image;

    promises.push(
      still.populateGridWithWorker(image).then(() => {
        still.currentImageIndex = i;
        sv.stills.push(still);
      })
    );
  }

  await Promise.all(promises).then(async () => {
    console.log("checking oneActiveImage state: ", sv.oneActiveImage);
    if (sv.oneActiveImage === true) {
      sv.iconAtlas = createGraphicsForSingleImage();
      downloadCanvas(sv.iconAtlas.canvas, "singleImgIconAtlas.png");
    } else if (sv.oneActiveImage === false) createGraphicsForMultipleImages();
    else throw new Error("No valid images loaded");

    await shaderRendering();

    sv.workerDone = true;
    hideLoadIcon();

    console.log("workerDone: ", sv.workerDone);

    // setTimeout(() => {
    // sv.workerDone = true;
    // hideLoadIcon();
    // console.log("workerDone: ", sv.workerDone);
    // }, 1000);
  });
}
