import { sv } from "../utils/variables.js";
import { getAspectRatio } from "../utils/utils.js";

import {
  Assets,
  Buffer,
  BufferUsage,
  Mesh,
  Shader,
  Geometry,
  Texture,
  ImageSource,
  GlProgram,
  Container,
} from "pixi.js";

async function loadFragShader() {
  const vertexLoader = import.meta.glob("../../shader/vert.vert", {
    as: "raw",
  });
  const fragmentLoader = sv.oneActiveImage
    ? import.meta.glob("../../shader/single.frag", { as: "raw" })
    : import.meta.glob("../../shader/mult.frag", { as: "raw" });

  const [vertex, fragment] = await Promise.all([
    vertexLoader["../../shader/vert.vert"](),
    sv.oneActiveImage
      ? fragmentLoader["../../shader/single.frag"]()
      : fragmentLoader["../../shader/mult.frag"](),
  ]);

  return { vertex, fragment };
}

export async function shaderRendering() {
  const { vertex, fragment } = await loadFragShader();
  const gl = { vertex, fragment };

  sv.totalTriangles = sv.totalCells;

  sv.instancePositionBuffer = new Buffer({
    data: new Float32Array(sv.totalTriangles * 2),
    usage: BufferUsage.VERTEX | BufferUsage.COPY_DST,
  });

  sv.triangles = [];

  for (let i = 0; i < sv.totalTriangles; i++) {
    // assuming the grid of both images is the same...
    const cell = sv.stills[0].cells[i];
    sv.triangles[i] = {
      x: cell.x,
      y: cell.y,
      speed: 1.0,
    };
  }

  // Create a new buffer for unique IDs
  const instanceIndexBuffer = new Buffer({
    data: new Float32Array(
      [...Array(sv.totalTriangles).keys()].map(
        (i) => i / (sv.totalTriangles - 1)
      )
    ),
    usage: BufferUsage.VERTEX | BufferUsage.COPY_DST,
  });

  // this seems to be a good thing to use for manual scaling
  const sclr = 1.0;
  const geometry = new Geometry({
    topology: "triangle-strip",
    instanceCount: sv.totalTriangles,
    attributes: {
      aPosition: [
        0.0,
        0.0,
        sv.cellW * sclr,
        0.0,
        sv.cellW * sclr,
        sv.cellH * sclr,
        0.0,
        sv.cellH * sclr,
      ],
      aUV: [0, 0, 1, 0, 1, 1, 0, 1],
      aPositionOffset: {
        buffer: sv.instancePositionBuffer,
        instance: true,
      },
      aIndex: {
        buffer: instanceIndexBuffer,
        instance: true,
      },
    },
    indexBuffer: [0, 1, 2, 0, 2, 3],
  });

  //// WIP WIP WIP WIP WIP WIP
  const noiseCanvas = sv.p.createGraphics(sv.gridResolution, sv.gridResolution);
  let n = 0;
  for (let y = 0; y < sv.rowCount; y++) {
    for (let x = 0; x < sv.colCount; x++) {
      const noisyValue = sv.p.noise(n);
      noiseCanvas.set(x, y, sv.p.color(noisyValue * 255));
      n++;
    }
  }
  noiseCanvas.updatePixels();
  //// WIP WIP WIP WIP WIP WIP END END END END

  let resources = {};
  if (resources) {
    Object.keys(resources).forEach((key) => {
      const resource = resources[key];
      if (resource instanceof WebGLBuffer) gl.deleteBuffer(resource);
      else if (resource instanceof HTMLElement) resource.remove();
    });
  }
  resources = {}; // Clears the object reference.

  resources = createResources(noiseCanvas);

  let bTexes = [];
  bTexes = sv.stills.map((still) => {
    let src = new ImageSource({ resource: still.brightnessTex });
    let tex = new Texture({ source: src });
    return tex;
  });

  resources.waveUniforms.numBTexes = { value: bTexes.length, type: "i32" };

  if (bTexes.length == 1) {
    resources["bTex1"] = bTexes[0].source;
    resources["bTex2"] = bTexes[0].source;

    resources.waveUniforms.bTex1AR = {
      value: getAspectRatio(bTexes[0].source),
      type: "f32",
    };
    resources.waveUniforms.bTex2AR = {
      value: getAspectRatio(bTexes[0].source),
      type: "f32",
    };
  } else if (bTexes.length == 2) {
    resources["bTex1"] = bTexes[0].source;
    resources["bTex2"] = bTexes[1].source;

    resources.waveUniforms.bTex1AR = {
      value: getAspectRatio(bTexes[0].source),
      type: "f32",
    };
    resources.waveUniforms.bTex2AR = {
      value: getAspectRatio(bTexes[1].source),
      type: "f32",
    };
  } else if (bTexes.length > 2) {
    console.error(" > 2 Images Not Supported ");
  } else console.log(" Currently " + bTexes.length + "Number of Images ");

  const shader = Shader.from({
    gl,
    resources,
  });

  sv.triangleMesh = new Mesh({
    geometry,
    shader,
    drawMode: "triangle-list",
  });
  sv.pApp.stage.removeChildren();
  sv.sceneContainer = new Container();
  sv.sceneContainerFrame = new Container();
  sv.sceneContainerFrame.addChild(sv.sceneContainer);
  sv.pApp.stage.addChild(sv.sceneContainerFrame);

  const data = sv.instancePositionBuffer.data;
  let count = 0;
  for (let i = 0; i < sv.totalTriangles; i++) {
    const triangle = sv.triangles[i];
    data[count++] = triangle.x;
    data[count++] = triangle.y;
  }

  sv.sceneContainer.addChild(sv.triangleMesh);
}

