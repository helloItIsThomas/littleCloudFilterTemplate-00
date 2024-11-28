import { sv } from "../utils/variables.js";
import { createStatsGUI } from "../utils/stats.js";

let pauseClock = 0;
let direction = 1;
let pauseTime = 1000;
let paused = false;
createStatsGUI();

export function draw() {
  if (sv.triangleMesh && sv.workerDone) {
    if (sv.params.startInvisible) {
      sv.triangleMesh.shader.resources.waveUniforms.uniforms.time = pauseClock;
      sv.triangleMesh.shader.resources.waveUniforms.uniforms.vTime = pauseClock;
    } else {
      console.log("else");
      sv.triangleMesh.shader.resources.waveUniforms.uniforms.time = sv.clock;
      sv.triangleMesh.shader.resources.waveUniforms.uniforms.vTime = sv.clock;
    }

    console.log(pauseClock);
  }
  updateClock();
}

function updateClock() {
  if (!paused) {
    pauseClock += direction * (sv.clock / 1000);
    if (pauseClock >= 1 || pauseClock <= 0) {
    }
    if (pauseClock >= 1) {
      pauseClock = 0.999999;
      paused = true; // Pause when hitting 0 or 1
      setTimeout(() => {
        paused = false;
        direction *= -1; // Reverse direction
      }, pauseTime);
    } else if (pauseClock <= 0) {
      pauseClock = 0;
      paused = true; // Pause when hitting 0 or 1
      setTimeout(() => {
        paused = false;
        direction *= -1; // Reverse direction
      }, pauseTime);
    }
  }
}
