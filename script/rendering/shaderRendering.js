import { sv } from "../utils/variables.js";

import {
  Assets,
  Buffer,
  BufferUsage,
  Mesh,
  Shader,
  Geometry,
  Texture,
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

  // need a buffer big enough to store x, y of totalTriangles
  sv.instancePositionBuffer = new Buffer({
    data: new Float32Array(sv.totalTriangles * 2),
    usage: BufferUsage.VERTEX | BufferUsage.COPY_DST,
  });

  sv.triangles = [];

  for (let i = 0; i < sv.totalTriangles; i++) {
    const cell = sv.cells[i];
    sv.triangles[i] = {
      x: cell.x,
      y: cell.y + 20,
      speed: 1,
    };
  }

  const geometry = new Geometry({
    attributes: {
      aPosition: [
        -10,
        -10, // x, y
        10,
        -20, // x, y
        10,
        10,
      ],
      aUV: [
        0,
        0, // u, v
        1,
        0, // u, v
        1,
        1,
        0,
        1,
      ],
      aPositionOffset: {
        buffer: sv.instancePositionBuffer,
        instance: true,
      },
    },
    instanceCount: sv.totalTriangles,
  });

  const gl = { vertex, fragment };

  const shader = Shader.from({
    gl,
    resources: {
      uTexture: sv.spinnyBG.source,
      uSampler: sv.spinnyBG.source.style,
      waveUniforms: {
        time: { value: 1, type: "f32" },
      },
    },
  });

  const triangleMesh = new Mesh({
    geometry,
    shader,
  });

  // triangle.position.set(128 / 2, 128 / 2);

  sv.pApp.stage.addChild(triangleMesh);
}
