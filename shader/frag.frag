in vec2 vUV;
in float vIndex;

uniform sampler2D uTexture;
uniform sampler2D uTexture2;
uniform float time;

void main() {
    // Define movement speeds for each texture
    float speed1 = 10.5; // Adjust the speed as needed
    float speed2 = 10.75;
    float speed3 = 10.0;

    // Calculate time-based offsets
    float offset1 = time * speed1 * (vIndex);
    float offset2 = time * speed2 * (vIndex);
    float offset3 = time * speed3 * (vIndex);

    // Apply offsets to the UV coordinates
    vec2 uv1 = vUV + vec2(offset1, 0.0);
    vec2 uv2 = vUV + vec2(offset2, 0.0);
    vec2 uv3 = vUV + vec2(offset3, 0.0);

    // Wrap UV coordinates to stay within [0, 1] range
    uv1.x = fract(uv1.x);
    uv2.x = fract(uv2.x);
    uv3.x = fract(uv3.x);

    // Sample each texture with its own offset
    vec4 tex1 = texture2D(uTexture, uv1);
    vec4 tex2 = texture2D(uTexture2, uv2);
    vec4 tex3 = texture2D(uTexture, uv3);

    // Combine textures
    gl_FragColor = tex3;
}
