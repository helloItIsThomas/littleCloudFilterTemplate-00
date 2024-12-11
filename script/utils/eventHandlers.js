import { sv } from "./variables.js";
import { updateCellData } from "../imgProcessing/imageProcessing.js";
import { AVC, HEVC } from "media-codecs";
import { initGridLoadingScreen } from "../rendering/loading.js";
import { showLoadIcon, initializeLoadIcon } from "./icons.js";
import { fitImageToWindow, downloadCanvas } from "../utils/utils.js";
import { gsap } from "gsap";
import { updateSvgIcons } from "./loadImages.js";

export function handleImgInputAtRuntime(p) {
  sv.animUnderImgs = [];

  sv.tempUploadFiles.forEach((_file) => {
    if (_file.type === "image") {
      p.loadImage(_file.data, function (img) {
        sv.animUnderImgs.push(img);
        if (sv.animUnderImgs.length === sv.totalSourceUploadNum) {
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

export async function recalculateGrid(resizeTo = "bodyRight") {
  console.log("running recalculateGrid");
  let _imgs = Array.isArray(sv.animUnderImgs)
    ? sv.animUnderImgs
    : [sv.animUnderImgs]; // Ensure _imgs is always an array

  // Preprocess images
  const processedImages = _imgs.map((img) => {
    img = fitImageToWindow(img, resizeTo);
    const processed = img.get();
    processed.filter(sv.p.GRAY);
    return processed;
  });

  const imgs = processedImages;

  // this assumes all background images are the same size and aspect ratio(?)
  sv.gridW = imgs[0].width;
  sv.gridH = imgs[0].height;
  sv.workerDone = false;
  showLoadIcon();

  sv.colCount = sv.gridResolution;
  sv.cellW = sv.gridW / sv.colCount;
  sv.cellH = sv.cellW;
  sv.rowCount = sv.p.floor(sv.gridH / sv.cellH);
  sv.totalCells = sv.rowCount * sv.colCount;
  sv.xExcess = (sv.cellW * sv.colCount) / sv.gridW;
  sv.yExcess = (sv.cellH * sv.rowCount) / sv.gridH;

  await updateCellData(imgs);
  console.log("••••••recalculated grid");
}

export function updateActiveImgBar() {
  console.log("running updateActiveImgBar");

  // set oneActiveImage flag here
  if (sv.totalSourceUploadNum == 1) {
    sv.oneActiveImage = true;
    sv.advanced.show();
  } else if (sv.totalSourceUploadNum > 1) {
    sv.oneActiveImage = false;
    sv.advanced.hide();
  } else throw console.error("Less than 1 active image detected");

  console.log("oneActiveImage: ", sv.oneActiveImage);

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
  clearTimeout(resizeTimeout);

  if (!resizingStarted) {
    resizingStarted = true;
    // gsap.to("#pixiApp", { opacity: 0, duration: 0.1 });
    gsap.to("#bodyLeft", { opacity: 0, duration: 0.1 });
    gsap.to("#bodyRight", { opacity: 0, duration: 0.1 });
  }

  resizeTimeout = setTimeout(() => {
    // resizeRecorderCanvas();
    initializeLoadIcon();
    recalculateGrid();
    updateSvgIcons();

    resizingStarted = false; // Reset for next resize
  }, 500); // Adjust timeout as needed
});
