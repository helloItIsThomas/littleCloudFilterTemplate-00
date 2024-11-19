in vec2 vUV;
in float vIndex;

uniform sampler2D hourglassTex;
uniform sampler2D leftCircleTex;
uniform sampler2D rightCircleTex;
uniform sampler2D noiseTex;
uniform sampler2D bTex1;
uniform sampler2D bTex2;

uniform float time;
uniform float gridResolution;
uniform float hgAR;
uniform float lcAR;
uniform float rcAR;
uniform int numBTexes;
uniform float tlThresh1;
uniform float tlThresh2;
uniform float tlThresh3;

float ease(float t, float easeFactor) {
    // Ensure easeFactor is between 0.5 and 2 for reasonable curve control
    easeFactor = mix(0.2, 3.0, easeFactor);
    return pow(t, easeFactor) / (pow(t, easeFactor) + pow(1.0 - t, easeFactor));
}

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

    vec4 noise = texture2D(noiseTex, vec2(x, y));

    if(numBTexes == 2) {
        vec4 bTexColor2 = texture2D(bTex2, vec2(x, y));
        // vec4 testLerp = mix(bTexColor, bTexColor2, time);
        // brightness = testLerp.r;
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    }

    // brightness = bTexColor.r + (time + (noise.r * 0.3));
    // brightness = bTexColor.r + ease(time, noise.r);
    // brightness = bTexColor.r;
    // brightness = bTexColor.r + time;
    // brightness = bTexColor.r + abs(sin(time));

    // Apply offsets to the UV coordinates
    vec2 hgUV = vUV / vec2(hgAR, 1.0);
    vec2 lcUV = vUV / vec2(lcAR, 1.0);
    vec2 rcUV = vUV / vec2(rcAR, 1.0);

    float lcUV_x;
    float hgUV_x;
    float rcUV_x;

    float point1 = tlThresh1; //0.2;
    float point2 = tlThresh2; //0.4;
    float point3 = tlThresh3; //0.8;

    // Map brightness to lcUV.x (0.0 to 0.25 for brightness 0.0 to 0.25)
    if(brightness <= point1) {
        lcUV_x = brightness / point1 * point1;
    } else {
        lcUV_x = point1;
    }

    // Map brightness to hgUV.x (0.0 to 0.5 for brightness 0.25 to 0.6)
    if(brightness > point1 && brightness <= point2) {
        hgUV_x = (brightness - point1) / (point2 - point1) * 0.5;
    } else if(brightness > point2) {
        hgUV_x = 0.5;
    } else {
        hgUV_x = 0.0;
    }

    // Map brightness to rcUV.x
    if(brightness > point1 && brightness <= point2) {
    // Map 0.25 - 0.4 brightness to 0.0 - 0.25 rcUV.x
        rcUV_x = (brightness - point1) / (point2 - point1) * point1;
    } else if(brightness > point2 && brightness <= point3) {
    // Keep rcUV_x constant at 0.25 in the mid-range to prevent snapping
        rcUV_x = point1;
    } else if(brightness > point3) {
    // Map 0.6 - 1.0 brightness to 0.25 - 1.0 rcUV.x
        rcUV_x = point1 + (brightness - point3) / (1.0 - point3) * 0.75;
    } else {
        rcUV_x = 0.0;
    }

    hgUV.x = hgUV.x + hgUV_x;
    lcUV.x = lcUV.x + 0.125 + lcUV_x;
    rcUV.x = rcUV.x - 0.125 + rcUV_x;

    // Sample each texture with its own offset
    vec4 hourglass = texture2D(hourglassTex, hgUV);
    vec4 leftCircle = texture2D(leftCircleTex, lcUV);
    vec4 rightCircle = texture2D(rightCircleTex, rcUV);

    // gl_FragColor = hourglass + rightCircle + leftCircle;
    // gl_FragColor = rightCircle;
}