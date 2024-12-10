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

  // console.log(AV.AV_CODECS);
  // console.log(AV.AV_PROFILES);
  // console.log(AV.AV_LEVELS);
  // console.log(AV.AV_TIER);
  // console.log(AV.AV_BIT_DEPTH);

  console.log(AVC.AVC_PROFILES);
  console.log(AVC.AVC_LEVELS);

  sv.canvasRecorder = new Recorder(webgl2CTX, {
    name: "canvas-record-example",
    duration: Infinity,
    frameRate: 30,
    encoderOptions: {
      download: true,
      // bitrate: 9500000,
      // bitrate: 5000000,
      // codec: "AV1",
      codec: AVC.getCodec({
        profile: "High", // Use a more common profile
        level: "5.2", // Use a more common level
      }),
      // codec: AV.getCodec({
      // name: "AV1",
      // profile: "Professional",
      // level: "5.2",
      // tier: "High",
      // bitDepth: 12,
      // }),
    },
  });
}
