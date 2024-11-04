import { sv } from "../utils/variables.js";
import { Mesh, Shader, Geometry, Texture, GlProgram } from "pixi.js";
// import vertex from "../../shader/vert.glsl";
// import fragment from "../../shader/frag.glsl";

export function shaderRendering() {
  const vertices = [];
  const uvs = [];
  const cellPositions = [];

  const gridWidth = sv.gridResolution;
  const gridHeight = sv.gridResolution;

  // Generate geometry data for all cells
  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      const x = i * sv.cellW;
      const y = j * sv.cellH;

      // Define the quad for the cell
      vertices.push(
        x,
        y,
        x + sv.cellW,
        y,
        x,
        y + sv.cellH,
        x + sv.cellW,
        y + sv.cellW
      );

      // Texture coordinates
      uvs.push(0, 0, 1, 0, 0, 1, 1, 1);

      // Cell positions
      cellPositions.push(
        x,
        y,
        x + sv.cellW,
        y,
        x,
        y + sv.cellH,
        x + sv.cellW,
        y + sv.cellH
      );
    }
  }

  // const brightnessData = new Uint8Array(gridWidth * gridHeight).fill(128); // Fill with some brightness data
  const brightnessData = new Uint8Array(sv.cells.length);

  sv.cells.forEach((cell, index) => {
    brightnessData[index] = cell.brightness;
  });

  // Create a brightness texture from the data
  // const brightnessTex
  const brightnessTexture = Texture.from(brightnessData, gridWidth, gridHeight);

  const uniforms = {
    uSampler: Texture.from("/puzzle.png"), // Your main texture or texture atlas
    brightnessSampler: brightnessTexture, // Pass brightness data as texture
    cellSize: [sv.cellW, sv.cellH],
    startPos: [0.0, 0.0], // Starting position of texture offset
    endPos: [sv.cellW / 2, 0.0], // End position of texture offset
    brightnessValue: 0.0, // Initial brightness (can be updated per frame)
  };

  const geometry = new Geometry({
    attributes: {
      aVertexPosition: vertices, // Use the existing vertices array for position
      aTextureCoord: uvs, // Use existing uvs array for texture coordinates
      //   aCellPosition: {
      //     // Define as an instance attribute
      //     buffer: cellPositions, // Use your cellPositions array/buffer
      //     instance: true, // Indicate it's an instance attribute
      //   },
    },
    instanceCount: sv.gridResolution * sv.gridResolution,
  });

  const vertexShaderSrc = `
    #version 300 es

    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute vec2 aCellPosition;

    uniform mat3 projectionMatrix;

    varying vec2 vTextureCoord;
    varying vec2 vCellPosition;

    void main() {
        vTextureCoord = aTextureCoord;
        vCellPosition = aCellPosition;
        gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }
`;
  const fragmentShaderSrc = `
#version 300 es

uniform sampler2D uSampler;
uniform sampler2D brightnessSampler;
uniform vec2 startPos;
uniform vec2 endPos;
uniform vec2 cellSize;
uniform float brightnessValue;

varying vec2 vTextureCoord;
varying vec2 vCellPosition;

void main() {
    vec2 cellUV = vCellPosition / cellSize;

    // Sample brightness value
    float brightnessValue = texture2D(brightnessSampler, cellUV).r * 255.0;

    // Compute xOffset based on brightnessValue
    // ...

    // Adjust vTextureCoord
    vec2 uv = vTextureCoord;
    uv.x += xOffset / cellSize.x;

    gl_FragColor = texture2D(uSampler, uv);
}

`;

  const shader = Shader.from({
    gl: {
      vertexShaderSrc,
      fragmentShaderSrc,
    },
    resources: uniforms,
  });

  const mesh = new Mesh({
    geometry,
    shader,
  });

  sv.pApp.stage.addChild(mesh);
}
