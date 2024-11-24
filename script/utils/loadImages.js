import { sv } from "./variables.js";
export async function loadImagesWithP5() {
  console.log("running loadImagesWithP5");

  const loadImage = (path) => {
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

  const loadIcon = (path) => {
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
    // (_, i) => `/assets/brightnessSortedPNG/${i}.png`
    (_, i) => `/assets/brightnessSortedPNG/${i}.png`
  );

  // const sourceImgPaths = ["/assets/debug/456.png", "/assets/debug/654.png"];
  // const sourceImgPaths = ["/assets/debug/satan.png", "/assets/debug/star.png"];
  const sourceImgPaths = ["/assets/debug/satan.png", "/assets/debug/satan.png"];
  // const sourceImgPaths = ["/assets/debug/satan.png"];
  // const sourceImgPaths = ["/assets/notSquare.png"];
  // const sourceImgPaths = ["/assets/studio.png"];

  if (sourceImgPaths.length > 1) {
    sv.currentlyMoreThanOneImage = true;
    sv.advanced.show();
  } else {
    sv.currentlyMoreThanOneImage = false;
    sv.advanced.hide();
  }

  await Promise.all(sourceImgPaths.map(loadImage));
  await Promise.all(singleImgIconPaths.map(loadIcon));
}
