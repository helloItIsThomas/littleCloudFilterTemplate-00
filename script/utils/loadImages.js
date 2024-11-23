import { sv } from "./variables.js";

export async function loadImagesWithP5() {
  console.log("running loadImagesWithP5");

  const loadImage = (path) => {
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

  // const sourceImgPaths = ["/assets/debug/456.png", "/assets/debug/654.png"];
  // const sourceImgPaths = ["/assets/debug/satan.png", "/assets/debug/star.png"];
  // const sourceImgPaths = ["/assets/debug/satan.png"];
  // const sourceImgPaths = ["/assets/notSquare.png"];
  const sourceImgPaths = ["/assets/studio.png"];

  await Promise.all(sourceImgPaths.map(loadImage));
}
