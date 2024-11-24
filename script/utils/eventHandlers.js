import { sv } from "./variables.js";
import { updateCellData } from "../imgProcessing/imageProcessing.js";
import { Recorder } from "canvas-record";
import { AVC, HEVC } from "media-codecs";
import { initGridLoadingScreen } from "../rendering/loading.js";
import { scaleDims } from "./utils.js";
import { Application, Assets, Graphics, Texture, Sprite } from "pixi.js";
import { showLoadIcon, initializeLoadIcon } from "./icons.js";
import { gsap } from "gsap";

export function handleMultFiles(p) {
  sv.animUnderImgs = [];

  sv.tempUploadFiles.forEach((_file) => {
    if (_file.type === "image") {
      p.loadImage(_file.data, function (img) {
        sv.animUnderImgs.push(img);
        if (sv.animUnderImgs.length === sv.totalUploadNum) imageLoaded();
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
  console.log("• Running imageLoaded() •");

  // get the background images
  const imgs = sv.animUnderImgs;

  // clear the preview bar
  const previewBar = document.getElementById("activeImages");
  while (previewBar.firstChild) {
    previewBar.removeChild(previewBar.firstChild);
  }

  // make a copy of each background image and put it in previewBar.
  // resizing is happening automatically with css.
  // Also, we are resizing each background image to fit bodyRightDiv
  imgs.forEach((img) => {
    // make a copy of each image for the activeImages div here //
    const previewImg = sv.p.createImage(img.width, img.height);
    previewImg.copy(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      img.width,
      img.height
    );
    const previewCanvas = Object.assign(document.createElement("canvas"), {
      width: previewImg.width,
      height: previewImg.height,
    });
    previewCanvas.getContext("2d").drawImage(previewImg.canvas, 0, 0);
    previewBar.appendChild(previewCanvas);
    // make a copy of each image for the activeImages div above //

    // changing this so each background image is resized to the width and height of the div not the window.
    // const widthForImageResize = window.innerWidth;
    // const heightForImageResize = window.innerHeight;
    // const widthForImageResize = sv.bodyRightDivWidth;
    // const heightForImageResize = sv.bodyRightDivHeight;
    // const aspectRatio = img.width / img.height;
    // if (widthForImageResize / heightForImageResize > aspectRatio) {
    // img.width = heightForImageResize * aspectRatio;
    // img.height = heightForImageResize;
    // } else {
    // img.width = widthForImageResize;
    // img.height = widthForImageResize / aspectRatio;
    // }
  });

  // this assumes that all images are the same aspect ratio,
  // and resizes all background images to the size of the first one?
  // isn't this unnessesary? let's turn it off for now.
  // if (imgs.length > 1) {
  // const firstImgWidth = imgs[0].width;
  // const firstImgHeight = imgs[0].height;
  // for (let i = 1; i < imgs.length; i++) {
  // if (
  // imgs[i].width !== firstImgWidth ||
  // imgs[i].height !== firstImgHeight
  // ) {
  // throw new Error("All images must be the same aspect ratio.");
  // }
  // }
  // }

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
    gsap.to("#bodyLeft", { opacity: 0, duration: 0.1 });
    gsap.to("#bodyRight", { opacity: 0, duration: 0.1 });
  }

  resizeTimeout = setTimeout(() => {
    console.log("User finished resizing");
    sv.bodyRightDivWidth = document.getElementById("bodyRight").offsetWidth;
    sv.bodyRightDivHeight = document.getElementById("bodyRight").offsetHeight;

    initializeLoadIcon();
    imageLoaded();

    resizingStarted = false; // Reset for next resize
  }, 500); // Adjust timeout as needed
});
