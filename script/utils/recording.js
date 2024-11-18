import { sv } from "./variables.js";

export async function startRecording() {
  await sv.canvasRecorder.start();
  // console.log("starting recording");
}

export async function stopRecording() {
  await sv.canvasRecorder.stop();
  // console.log("stopping recording");
}
