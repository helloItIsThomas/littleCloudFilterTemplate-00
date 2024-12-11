import { tick } from "../sketch";
import { Recorder } from "canvas-record";
import { AVC } from "media-codecs";
import { recalculateGrid } from "./eventHandlers";
import { updateSvgIcons } from "./loadImages";
import { sv } from "./variables.js";

export async function startRecording() {
  sv.ticker.stop();
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

  if (!sv.canvasRecorder) setupRecorder();
  await sv.canvasRecorder.start();

  console.log("ÒÔ reached the end of startRecording function (*›ﬁ");

  tick(sv.canvasRecorder);
}

export async function stopRecording() {
  const aCont = document.getElementById("absoluteContainer");
  const bodyRight = document.getElementById("bodyRight");

  await sv.canvasRecorder.stop();
  if (bodyRight.contains(sv.pApp.canvas)) {
    bodyRight.removeChild(sv.pApp.canvas);
  }
  bodyRight.appendChild(sv.pApp.canvas);

  sv.pApp.resizeTo = bodyRight;
  recalculateGrid();
  updateSvgIcons();
  aCont.style.display = "none";

  sv.ticker.start();
}

export function setupRecorder() {
  const webglCanvas = sv.pApp.canvas;
  const webgl2CTX = webglCanvas.getContext("webgl2");
  const dpr = window.devicePixelRatio || 2;

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
