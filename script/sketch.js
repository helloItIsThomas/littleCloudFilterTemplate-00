import "p5.js-svg";
import {
  Application,
  Ticker,
  Assets,
  Sprite,
  Loader,
  Texture,
  AnimatedSprite,
} from "pixi.js";

import { sv } from "./utils/variables.js";
import { handleMultFiles, imageLoaded } from "./utils/eventHandlers.js";
import { draw } from "./rendering/draw.js";
// import { loadShaderFiles } from "./utils/loadShaderFiles.js";

import { drawIcon } from "./utils/recordingIcon.js";
import { createInput } from "./utils/input";

sv.pApp = new Application();
await sv.pApp.init({
  background: "#D30403",
  clearBeforeRender: true,
  autoDensity: true,
  resolution: 2,
  resizeTo: window,
  preference: "webgl",
  // autoDensity: true,
});
document.getElementById("pixiApp").appendChild(sv.pApp.canvas);

sv.ticker = new Ticker();
sv.ticker.autoStart = false;
sv.ticker.stop();

async function loadImagesWithPixi() {
  // Load the background image asynchronously
  console.log("Image loaded and sprite added to stage");
}

async function loadImagesWithP5(p) {
  console.log("running loadImagesWithP5");

  const loadImage = (path) => {
    return new Promise((resolve, reject) => {
      p.loadImage(
        path,
        (img) => {
          sv.animUnderImgs.push(img);
          resolve(img);
        },
        (err) => {
          console.log("Error: " + err);
          reject(err);
        }
      );
    });
  };

  // const sourceImgPaths = ["/assets/debug/star.png", "/assets/debug/circle.png"];
  const sourceImgPaths = ["/assets/debug/satan.png"];

  await Promise.all(sourceImgPaths.map(loadImage));
}

export default function (p) {
  console.log("running main sketch");
  sv.p = p;

  sv.stepPromise = Promise.resolve();

  async function mySetup() {
    console.log("running mySetup");
    await loadImagesWithP5(p);
    await loadImagesWithPixi();
    console.log("all images have loaded");

    sv.imgDiv = p.createDiv();
    sv.imgDiv.id("image-container");
    p.createCanvas(p.windowWidth, p.windowHeight).parent(sv.imgDiv);

    imageLoaded(p);

    createInput();

    sv.ticker.start();
  }

  p.setup = function () {
    mySetup();
  };

  sv.ticker.add((deltaTime) => {
    sv.stats.begin();
    sv.constantClock += sv.speed;

    if (sv.setupDone) {
      if (sv.isRecording) {
        sv.stepPromise = sv.stepPromise.then(async () => {
          await sv.canvasRecorder.step();
        });
      }
      draw();
      if (sv.isRecording) drawIcon();
    } else {
    }
    sv.stats.end();
  });
}
