import { sv } from "./variables.js";
import { redrawSlidingTiles } from "./redrawSlidingTiles.js";
import { redrawThisImage } from "./redrawCellImages.js";

export function scaleToPreview(p) {
  const source = sv.printBuffer;
  const target = sv.previewBuffer;
  const scaleFactor = Math.min(
    target.width / source.width,
    target.height / source.height
  );
  sv.previewBuffer.scale(scaleFactor);
}

export function draw() {
  sv.clock = sv.p.frameCount * sv.speed;
  sv.printBuffer.clear();
  sv.previewBuffer.clear();
  sv.p.clear();
  sv.printBuffer.background("#fff");
  sv.previewBuffer.background("#fff");
  sv.p.background("#fff");

  if (!sv.params.showSingleImgMode) {
    redrawSlidingTiles();
  } else redrawThisImage();
  sv.previewBuffer.image(sv.printBuffer, 0, 0);
  sv.p.image(sv.previewBuffer, 0, 0);
}
