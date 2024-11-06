in vec2 vUV;
in float vIndex;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D bTex;
uniform float time;
uniform float gridResolution;
uniform float uTex1AspectRatio;
uniform float uTex2AspectRatio;

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

    // Calculate time-based offsets
    float offset1 = brightness + time * (1.0 - brightness) + vIndex;

    // Apply offsets to the UV coordinates
    vec2 uv1 = vUV / vec2(uTex1AspectRatio, 1.0) + vec2(offset1, 0.0);
    vec2 uv2 = vUV / vec2(uTex2AspectRatio, 1.0) + vec2(offset1, 0.0);

    // Wrap UV coordinates to stay within [0, 1] range
    uv1.x = fract(uv1.x);
    uv2.x = fract(uv2.x);

    // Sample each texture with its own offset
    vec4 tex1 = texture2D(uTexture1, uv1);
    vec4 tex2 = texture2D(uTexture2, uv2);

    // Output color
    gl_FragColor = tex1;
}
