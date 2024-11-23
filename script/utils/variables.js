import * as dat from "dat.gui";
import { recalculateGrid, imageLoaded } from "./eventHandlers";
import { startRecording, stopRecording } from "./recording";
import { updateCellData } from "../imgProcessing/imageProcessing";
import { createInput } from "./input";

export const gui = new dat.GUI({
  autoPlace: false,
});

var customContainer = document
  .querySelector(".moveGUI")
  .appendChild(gui.domElement);

export const sv = {
  arcCont: null,
  animatedArc: null,
  workerDone: false,
  pApp: null,
  pContainer: null,
  ticker: null,
  frameCount: null,
  spinnyBG: null,
  triangleMesh: null,
  instancePositionBuffer: null,
  totalTriangles: null,
  triangles: null,
  spritesheet: null,
  sSheetTextures: [],
  sheets: [],
  canvasRecorder: null,
  stepPromise: null,
  p: null,
  setupDone: false,
  clock: null,
  constantClock: null,
  clockState: "forward",
  duration: 2000,
  startLoop: 1.01,
  endLoop: 1.99,
  stateStartTime: null,
  clearImage: null,
  stills: [],
  animUnderImgs: [],
  debugImgToggle: 0,
  slidingPieceImgs: [],
  manualScale: 1.0,
  transitionSpeed: 3000.0,
  transitionDelay: 0.5,
  speed: 0.02,
  params: {
    showSingleImgMode: false,
    contrast: 5.0,
    clipOutliers: false,
    scaleDynamically: true,
    startInvisible: false,
  },
  customShapeGraphics: null,
  circleGraphicLeft: null,
  circleGraphicRight: null,
  cTex: null,
  sTex: null,
  loadingScreen: null,
  circles: [],
  shapes: [],
  shapes2: [],
  noiseTex: null,

  rowCount: null,
  colCount: null,
  totalCells: null,
  gridW: null,
  gridH: null,
  cellW: null,
  cellH: null,
  gridGutterMult: 1.0,
  gridResolutionBuffer: "1",
  gridResolution: "200",
  // noiseOffset: 3.4,
  noiseOffset: 0.0,

  tlThresh1: 0.15,
  tlThresh1BUFFER: 0.01,
  tlThresh2: 0.25,
  tlThresh2BUFFER: 0.01,
  tlThresh3: 0.5,
  tlThresh3BUFFER: 0.01,

  testSVG: null,
  testImages: null,

  isRecording: false,
  takeScreenshot: false,
  tempUploadFiles: [],
  // multiImgMode: false,

  // HTML elements
  inputElement: null,
  imgDiv: null,
};

const recording = gui.addFolder("Render");
recording.open();
const screenshotController = recording
  .add(sv, "takeScreenshot")
  .name("Screenshot");
const recordingController = recording.add(sv, "isRecording").name("Recording");

recordingController.onChange((value) => {
  if (sv.isRecording) startRecording();
  else if (!sv.isRecording) stopRecording();
});
screenshotController.onChange((value) => {
  if (value) {
    sv.p.save();
    screenshotController.setValue(false);
  }
});

const general = gui.addFolder("General");
general.open();
const gridResController = general
  .add(sv, "gridResolutionBuffer")
  .name("Grid Resolution");
general.add(sv, "manualScale", 0.1, 1.0).name("Manual Scale");
general.add(sv, "speed", 0.0, 0.1).name("Speed");
general.add(sv, "noiseOffset", 0, 10, 0.1).name("Noise Offset");

const threshController1 = general.add(sv, "tlThresh1").name("tlThresh1");
const threshController2 = general.add(sv, "tlThresh2").name("tlThresh2");
const threshController3 = general.add(sv, "tlThresh3").name("tlThresh3");

threshController1.onChange((value) => {
  sv.tlThresh1 = value % 1.0;
  imageLoaded();
});
threshController2.onChange((value) => {
  sv.tlThresh2 = value % 1.0;
  imageLoaded();
});
threshController3.onChange((value) => {
  sv.tlThresh3 = value % 1.0;
  imageLoaded();
});

const inputField = gridResController.domElement.querySelector("input");
inputField.addEventListener("keydown", (event) => {
  const value = parseInt(inputField.value, 10);
  if (value !== sv.gridResolution) {
    if (event.key === "Enter") {
      if (sv.workerDone) {
        if (value < 400) sv.gridResolution = value;
        else sv.gridResolution = 400;
        if (value == 0) sv.gridResolution = 1;
        recalculateGrid();
      }
    }
  }
});

// Add the toggle parameter to control visibility
const showSingleImgModeController = gui
  .add(sv.params, "showSingleImgMode")
  .name("Single Image Mode");

const outerDiv = showSingleImgModeController.domElement.parentElement;
outerDiv.classList.add("title-class");

// References for dynamically added controllers
let contrastController,
  clipController,
  scaleDynamicController,
  startInvisibleController;

// Function to add advanced parameters
function addAdvancedParameters() {
  // console.log(" • running addAdvancedParameters • ");
  contrastController = gui.add(sv.params, "contrast", 0, 10).name("Contrast");

  clipController = gui.add(sv.params, "clipOutliers").name("Clip Outliers");

  scaleDynamicController = gui
    .add(sv.params, "scaleDynamically")
    .name("Scale Dynamically");

  startInvisibleController = gui
    .add(sv.params, "startInvisible")
    .name("Start Invisible");
}

// Function to remove advanced parameters
function removeAdvancedParameters() {
  // console.log(" • running removeAdvancedParameters • ");
  if (contrastController) gui.remove(contrastController);
  if (clipController) gui.remove(clipController);
  if (scaleDynamicController) gui.remove(scaleDynamicController);
  if (startInvisibleController) gui.remove(startInvisibleController);
  contrastController = null;
  clipController = null;
  scaleDynamicController = null;
  startInvisibleController = null;
}

// Function to dynamically update the visibility of parameters
function updateVisibility() {
  // console.log(" • running updateVisibility • ");
  createInput();
  removeAdvancedParameters(); // Always remove first to avoid duplicates
  if (sv.params.showSingleImgMode) {
    addAdvancedParameters(); // Add when the toggle is true
  }
}

// Update visibility when the boolean changes
showSingleImgModeController.onChange(updateVisibility);

// Initial state update
// updateVisibility();
