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

export function createAddSprites() {
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
