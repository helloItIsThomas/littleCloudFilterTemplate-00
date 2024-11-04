import { sv } from "../utils/variables.js";
import { createAddSprites } from "./createAddSprites.js";
import { calculateAverageBrightnessP5 } from "../utils/calculateAverageBrightnessP5.js";
import {
  Application,
  Assets,
  Texture,
  ImageSource,
  Sprite,
  Rectangle,
  Graphics,
  Container,
  RenderTexture,
} from "pixi.js";
import { shaderRendering } from "../rendering/shaderRendering.js";

export function updateCellData() {
  console.log("running updateCellData");
  let _imgs = Array.isArray(sv.animUnderImgs)
    ? sv.animUnderImgs
    : [sv.animUnderImgs]; // Ensure _imgs is always an array

  const p = sv.p;
  sv.cells = []; // Clear and redefine the array

  // Preprocess images
  const processedImages = _imgs.map((img) => {
    const processed = img.get();
    processed.filter(p.GRAY);
    return processed;
  });

  let gridIndex = 0;

  for (let y = 0; y < sv.rowCount; y++) {
    for (let x = 0; x < sv.colCount; x++) {
      let xPos = x * sv.cellW;
      let yPos = y * sv.cellH;

      let brightnessValues = processedImages.map((image) => {
        let cell = image.get(xPos, yPos, sv.cellW, sv.cellH);
        return calculateAverageBrightnessP5(p, cell);
      });

      // Create cell once
      sv.cells[gridIndex++] = {
        gridIndex,
        currentImgIndex: 0,
        brightness: brightnessValues,
        x: xPos,
        y: yPos,
        width: sv.cellW,
        height: sv.cellH,
      };
    }
  }

  shaderRendering();
  // createAddSprites();

  sv.pApp.renderer.resize(sv.gridW, sv.gridH);
}
