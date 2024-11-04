export function calculateAverageBrightnessP5(p, imgSection) {
  console.log("running calculateAverageBrightnessP5");
  imgSection.loadPixels();
  let sumBrightness = 0;
  for (let i = 0; i < imgSection.pixels.length; i += 4) {
    sumBrightness += imgSection.pixels[i];
  }
  let avgBrightness = sumBrightness / (imgSection.pixels.length / 4);
  return avgBrightness;
}
