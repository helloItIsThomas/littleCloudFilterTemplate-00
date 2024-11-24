in vec2 vUV;
in float vIndex;

uniform sampler2D hourglassTex;
uniform sampler2D leftCircleTex;
uniform sampler2D rightCircleTex;
uniform sampler2D noiseTex;
uniform sampler2D bTex1;
uniform sampler2D bTex2;

uniform float time;
uniform float gridResolution;
uniform float rowCount;
uniform float colCount;
uniform float hgAR;
uniform float lcAR;
uniform float rcAR;
uniform float bTex1AR;
uniform float bTex2AR;

uniform int numBTexes;
uniform float tlThresh1;
uniform float tlThresh2;
uniform float tlThresh3;

float ease(float t, float easeFactor) {
    // Ensure easeFactor is between 0.5 and 2 for reasonable curve control
    easeFactor = mix(0.2, 3.0, easeFactor);
    return pow(t, easeFactor) / (pow(t, easeFactor) + pow(1.0 - t, easeFactor));
}

vec2 adjustUV(vec2 uv, float aspectRatio) {
    if(aspectRatio >= 1.0) {
        uv.x = uv.x * aspectRatio;
    } else {
        uv.y = uv.y * (1.0 / aspectRatio);
    }
    return uv;
}

void main() {
    float totalCells = rowCount * colCount;
    float indexFloat = vIndex * totalCells; // Scale normalized index to total cells

    float x = mod(indexFloat, colCount) / colCount;
    float y = floor(indexFloat / colCount) / rowCount;
    vec2 bTexUV = vec2(x, y);
    vec4 bTexColor = texture2D(bTex1, bTexUV);
    float brightness = bTexColor.r;

    vec4 rightCircle = texture2D(rightCircleTex, vUV);
    if(brightness < 0.5) {
        rightCircle = texture2D(rightCircleTex, vUV);
    } else {
        rightCircle = texture2D(leftCircleTex, vUV);
    }

    // gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    gl_FragColor = rightCircle;
}