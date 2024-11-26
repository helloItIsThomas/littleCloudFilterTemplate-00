in vec2 vUV;
in float vIndex;

// uniform sampler2D hourglassTex;
uniform sampler2D icon0Tex;
uniform sampler2D icon1Tex;
uniform sampler2D icon2Tex;
uniform sampler2D icon3Tex;
uniform sampler2D icon4Tex;
uniform sampler2D icon5Tex;
uniform sampler2D icon6Tex;
uniform sampler2D icon7Tex;
uniform sampler2D icon8Tex;
uniform sampler2D icon9Tex;

uniform sampler2D noiseTex;
uniform sampler2D bTex1;
uniform sampler2D bTex2;

uniform float time;
uniform float gridResolution;
uniform float rowCount;
uniform float colCount;
uniform float iconAR;
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

    vec4 rightCircle = texture2D(icon0Tex, vUV);
    if(brightness < 0.5) {
        rightCircle = texture2D(icon0Tex, vUV);
    } else {
        rightCircle = texture2D(icon0Tex, vUV);
    }

    gl_FragColor = vec4(0.0, 0.0, brightness, 1.0);
    // gl_FragColor = rightCircle;
}