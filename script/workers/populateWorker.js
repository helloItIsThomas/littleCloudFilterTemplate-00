// TOP

// populateGridWorker.js
onmessage = function (e) {
  const { imageData, sv } = e.data;
  // Perform intensive work here

  const tempCanv = sv.p.createGraphics(sv.gridResolution, sv.gridResolution);
  tempCanv.pixelDensity(1);
  tempCanv.clear();

  for (let y = 0; y < sv.rowCount; y++) {
    for (let x = 0; x < sv.colCount; x++) {
      const xPos = x * sv.cellW;
      const yPos = y * sv.cellH;
      const cellImage = imageData.get(xPos, yPos, sv.cellW, sv.cellH);

      const aveBrightnessOfCell = calculateAverageBrightnessP5(sv.p, cellImage);
      const brightness = aveBrightnessOfCell;

      tempCanv.set(x, y, sv.p.color(brightness, brightness, brightness));

      // Populate cells
      this.cells.push({
        gridIndex: y * sv.colCount + x,
        brightness: brightness,
        x: xPos,
        y: yPos,
        width: sv.cellW,
        height: sv.cellH,
      });
    }
  }
  tempCanv.updatePixels();
  console.log("done populating grid");
  this.brightnessTex = tempCanv;

  const result = populateGridWork(imageData, sv);
  postMessage(result); // Send back the result to main thread
};
