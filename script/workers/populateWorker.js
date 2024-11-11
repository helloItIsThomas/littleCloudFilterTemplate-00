// populateGridWorker.js
onmessage = function (e) {
  const { imageData, rowCount, colCount, cellW, cellH } = e.data;

  // Adjust canvas size based on the grid dimensions
  const tempCanv = new OffscreenCanvas(colCount, rowCount);
  const tempCanvContext = tempCanv.getContext("2d");

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

      // Set the pixel color in tempCanv
      tempCanvContext.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      tempCanvContext.fillRect(x, y, 1, 1);

      // Populate cell object
      cells.push({
        gridIndex: y * colCount + x,
        brightness: brightness,
        x: xPos,
        y: yPos,
        width: cellW,
        height: cellH,
      });
    }
  }

  const result = {
    cells,
    brightnessTex: tempCanv.transferToImageBitmap(),
  };

  postMessage(result);
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