function createResources(noiseCanvas) {
  console.log("gridW: ", sv.gridW);
  console.log("gridH: ", sv.gridH);
  console.log("cellW: ", sv.cellW);
  console.log("cellH: ", sv.cellH);
  // Common properties for both modes
  let noiseSrc = new ImageSource({ resource: noiseCanvas.canvas });
  let noiseTex = new Texture({ source: noiseSrc });
  const commonResources = {
    noiseTex: noiseTex.source,
    waveUniforms: {
      time: { value: 1.0, type: "f32" },
      gridResolution: { value: sv.gridResolution, type: "f32" },
      rowCount: { value: sv.rowCount, type: "f32" },
      colCount: { value: sv.colCount, type: "f32" },
      nCellW: { value: sv.cellW / sv.gridW, type: "f32" },
      nCellH: { value: sv.cellH / sv.gridH, type: "f32" },
      tlThresh1: { value: sv.tlThresh1, type: "f32" },
      tlThresh2: { value: sv.tlThresh2, type: "f32" },
      tlThresh3: { value: sv.tlThresh3, type: "f32" },
    },
  };

  const graphics = sv.oneActiveImage
    ? Array.from({ length: 20 }, (_, i) => sv[`iconGraphic${i}`].canvas)
    : [
        sv.customShapeGraphics.canvas,
        sv.circleGraphicLeft.canvas,
        sv.circleGraphicRight.canvas,
      ];

  const textures = graphics.map(
    (canvas) => new Texture({ source: new ImageSource({ resource: canvas }) })
  );

  // Mode-specific textures
  const modeSpecificTextures =
    sv.oneActiveImage === true
      ? {
          icon0Tex: textures[0].source,
          icon1Tex: textures[1].source,
          icon2Tex: textures[2].source,
          icon3Tex: textures[3].source,
          icon4Tex: textures[4].source,
          icon5Tex: textures[5].source,
          icon6Tex: textures[6].source,
          icon7Tex: textures[7].source,
          icon8Tex: textures[8].source,
          icon9Tex: textures[9].source,
          icon10Tex: textures[10].source,
          icon11Tex: textures[11].source,
          icon12Tex: textures[12].source,
          icon13Tex: textures[13].source,
          icon14Tex: textures[14].source,
          icon15Tex: textures[15].source,
          icon16Tex: textures[16].source,
          icon17Tex: textures[17].source,
          icon18Tex: textures[18].source,
          icon19Tex: textures[19].source,
          waveUniforms: {
            iconAR: { value: 1.0, type: "f32" },
          },
        }
      : (() => {
          const [art1, art2, art3] = textures.map((tex) =>
            sv.p.int(tex.source.width / tex.source.height)
          );
          return {
            hourglassTex: textures[0].source,
            leftCircleTex: textures[0].source,
            rightCircleTex: textures[0].source,
            waveUniforms: {
              hgAR: { value: art1, type: "f32" },
              lcAR: { value: art2, type: "f32" },
              rcAR: { value: art3, type: "f32" },
            },
          };
        })();

  // Merge common and specific resources
  return {
    ...commonResources,
    ...modeSpecificTextures,
    waveUniforms: {
      ...commonResources.waveUniforms,
      ...modeSpecificTextures.waveUniforms,
    },
  };
}
