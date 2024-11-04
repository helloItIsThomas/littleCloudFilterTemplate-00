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
// import vertex from "../../shader/vert.vert";
// import fragment from "../../shader/frag.frag";
const vertex = `
in vec2 aPosition;
in vec2 aUV;
in vec2 aPositionOffset;

out vec2 vUV;

uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform mat3 uTransformMatrix;


void main() {

    mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
    gl_Position = vec4((mvp * vec3(aPosition + aPositionOffset, 1.0)).xy, 0.0, 1.0);

    vUV = aUV;
}
`;

const fragment = `
in vec2 vUV;
uniform sampler2D uTexture;
uniform float time;

void main() {
    gl_FragColor = texture(uTexture, vUV + sin( (time + (vUV.x) * 14.) ) * 0.1 );
}
`;

export function shaderRendering() {
  sv.totalTriangles = 140;

  // need a buffer big enough to store x, y of totalTriangles
  sv.instancePositionBuffer = new Buffer({
    data: new Float32Array(sv.totalTriangles * 2),
    usage: BufferUsage.VERTEX | BufferUsage.COPY_DST,
  });

  sv.triangles = [];

  for (let i = 0; i < sv.totalTriangles; i++) {
    sv.triangles[i] = {
      x: 800 * Math.random(),
      y: 600 * Math.random(),
      speed: 1 + Math.random() * 2,
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
