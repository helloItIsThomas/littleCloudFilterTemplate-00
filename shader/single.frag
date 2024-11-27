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
    float totalNumCells = atlasColCount * atlasRowCount;

    float totalCells = rowCount * colCount;
    float indexFloat = vIndex * totalCells;

    float x = mod(indexFloat, colCount) / colCount;
    float y = floor(indexFloat / colCount) / rowCount;
    vec2 bTexUV = vec2(x, y);
    vec4 bTexColor = texture2D(bTex1, bTexUV);
    float brightness = bTexColor.r;

    float bToIndex = float(floor(brightness * (totalNumCells - 1.0)));

    float row = floor(bToIndex / atlasColCount);
    float col = mod(bToIndex, atlasColCount);

    float xi = col;
    float yi = row;

    vec2 debugUV = vec2((vUV.x / atlasColCount) + (mod((1.0 / atlasColCount) * xi, 1.0)), (vUV.y / atlasRowCount) + (mod((1.0 / atlasRowCount) * yi, 1.0)));

    gl_FragColor = texture2D(atlasTex, debugUV);
    // gl_FragColor = vec4(0.0, 0.0, brightness, 1.0);
}
