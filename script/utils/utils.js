export function scaleDims(_img) {
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
