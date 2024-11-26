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
uniform sampler2D icon10Tex;
uniform sampler2D icon11Tex;
uniform sampler2D icon12Tex;
uniform sampler2D icon13Tex;
uniform sampler2D icon14Tex;
uniform sampler2D icon15Tex;
uniform sampler2D icon16Tex;
uniform sampler2D icon17Tex;
uniform sampler2D icon18Tex;
uniform sampler2D icon19Tex;

uniform sampler2D noiseTex;
uniform sampler2D bTex1;
uniform sampler2D bTex2;

uniform float time;
uniform float gridResolution;
uniform float rowCount;
uniform float colCount;
uniform float cellW;
uniform float cellH;
uniform float iconAR;
uniform float bTex1AR;
uniform float bTex2AR;

uniform int numBTexes;
uniform float tlThresh1;
uniform float tlThresh2;
uniform float tlThresh3;

// it seems that this is running for each grid unit.
void main() {
    float totalCells = rowCount * colCount;
    float indexFloat = vIndex * totalCells; // Scale normalized index to total cells

    float x = mod(indexFloat, colCount) / colCount;
    float y = floor(indexFloat / colCount) / rowCount;
    vec2 bTexUV = vec2(x, y);
    vec4 bTexColor = texture2D(bTex1, bTexUV);
    float brightness = bTexColor.r;
    vec4 thisIcon = texture2D(icon0Tex, vUV);

    if(brightness <= 0.05) {
        thisIcon = texture2D(icon0Tex, vUV);
    } else if(brightness >= 0.05 && brightness <= 0.1) {
        thisIcon = texture2D(icon1Tex, vUV);
    } else if(brightness >= 0.1 && brightness <= 0.15) {
        thisIcon = texture2D(icon2Tex, vUV);
    } else if(brightness >= 0.15 && brightness <= 0.2) {
        thisIcon = texture2D(icon3Tex, vUV);
    } else if(brightness >= 0.2 && brightness <= 0.25) {
        thisIcon = texture2D(icon4Tex, vUV);
    } else if(brightness >= 0.25 && brightness <= 0.3) {
        thisIcon = texture2D(icon5Tex, vUV);
    } else if(brightness >= 0.3 && brightness <= 0.35) {
        thisIcon = texture2D(icon6Tex, vUV);
    } else if(brightness >= 0.35 && brightness <= 0.4) {
        thisIcon = texture2D(icon7Tex, vUV);
    } else if(brightness >= 0.4 && brightness <= 0.45) {
        thisIcon = texture2D(icon8Tex, vUV);
    } else if(brightness >= 0.45 && brightness <= 0.5) {
        thisIcon = texture2D(icon9Tex, vUV);
    } else if(brightness >= 0.5 && brightness <= 0.55) {
        thisIcon = texture2D(icon10Tex, vUV);
    } else if(brightness >= 0.55 && brightness <= 0.6) {
        thisIcon = texture2D(icon11Tex, vUV);
    } else if(brightness >= 0.6 && brightness <= 0.65) {
        thisIcon = texture2D(icon12Tex, vUV);
    } else if(brightness >= 0.65 && brightness <= 0.7) {
        thisIcon = texture2D(icon13Tex, vUV);
    } else if(brightness >= 0.7 && brightness <= 0.75) {
        thisIcon = texture2D(icon14Tex, vUV);
    } else if(brightness >= 0.75 && brightness <= 0.8) {
        thisIcon = texture2D(icon14Tex, vUV);
    } else if(brightness >= 0.8 && brightness <= 0.85) {
        thisIcon = texture2D(icon16Tex, vUV);
    }
    // gl_FragColor = vec4(0.0, 0.0, 1.0, vUV.x);
    gl_FragColor = thisIcon;
}