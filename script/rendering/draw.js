import { sv } from "../utils/variables.js";

import Stats from "stats.js";

sv.stats;

createStatsGUI();

function createStatsGUI() {
  console.log("creating stats gui");
  sv.stats = new Stats();
  sv.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

  var thisParent = document.getElementById("modal_4-content");
  thisParent.appendChild(sv.stats.domElement);

  var statsALL = document
    .getElementById("modal_4-content")
    .querySelectorAll("canvas");

  for (var i = 0; i < statsALL.length; i++) {
    statsALL[i].style.width = "100%";
    statsALL[i].style.height = "160px";
  }
}

export function draw() {
  sv.frameCount = sv.ticker.lastTime * 0.05;
  sv.clock = sv.frameCount * sv.speed;

  const data = sv.instancePositionBuffer.data;

  let count = 0;

  for (let i = 0; i < sv.totalTriangles; i++) {
    const triangle = sv.triangles[i];
    data[count++] = triangle.x;
    data[count++] = triangle.y;
    // triangle.x += triangle.speed;
    // triangle.x %= 800;
  }
  sv.triangleMesh.shader.resources.waveUniforms.uniforms.time = sv.clock % 1.0;
  // console.log(sv.triangleMesh.shader.resources.waveUniforms.uniforms.time);

  sv.instancePositionBuffer.update();
  // updateGraphicsPositions();
}
