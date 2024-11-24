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

async function loadFragShader(_currentlyMoreThanOneImage) {
  const vertexLoader = import.meta.glob("../../shader/vert.vert", {
    as: "raw",
  });
  const fragmentLoader = _currentlyMoreThanOneImage
    ? import.meta.glob("../../shader/frag.frag", { as: "raw" })
    : import.meta.glob("../../shader/fragSingleImg.frag", { as: "raw" });

  const [vertex, fragment] = await Promise.all([
    vertexLoader["../../shader/vert.vert"](),
    _currentlyMoreThanOneImage
      ? fragmentLoader["../../shader/frag.frag"]()
      : fragmentLoader["../../shader/fragSingleImg.frag"](),
  ]);

  return { vertex, fragment };
}

export async function shaderRendering() {
  const { vertex, fragment } = await loadFragShader(
    sv.currentlyMoreThanOneImage
  );
  const gl = { vertex, fragment };

  console.log("°·°‡€ﬁﬂrunning shader rendering·°‡ﬁﬂ");
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

  resources = createResources(sv.currentlyMoreThanOneImage, noiseCanvas);
  console.log("sv.currentlyMoreThanOneImage: ", sv.currentlyMoreThanOneImage);

  // Prepare resources dynamically
  // resources = {
  // hourglassTex: tex1.source,
  // leftCircleTex: tex2.source,
  // rightCircleTex: tex3.source,
  // noiseTex: noiseTex.source,
  //
  // waveUniforms: {
  // time: { value: 1.0, type: "f32" },
  // gridResolution: { value: sv.gridResolution, type: "f32" },
  // rowCount: { value: sv.rowCount, type: "f32" },
  // colCount: { value: sv.colCount, type: "f32" },
  // hgAR: { value: art1, type: "f32" },
  // lcAR: { value: art2, type: "f32" },
  // rcAR: { value: art3, type: "f32" },
  //
  // tlThresh1: { value: sv.tlThresh1, type: "f32" },
  // tlThresh2: { value: sv.tlThresh2, type: "f32" },
  // tlThresh3: { value: sv.tlThresh3, type: "f32" },
  // },
  // };

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

function createResources(_multipleImages, noiseCanvas) {
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
      tlThresh1: { value: sv.tlThresh1, type: "f32" },
      tlThresh2: { value: sv.tlThresh2, type: "f32" },
      tlThresh3: { value: sv.tlThresh3, type: "f32" },
    },
  };

  const graphics = [
    sv.iconGraphic0.canvas,
    sv.iconGraphic1.canvas,
    sv.iconGraphic2.canvas,
    // sv.customShapeGraphics.canvas,
    // sv.circleGraphicLeft.canvas,
    // sv.circleGraphicRight.canvas,
  ];
  const textures = graphics.map((canvas) => {
    const src = new ImageSource({ resource: canvas });
    return new Texture({ source: src });
  });
  const [tex1, tex2, tex3] = textures;
  const [art1, art2, art3] = textures.map((tex) =>
    sv.p.int(tex.source.width / tex.source.height)
  );

  // Mode-specific textures
  const modeSpecificTextures =
    _multipleImages === true
      ? {
          hourglassTex: tex1.source,
          leftCircleTex: tex2.source,
          rightCircleTex: tex3.source,
          waveUniforms: {
            hgAR: { value: art1, type: "f32" },
            lcAR: { value: art2, type: "f32" },
            rcAR: { value: art3, type: "f32" },
          },
        }
      : {
          hourglassTex: tex1.source,
          leftCircleTex: tex2.source,
          rightCircleTex: tex3.source,
          waveUniforms: {
            hgAR: { value: art1, type: "f32" },
            lcAR: { value: art2, type: "f32" },
            rcAR: { value: art3, type: "f32" },
          },
        };

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
