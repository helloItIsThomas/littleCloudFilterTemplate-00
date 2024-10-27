import { sv } from "./variables.js";
import { map2 } from "./easing.js";

function getVisibleIndices() {
  const { numOverlayImages } = sv;
  const totalImages = numOverlayImages;
  let visibleIndices = [];
  let visibleCount = getVisibleNum();
  // Calculate step size to maintain distribution
  const step = Math.floor((totalImages - 1) / (visibleCount - 1));

  const sliderValue = sv.params.contrast;

  // Generate visible indices
  for (let i = 0; i < visibleCount; i++) {
    visibleIndices.push(i * step); // Add spaced out indices
  }

  // Include the edge cases: ID 0 and ID 9 if slider is at 10
  if (sliderValue >= numOverlayImages) {
    visibleIndices = [0, totalImages - 1];
  }

  // return visibleIndices.map((index) => images[index]);
  return visibleIndices;
}

function getVisibleNum() {
  const { numOverlayImages } = sv;
  // Determine the number of images to show based on slider value
  const visibleCount =
    Math.floor(numOverlayImages * (1 - sv.params.contrast / 10)) + 2;

  return visibleCount;
}

export function pickTile(n) {
  const { cells } = sv;
  const cell = cells[n];
  const thisBright = cell.brightness[0] / 255;

  const subNum = getVisibleNum();

  let maxTiles = subNum;
  if (sv.params.startInvisible) {
    // maxTiles = sv.p.floor(sv.p.map(thisClock, 0, 1, 1, subNum));
  }

  let chosenTileIndex = sv.p.floor(
    sv.p.map(thisBright * 1.0, 0.0, 1, 0, maxTiles)
  );
  let subIndices = getVisibleIndices();

  let originalImages = [...sv.overlayImages];
  if (sv.hasColor) {
    originalImages = [];
    originalImages = [...sv.blueOverlayImages];
  }

  let returnImages = [...originalImages];

  if (sv.params.clipOutliers) {
    const image19 = sv.clearImage;
    returnImages[0] = image19;
    returnImages[sv.overlayImages.length - 1] = image19;
  } else {
    returnImages = [...originalImages];
  }
  const thisImage = returnImages[subIndices[chosenTileIndex]];
  return thisImage;
}

export function redrawThisImage() {
  for (let n = 0; n < sv.totalCells; n++) {
    const cell = sv.cells[n];
    let animScaler = 1;
    const nb =
      (cell.brightness[0] / 255 + n * sv.noiseOffset + sv.clock) % 0.99;
    animScaler = nb;

    const centerAdj = sv.gridGutterMult * (sv.cellW * animScaler) * 0.5;

    const chosenTile = pickTile(n);

    if (sv.params.scaleDynamically) {
      sv.startLoop = 0.05;
      sv.endLoop = 0.95;
    }

    if (!sv.params.scaleDynamically) {
      animScaler = sv.manualScale;
    }
    const noisyValue = sv.p.noise(n);
    const thisClock = map2(
      sv.p.sin(noisyValue * sv.noiseOffset + sv.clock),
      -1.0,
      1,
      0,
      1,
      4,
      2
    );

    if (!sv.params.scaleDynamically && sv.params.startInvisible) {
      animScaler =
        sv.manualScale * 2 * map2(thisClock % 2.0, 0.0, 2.0, 0, 1.0, 4, 2);
    }

    if (chosenTile && sv.gridGutterMult && sv.cellW && animScaler) {
      sv.printBuffer.image(
        chosenTile,
        cell.x, // + sv.p.sin(nb * sv.offsetWiggle + sv.clock),
        // cell.x - centerAdj + sv.p.sin(nb * sv.offsetWiggle + sv.clock),
        // cell.x,
        cell.y,
        // cell.y - centerAdj,
        sv.gridGutterMult * (sv.cellW * animScaler),
        sv.gridGutterMult * (sv.cellW * animScaler)
      );
    }
  }
}
