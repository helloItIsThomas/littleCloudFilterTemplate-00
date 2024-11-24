import { sv } from "../utils/variables.js";
import {
  Application,
  Ticker,
  Assets,
  Sprite,
  Loader,
  Texture,
  Graphics,
  ImageSource,
  AnimatedSprite,
} from "pixi.js";

export function initGridLoadingScreen() {
  // console.log("running initGridLoadingScreen");

  // Create a new Graphics object
  const loadingScreenGraphics = new Graphics();

  loadingScreenGraphics.circle(0, 0, 50);
  loadingScreenGraphics.fill(0x00ff00);

  // Create a texture from the graphics
  const loadingScreenTex = sv.pApp.renderer.generateTexture(
    loadingScreenGraphics
  );

  // Create a sprite from the texture
  const loadingSprite = new Sprite(loadingScreenTex);
  loadingSprite.anchor.set(0.5);
  loadingSprite.x = sv.bodyRightDivWidth / 2;
  loadingSprite.y = sv.bodyRightDivHeight / 2;
  sv.loadingScreen = loadingSprite;
  // sv.pContainer.addChild(sv.loadingScreen);

  // Add animation using Ticker
  const ticker = new Ticker();
  ticker.add(() => {
    loadingSprite.rotation += 0.01; // Rotate the sprite
  });
  ticker.start();
}
