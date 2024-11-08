import "p5.js-svg";
import { Application, Ticker } from "pixi.js";

import { sv } from "./utils/variables.js";
import { imageLoaded } from "./utils/eventHandlers.js";
import { loadImagesWithP5 } from "./utils/loadImages";
import { draw } from "./rendering/draw.js";

import { drawIcon } from "./utils/recordingIcon.js";
import { createInput } from "./utils/input";

sv.pApp = new Application();
await sv.pApp.init({
  background: "#D30403",
  // background: "#ffffff",
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
  console.log("running main sketch");
  sv.p = p;

  sv.stepPromise = Promise.resolve();

  async function mySetup() {
    console.log("running mySetup");

    sv.imgDiv = p.createDiv();
    sv.imgDiv.id("image-container");
    p.createCanvas(p.windowWidth, p.windowHeight).parent(sv.imgDiv);
    createInput();

    sv.ticker.start();

    await loadImagesWithP5();

    await imageLoaded();

    // imageLoaded().then(() => {
    // sv.setupDone = true;
    // });
    // sv.setupDone = true;
  }

  p.setup = function () {
    mySetup();
  };

  sv.ticker.add((deltaTime) => {
    sv.stats.begin();
    sv.constantClock += sv.speed;

    // Create and animate circle if it doesn't exist yet
    if (!sv.animatedCircle) {
      sv.animatedCircle = document.createElement("div");
      sv.animatedCircle.style.position = "absolute";
      sv.animatedCircle.style.width = "20px";
      sv.animatedCircle.style.height = "20px";
      sv.animatedCircle.style.backgroundColor = "white";
      sv.animatedCircle.style.borderRadius = "50%";
      document.body.appendChild(sv.animatedCircle);
    }

    // Calculate circle position
    const radius = 100;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const x = centerX + Math.cos(sv.constantClock) * radius;
    const y = centerY + Math.sin(sv.constantClock) * radius;

    // Update circle position
    sv.animatedCircle.style.left = `${x}px`;
    sv.animatedCircle.style.top = `${y}px`;

    if (sv.setupDone) {
      console.log("DRAWING");
      draw();
    } else {
      console.log("SETTING UP");
    }

    // if (sv.setupDone) {
    // if (sv.isRecording) {
    // sv.stepPromise = sv.stepPromise.then(async () => {
    // await sv.canvasRecorder.step();
    // });
    // }
    // if (sv.isRecording) drawIcon();
    // } else {
    // }
    sv.stats.end();
  });
}
