import { calculateAverageBrightnessP5 } from "../utils/calculateAverageBrightnessP5";

export class Still {
  constructor() {
    this.processedImage = null;
    this.currentImageIndex = 0;
    this.brightnessTex = null;
    this.cells = [];
  }

  // populateGrid does the following:
  // create a canvas
  // gets brightness values
  // stores them in the canvas
  // populates its cell array,
  //    including with brightness values

  // i want to pre-calculate one or more things,
  // so that we don't have to run this x y loop on start.
  //

  async populateGrid(image, sv) {
    const tempCanv = sv.p.createGraphics(sv.gridResolution, sv.gridResolution);
    tempCanv.pixelDensity(1);
    tempCanv.clear();

    for (let y = 0; y < sv.rowCount; y++) {
      for (let x = 0; x < sv.colCount; x++) {
        const xPos = x * sv.cellW;
        const yPos = y * sv.cellH;
        const cellImage = image.get(xPos, yPos, sv.cellW, sv.cellH);

        const aveBrightnessOfCell = calculateAverageBrightnessP5(
          sv.p,
          cellImage
        );
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
  }
}
