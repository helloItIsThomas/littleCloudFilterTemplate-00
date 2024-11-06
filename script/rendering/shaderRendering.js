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
  sv.totalTriangles = sv.totalCells;

  sv.instancePositionBuffer = new Buffer({
    data: new Float32Array(sv.totalTriangles * 2),
    usage: BufferUsage.VERTEX | BufferUsage.COPY_DST,
  });

  sv.triangles = [];

  for (let i = 0; i < sv.totalTriangles; i++) {
    const cell = sv.cells[i];
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
  let src2 = new ImageSource({ resource: sv.circleGraphics.canvas });
  let tex2 = new Texture({ source: src2 });
  let srcB = new ImageSource({ resource: sv.bb.canvas });
  let bTex = new Texture({ source: srcB });
  const art1 = sv.p.int(tex1.source.width / tex1.source.height);
  const art2 = sv.p.int(tex2.source.width / tex2.source.height);

  const shader = Shader.from({
    gl,
    resources: {
      uTexture1: tex1.source,
      uTexture2: tex2.source,
      bTex: bTex.source,
      waveUniforms: {
        time: { value: 1, type: "f32" },
        gridResolution: { value: sv.gridResolution, type: "f32" },
        uTex1AspectRatio: { value: art1, type: "f32" },
        uTex2AspectRatio: { value: art2, type: "f32" },
      },
    },
  });

  //   let s = sv.shader;
  sv.triangleMesh = new Mesh({
    geometry,
    shader,
    drawMode: "triangle-list",
  });

  sv.pApp.stage.addChild(sv.triangleMesh);
}
