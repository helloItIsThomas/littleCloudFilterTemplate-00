import { sv } from "./variables.js";

export function scaleDims(_img) {
  console.log("• running scaleDims •");
  const maxRes = 1000;
  const maxPixels = maxRes * maxRes;
  const width = _img.width;
  const height = _img.height;
  const currentPixels = width * height;

  if (currentPixels <= maxPixels) {
    // No need to scale
    return;
  }

  // Calculate scaling factor to maintain aspect ratio
  const scalingFactor = Math.sqrt(maxPixels / currentPixels);
  const newWidth = Math.floor(width * scalingFactor);
  const newHeight = Math.floor(height * scalingFactor);

  // Resize the image with the new dimensions
  _img.resize(newWidth, newHeight);
  return _img;
}

export function fitImageToWindow(img) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

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

  // Create a new p5.Graphics canvas to resize the image
  const resizedImg = sv.p.createGraphics(newWidth, newHeight);
  resizedImg.image(img, 0, 0, newWidth, newHeight);

  return resizedImg;
}
