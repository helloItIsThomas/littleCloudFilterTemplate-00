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
  // overlay a rendering screen on top of everything
  const renderingScreen = document.createElement("div");
  renderingScreen.id = "renderingScreen";
  document.body.appendChild(renderingScreen);

  const renderingText = document.createElement("p");
  renderingText.id = "renderingText";
  renderingText.textContent = "Rendering...";
  renderingScreen.appendChild(renderingText);
}

window.addEventListener("load", () => {
  mySetup();
});

export const tick = async () => {
  render();

  console.log("tick running");

  if (sv.canvasRecorder.status !== RecorderStatus.Recording) return;
  await sv.canvasRecorder.step();

  // calculate duration of the recording given that we are recording at 30 frames / second, and the record duration is set in seconds

  // replace sv.frame with a frame counter that resets to 0 when the recording is stopped

  console.log(sv.frame, sv.recordDuration * 30);

  if (sv.frame >= sv.recordDuration * 30) {
    await stopRecording();
    sv.frame = 0;
  }

  if (sv.canvasRecorder.status !== RecorderStatus.Stopped) {
    sv.frame++;
    requestAnimationFrame(() => tick());
  }
};

function render() {
  renderingText.textContent = "Rendering...";
  // replace the content of the rendering text with the current frame number
  // renderingText.textContent = `Rendering... ${sv.frame}`;

  sv.stats.begin();

  if (sv.setupDone) {
    draw();
    sv.clock += sv.speed;
  }

  sv.stats.end();
}
