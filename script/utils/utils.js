import { sv } from "./variables.js";

export function scaleDims(_img) {
  // console.log("• running scaleDims •");
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

export function fitImageToWindow(img) {
  const windowWidth = sv.bodyRightDivWidth;
  const windowHeight = sv.bodyRightDivHeight;

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

export function updateClock(time, pauseDuration) {
  const cycleDuration = 2 + pauseDuration * 2; // Full cycle duration with pauses
  const cycleTime = time % cycleDuration;

  if (cycleTime < 1) {
    // Move from 0.0 to 1.0 over 1 second
    return cycleTime;
  } else if (cycleTime < 1 + pauseDuration) {
    // Pause at 1.0
    return 1.0;
  } else if (cycleTime < 2 + pauseDuration) {
    // Move from 1.0 back to 0.0 over 1 second
    return 2 + pauseDuration - cycleTime;
  } else {
    // Pause at 0.0
    return 0.0;
  }
}
function easeInOut(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

export function updateClockEase(time, pauseDuration) {
  const cycleDuration = 2 + pauseDuration * 2; // Full cycle duration with pauses
  const cycleTime = time % cycleDuration;

  if (cycleTime < 1) {
    // Move from 0.0 to 1.0 over 1 second with ease-in-out
    return easeInOut(cycleTime);
  } else if (cycleTime < 1 + pauseDuration) {
    // Pause at 1.0
    return 1.0;
  } else if (cycleTime < 2 + pauseDuration) {
    // Move from 1.0 back to 0.0 over 1 second with ease-in-out
    return easeInOut(1 - (cycleTime - (1 + pauseDuration)));
  } else {
    // Pause at 0.0
    return 0.0;
  }
}

export function downloadCanvas(_canvas, name = "canvas.png") {
  const dataURL = _canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
