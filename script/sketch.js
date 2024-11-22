import "p5.js-svg";
import { Application, Ticker } from "pixi.js";

import { sv } from "./utils/variables.js";
import { imageLoaded } from "./utils/eventHandlers.js";
import { loadImagesWithP5 } from "./utils/loadImages";
import { draw } from "./rendering/draw.js";
import { createInput } from "./utils/input";
import { initializeLoadIcon, showLoadIcon } from "./utils/icons.js";

sv.pApp = new Application();
await sv.pApp.init({
  background: "#ff0000",
  clearBeforeRender: true,
  autoDensity: true,
  resolution: 2,
  antialias: true,
  resizeTo: window,
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
    // console.log("running mySetup");

    initializeLoadIcon();
    sv.imgDiv = p.createDiv();
    sv.imgDiv.id("image-container");
    p.createCanvas(p.windowWidth, p.windowHeight).parent(sv.imgDiv);
    createInput();
    showLoadIcon();

    sv.ticker.start();

    await loadImagesWithP5();
    imageLoaded();

    // imageLoaded().then(() => {
    // sv.setupDone = true;
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
      // console.log("DRAWING");
      draw();
    } else {
      // console.log("SETTING UP");
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
