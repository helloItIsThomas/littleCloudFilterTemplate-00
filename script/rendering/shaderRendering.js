import { sv } from "../utils/variables.js";

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
} from "pixi.js";

let vertex;
let fragment;

const vertexLoader = import.meta.glob("../../shader/vert.vert", { as: "raw" });
vertexLoader["../../shader/vert.vert"]().then((vertexLoader) => {
  vertex = vertexLoader;
});
const fragmentLoader = import.meta.glob("../../shader/frag.frag", {
  as: "raw",
});
fragmentLoader["../../shader/frag.frag"]().then((fragmentLoader) => {
  fragment = fragmentLoader;
});

export function shaderRendering() {
  // console.log("°·°‡€ﬁﬂrunning shader rendering·°‡ﬁﬂ");
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
      speed: 1,
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

  const gl = { vertex, fragment };

  let src1 = new ImageSource({ resource: sv.customShapeGraphics.canvas });
  let tex1 = new Texture({ source: src1 });
  let src2 = new ImageSource({ resource: sv.circleGraphicLeft.canvas });
  let tex2 = new Texture({ source: src2 });
  let src3 = new ImageSource({ resource: sv.circleGraphicRight.canvas });
  let tex3 = new Texture({ source: src3 });
  let noiseSrc = new ImageSource({ resource: noiseCanvas.canvas });
  let noiseTex = new Texture({ source: noiseSrc });

  let bTexes = [];
  bTexes = sv.stills.map((still) => {
    let src = new ImageSource({ resource: still.brightnessTex });
    let tex = new Texture({ source: src });
    return tex;
  });
  const art1 = sv.p.int(tex1.source.width / tex1.source.height);
  const art2 = sv.p.int(tex2.source.width / tex2.source.height);
  const art3 = sv.p.int(tex3.source.width / tex3.source.height);
  const tlThresh1 = 0.15;
  const tlThresh2 = 0.25;
  const tlThresh3 = 0.5;

  let resources = {};
  if (resources) {
    Object.keys(resources).forEach((key) => {
      const resource = resources[key];
      if (resource instanceof WebGLBuffer) gl.deleteBuffer(resource);
      else if (resource instanceof HTMLElement) resource.remove();
      // Add other resource types if needed.
    });
  }
  resources = {}; // Clears the object reference.

  // Prepare resources dynamically
  resources = {
    hourglassTex: tex1.source,
    leftCircleTex: tex2.source,
    rightCircleTex: tex3.source,
    noiseTex: noiseTex.source,
    waveUniforms: {
      time: { value: 1, type: "f32" },
      gridResolution: { value: sv.gridResolution, type: "f32" },
      hgAR: { value: art1, type: "f32" },
      lcAR: { value: art2, type: "f32" },
      rcAR: { value: art3, type: "f32" },

      tlThresh1: { value: tlThresh1, type: "f32" },
      tlThresh2: { value: tlThresh2, type: "f32" },
      tlThresh3: { value: tlThresh3, type: "f32" },
    },
  };

  console.log(bTexes.length);
  resources.waveUniforms.numBTexes = { value: bTexes.length, type: "i32" };

  if (bTexes.length == 1) {
    resources["bTex1"] = bTexes[0].source;
    resources["bTex2"] = bTexes[0].source;
  } else if (bTexes.length == 2) {
    resources["bTex1"] = bTexes[0].source;
    resources["bTex2"] = bTexes[1].source;
  } else if (bTexes.length > 2) {
    console.error(" > 2 Images Not Supported ");
  } else console.log(" Currently " + bTexes.length + "Number of Images ");

  // bTexes.forEach((tex, index) => {
  // resources[`bTex${index + 1}`] = tex.source;
  // });

  const shader = Shader.from({
    gl,
    resources,
  });

  //   let s = sv.shader;
  sv.triangleMesh = new Mesh({
    geometry,
    shader,
    drawMode: "triangle-list",
  });
  sv.pApp.stage.removeChildren();
  sv.pApp.stage.addChild(sv.triangleMesh);

  const data = sv.instancePositionBuffer.data;
  let count = 0;
  for (let i = 0; i < sv.totalTriangles; i++) {
    const triangle = sv.triangles[i];
    data[count++] = triangle.x;
    data[count++] = triangle.y;
  }

  // the below stuff is not needed until we sort the web workers stuff
  // sv.pContainer.addChild(sv.triangleMesh);
  // sv.pContainer.addChild(sv.loadingScreen);
  // the above stuff is not needed until we sort the web workers stuff
  // console.log("finished shaderRendering");
}
