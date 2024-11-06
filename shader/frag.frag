in vec2 vUV;
in float vIndex;

uniform sampler2D uTexture;
uniform sampler2D uTexture2;
uniform sampler2D bTex;
uniform float time;
uniform float gridResolution;

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

    float speed1 = 1.5;

    // Calculate time-based offsets
    float offset1 = time * speed1 * brightness;

    // Apply offsets to the UV coordinates
    vec2 uv1 = vUV / vec2(3.0, 1.0) + vec2(offset1, 0.0);

    // Wrap UV coordinates to stay within [0, 1] range
    uv1.x = fract(uv1.x);

    // Sample each texture with its own offset
    vec4 tex1 = texture2D(uTexture2, uv1);

    // Output color
    gl_FragColor = tex1;
}
