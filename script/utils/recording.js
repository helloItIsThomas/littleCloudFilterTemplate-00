import { RenderTexture } from "pixi.js";
import { downloadCanvas } from "./utils.js";
import { sv } from "./variables.js";
import { Recorder, RecorderStatus, Encoders } from "canvas-record";
import createCanvasContext from "canvas-context";
import { AVC } from "media-codecs";

export async function startRecording() {
  await sv.canvasRecorder.start();
  // console.log("starting recording");
}

export async function stopRecording() {
  await sv.canvasRecorder.stop();
  // console.log("stopping recording");
}

export function setupRecorder() {
  console.log("running setup recorder");
  const webglCanvas = sv.pApp.canvas;
  console.log("pApp.canvas: ", webglCanvas);

  const webgl2CTX = webglCanvas.getContext("webgl2");

  if (webgl2CTX) console.log("Canvas context is webgl2");
  else console.log("BAD CONTEXT");

  // const pixelRatio = devicePixelRatio;
  // const width = 512;
  // const height = 512;
  // const { context, canvas } = createCanvasContext("webgl2", {
  //   width: width * pixelRatio,
  //   height: height * pixelRatio,
  //   contextAttributes: { willReadFrequently: true },
  // });

  sv.canvasRecorder = new Recorder(webgl2CTX, {
    name: "canvas-record-example",
    duration: Infinity,
    encoderOptions: {
      framerate: sv.frameRate,
      download: true,
      bitrate: 2000000,
    },
  });
}
