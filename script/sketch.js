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
import {
  setupRecorder,
  startRecording,
  stopRecording,
} from "./utils/recording";

let resizeAppToMe = document.getElementById("bodyRight");

sv.pApp = new Application();
await sv.pApp.init({
  background: "#00ff00",
  clearBeforeRender: true,
  preserveDrawingBuffer: true,
  autoDensity: true,
  resolution: 3,
  antialias: true,
  // canvas: targetCanvas,
  resizeTo: resizeAppToMe,
  preference: "webgl",
});
document.getElementById("bodyRight").appendChild(sv.pApp.canvas);

// document.body.appendChild(sv.pApp.canvas);

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
  sv.p.noCanvas();

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

let clickCounter = 1;

window.addEventListener("mousedown", () => {
  const aCont = document.getElementById("absoluteContainer");
  const bodyRight = document.getElementById("bodyRight");
  clickCounter++;
  if (clickCounter % 2 == 0) {
    aCont.style.display = "block";
    recalculateGrid("absoluteContainer");
    updateSvgIcons();

    if (aCont.contains(sv.pApp.canvas)) {
      aCont.removeChild(sv.pApp.canvas);
    }
    aCont.appendChild(sv.pApp.canvas);
    sv.pApp.resizeTo = aCont;

    console.log("SHOW");

    if (!sv.canvasRecorder) setupRecorder();
    startRecording();
  } else {
    stopRecording();

    if (bodyRight.contains(sv.pApp.canvas)) {
      bodyRight.removeChild(sv.pApp.canvas);
    }
    bodyRight.appendChild(sv.pApp.canvas);

    sv.pApp.resizeTo = bodyRight;
    recalculateGrid();
    updateSvgIcons();
    aCont.style.display = "none";

    console.log("HIDE");
  }
});
