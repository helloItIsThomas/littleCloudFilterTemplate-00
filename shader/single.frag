in vec2 vUV;
in float vIndex;

uniform float rowCount;
uniform float colCount;

uniform sampler2D bTex1;
uniform sampler2D bTex2;
uniform sampler2D atlasTex;

void main() {
    float atlasColCount = 5.0;
    float atlasRowCount = 4.0;

    float totalCells = rowCount * colCount;
    float indexFloat = vIndex * totalCells; // Scale normalized index to 

    float x = mod(indexFloat, colCount) / colCount;
    float y = floor(indexFloat / colCount) / rowCount;
    vec2 bTexUV = vec2(x, y);
    vec4 bTexColor = texture2D(bTex1, bTexUV);
    float brightness = bTexColor.r;

    float xi = 0.0;
    float yi = 0.0;

    // Add padding to distribute gaps at the top and bottom
    float totalGapHeight = 1.0 - (1.0 / atlasRowCount) * atlasRowCount;
    float padding = totalGapHeight / 2.0;

    vec2 debugUV = vec2((vUV.x / atlasColCount) + (mod((1.0 / atlasColCount) * xi, 1.0)), (vUV.y / atlasRowCount) + padding + (mod((1.0 / atlasRowCount) * yi, 1.0)));

    gl_FragColor = texture2D(atlasTex, debugUV);
    // gl_FragColor = vec4(0.0, 0.0, brightness, 1.0);
}
