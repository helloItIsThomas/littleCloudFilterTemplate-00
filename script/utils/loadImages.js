import { updateActiveImgBar } from "./eventHandlers.js";
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

  const loadASetupIcon = (path) => {
    sv.singleImgIcons = [];

    return new Promise((resolve, reject) => {
      sv.p.loadImage(
        path,
        (img) => {
          sv.singleImgIcons.push(img);
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

  // const sourceImgPaths = ["/assets/debug/456.png", "/assets/debug/654.png"];
  // const sourceImgPaths = ["/assets/debug/satan.png", "/assets/debug/star.png"];
  // const sourceImgPaths = ["/assets/debug/satan.png", "/assets/studio.png"];
  const sourceImgPaths = ["/assets/debug/satan.png"];
  // const sourceImgPaths = ["/assets/notSquare.png"];
  // const sourceImgPaths = ["/assets/studio.png"];

  sv.totalUploadNum = sourceImgPaths.length;

  await Promise.all(sourceImgPaths.map(loadASetupImage));
  await Promise.all(singleImgIconPaths.map(loadASetupIcon));

  updateActiveImgBar();
}
