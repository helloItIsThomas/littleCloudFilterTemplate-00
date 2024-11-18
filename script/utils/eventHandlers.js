import { sv } from "./variables.js";
import { updateCellData } from "../imgProcessing/imageProcessing.js";
import { Recorder } from "canvas-record";
import { AVC, HEVC } from "media-codecs";
import { initGridLoadingScreen } from "../rendering/loading.js";
import { shaderRendering } from "../rendering/shaderRendering.js";
import { createAllThreeGraphics } from "../rendering/createShapeGraphics.js";
import { scaleDims } from "./utils.js";
import { Application, Assets, Graphics, Texture, Sprite } from "pixi.js";
import { showLoadIcon } from "./icons.js";

document.getElementById("closeGui").addEventListener("click", function () {
  const guiElement = document.querySelector(".moveGUI");
  guiElement.style.display =
    guiElement.style.display === "none" ? "flex" : "none";
  this.textContent = this.textContent === "Close" ? "Open" : "Close";
});

export function handleMultFiles(p, totalUploadNum) {
  // console.log("• Running handleMultFiles() •");
  sv.animUnderImgs = [];

  sv.tempUploadFiles.forEach((_file) => {
    if (_file.type === "image") {
      p.loadImage(_file.data, function (img) {
        sv.animUnderImgs.push(img);
        if (sv.animUnderImgs.length === totalUploadNum) imageLoaded();
      });
    } else {
      document.getElementById("badFile").style.opacity = 1;
      setTimeout(() => {
        document.getElementById("badFile").style.opacity = 0;
      }, 5000);
    }
  });
}

export async function recalculateGrid() {
  sv.workerDone = false;
  showLoadIcon();
  console.log("• Running recalculateGrid() •");

  sv.colCount = sv.gridResolution;
  sv.rowCount = Math.floor((sv.gridH / sv.gridW) * sv.gridResolution);
  sv.totalCells = sv.rowCount * sv.colCount;
  sv.cellW = sv.gridW / sv.colCount;
  sv.cellH = sv.gridH / sv.rowCount;

  await updateCellData();
}

export function imageLoaded() {
  // console.log("• Running imageLoaded() •");

  // return new Promise(async (resolve) => {
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

  if (imgs.length > 1) {
    // imgs.forEach((img) => {
    // img = scaleDims(img);
    // });
    sv.gridW = imgs[0].width;
    sv.gridH = imgs[0].height;
  } else {
    sv.gridW = imgs[0].width;
    sv.gridH = imgs[0].height;
  }

  recalculateGrid();

  // const context = sv.p.drawingContext;
  // context.imageSmoothingEnabled = true;
  // sv.canvasRecorder = new Recorder(context, {
  // name: "canvas-record-example",
  // duration: Infinity,
  // encoderOptions: {
  // framerate: sv.frameRate,
  // bitrate: 2500000,
  // },
  // });
  // sv.setupDone = true;

  // document.body.appendChild(recordingScaleText);

  // resolve();
  // });
}
