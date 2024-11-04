attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec2 aCellPosition;

uniform mat3 projectionMatrix;


varying vec2 vTextureCoord;
varying vec2 vCellPosition;

void main() {
    vTextureCoord = aTextureCoord;
    vCellPosition = aCellPosition;
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
}
