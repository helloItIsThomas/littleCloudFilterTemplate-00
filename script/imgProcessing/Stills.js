import { sv } from "../utils/variables.js";
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

  populateGridWithWorker(image) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL("/script/workers/populateWorker.js", import.meta.url),
        { type: "module" }
      );

      const tempContext = image.canvas.getContext("2d");
      const imageData = tempContext.getImageData(
        0,
        0,
        image.width,
        image.height
      );

      const rowCount = sv.rowCount;
      const colCount = sv.colCount;
      const cellW = sv.cellW;
      const cellH = sv.cellH;

      worker.postMessage({ imageData, rowCount, colCount, cellW, cellH });

      worker.onmessage = (e) => {
        const result = e.data;
        // Create a canvas element
        const canvas = document.createElement("canvas");
        canvas.width = result.brightnessTex.width;
        canvas.height = result.brightnessTex.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(result.brightnessTex, 0, 0);

        this.brightnessTex = canvas;
        this.cells = result.cells;
        this.cells.forEach((e) => {
          // e.brightness = 10;
          // console.log(e.brightness);
        });
        resolve();
      };
      worker.onerror = (e) => console.error("Worker error:", e.message, e);
    });
  }

  populateGrid(image, sv) {
    console.log("•• • RUN POPULATE GRID • ••");
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
    this.brightnessTex = tempCanv;
  }
}
