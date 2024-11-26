import { tick } from "../sketch.js";
import { downloadCanvas } from "./utils.js";
import { sv } from "./variables.js";
import { Recorder, RecorderStatus, Encoders } from "canvas-record";

export async function startRecording() {
  sv.ticker.stop();
  await sv.canvasRecorder.start();
  tick(sv.canvasRecorder);
}

export async function stopRecording() {
  await sv.canvasRecorder.stop();
  sv.ticker.start();
}

export function setupRecorder() {
  console.log("running setup recorder");
  const webglCanvas = sv.pApp.canvas;
  const webgl2CTX = webglCanvas.getContext("webgl2");
  if (webgl2CTX) console.log("Canvas context is webgl2");
  else console.log("BAD CONTEXT");

  sv.canvasRecorder = new Recorder(webgl2CTX, {
    name: "canvas-record-example",
    duration: Infinity,
    encoderOptions: {
      download: true,
      // bitrate: 2000000,
      bitrate: 3500000,
    },
  });
}
