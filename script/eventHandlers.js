import { sv } from "./variables.js";
import { updateCellData } from "./imageProcessing.js";
import { scaleToPreview } from "./draw.js";
import { Recorder } from "canvas-record";
import { AVC, HEVC } from "media-codecs";
import {
  createCircleGraphics,
  createCustomShapeGraphics,
} from "./createShapeGraphics.js";
import { scaleDims } from "./utils.js";

document.getElementById("closeGui").addEventListener("click", function () {
  const guiElement = document.querySelector(".moveGUI");
  guiElement.style.display =
    guiElement.style.display === "none" ? "flex" : "none";
  this.textContent = this.textContent === "Close" ? "Open" : "Close";
});

export function handleMultFiles(p, totalUploadNum) {
  sv.animUnderImgs = [];

  sv.tempUploadFiles.forEach((_file) => {
    if (_file.type === "image") {
      p.loadImage(_file.data, function (img) {
        sv.animUnderImgs.push(img);
        if (sv.animUnderImgs.length === totalUploadNum) imageLoaded(p);
      });
    } else {
      document.getElementById("badFile").style.opacity = 1;
      setTimeout(() => {
        document.getElementById("badFile").style.opacity = 0;
      }, 5000);
    }
  });
}

export function recalculateGrid() {
  sv.colCount = sv.gridResolution;
  sv.rowCount = Math.floor((sv.gridH / sv.gridW) * sv.gridResolution);
  sv.totalCells = sv.rowCount * sv.colCount;
  sv.cellW = sv.gridW / sv.colCount;
  sv.cellH = sv.gridH / sv.rowCount;
  if (sv.customShapeGraphics) sv.customShapeGraphics.remove();
  if (sv.circleGraphics) sv.circleGraphics.remove();
  sv.customShapeGraphics = createCustomShapeGraphics(sv.cellW);
  sv.circleGraphics = createCircleGraphics(sv.cellW);
}

export function imageLoaded(p) {
  const recordingScaleText = document.createElement("div");
  recordingScaleText.style.position = "absolute";
  recordingScaleText.style.bottom = "30px";
  recordingScaleText.style.zIndex = "10";
  recordingScaleText.style.left = "300px";

  const imgs = sv.animUnderImgs;
  if (imgs.length > 1) {
    imgs.forEach((img) => {
      img = scaleDims(img);
    });
    sv.gridW = imgs[0].width;
    sv.gridH = imgs[0].height;
  } else {
    imgs[0] = scaleDims(imgs[0]);
    sv.gridW = imgs[0].width;
    sv.gridH = imgs[0].height;
  }
  if (sv.printBuffer) sv.printBuffer.remove();
  if (sv.previewBuffer) sv.previewBuffer.remove();
  sv.printBuffer = p.createGraphics(sv.gridW, sv.gridH);
  sv.previewBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
  recalculateGrid();

  updateCellData();

  sv.customShapeGraphics = createCustomShapeGraphics(sv.cellW);
  sv.circleGraphics = createCircleGraphics(sv.cellW);

  scaleToPreview(p);

  const context = sv.printBuffer.drawingContext;
  context.imageSmoothingEnabled = true;
  sv.canvasRecorder = new Recorder(context, {
    name: "canvas-record-example",
    duration: Infinity,
    encoderOptions: {
      // framerate: sv.frameRate,
      // bitrate: 2500000,
    },
  });
  sv.setupDone = true;

  document.body.appendChild(recordingScaleText);
}
