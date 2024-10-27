import { sv } from "../utils/variables.js";
import { redrawSlidingTiles } from "./redrawSlidingTiles.js";
import { updateGraphicsPositions } from "./updateGraphicsPositions.js";

export function draw() {
  sv.clock = sv.p.frameCount * sv.speed;
  sv.p.clear();
  sv.p.background("#fff");

  // redrawSlidingTiles();
  // if (!sv.params.showSingleImgMode) {
  // redrawSlidingTiles();
  // } else redrawThisImage();
  updateGraphicsPositions();
}
