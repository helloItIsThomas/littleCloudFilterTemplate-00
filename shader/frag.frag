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
    brightness = bTexColor.r + time;
    // brightness = time;

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
    float lcUV_x;
    float hgUV_x;
    float rcUV_x;

    // Map brightness to lcUV.x (0.0 to 0.25 for brightness 0.0 to 0.25)
    if(brightness <= 0.25) {
        lcUV_x = brightness / 0.25 * 0.25;
    } else {
        lcUV_x = 0.25;
    }

    // Map brightness to hgUV.x (0.0 to 0.5 for brightness 0.25 to 0.6)
    if(brightness > 0.25 && brightness <= 0.6) {
        hgUV_x = (brightness - 0.25) / (0.6 - 0.25) * 0.5;
    } else if(brightness > 0.6) {
        hgUV_x = 0.5;
    } else {
        hgUV_x = 0.0;
    }

// Map brightness to rcUV.x
    if(brightness > 0.25 && brightness <= 0.4) {
    // Map 0.25 - 0.4 brightness to 0.0 - 0.25 rcUV.x
        rcUV_x = (brightness - 0.25) / (0.4 - 0.25) * 0.25;
    } else if(brightness > 0.4 && brightness <= 0.6) {
    // Keep rcUV_x constant at 0.25 in the mid-range to prevent snapping
        rcUV_x = 0.25;
    } else if(brightness > 0.6) {
    // Map 0.6 - 1.0 brightness to 0.25 - 1.0 rcUV.x
        rcUV_x = 0.25 + (brightness - 0.6) / (1.0 - 0.6) * 0.75;
    } else {
        rcUV_x = 0.0;
    }

    // float minClampVal = 0.0;
    // float maxClampVal = 0.7;
    // hgUV.x = clamp(hgUV.x + hgUV_x, minClampVal, maxClampVal);
    // lcUV.x = clamp(lcUV.x + 0.125 + lcUV_x, minClampVal, maxClampVal);
    // rcUV.x = clamp(rcUV.x - 0.125 + rcUV_x, minClampVal, maxClampVal);

    float minClampVal = 0.0;
    float maxClampVal = 0.8;
    float interval1 = hgUV.x + hgUV_x;
    float interval2 = lcUV.x + 0.125 + lcUV_x;
    float interval3 = rcUV.x - 0.125 + rcUV_x;

// Find minimum and maximum of the intervals to check range
    float minValue = min(min(interval1, interval2), interval3);
    float maxValue = max(max(interval1, interval2), interval3);

// Calculate the necessary shift to fit within minClampVal and maxClampVal
    float shift = 0.0;
    if(minValue < minClampVal) {
        shift = minClampVal - minValue;
    } else if(maxValue > maxClampVal) {
        shift = maxClampVal - maxValue;
    }

// Apply shift or set to 0.0 if minValue reaches minClampVal
    if(maxValue <= maxClampVal) {
        hgUV.x = 1.0;
        lcUV.x = 1.0;
        rcUV.x = 1.0;
    } else {
        hgUV.x = interval1 + shift;
        lcUV.x = interval2 + shift;
        rcUV.x = interval3 + shift;
    }

    // float timeOrBrightness = brightness;
    // hgUV.x = clamp(hgUV.x + timeOrBrightness, 0.0, 1.0);
    // lcUV.x = clamp(lcUV.x + 0.125 + timeOrBrightness, 0.0, 1.0);
    // rcUV.x = clamp(rcUV.x - 0.125 + timeOrBrightness, 0.0, 1.0);

    // Sample each texture with its own offset
    vec4 hourglass = texture2D(hourglassTex, hgUV);
    vec4 leftCircle = texture2D(leftCircleTex, lcUV);
    vec4 rightCircle = texture2D(rightCircleTex, rcUV);

    // Output color
    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    // gl_FragColor = rightCircle + leftCircle + hourglass;
    gl_FragColor = hourglass;
}