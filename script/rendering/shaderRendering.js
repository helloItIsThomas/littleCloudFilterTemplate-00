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

  const instanceIDData = new Float32Array(sv.totalTriangles);

  for (let i = 0; i < sv.totalTriangles; i++) {
    instanceIDData[i] = i;
  }
  // instanceIDData, true, false
  const instanceIDBuffer = new Buffer({
    data: instanceIDData,
    usage: BufferUsage.VERTEX | BufferUsage.COPY_DST,
  });

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
  const scaler = 0.5;

  const geometry = new Geometry({
    attributes: {
      aPosition: [
        -10 * scaler,
        -10 * scaler,
        10 * scaler,
        -10 * scaler,
        10 * scaler,
        10 * scaler,
        -10 * scaler,
        10 * scaler,
      ],
      aUV: [0, 0, 1, 0, 1, 1, 0, 1],
      aPositionOffset: {
        buffer: sv.instancePositionBuffer,
        instance: true,
      },
      //   aInstanceID: {
      // buffer: instanceIDBuffer,
      // instance: true,
      //   },
    },
    indexBuffer: [0, 1, 2, 0, 2, 3],
    instanceCount: sv.totalTriangles,
  });

  const gl = { vertex, fragment };

  let jfjf = new ImageSource({ resource: sv.customShapeGraphics.canvas });
  let jff = new Texture({ source: jfjf });

  const shader = Shader.from({
    gl,
    resources: {
      uTexture: jff.source, //sv.spinnyBG.source,
      uSampler: jff.source.style, //sv.spinnyBG.source.style,
      waveUniforms: {
        time: { value: 1, type: "f32" },
      },
    },
  });

  //   let s = sv.shader;
  sv.triangleMesh = new Mesh({
    geometry,
    shader,
  });

  // triangle.position.set(128 / 2, 128 / 2);

  sv.pApp.stage.addChild(sv.triangleMesh);
}
