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
