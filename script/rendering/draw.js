import { sv } from "../utils/variables.js";
import { updateClock, updateClockEase } from "../utils/utils";
import { createStatsGUI } from "../utils/stats.js";

createStatsGUI();

export function draw() {
  sv.frameCount = sv.ticker.lastTime * 0.02;
  sv.clock = sv.frameCount * sv.speed;

  // const newClock = updateClock(performance.now() / 2000, 0.5);
  const newClock = sv.clock % 1.0;

  if (sv.triangleMesh) {
    if (sv.workerDone) {
      console.log("stuff is happening");
      sv.triangleMesh.shader.resources.waveUniforms.uniforms.time = newClock;
      sv.instancePositionBuffer.update();
    } else {
      console.log("stuff is not happening");
    }
  }
}
