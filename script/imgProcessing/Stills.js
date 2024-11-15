import { sv } from "../utils/variables.js";
import { calculateAverageBrightnessP5 } from "../utils/calculateAverageBrightnessP5";
import { populateGridNoWebWorker } from "./populateGridNoWebWorker.js";
import { downloadCanvas } from "../utils/utils.js";

export class Still {
  constructor() {
    this.processedImage = null;
    this.currentImageIndex = 0;
    this.brightnessTex = null;
    this.cells = [];
  }

  populateGridWithWorker(image) {
    // image here is a p5 image object.

    const originalW = image.width;
    const originalH = image.height;
    // Create a temporary canvas to make sure the image is in native format.
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = originalW;
    tempCanvas.height = originalH;
    const tempContext = tempCanvas.getContext("2d");
    tempContext.drawImage(image.canvas, 0, 0, originalW, originalH);

    downloadCanvas(tempCanvas, "beforeWorker");

    return new Promise((resolve, reject) => {
      const worker = new Worker(
        new URL("/script/workers/populateWorker.js", import.meta.url),
        { type: "module" }
      );

      const imageData = tempContext.getImageData(0, 0, originalW, originalH);

      const rowCount = sv.rowCount;
      const colCount = sv.colCount;
      const cellW = originalW / colCount; //sv.cellW;
      const cellH = originalH / rowCount; //sv.cellH;

      worker.postMessage({ imageData, rowCount, colCount, cellW, cellH });

      worker.onmessage = (e) => {
        console.log(
          "¶ acting on response from worker's internal postMessage ¶"
        );
        const result = e.data;

        if (result.brightnessTex) {
          const canvas = document.createElement("canvas");
          canvas.width = result.brightnessTex.width;
          canvas.height = result.brightnessTex.height;
          canvas.width = originalW;
          canvas.height = originalH;
          const ctx = canvas.getContext("2d");
          // ctx.drawImage(result.brightnessTex, 0, 0);
          ctx.putImageData(imageData, 0, 0);

          downloadCanvas(canvas, "afterWorker");

          this.brightnessTex = canvas;
          this.cells = result.cells;
          resolve();
        } else {
          console.error("Failed to receive brightness texture from worker.");
        }
      };
      worker.onerror = (e) => {
        reject();
        console.error("Worker error:", e.message, e);
      };
    });
  }

  populateGrid(image) {
    console.log("˘˛¯Â·%^ RUNNING OLD WAY ﬁﬂ");
    populateGridNoWebWorker(this, image);
  }
}
