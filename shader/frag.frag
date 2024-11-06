in vec2 vUV;
in float vIndex;

uniform sampler2D hourglassTex;
uniform sampler2D leftCircleTex;
uniform sampler2D rightCircleTex;
uniform sampler2D bTex;
uniform float time;
uniform float gridResolution;
uniform float hgAR;
uniform float lcAR;
uniform float rcAR;

void main() {
    // Convert normalized vIndex to an absolute index
    float totalCells = gridResolution * gridResolution;
    float indexFloat = vIndex * totalCells; // Scale normalized index to total cells

    // Calculate x and y based on indexFloat
    float x = mod(indexFloat, gridResolution) / gridResolution;
    float y = floor(indexFloat / gridResolution) / gridResolution;

    // Sample bTex at the calculated normalized coordinates
    vec4 bTexColor = texture2D(bTex, vec2(x, y));
    float brightness = bTexColor.r;

    float offset1 = 0.0;
    float offset2 = 0.0;
    float offset3 = time;

    // Apply offsets to the UV coordinates
    vec2 hgUV = vUV / vec2(hgAR, 1.0) + vec2(offset1, 0.0);
    vec2 lcUV = vUV / vec2(lcAR, 1.0) + vec2(offset2, 0.0);
    vec2 rcUV = vUV / vec2(rcAR, 1.0) + vec2(offset3, 0.0);

    // Wrap UV coordinates to stay within [0, 1] range
    hgUV.x = fract(hgUV.x);
    lcUV.x = fract(lcUV.x);
    rcUV.x = fract(rcUV.x);

    // Sample each texture with its own offset
    vec4 hourglass = texture2D(hourglassTex, hgUV);
    vec4 leftCircle = texture2D(leftCircleTex, lcUV);
    vec4 rightCircle = texture2D(rightCircleTex, rcUV);

    // Output color
    gl_FragColor = rightCircle;
}
