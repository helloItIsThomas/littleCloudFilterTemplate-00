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
  // console.log("running setup recorder");
  const webglCanvas = sv.pApp.canvas;
  const webgl2CTX = webglCanvas.getContext("webgl2");
  // const dpr = window.devicePixelRatio || 2;
  const dpr = 2; // for testing
  // webglCanvas.width = webglCanvas.clientWidth * dpr;
  // webglCanvas.height = webglCanvas.clientHeight * dpr;
  // webgl2CTX.viewport(0, 0, 400, 936);

  // const offsetWidth = sv.pApp.renderer.width * 0.5 - sv.gridW * 0.5;
  // const offsetHeight = sv.pApp.renderer.height * 0.5 - sv.gridH * 0.5;

  // create a new div
  // const div = document.createElement("div");
  // div.id = "debugCrop";
  // div.style.width = `${sv.gridW}px`;
  // div.style.height = `${sv.gridH}px`;
  // div.style.top = `${offsetHeight}px`;
  // div.style.left = `${offsetWidth}px`;
  // document.body.appendChild(div);

  // const cropX = offsetWidth;
  // const cropY = offsetHeight;
  // const cropWidth = sv.gridW;
  // const cropHeight = sv.gridH;
  // const croppedCanvas = document.createElement("canvas");
  // croppedCanvas.id = "croppedCanvas";
  // croppedCanvas.width = cropWidth;
  // croppedCanvas.height = cropHeight;
  // const croppedCtx = croppedCanvas.getContext("2d");
  // croppedCtx.drawImage(
  // webglCanvas,
  // cropX,
  // cropY,
  // cropWidth,
  // cropHeight,
  // 0,
  // 0,
  // cropWidth,
  // cropHeight
  // );
  // downloadCanvas(croppedCanvas);
  // Append the new canvas to the DOM (optional)
  // document.body.appendChild(croppedCanvas);

  sv.canvasRecorder = new Recorder(webgl2CTX, {
    name: "canvas-record-example",
    duration: Infinity,
    encoderOptions: {
      download: true,
      bitrate: 9500000,
    },
  });
}
