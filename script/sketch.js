import "p5.js-svg";
import { Application, RenderTexture, Ticker } from "pixi.js";
import { Recorder, RecorderStatus, Encoders } from "canvas-record";

import { sv } from "./utils/variables.js";
import { recalculateGrid } from "./utils/eventHandlers.js";
import { loadSetupImages, updateSvgIcons } from "./utils/loadImages";
import { draw } from "./rendering/draw.js";
import { createInput } from "./utils/input";
import { initializeLoadIcon, showLoadIcon } from "./utils/icons.js";
import { downloadCanvas } from "./utils/utils.js";
import { setupRecorder } from "./utils/recording.js";

let bodyRightDiv = document.getElementById("pixiSizerDiv");
// let bodyRightDiv = document.getElementById("pixiDivTarget");
let targetCanvas = document.getElementById("pixiCanvasTarget");
sv.bodyRightDivWidth = bodyRightDiv.offsetWidth;
sv.bodyRightDivHeight = bodyRightDiv.offsetHeight;

sv.pApp = new Application();
await sv.pApp.init({
  // background: "#0000ff",
  // background: "#ffffff",
  background: "#00f0ff",
  // transparent: true,
  clearBeforeRender: true,
  preserveDrawingBuffer: true,
  autoDensity: true,
  resolution: 2,
  antialias: true,
  canvas: targetCanvas,
  resizeTo: bodyRightDiv,
  preference: "webgl",
});
// document.getElementById("pixiApp").appendChild(sv.pApp.canvas);

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
  // setupRecorder();
}

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
  if (sv.pApp.ticker.FPS <= 30.0) {
    // console.log("<<XXXXXXXX BAD FPS XXXXXXX>>>", sv.pApp.ticker.FPS);
  }
  sv.stats.begin();

  if (sv.setupDone) {
    draw();
    sv.clock += sv.speed;
  }

  sv.stats.end();
}

window.addEventListener("mousedown", () => {
  console.log("mousedown");
  // setupRecorder() here for testing debug
  setupRecorder();
  // const webglCanvas = sv.pApp.canvas;
  // sv.pApp.renderer.resize(200, 200);
});
