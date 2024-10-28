import { sv } from "../utils/variables.js";
import { redrawSlidingTiles } from "./redrawSlidingTiles.js";
import { updateGraphicsPositions } from "./updateGraphicsPositions.js";
import Stats from "stats.js";

sv.stats;

createStatsGUI();

function createStatsGUI() {
  console.log("creating stats gui");
  //Create new Graphs (FPS, MS, MB)
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
  // sv.p.clear();
  // sv.p.background("#fff");

  // redrawSlidingTiles();
  // if (!sv.params.showSingleImgMode) {
  // redrawSlidingTiles();
  // } else redrawThisImage();
  updateGraphicsPositions();
}
