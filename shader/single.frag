in vec2 vUV;
in float vIndex;

uniform sampler2D atlasTex;

// it seems that this is running for each grid unit.
void main() {
    float atlasColCount = 5.0;
    float atlasRowCount = 4.0;

    float xi = 0.0;
    float yi = 0.0;

    vec2 debugUV = vec2((vUV.x / atlasColCount) + (mod((1.0 / atlasColCount) * xi, 1.0)), (vUV.y / atlasRowCount) + (mod((1.0 / atlasRowCount) * yi, 1.0)));

    vec4 debug = texture2D(atlasTex, debugUV);
    gl_FragColor = debug;
}
