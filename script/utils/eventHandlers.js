import { sv } from "./variables.js";
import { updateCellData } from "../imgProcessing/imageProcessing.js";
import { Recorder } from "canvas-record";
import { AVC, HEVC } from "media-codecs";
import { initGridLoadingScreen } from "../rendering/loading.js";
import { shaderRendering } from "../rendering/shaderRendering.js";
import { createAllThreeGraphics } from "../rendering/createShapeGraphics.js";
import { scaleDims } from "./utils.js";
import { Application, Assets, Graphics, Texture, Sprite } from "pixi.js";
import { showLoadIcon, initializeLoadIcon } from "./icons.js";
import { gsap } from "gsap";

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
  console.log("rowCount: ", sv.rowCount);
  console.log("colCount: ", sv.colCount);
  sv.totalCells = sv.rowCount * sv.colCount;
  sv.cellW = sv.gridW / sv.colCount;
  sv.cellH = sv.gridH / sv.rowCount;

  await updateCellData();
}

export function imageLoaded() {
  // console.log("• Running imageLoaded() •");

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
    const firstImgWidth = imgs[0].width;
    const firstImgHeight = imgs[0].height;
    for (let i = 1; i < imgs.length; i++) {
      if (
        imgs[i].width !== firstImgWidth ||
        imgs[i].height !== firstImgHeight
      ) {
        throw new Error("All images must be the same aspect ratio.");
      }
    }
  }

  if (imgs.length > 1) {
    sv.gridW = imgs[0].width;
    sv.gridH = imgs[0].height;
  } else {
    sv.gridW = imgs[0].width;
    sv.gridH = imgs[0].height;
  }

  recalculateGrid();

  const context = sv.p.drawingContext;
  context.imageSmoothingEnabled = true;
  sv.canvasRecorder = new Recorder(context, {
    name: "canvas-record-example",
    duration: Infinity,
    encoderOptions: {
      framerate: sv.frameRate,
      bitrate: 2500000,
    },
  });
  sv.setupDone = true;
}

let resizeTimeout;
let resizingStarted = false;

window.addEventListener("resize", () => {
  console.log("Resizing...");
  clearTimeout(resizeTimeout);

  if (!resizingStarted) {
    console.log("Resizing started");
    resizingStarted = true;
    gsap.to("#pixiApp", { opacity: 0, duration: 0.1 });
  }

  resizeTimeout = setTimeout(() => {
    console.log("User finished resizing");
    initializeLoadIcon();
    imageLoaded();

    resizingStarted = false; // Reset for next resize
  }, 500); // Adjust timeout as needed
});
