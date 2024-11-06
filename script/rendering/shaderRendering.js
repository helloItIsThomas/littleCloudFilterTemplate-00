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
  console.log(typeof vertexLoader); // shader code as string
  vertex = vertexLoader;
});
const fragmentLoader = import.meta.glob("../../shader/frag.frag", {
  as: "raw",
});
fragmentLoader["../../shader/frag.frag"]().then((fragmentLoader) => {
  fragment = fragmentLoader;
});

export function shaderRendering() {
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

  const gl = { vertex, fragment };

  let src1 = new ImageSource({ resource: sv.customShapeGraphics.canvas });
  let tex1 = new Texture({ source: src1 });
  let src2 = new ImageSource({ resource: sv.circleGraphicLeft.canvas });
  let tex2 = new Texture({ source: src2 });
  let src3 = new ImageSource({ resource: sv.circleGraphicRight.canvas });
  let tex3 = new Texture({ source: src3 });

  let bTexes = [];
  bTexes = sv.stills.map((still) => {
    let src = new ImageSource({ resource: still.brightnessTex.canvas });
    let tex = new Texture({ source: src });
    return tex;
  });
  const art1 = sv.p.int(tex1.source.width / tex1.source.height);
  const art2 = sv.p.int(tex2.source.width / tex2.source.height);
  const art3 = sv.p.int(tex3.source.width / tex3.source.height);

  let resources = {};

  // Prepare resources dynamically
  resources = {
    hourglassTex: tex1.source,
    leftCircleTex: tex2.source,
    rightCircleTex: tex3.source,
    waveUniforms: {
      time: { value: 1, type: "f32" },
      gridResolution: { value: sv.gridResolution, type: "f32" },
      hgAR: { value: art1, type: "f32" },
      lcAR: { value: art2, type: "f32" },
      rcAR: { value: art3, type: "f32" },
    },
  };

  resources.waveUniforms.numBTexes = { value: bTexes.length, type: "i32" };

  bTexes.forEach((tex, index) => {
    console.log("index: ", index + 1);
    resources[`bTex${index + 1}`] = tex.source;
  });

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
}
