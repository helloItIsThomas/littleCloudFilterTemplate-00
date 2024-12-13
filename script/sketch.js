import "p5.js-svg";

import gsap from "gsap";
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
import { stopRecording } from "./utils/recording";
import { createStatsGUI } from "./utils/stats.js";

let resizeAppToMe = document.getElementById("bodyRight");

export default function (p) {
  sv.p = p;
}

async function mySetup() {
  sv.pApp = new Application();
  await sv.pApp.init({
    background: "#ffffff",
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

  sv.ticker = new Ticker();
  sv.ticker.autoStart = false;
  sv.ticker.add(() => {
    sv.clock += sv.speed * 0.5;
    render();
  });
  sv.ticker.stop();

  createStatsGUI();
  // sv.p.noCanvas();

  initializeLoadIcon();
  createInput();
  showLoadIcon();

  await loadSetupImages();

  recalculateGrid();
  updateSvgIcons();

  sv.setupDone = true;
  sv.ticker.start();
}

window.addEventListener("load", () => {
  mySetup();
});

export const tick = async () => {
  console.log(
    "sv.frame / sv.frameRate" + sv.frame / sv.recordDuration / sv.frameRate
  );
  sv.frame++;
  render();

  sv.clock = sv.frame * sv.speed;

  if (sv.canvasRecorder.status !== RecorderStatus.Recording) return;

  await sv.canvasRecorder.step();

  const currentIcon = Math.floor(
    (sv.frame / sv.recordDuration / sv.frameRate) * 6
  );

  const progressIcons = document.getElementsByClassName(
    "renderingBarProgressSubIcons"
  );

  Array.from(progressIcons).forEach((icon, index) => {
    icon.style.display = "none";
    if (index <= currentIcon) {
      icon.style.display = "block";
    }
  });

  if (sv.frame >= sv.recordDuration * sv.frameRate) {
    await stopRecording();
    sv.frame = 0;
  }

  if (sv.canvasRecorder.status !== RecorderStatus.Stopped) {
    requestAnimationFrame(() => tick());
  }
};

function render() {
  sv.stats.begin();

  if (sv.setupDone) {
    draw();
  }

  sv.stats.end();
}

export async function updateClock() {
  // Helper function to create a promise-based delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Helper function for GSAP animations
  const animateClock = (pauseValue, duration = 2) => {
    return new Promise((resolve) => {
      gsap.to(sv, {
        pauseClock: pauseValue,
        duration: duration,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  };

  // Infinite loop
  while (true) {
    try {
      await delay(1000);
      await animateClock(1);
      // console.log("first done");

      await delay(1000);
      await animateClock(0);
      // console.log("second done");
    } catch (error) {
      console.error("Error updating clock:", error);
    }
  }
}
