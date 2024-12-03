import { updateActiveImgBar } from "./eventHandlers.js";
import { downloadCanvas } from "./utils.js";
import { sv } from "./variables.js";

export async function loadSetupImages() {
  console.log("should run once ");
  const loadASetupImage = (path) => {
    return new Promise((resolve, reject) => {
      sv.p.loadImage(
        path,
        (img) => {
          resolve(img);
        },
        (err) => {
          console.log("Error: " + err);
          reject(err);
        }
      );
    });
  };

  sv.singleImgIconPaths = Array.from(
    { length: 20 },
    (_, i) => `/assets/brightnessSortedSVG/${i}.svg`
  );

  // const sourceImgPaths = ["/assets/debug/satan.png", "/assets/img.jpg"];
  const sourceImgPaths = ["/assets/debug/satan.png"];
  // const sourceImgPaths = ["/assets/grad.png"];
  // const sourceImgPaths = ["/assets/studio.png"];
  sv.totalSourceUploadNum = sourceImgPaths.length;

  sv.animUnderImgs = [];
  await Promise.all(
    sourceImgPaths.map(async (path) => {
      const img = await loadASetupImage(path);
      sv.animUnderImgs.push(img);
    })
  );

  updateActiveImgBar();
}

const loadASetupIcon = (path) => {
  // this should return a vanilla canvas of an svg.
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // MAKE SURE THIS ISN'T RUINING PERFORMANCE
    // figure out an optimal number for svgResolution
    let svgResolution = sv.gridW / sv.gridResolution;
    // let svgResolution = window.innerWidth * 1.0;
    // if (sv.gridResolution <= 20)
    // svgResolution = window.innerWidth / sv.gridResolution;
    // else svgResolution = window.innerWidth * 0.1;
    // svgResolution = (sv.gridW / sv.gridResolution) * 2;

    canvas.width = svgResolution;
    canvas.height = svgResolution;

    // console.log("START");
    // this seems to be slowing down the loading screen
    const img = new Image();
    img.onload = () => {
      if (sv.color) ctx.fillStyle = "#73c9fd";
      else ctx.fillStyle = "#000000";
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-in";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
      // svg's seem to be perfectly sharp here.
      // downloadCanvas(canvas);

      resolve(canvas);
    };
    img.onerror = (err) => {
      console.log("Error loading SVG: " + err);
      reject(err);
    };
    img.src = path;
  });
};

export async function updateSvgIcons() {
  console.log("running updateSvgIcons");
  sv.singleImgIcons = [];
  await Promise.all(
    sv.singleImgIconPaths.map(async (path) => {
      const icon = await loadASetupIcon(path);
      sv.singleImgIcons.push(icon);
      // svg's are canvases here and are perfectly sharp.
      // downloadCanvas(icon);
    })
  );
}
