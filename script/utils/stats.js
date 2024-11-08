import Stats from "stats.js";
import { sv } from "./variables.js";

export function createStatsGUI() {
  //   console.log("creating stats gui");
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
