in vec2 vUV;
in float vIndex;

// uniform sampler2D hourglassTex;
uniform sampler2D atlasTex;
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
    float bTime = sin(brightness + time);
    float noise = texture2D(noiseTex, bTexUV).r;
    float bTime2 = mod(time + x + y + noise + brightness, 1.0);

    // vec4 debug = texture2D(atlasTex, vUV);
    vec4 debug = vec4(0.0, 0.0, bTime2, 1.0);

    gl_FragColor = debug;
}