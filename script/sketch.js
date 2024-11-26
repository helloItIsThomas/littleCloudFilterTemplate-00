import "p5.js-svg";
import { Application, RenderTexture, Ticker } from "pixi.js";
import { Recorder, RecorderStatus, Encoders } from "canvas-record";

import { sv } from "./utils/variables.js";
import { recalculateGrid } from "./utils/eventHandlers.js";
import { loadSetupImages } from "./utils/loadImages";
import { draw } from "./rendering/draw.js";
import { createInput } from "./utils/input";
import { initializeLoadIcon, showLoadIcon } from "./utils/icons.js";
import { downloadCanvas, takeScreenshot } from "./utils/utils.js";
import { setupRecorder } from "./utils/recording.js";

const bodyRightDiv = document.getElementById("bodyRight");
sv.bodyRightDivWidth = document.getElementById("bodyRight").offsetWidth;
sv.bodyRightDivHeight = document.getElementById("bodyRight").offsetHeight;

sv.pApp = new Application();
await sv.pApp.init({
  background: "#fff",
  clearBeforeRender: true,
  preserveDrawingBuffer: true,
  autoDensity: true,
  resolution: 2,
  antialias: true,
  resizeTo: bodyRightDiv,
  preference: "webgl",
});
document.getElementById("pixiApp").appendChild(sv.pApp.canvas);

sv.ticker = new Ticker();
sv.ticker.autoStart = false;
sv.ticker.stop();

export default function (p) {
  sv.p = p;

  async function mySetup() {
    initializeLoadIcon();
    createInput();
    showLoadIcon();

    await loadSetupImages();

    recalculateGrid();
    sv.setupDone = true;
    sv.ticker.start();
    setupRecorder();
  }

  p.setup = function () {
    mySetup();
  };
}

window.addEventListener("load", (event) => {
  console.log("Page is fully loaded");

  // Your code to execute after the page is fully loaded goes here
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
  console.log("render running");

  if (sv.setupDone) {
    console.log("draw running");
    draw();
    sv.clock += sv.speed;
  }

  sv.stats.end();
}

sv.pApp.stage.eventMode = "static";
sv.pApp.stage.hitArea = sv.pApp.screen;
sv.pApp.stage.on("pointerdown", takeScreenshot);
