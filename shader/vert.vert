in vec2 aPosition;
in vec2 aUV;
in vec2 aPositionOffset;
in float aIndex;

uniform float vRowCount;
uniform float vColCount;
uniform float time;
uniform float scale;
uniform sampler2D noiseTex;

out vec2 vUV;
out float vIndex;

uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform mat3 uTransformMatrix;

void main() {

    float rowCount = vRowCount;
    float colCount = vColCount;

    float totalCells = rowCount * colCount;
    float indexFloat = aIndex * totalCells;
    float x = mod(indexFloat, colCount) / colCount;
    float y = floor(indexFloat / colCount) / rowCount;
    vec2 bTexUV = vec2(x, y);
    float noise = texture2D(noiseTex, bTexUV).r;

    mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
    gl_Position = vec4((mvp * vec3(aPosition * (mod(noise + time, 1.0)) + aPositionOffset, 1.0)).xy, 0.0, 1.0);

    vUV = aUV;
    vIndex = aIndex;
}