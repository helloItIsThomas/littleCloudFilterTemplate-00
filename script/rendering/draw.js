import { sv } from "../utils/variables.js";
import { createStatsGUI } from "../utils/stats.js";

createStatsGUI();

export function draw() {
  // Update your main code to use the new functions
  if (sv.triangleMesh && sv.workerDone) {
    sv.triangleMesh.shader.resources.waveUniforms.uniforms.time = sv.clock;
    // sv.instancePositionBuffer.update();
  }
}
