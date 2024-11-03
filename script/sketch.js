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

import { drawIcon } from "./utils/recordingIcon.js";
import { createInput } from "./utils/input";

sv.pApp = new Application();
await sv.pApp.init({
  background: "#1099bb",
  autoDensity: true,
  resolution: 2,
  resizeTo: window,
  // autoDensity: true,
});
document.getElementById("pixiApp").appendChild(sv.pApp.canvas);

sv.ticker = new Ticker();
sv.ticker.autoStart = false;
sv.ticker.stop();

async function loadImagesWithP5(p) {
  console.log("running loadImagesWithP5");

  const sheet = await Assets.load("/assets/spritesheet/spritesheet.json");
  if (!sheet) {
    console.error("Failed to load spritesheet.");
  } else console.log("SUCCESS SPRITESHEET LOAD");

  // START of AnimatedSprite Approach
  let i;
  const time = 10;
  for (i = 0; i < 150; i++) {
    const framekey = `frame_${i.toString().padStart(5, "0")}.png`;
    const texture = Texture.from(framekey);
    sv.sSheetTextures.push({ texture, time });
  }

  sv.spritesheet = new AnimatedSprite(sv.sSheetTextures);
  sv.spritesheet.animationSpeed = 1.0;
  sv.spritesheet.anchor.set(0.5);
  sv.spritesheet.x = sv.pApp.screen.width * 0.5;
  sv.spritesheet.y = sv.pApp.screen.height * 0.5;
  sv.spritesheet.play();
  sv.pApp.stage.addChild(sv.spritesheet);
  // END of AnimatedSprite Approachs

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

  const sourceImgPaths = ["/assets/debug/star.png", "/assets/debug/circle.png"];

  await Promise.all(sourceImgPaths.map(loadImage));
}

export default function (p) {
  console.log("running main sketch");
  sv.p = p;

  sv.stepPromise = Promise.resolve();

  async function mySetup() {
    console.log("running mySetup");
    await loadImagesWithP5(p);
    console.log("all images have loaded");

    // sv.p.noLoop();

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
    }
    sv.stats.end();
  });
}
