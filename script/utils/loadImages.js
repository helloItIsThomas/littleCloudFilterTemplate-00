import { updateActiveImgBar } from "./eventHandlers.js";
import { downloadCanvas } from "./utils.js";
import { sv } from "./variables.js";

export async function loadSetupImages() {
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

  const loadASetupIcon = (path) => {
    console.log("••§∞¢§™£¡ running loadASetupIcon");
    // this should return a vanilla canvas of an svg.
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // MAKE SURE THIS ISN'T RUINING PERFORMANCE
      // figure out an optimal number for svgResolution
      const svgResolution = window.innerWidth * 0.1;
      canvas.width = svgResolution;
      canvas.height = svgResolution;

      const img = new Image();
      img.onload = () => {
        console.log("•••• loading an svg <<<<");
        ctx.fillStyle = "#73c9fd";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-in";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";

        resolve(canvas);
      };
      img.onerror = (err) => {
        console.log("Error loading SVG: " + err);
        reject(err);
      };
      img.src = path;
    });
  };

  const singleImgIconPaths = Array.from(
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
  sv.singleImgIcons = [];
  await Promise.all(
    singleImgIconPaths.map(async (path) => {
      const icon = await loadASetupIcon(path);
      sv.singleImgIcons.push(icon);
    })
  );

  updateActiveImgBar();
}
