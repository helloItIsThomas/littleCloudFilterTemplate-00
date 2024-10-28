import { sv } from "./variables.js";
import { updateCellData } from "../imgProcessing/imageProcessing.js";
import { Recorder } from "canvas-record";
import { AVC, HEVC } from "media-codecs";
import {
  createCircleGraphics,
  createCustomShapeGraphics,
} from "../rendering/createShapeGraphics.js";
import { scaleDims } from "./utils.js";
import { Application, Assets, Texture, Sprite } from "pixi.js";

document.getElementById("closeGui").addEventListener("click", function () {
  const guiElement = document.querySelector(".moveGUI");
  guiElement.style.display =
    guiElement.style.display === "none" ? "flex" : "none";
  this.textContent = this.textContent === "Close" ? "Open" : "Close";
});

export function handleMultFiles(p, totalUploadNum) {
  console.log("• Running handleMultFiles() •");
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
  console.log("• Running recalculateGrid() •");
  sv.colCount = sv.gridResolution;
  sv.rowCount = Math.floor((sv.gridH / sv.gridW) * sv.gridResolution);
  sv.totalCells = sv.rowCount * sv.colCount;
  sv.cellW = sv.gridW / sv.colCount;
  sv.cellH = sv.gridH / sv.rowCount;
  if (sv.customShapeGraphics) sv.customShapeGraphics.remove();
  if (sv.circleGraphics) sv.circleGraphics.remove();
  sv.customShapeGraphics = createCustomShapeGraphics(sv.cellW / 2);
  sv.circleGraphics = createCircleGraphics(sv.cellW);
}

export function imageLoaded(p) {
  console.log("• Running imageLoaded() •");
  const recordingScaleText = document.createElement("div");
  recordingScaleText.style.position = "absolute";
  recordingScaleText.style.bottom = "30px";
  recordingScaleText.style.zIndex = "10";
  recordingScaleText.style.left = "300px";

  const imgs = sv.animUnderImgs;

  if (imgs.length > 1) {
    console.log("larger than 1");
    // imgs.forEach((img) => {
    // img = scaleDims(img);
    // });
    sv.gridW = imgs[0].width;
    sv.gridH = imgs[0].height;
  } else {
    console.log("smaller than 1");
    // imgs[0] = scaleDims(imgs[0]);
    sv.gridW = imgs[0].width;
    sv.gridH = imgs[0].height;
  }

  recalculateGrid();
  updateCellData();

  sv.customShapeGraphics = createCustomShapeGraphics(sv.cellW);
  sv.circleGraphics = createCircleGraphics(sv.cellW);

  const context = sv.p.drawingContext;
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
