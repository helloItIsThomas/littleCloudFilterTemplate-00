import { tick } from "../sketch.js";
import { downloadCanvas } from "./utils.js";
import { recalculateGrid } from "./eventHandlers";
import { updateSvgIcons } from "./loadImages";
import { sv } from "./variables.js";
import { Recorder, RecorderStatus, Encoders } from "canvas-record";
import { AVC, AV } from "media-codecs";

export async function startRecording() {
  const aCont = document.getElementById("absoluteContainer");

  // make the absolute container size the same aspect ratio as the grid, and make sure that neither the width nor height exceed 1080px
  const aspectRatio = sv.gridW / sv.gridH;
  const maxSize = 1080;

  const width = Math.min(maxSize, maxSize * aspectRatio);
  const height = Math.min(maxSize, maxSize / aspectRatio);

  aCont.style.width = `${width}px`;
  aCont.style.height = `${height}px`;

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
  sv.ticker.stop();
  await sv.canvasRecorder.start();
  console.log("started recording");
  tick(sv.canvasRecorder);
}

export async function stopRecording() {
  const aCont = document.getElementById("absoluteContainer");
  const bodyRight = document.getElementById("bodyRight");

  await sv.canvasRecorder.stop();
  console.log("stopped recording");
  if (bodyRight.contains(sv.pApp.canvas)) {
    bodyRight.removeChild(sv.pApp.canvas);
  }
  bodyRight.appendChild(sv.pApp.canvas);

  sv.pApp.resizeTo = bodyRight;
  recalculateGrid();
  updateSvgIcons();
  aCont.style.display = "none";

  console.log("HIDE");
  sv.ticker.start();
}

export function setupRecorder() {
  // console.log("running setup recorder");
  const webglCanvas = sv.pApp.canvas;
  const webgl2CTX = webglCanvas.getContext("webgl2");
  const dpr = window.devicePixelRatio || 2;

  console.log(AVC.AVC_PROFILES);
  console.log(AVC.AVC_LEVELS);

  sv.canvasRecorder = new Recorder(webgl2CTX, {
    name: "canvas-record-example",
    duration: Infinity,
    frameRate: 30,
    encoderOptions: {
      download: true,
      codec: AVC.getCodec({
        profile: "High",
        level: "5.2",
      }),
    },
  });
}
