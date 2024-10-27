import { sv } from "../utils/variables.js";
import {
  Application,
  Assets,
  Texture,
  ImageSource,
  Sprite,
  Rectangle,
} from "pixi.js";

export function updateCellData() {
  let _imgs = Array.isArray(sv.animUnderImgs)
    ? sv.animUnderImgs
    : [sv.animUnderImgs]; // Ensure _imgs is always an array
  const p = sv.p;
  sv.cells = []; // Clear and redefine the array

  // Preprocess images
  const processedImages = _imgs.map((img) => {
    // const imgData = ctx.getImageData(0, 0, img.width, img.height).data;
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
        brightness: brightnessValues, // Array of brightness values for all images or single value if only one image
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
  const frame = new Rectangle(
    0,
    0,
    sv.cells[0].width * 1.0,
    sv.cells[0].height * 1.0
  );
  sv.cTex = new Texture({ source: cImageSource, frame: frame });
  sv.sTex = new Texture({ source: sImageSource, frame: frame });

  for (let n = 0; n < sv.totalCells; n++) {
    const cell = sv.cells[n];
    const cSprite = new Sprite(sv.cTex);
    if (n == 0) {
      // console.log(cSprite.texture.frame.x);
    }
    const sSprite = new Sprite(sv.sTex);
    const s2Sprite = new Sprite(sv.sTex);
    cSprite.x = cell.x;
    cSprite.y = cell.y;
    sSprite.x = cell.x;
    sSprite.y = cell.y;
    s2Sprite.x = cell.x;
    s2Sprite.y = cell.y;
    sv.pApp.stage.addChild(cSprite);
    sv.pApp.stage.addChild(sSprite);
    sv.pApp.stage.addChild(s2Sprite);
    sv.circles.push(cSprite);
    sv.shapes.push(sSprite);
    sv.shapes2.push(s2Sprite);
  }
}

function calculateAverageBrightness(p, imgSection) {
  imgSection.loadPixels();
  let sumBrightness = 0;
  for (let i = 0; i < imgSection.pixels.length; i += 4) {
    sumBrightness += imgSection.pixels[i];
  }
  let avgBrightness = sumBrightness / (imgSection.pixels.length / 4);
  return avgBrightness;
}
