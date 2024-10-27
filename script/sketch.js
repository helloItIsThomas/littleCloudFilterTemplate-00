import "p5.js-svg";

import { sv } from "./variables.js";
import { handleMultFiles, imageLoaded } from "./eventHandlers.js";
import { draw, scaleToPreview } from "./draw.js";
import { drawIcon } from "./recordingIcon.js";
import { createInput } from "./input";

export default function (p) {
  sv.p = p;
  p.preload = async function () {
    sv.clearImage = p.loadImage("/assets/brightnessSortedPNG/19.png");

    const imagePaths = [
      "/assets/brightnessSortedPNG/0.png",
      "/assets/brightnessSortedPNG/1.png",
      "/assets/brightnessSortedPNG/2.png",
      "/assets/brightnessSortedPNG/3.png",
      "/assets/brightnessSortedPNG/4.png",
      "/assets/brightnessSortedPNG/5.png",
      "/assets/brightnessSortedPNG/6.png",
      "/assets/brightnessSortedPNG/7.png",
      "/assets/brightnessSortedPNG/8.png",
      "/assets/brightnessSortedPNG/9.png",
      "/assets/brightnessSortedPNG/10.png",
      "/assets/brightnessSortedPNG/11.png",
      "/assets/brightnessSortedPNG/12.png",
      "/assets/brightnessSortedPNG/13.png",
      "/assets/brightnessSortedPNG/14.png",
      "/assets/brightnessSortedPNG/15.png",
      "/assets/brightnessSortedPNG/16.png",
      "/assets/brightnessSortedPNG/17.png",
      "/assets/brightnessSortedPNG/18.png",
      "/assets/brightnessSortedPNG/19.png",
    ];
    sv.numOverlayImages = imagePaths.length - 1;
    const blueImagePaths = [
      "/assets/brightnessSortedPNG-blue/0.png",
      "/assets/brightnessSortedPNG-blue/1.png",
      "/assets/brightnessSortedPNG-blue/2.png",
      "/assets/brightnessSortedPNG-blue/3.png",
      "/assets/brightnessSortedPNG-blue/4.png",
      "/assets/brightnessSortedPNG-blue/5.png",
      "/assets/brightnessSortedPNG-blue/6.png",
      "/assets/brightnessSortedPNG-blue/7.png",
      "/assets/brightnessSortedPNG-blue/8.png",
      "/assets/brightnessSortedPNG-blue/9.png",
      "/assets/brightnessSortedPNG-blue/10.png",
      "/assets/brightnessSortedPNG-blue/11.png",
      "/assets/brightnessSortedPNG-blue/12.png",
      "/assets/brightnessSortedPNG-blue/13.png",
      "/assets/brightnessSortedPNG-blue/14.png",
      "/assets/brightnessSortedPNG-blue/15.png",
      "/assets/brightnessSortedPNG-blue/16.png",
      "/assets/brightnessSortedPNG-blue/17.png",
      "/assets/brightnessSortedPNG-blue/18.png",
      "/assets/brightnessSortedPNG-blue/19.png",
    ];

    sv.testSVG = p.loadImage("/assets/brightnessSortedPNG/0.png");

    const testImgPaths = ["/assets/studio.png", "/assets/puzzle.png"];

    // Load overlay images
    for (let path of imagePaths) {
      let img = await p.loadImage(path);
      sv.overlayImages.push(img);
    }
    for (let path of blueImagePaths) {
      let img = await p.loadImage(path);
      sv.blueOverlayImages.push(img);
    }
    for (let path of testImgPaths) {
      let img = await p.loadImage(path);
      sv.animUnderImgs.push(img);
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    if (sv.previewBuffer) sv.previewBuffer.remove();
    sv.previewBuffer.resizeCanvas(p.windowWidth, p.windowHeight);
    sv.previewBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    scaleToPreview(p);
  };

  sv.stepPromise = Promise.resolve();

  p.setup = function () {
    sv.p.pixelDensity(2);
    // Create canvas inside a div
    sv.imgDiv = p.createDiv();
    sv.imgDiv.id("image-container");
    p.createCanvas(p.windowWidth, p.windowHeight).parent(sv.imgDiv);
    p.frameRate(sv.frameRate);
    sv.previewBuffer = p.createGraphics(p.windowWidth, p.windowHeight);
    sv.printBuffer = p.createGraphics(1.0, 1.0);

    imageLoaded(p);

    // Create file input element
    createInput();
  };

  p.draw = function () {
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
  };
}
