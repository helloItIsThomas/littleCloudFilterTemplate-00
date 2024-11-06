import { sv } from "./variables.js";
import { updateCellData } from "../imgProcessing/imageProcessing.js";
import { Recorder } from "canvas-record";
import { AVC, HEVC } from "media-codecs";
import { shaderRendering } from "../rendering/shaderRendering.js";
import { createAllThreeGraphics } from "../rendering/createShapeGraphics.js";
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

  createAllThreeGraphics();
}

export function imageLoaded(p) {
  console.log("• Running imageLoaded() •");
  const recordingScaleText = document.createElement("div");
  recordingScaleText.style.position = "absolute";
  recordingScaleText.style.bottom = "30px";
  recordingScaleText.style.zIndex = "10";
  recordingScaleText.style.left = "300px";

  const imgs = sv.animUnderImgs;

  imgs.forEach((img) => {
    const aspectRatio = img.width / img.height;
    if (window.innerWidth / window.innerHeight > aspectRatio) {
      img.width = window.innerHeight * aspectRatio;
      img.height = window.innerHeight;
    } else {
      img.width = window.innerWidth;
      img.height = window.innerWidth / aspectRatio;
    }
  });

  imgs.map((img) => {});

  if (imgs.length > 1) {
    console.log("larger than 1");
    // imgs.forEach((img) => {
    // img = scaleDims(img);
    // });
    sv.gridW = imgs[0].width;
    sv.gridH = imgs[0].height;
  } else {
    console.log("smaller than 1");
    sv.gridW = imgs[0].width;
    sv.gridH = imgs[0].height;
  }

  recalculateGrid();
  console.log(
    "about to run updateCellData from eventHandlers.js (imageLoaded())"
  );
  updateCellData();

  createAllThreeGraphics();

  shaderRendering();

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
