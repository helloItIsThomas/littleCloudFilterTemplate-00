import { updateActiveImgBar } from "./eventHandlers.js";
import { downloadCanvas } from "./utils.js";
import { sv } from "./variables.js";

export async function loadSetupImages() {
  const loadASetupImage = (path) => {
    sv.animUnderImgs = [];

    return new Promise((resolve, reject) => {
      sv.p.loadImage(
        path,
        (img) => {
          sv.animUnderImgs.push(img);
          resolve(img);
        },
        (err) => {
          console.log("Error: " + err);
          reject(err);
        }
      );
    });
  };

  const loadASetupIcon = (path, index) => {
    sv.singleImgIcons = new Array(singleImgIconPaths.length);

    return new Promise((resolve, reject) => {
      sv.p.loadImage(
        path,
        (img) => {
          sv.singleImgIcons[index] = img; // Assign image to the correct index
          resolve(img);
        },
        (err) => {
          console.log("Error: " + err);
          reject(err);
        }
      );
    });
  };

  const singleImgIconPaths = Array.from(
    { length: 20 },
    (_, i) => `/assets/brightnessSortedPNG/${i}.png`
  );

  // const sourceImgPaths = ["/assets/debug/satan.png", "/assets/studio.png"];
  const sourceImgPaths = ["/assets/debug/satan.png", "/assets/img.jpg"];
  // const sourceImgPaths = ["/assets/grad.png"];
  // const sourceImgPaths = ["/assets/debug/satan.png"];
  // const sourceImgPaths = ["/assets/studio.png"];

  sv.totalUploadNum = sourceImgPaths.length;

  await Promise.all(sourceImgPaths.map(loadASetupImage));
  // await Promise.all(singleImgIconPaths.map(loadASetupIcon));
  await Promise.all(
    singleImgIconPaths.map((path, index) => loadASetupIcon(path, index))
  );

  updateActiveImgBar();
}
