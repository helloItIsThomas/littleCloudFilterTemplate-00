import { sv } from "../utils/variables.js";
import {
  Application,
  Ticker,
  Assets,
  Sprite,
  Loader,
  Texture,
  ImageSource,
  AnimatedSprite,
} from "pixi.js";

export function initGridLoadingScreen() {
  console.log("running initGridLoadingScreen");
  let loadingScreenTex = sv.p.createGraphics(100, 100);
  loadingScreenTex.background("#0000ff");
  loadingScreenTex.fill("#ff0000");
  loadingScreenTex.circle(50, 50, 50);
  let src0 = new ImageSource({ resource: loadingScreenTex.canvas });
  let tex0 = new Texture({ source: src0 });
  const loadingSprite = new Sprite(tex0);
  loadingSprite.anchor.set(0.5);
  loadingSprite.x = sv.p.windowWidth / 2;
  loadingSprite.y = sv.p.windowHeight / 2;
  sv.loadingScreen = loadingSprite;
}
