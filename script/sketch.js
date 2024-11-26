import "p5.js-svg";
import { Application, RenderTexture, Ticker } from "pixi.js";

import { sv } from "./utils/variables.js";
import { recalculateGrid } from "./utils/eventHandlers.js";
import { loadSetupImages } from "./utils/loadImages";
import { draw } from "./rendering/draw.js";
import { createInput } from "./utils/input";
import { initializeLoadIcon, showLoadIcon } from "./utils/icons.js";
import { downloadCanvas, takeScreenshot } from "./utils/utils.js";

const bodyRightDiv = document.getElementById("bodyRight");
sv.bodyRightDivWidth = document.getElementById("bodyRight").offsetWidth;
sv.bodyRightDivHeight = document.getElementById("bodyRight").offsetHeight;

sv.pApp = new Application();
await sv.pApp.init({
  background: "#fff",
  // background: "00ff00",
  clearBeforeRender: true,
  preserveDrawingBuffer: true,
  autoDensity: true,
  resolution: 2,
  antialias: true,
  resizeTo: bodyRightDiv,
  // resizeTo: window,
  preference: "webgl",
});
document.getElementById("pixiApp").appendChild(sv.pApp.canvas);

sv.ticker = new Ticker();
sv.ticker.autoStart = false;
sv.ticker.stop();

export default function (p) {
  // console.log("running main sketch");
  sv.p = p;

  sv.stepPromise = Promise.resolve();

  async function mySetup() {
    initializeLoadIcon();
    createInput();
    showLoadIcon();

    sv.ticker.start();

    await loadSetupImages();

    recalculateGrid();

    // const debugP5Canv = sv.p.createGraphics(500, 500);
    // debugP5Canv.background("pink");
    // debugP5Canv.fill("green");
    // debugP5Canv.circle(150, 50, 50);

    // const previewCanvas = Object.assign(document.createElement("canvas"), {
    // width: 500,
    // height: 500,
    // });
    // const context = webglCanvas.getContext("2d");
    // context.drawImage(debugP5Canv.canvas, 0, 0);
    // console.log("context:", context);

    // sv.canvasRecorder = new Recorder(webglCanvas, {
    // name: "canvas-record-example",
    // duration: Infinity,
    // encoderOptions: {
    // framerate: sv.frameRate,
    // bitrate: 2000000,
    // },
    // });

    sv.setupDone = true;
  }

  p.setup = function () {
    mySetup();
  };

  sv.ticker.add((deltaTime) => {
    sv.stats.begin();
    sv.constantClock += sv.speed;

    if (sv.setupDone) {
      draw();
    }

    if (sv.setupDone) {
      if (sv.isRecording) {
        console.log("recording");
        sv.stepPromise = sv.stepPromise.then(async () => {
          await sv.canvasRecorder.step();
        });
      }
      // if (sv.isRecording) drawIcon();
    }
    sv.stats.end();
  });
}

sv.pApp.stage.eventMode = "static";
sv.pApp.stage.hitArea = sv.pApp.screen;
sv.pApp.stage.on("pointerdown", takeScreenshot);
