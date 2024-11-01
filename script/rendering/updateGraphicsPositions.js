import { sv } from "../utils/variables.js";
import { Sprite, Rectangle, Texture } from "pixi.js";

export function updateGraphicsPositions() {
  console.log(" • running updateGraphicsPositions • ");
  for (let c of sv.circles) {
    const noisyValue = sv.p.noise(c.i);
    c.sprite.x =
      c.originalX +
      Math.sin(c.i * 0.3 + noisyValue + sv.frameCount * 0.05) *
        c.sprite.width *
        0.5;
  }

  // for (let s of sv.shapes) {
  // s.x = 10000;
  // }
  // for (let s2 of sv.shapes2) {
  // s2.x = 10000;
  // }
}
