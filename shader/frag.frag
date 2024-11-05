in vec2 vUV;
uniform sampler2D uTexture;
uniform float time;

void main() {
    gl_FragColor = vec4(1.0, sin(time), 0.0, 1.0);//texture(uTexture, vUV + sin((time + (vUV.x) * 14.)) * 0.1);
}