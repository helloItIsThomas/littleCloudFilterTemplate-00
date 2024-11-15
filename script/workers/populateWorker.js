onmessage = function (e) {
  console.log("¶ acting on initial worker.postMessage from main thread ¶");

  const { imageData, rowCount, colCount, cellW, cellH } = e.data;

  // Adjust canvas size based on the grid dimensions
  // const brightnessMap = new OffscreenCanvas(colCount, rowCount);
  const brightnessMap = new OffscreenCanvas(colCount, rowCount);
  const brightnessMapContext = brightnessMap.getContext("2d");

  const cells = [];

  for (let y = 0; y < rowCount; y++) {
    for (let x = 0; x < colCount; x++) {
      const xPos = x * cellW;
      const yPos = y * cellH;

      // Calculate average brightness directly
      const brightness = calcAverageBrightness(
        imageData,
        xPos,
        yPos,
        cellW,
        cellH
      );

      // Set the pixel color in brightnessMap
      brightnessMapContext.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      brightnessMapContext.fillRect(x, y, 1, 1);

      // Populate cell object
      cells.push({
        gridIndex: y * colCount + x,
        // brightness: brightness,
        x: xPos,
        y: yPos,
        width: cellW,
        height: cellH,
      });
    }
  }

  const brightnessTex = brightnessMap.transferToImageBitmap();

  const result = {
    cells,
    imageData,
    brightnessTex,
  };

  console.log("ª finishing stuff on worker thread ª");
  // postMessage(result);
  postMessage(result, [brightnessTex]);
};

function calcAverageBrightness(imageData, xPos, yPos, cellW, cellH) {
  const { width, height, data } = imageData;
  let totalBrightness = 0;
  let pixelCount = 0;

  // Boundary checks
  const maxX = Math.min(xPos + cellW, width);
  const maxY = Math.min(yPos + cellH, height);

  for (let row = yPos; row < maxY; row++) {
    for (let col = xPos; col < maxX; col++) {
      const index = (row * width + col) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      totalBrightness += (r + g + b) / 3;
      pixelCount++;
    }
  }

  return totalBrightness / pixelCount;
}
