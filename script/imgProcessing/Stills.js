export class Still {
  constructor() {
    this.processedImage = null;
    this.currentImageIndex = 0;
    this.brightnessTex = null;
    this.cells = [];
  }
  populateGrid(image, sv, calculateAverageBrightnessP5) {
    const tempCanv = sv.p.createGraphics(sv.gridResolution, sv.gridResolution);
    tempCanv.pixelDensity(1);
    tempCanv.clear();

    for (let y = 0; y < sv.rowCount; y++) {
      for (let x = 0; x < sv.colCount; x++) {
        const xPos = x * sv.cellW;
        const yPos = y * sv.cellH;
        const cellImage = image.get(xPos, yPos, sv.cellW, sv.cellH);

        // Calculate brightness
        const brightnessValues = calculateAverageBrightnessP5(sv.p, cellImage);
        const brightness = brightnessValues[0]; // Assuming we're using the first index for brightness

        // Populate canvas with brightness value (for texture representation)
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
    this.brightnessTex = tempCanv;
  }
}
