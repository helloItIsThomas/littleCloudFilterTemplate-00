import { tick } from "../sketch.js";
import { downloadCanvas } from "./utils.js";
import { sv } from "./variables.js";
import { Recorder, RecorderStatus, Encoders } from "canvas-record";
import { AVC, AV } from "media-codecs";

export async function startRecording() {
  sv.ticker.stop();
  await sv.canvasRecorder.start();
  console.log("started recording");
  tick(sv.canvasRecorder);
}

export async function stopRecording() {
  await sv.canvasRecorder.stop();
  console.log("stopped recording");
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
