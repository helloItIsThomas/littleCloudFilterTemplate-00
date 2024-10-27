import { sv } from "../utils/variables.js";
import { Sprite, Rectangle, Texture } from "pixi.js";

export function updateGraphicsPositions() {
  for (let c of sv.circles) {
    console.log(c);
    // console.log(c.texture.frame);
    // c.texture.frame.width = sv.cellW * 0.5;
    // c.texture.frame;
  }
  for (let s of sv.shapes) {
    s.x = 10000;
    // Define the cropping area for the shape texture
    // const cropFrame = new Rectangle(0, 0, s.width / 2, s.height / 2);
    // s.texture.frame = cropFrame;
  }
  for (let s2 of sv.shapes2) {
    s2.x = 10000;
    // Define the cropping area for the second shape texture
    // const cropFrame = new Rectangle(0, 0, s2.width / 2, s2.height / 2);
    // s2.texture.frame = cropFrame;
  }
}
