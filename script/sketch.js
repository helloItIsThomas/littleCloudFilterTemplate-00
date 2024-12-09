import "p5.js-svg";
// import pixi from pixi.js
import * as PIXI from "pixi.js";

import { Application, Ticker } from "pixi.js";
import { Recorder, RecorderStatus, Encoders } from "canvas-record";

import { sv } from "./utils/variables.js";
import { recalculateGrid } from "./utils/eventHandlers.js";
import { loadSetupImages, updateSvgIcons } from "./utils/loadImages";
import { draw } from "./rendering/draw.js";
import { createInput } from "./utils/input";
import { initializeLoadIcon, showLoadIcon } from "./utils/icons.js";
import { downloadCanvas } from "./utils/utils.js";
import { setupRecorder } from "./utils/recording.js";

let resizeAppToMe = document.getElementById("pixiSizerDiv");
console.log("resizeAppToMe", resizeAppToMe);
let targetCanvas = document.getElementById("pixiCanvasTarget");
let targetCanvas2 = document.getElementById("pixiCanvasTarget2");
sv.resizeAppToMeWidth = resizeAppToMe.offsetWidth;
sv.resizeAppToMeHeight = resizeAppToMe.offsetHeight;

sv.pApp = new Application();
await sv.pApp.init({
  background: "#0000ff",
  clearBeforeRender: true,
  preserveDrawingBuffer: true,
  autoDensity: true,
  resolution: 3,
  antialias: true,
  width: 800,
  height: 800,
  canvas: targetCanvas,
  // resizeTo: resizeAppToMe,
  preference: "webgl",
});

sv.displayApp = new Application();
sv.displayApp.init({
  background: "#00ff00",
  clearBeforeRender: true,
  preserveDrawingBuffer: true,
  autoDensity: true,
  resolution: 3,
  antialias: true,
  width: 600,
  height: 600,
  canvas: targetCanvas2,
  // resizeTo: resizeAppToMe,
  preference: "webgl",
});

sv.ticker = new Ticker();
sv.ticker.autoStart = false;
sv.ticker.add(() => {
  render();
});
sv.ticker.stop();

export default function (p) {
  sv.p = p;
}

async function mySetup() {
  initializeLoadIcon();
  createInput();
  showLoadIcon();

  await loadSetupImages();

  recalculateGrid();
  updateSvgIcons();

  sv.setupDone = true;
  sv.ticker.start();
  setupRecorder();
}

const originalCanvas = document.getElementById("pixiCanvasTarget");

window.addEventListener("load", () => {
  mySetup();
});

export const tick = async () => {
  render();

  console.log("tick running");

  if (sv.canvasRecorder.status !== RecorderStatus.Recording) return;
  await sv.canvasRecorder.step();

  if (sv.canvasRecorder.status !== RecorderStatus.Stopped) {
    requestAnimationFrame(() => tick());
  }
};

function render() {
  sv.stats.begin();

  if (sv.setupDone) {
    draw();
    sv.clock += sv.speed;
  }

  sv.stats.end();
}

window.addEventListener("mousedown", () => {
  console.log("mousedown");
});
