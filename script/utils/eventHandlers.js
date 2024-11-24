import { sv } from "./variables.js";
import { updateCellData } from "../imgProcessing/imageProcessing.js";
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
        if (sv.animUnderImgs.length === sv.totalUploadNum) {
          updateActiveImgBar();
          recalculateGrid();
        }
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
  const imgs = sv.animUnderImgs;

  // this assumes all background images are the same size and aspect ratio(?)
  if (imgs.length > 1) {
    sv.gridW = imgs[0].width;
    sv.gridH = imgs[0].height;
  } else {
    sv.gridW = imgs[0].width;
    sv.gridH = imgs[0].height;
  }

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

export function updateActiveImgBar() {
  // get the background images
  const imgs = sv.animUnderImgs;

  // clear the preview bar
  const previewBar = document.getElementById("activeImages");
  while (previewBar.firstChild) {
    previewBar.removeChild(previewBar.firstChild);
  }

  // make a copy of each background image and put it in previewBar.
  // resizing for these is happening automatically with css.
  imgs.forEach((img) => {
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
  });
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
    recalculateGrid();

    resizingStarted = false; // Reset for next resize
  }, 500); // Adjust timeout as needed
});
