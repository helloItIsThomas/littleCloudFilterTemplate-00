import { sv } from "../utils/variables.js";
import { createStatsGUI } from "../utils/stats.js";

createStatsGUI();

export function draw() {
  // Update your main code to use the new functions
  if (sv.triangleMesh && sv.workerDone) {
    let sclr = sv.clock % 1.0;

    // Update sv.aPositionData directly
    sv.aPositionData[0] = 0.0;
    sv.aPositionData[1] = 0.0;
    sv.aPositionData[2] = sv.cellW * sclr;
    sv.aPositionData[3] = 0.0;
    sv.aPositionData[4] = sv.cellW * sclr;
    sv.aPositionData[5] = sv.cellH * sclr;
    sv.aPositionData[6] = 0.0;
    sv.aPositionData[7] = sv.cellH * sclr;
    sv.aPositionBuffer.update();

    sv.triangleMesh.shader.resources.waveUniforms.uniforms.time = sv.clock;
    // sv.instancePositionBuffer.update();
  }
}
