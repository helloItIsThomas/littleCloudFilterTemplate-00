in vec2 vUV;
in float vIndex;

uniform sampler2D hourglassTex;
uniform sampler2D leftCircleTex;
uniform sampler2D rightCircleTex;
uniform sampler2D bTex1;
uniform sampler2D bTex2;

uniform float time;
uniform float gridResolution;
uniform float hgAR;
uniform float lcAR;
uniform float rcAR;
uniform int numBTexes;

void main() {
    // Convert normalized vIndex to an absolute index
    float totalCells = gridResolution * gridResolution;
    float indexFloat = vIndex * totalCells; // Scale normalized index to total cells

    // Calculate x and y based on indexFloat
    float x = mod(indexFloat, gridResolution) / gridResolution;
    float y = floor(indexFloat / gridResolution) / gridResolution;

    // Sample bTex at the calculated normalized coordinates
    vec4 bTexColor = texture2D(bTex1, vec2(x, y));
    float brightness = bTexColor.r;

    if(numBTexes == 2) {
        vec4 bTexColor2 = texture2D(bTex2, vec2(x, y));
        vec4 testLerp = mix(bTexColor, bTexColor2, abs(sin(time)));
        brightness = testLerp.r;
    }
    brightness = 0.0;
    brightness = bTexColor.r;

    // Apply offsets to the UV coordinates
    vec2 hgUV = vUV / vec2(hgAR, 1.0);
    vec2 lcUV = vUV / vec2(lcAR, 1.0);
    vec2 rcUV = vUV / vec2(rcAR, 1.0);

    // map brightness from 0.0 => 0.25 to lcUV.x 0.0 => 0.25
    //  if brightness > 0.25, lcUV.x should stay at 0.25
    // map brightness from 0.25 => 0.6 to hgUV.x 0.0 => 0.5
    //  if brightness > 0.6, hgUV.x should stay at 0.5
    // map brightness from 0.25 => 0.4 to rcUV.x 0.0 => 0.25
    // map brightness from 0.6 => 1.0 to rcUV.x 0.25 => 1.0

    float timeOrBrightness = brightness;

    hgUV.x = clamp(hgUV.x + timeOrBrightness, 0.0, 1.0);
    lcUV.x = clamp(lcUV.x + 0.125 + timeOrBrightness, 0.0, 1.0);
    rcUV.x = clamp(rcUV.x - 0.125 + timeOrBrightness, 0.0, 1.0);

    // Sample each texture with its own offset
    vec4 hourglass = texture2D(hourglassTex, hgUV);
    vec4 leftCircle = texture2D(leftCircleTex, lcUV);
    vec4 rightCircle = texture2D(rightCircleTex, rcUV);

    // Output color
    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    // gl_FragColor = rightCircle + leftCircle;
    gl_FragColor = hourglass + rightCircle + leftCircle;
}