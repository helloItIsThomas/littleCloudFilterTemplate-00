import { sv } from "../utils/variables.js";
import { Sprite, Rectangle, Texture } from "pixi.js";

export function updateGraphicsPositions() {
  for (let c of sv.circles) {
    const noisyValue = sv.p.noise(c.i);
    c.sprite.x =
      c.originalX +
      Math.sin(c.i * 0.3 + noisyValue + sv.frameCount * 0.05) *
        c.sprite.width *
        0.5;
  }

  for (let c of sv.shapes) {
    const noisyValue = sv.p.noise(c.i);
    c.sprite.x =
      c.originalX +
      Math.sin(c.i * 0.3 + noisyValue + sv.frameCount * 0.05) *
        c.sprite.width *
        0.5;
    // s.sprite.x = 10000;
  }
  for (let c of sv.shapes2) {
    const noisyValue = sv.p.noise(c.i);
    c.sprite.x =
      c.originalX +
      Math.sin(c.i * 0.3 + noisyValue + sv.frameCount * 0.05) *
        c.sprite.width *
        0.5;
    // s2.sprite.x = 10000;
  }
}
