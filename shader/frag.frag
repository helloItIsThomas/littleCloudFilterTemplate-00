in vec2 vUV;
in float vIndex;

uniform sampler2D uTexture;
uniform float time;

void main() {
    gl_FragColor = vec4(vIndex, vIndex, vIndex, 1.0);
}