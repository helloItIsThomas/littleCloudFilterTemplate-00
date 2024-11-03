import { sv } from "../utils/variables.js";
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
        return calculateAverageBrightness(p, cell);
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

  sv.pApp.renderer.resize(sv.gridW, sv.gridH);

  const _cCanv = sv.circleGraphics.canvas;
  const _sCanv = sv.customShapeGraphics.canvas;

  // Create ImageSource from canvases
  const cImageSource = new ImageSource({ resource: _cCanv });
  const sImageSource = new ImageSource({ resource: _sCanv });
  sv.cTex = new Texture({ source: cImageSource });
  sv.sTex = new Texture({ source: sImageSource });

  for (let n = 0; n < sv.totalCells; n++) {
    const cell = sv.cells[n];

    // Create a texture frame for the cell to avoid using masks
    const cellFrame = new Rectangle(cell.x, cell.y, cell.width, cell.height);
    const circleTexture = new Texture(sv.cTex.baseTexture, cellFrame);
    const shapeTexture = new Texture(sv.sTex.baseTexture, cellFrame);

    const cSprite = new Sprite(circleTexture);
    cSprite.x = cell.x;
    cSprite.y = cell.y;
    const sSprite = new Sprite(shapeTexture);
    sSprite.x = cell.x;
    sSprite.y = cell.y;
    const sSprite2 = new Sprite(shapeTexture);
    sSprite2.x = cell.x;
    sSprite2.y = cell.y;

    sv.pApp.stage.addChild(cSprite);
    sv.pApp.stage.addChild(sSprite);
    sv.pApp.stage.addChild(sSprite2);

    sv.circles.push({
      i: n,
      sprite: cSprite,
      originalX: cell.x,
      originalY: cell.y,
    });
    sv.shapes.push({
      i: n,
      sprite: sSprite,
      originalX: cell.x,
      originalY: cell.y,
    });
    sv.shapes2.push({
      i: n,
      sprite: sSprite2,
      originalX: cell.x,
      originalY: cell.y,
    });
  }
}

function calculateAverageBrightness(p, imgSection) {
  console.log("running calculateAverageBrightness");
  imgSection.loadPixels();
  let sumBrightness = 0;
  for (let i = 0; i < imgSection.pixels.length; i += 4) {
    sumBrightness += imgSection.pixels[i];
  }
  let avgBrightness = sumBrightness / (imgSection.pixels.length / 4);
  return avgBrightness;
}
