import { sv } from "./variables.js";
export function getAspectRatio(img) {
  if (!img || !img.width || !img.height) {
    throw new Error("Invalid image object");
  }

  const width = img.width;
  const height = img.height;

  // Normalize the aspect ratio to always be <= 1
  // return width > height ? height / width : width / height;
  return width / height;
}

export function fitImageToWindow(img, resizeTo = "bodyRight") {
  let resizeAppToMe = document.getElementById(resizeTo);
  const resizeAppToMeWidth = resizeAppToMe.offsetWidth;
  const resizeAppToMeHeight = resizeAppToMe.offsetHeight;
  const windowWidth = resizeAppToMeWidth;
  const windowHeight = resizeAppToMeHeight;

  // Calculate aspect ratios
  const imgAspect = img.width / img.height;
  const windowAspect = windowWidth / windowHeight;

  let newWidth, newHeight;

  // Determine new dimensions while maintaining aspect ratio
  if (windowAspect > imgAspect) {
    // Fit by height
    newHeight = windowHeight;
    newWidth = windowHeight * imgAspect;
  } else {
    // Fit by width
    newWidth = windowWidth;
    newHeight = windowWidth / imgAspect;
  }

  if (sv.fitImageToWindowGraphic) {
    sv.fitImageToWindowGraphic.remove();
    sv.fitImageToWindowGraphic = undefined;
  }

  const resizedImg = sv.p.createGraphics(newWidth, newHeight);
  resizedImg.image(img, 0, 0, newWidth, newHeight);

  sv.fitImageToWindowGraphic = resizedImg;

  return resizedImg;
}

export function downloadCanvas(_canvas, name = "canvas.png") {
  const dataURL = _canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = name;
  link.click();
}
