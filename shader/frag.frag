in vec2 vUV;
in float vIndex;

uniform sampler2D hourglassTex;
uniform sampler2D leftCircleTex;
uniform sampler2D rightCircleTex;
uniform sampler2D bTex;
uniform sampler2D bTex2;
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
    vec4 bTexColor2 = texture2D(bTex2, vec2(x, y));

    vec4 testLerp = mix(bTexColor, bTexColor2, abs(sin(time)));
    float brightness = testLerp.r;

    float hgOff = 0.0;
    float lcOff = 0.0;
    float rcOff = 0.0;

    // Apply offsets to the UV coordinates
    vec2 hgUV = vUV / vec2(hgAR, 1.0) + vec2(hgOff, 0.0);
    vec2 lcUV = vUV / vec2(lcAR, 1.0) + vec2(lcOff, 0.0);
    vec2 rcUV = vUV / vec2(rcAR, 1.0) + vec2(rcOff, 0.0);

    // map brightness from 0.0 => 0.25 to lcUV.x 0.0 => 0.25
    //  if brightness > 0.25, lcUV.x should stay at 0.25
    // map brightness from 0.25 => 0.6 to hgUV.x 0.0 => 0.5
    //  if brightness > 0.6, hgUV.x should stay at 0.5
    // map brightness from 0.25 => 0.4 to rcUV.x 0.0 => 0.25
    // map brightness from 0.6 => 1.0 to rcUV.x 0.25 => 1.0

    float lVal = min(brightness / 0.25, 1.0);
    float rVal = 0.0;
    if(brightness <= 0.4) {
        rVal = min((brightness - 0.25) / (0.4 - 0.25), 1.0) * 0.25;
    } else if(brightness > 0.6) {
        rVal = 0.25 + ((brightness - 0.6) / (1.0 - 0.6)) * 0.75;
    }
    float hgVal = 0.0;
    if(brightness > 0.25 && brightness <= 0.6) {
        hgVal = ((brightness - 0.25) / (0.6 - 0.25)) * 0.5;
    } else if(brightness > 0.6) {
        hgVal = 0.5;
    }

    vec2 debug = vUV;
    debug.x = fract(debug.x + time);
    debug.y = fract(debug.y);
    // Wrap UV coordinates to stay within [0, 1] range
    hgUV.x = fract(hgUV.x + hgVal);
    lcUV.x = fract(lcUV.x + 0.125 + lVal);
    rcUV.x = fract(rcUV.x - 0.625 + rVal);

    // Sample each texture with its own offset
    vec4 hourglass = texture2D(hourglassTex, hgUV);
    vec4 leftCircle = texture2D(leftCircleTex, lcUV);
    vec4 rightCircle = texture2D(rightCircleTex, rcUV);

    // Output color
    gl_FragColor = hourglass;
    // gl_FragColor = vec4(tempVal, tempVal, tempVal, 1.0);
}
