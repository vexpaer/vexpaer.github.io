// Liquid glass renderer for the web.
//
// This is a direct port of the Direct3D 11 / HLSL renderer in
// native_app/main.cpp.  The optical model is unchanged: the same superelliptic
// capsule profile, the same glass-to-air Fresnel term, the same total internal
// reflection band, the same per-channel dispersion path, the same frosted
// laminate, the same shadow and caustic.  Three things are generalized so the
// effect can be applied to arbitrary page content:
//
//   * the capsule signed distance field became a rounded-box field, which
//     reduces to the original capsule when halfSize.y equals cornerRadius;
//   * the desktop capture became a pluggable backdrop source (rasterized DOM,
//     an image/video/canvas element, or a user callback);
//   * all optical constants are expressed in CSS pixels while the render
//     target runs at devicePixelRatio.

import {
  acquireSharedSnapshot,
  releaseSharedSnapshot,
  EXCLUDE_ATTRIBUTE,
} from './dom-snapshot.js';

export const BASE_LENS_RADIUS = 47.0;
export const BASE_LENS_HALF_BODY = 118.0;
export const HOVER_SCALE = 1.045;
export const PRESSED_SCALE = 1.115;
const DEGREES = Math.PI / 180.0;

export const DEFAULT_SETTINGS = Object.freeze({
  dispersion: 3,
  internalReflection: 100,
  edgeRefraction: 100,
  externalReflection: 80,
  shadowDepth: 40,
  highlightDirection: 315,
  highlightStrength: 150,
  internalBlur: 0,
  highlightFollowMouse: true,
  touchFeedback: true,
  dragFeedback: true,
  circle: false,
  size: 200,
  length: 50,
});

// The size slider is quadratic: it reaches 50% at the left stop and 1000% at
// the right stop, growing faster toward the right.
export function sizeValueFromSliderPosition(position) {
  const t = Math.min(Math.max(position / 100.0, 0.0), 1.0);
  return Math.round(50.0 + 950.0 * t * t);
}

export function sizeSliderPositionFromValue(value) {
  const normalized = Math.min(Math.max((value - 50.0) / 950.0, 0.0), 1.0);
  return Math.round(Math.sqrt(normalized) * 100.0);
}

const VERTEX_SHADER = `#version 300 es
void main() {
  vec2 p = gl_VertexID == 0
      ? vec2(-1.0, -1.0)
      : (gl_VertexID == 1 ? vec2(-1.0, 3.0) : vec2(3.0, -1.0));
  gl_Position = vec4(p, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
precision highp sampler2D;

uniform vec2 resolution;
uniform vec2 backdropSize;
uniform vec2 windowPosition;
uniform vec2 halfSize;
uniform float pixelRatio;
uniform float scale;
uniform float cornerRadius;
uniform float profileRadius;
uniform float dispersionAmount;
uniform float internalReflectionStrength;
uniform float edgeRefractionStrength;
uniform float externalReflectionStrength;
uniform float shadowDepth;
uniform float highlightDirection;
uniform float highlightStrength;
uniform float internalBlurAmount;
uniform float maximumLod;
uniform sampler2D backdropTexture;

out vec4 fragmentColor;

// Reduces to the native capsule field when halfSize == vec2(halfBody + r, r)
// and cornerRadius == r.
float roundedBoxSdf(vec2 p, vec2 extent, float radius) {
  vec2 q = abs(p) - (max(extent, vec2(radius)) - vec2(radius));
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

float lensSdf(vec2 p) {
  return roundedBoxSdf(p, halfSize, cornerRadius);
}

float lensHeight(vec2 p, float rangeScale) {
  // Cross-section: a flat, parallel central plate joined by a superelliptic
  // shoulder.  The fourth-order plateau term makes both slope and curvature
  // settle gradually before the flat region, while the square root retains a
  // near-vertical tangent at the outside edge.
  if (rangeScale <= 0.0001) return 1.0;
  float shoulderWidth = max(profileRadius * 0.7234 * rangeScale, 1.0);
  float inward = clamp(-lensSdf(p) / shoulderWidth, 0.0, 1.0);
  float plateauDistance = 1.0 - inward;
  return sqrt(max(1.0 - pow(plateauDistance, 4.0), 0.0));
}

vec2 lensHeightGradient(vec2 p, float rangeScale) {
  const float epsilon = 0.75;
  float dx = lensHeight(p + vec2(epsilon, 0.0), rangeScale) -
             lensHeight(p - vec2(epsilon, 0.0), rangeScale);
  float dy = lensHeight(p + vec2(0.0, epsilon), rangeScale) -
             lensHeight(p - vec2(0.0, epsilon), rangeScale);
  return vec2(dx, dy) / (2.0 * epsilon);
}

float glassToAirReflectance(float cosineInside, float ior) {
  float transmittedSineSquared =
      ior * ior * max(1.0 - cosineInside * cosineInside, 0.0);
  if (transmittedSineSquared >= 1.0) return 1.0;
  float transmittedCosine = sqrt(max(1.0 - transmittedSineSquared, 0.0));
  float rsNumerator = ior * cosineInside - transmittedCosine;
  float rsDenominator = max(ior * cosineInside + transmittedCosine, 0.0001);
  float rpNumerator = cosineInside - ior * transmittedCosine;
  float rpDenominator = max(cosineInside + ior * transmittedCosine, 0.0001);
  float rs = rsNumerator / rsDenominator;
  float rp = rpNumerator / rpDenominator;
  return clamp(0.5 * (rs * rs + rp * rp), 0.0, 1.0);
}

vec2 traceThroughGlass(vec2 heightGradient, float height, float ior,
                       float radius) {
  float crownHeight = radius * 0.4681;
  float baseThickness = radius * 0.1277;
  float airGap = radius * 0.1489;
  vec3 incident = vec3(0.0, 0.0, -1.0);
  vec3 topNormal = normalize(vec3(-heightGradient * crownHeight, 1.0));
  vec3 insideRay = refract(incident, topNormal, 1.0 / ior);

  // The direct transmitted path exits through the flat lower face.  Its
  // reverse path is guaranteed by reciprocity, so this branch does not carry
  // the side-wall total-internal-reflection energy.
  float cosineAtBottom = clamp(-insideRay.z, 0.0, 1.0);
  vec3 exitRay = refract(insideRay, vec3(0.0, 0.0, -1.0), ior);

  float glassDistance = (baseThickness + crownHeight * height) /
                        max(cosineAtBottom, 0.12);
  float exitCosine = max(-exitRay.z, 0.24);
  vec2 offset = insideRay.xy * glassDistance +
                exitRay.xy * (airGap / exitCosine);
  float offsetLength = length(offset);
  float maximumOffset = radius * 0.8085;
  if (offsetLength > maximumOffset) offset *= maximumOffset / offsetLength;
  return offset;
}

vec3 sampleBackdrop(vec2 localPixel, vec2 offset) {
  vec2 screenPixel = windowPosition + localPixel + offset;
  vec2 uv = clamp(screenPixel / backdropSize, 0.0, 1.0);
  return textureLod(backdropTexture, uv, 0.0).rgb;
}

vec3 sampleBackdropLod(vec2 localPixel, vec2 offset, float lod) {
  vec2 screenPixel = windowPosition + localPixel + offset;
  vec2 uv = clamp(screenPixel / backdropSize, 0.0, 1.0);
  return textureLod(backdropTexture, uv, lod).rgb;
}

vec3 sampleFrostedBackdrop(vec2 localPixel, vec2 opticalOffset, float radius,
                           float amount) {
  // Each tap is already continuously low-pass filtered by the GPU-generated
  // mip chain.  Overlapping nine such footprints produces real wide-area
  // diffusion without sparse dots, copied letters, grids, or temporal noise.
  float lod = clamp(log2(max(radius * pixelRatio * 0.78, 1.0)), 0.0,
                    min(8.0, maximumLod));
  float tapLod = max(lod - 0.45, 0.0);
  float tapRadius = radius * 0.52;
  vec3 diffused = sampleBackdropLod(localPixel, opticalOffset, lod) * 0.20;
  diffused += sampleBackdropLod(localPixel, opticalOffset + vec2(0.9239, 0.3827) * tapRadius, tapLod) * 0.10;
  diffused += sampleBackdropLod(localPixel, opticalOffset + vec2(0.3827, 0.9239) * tapRadius, tapLod) * 0.10;
  diffused += sampleBackdropLod(localPixel, opticalOffset + vec2(-0.3827, 0.9239) * tapRadius, tapLod) * 0.10;
  diffused += sampleBackdropLod(localPixel, opticalOffset + vec2(-0.9239, 0.3827) * tapRadius, tapLod) * 0.10;
  diffused += sampleBackdropLod(localPixel, opticalOffset + vec2(-0.9239, -0.3827) * tapRadius, tapLod) * 0.10;
  diffused += sampleBackdropLod(localPixel, opticalOffset + vec2(-0.3827, -0.9239) * tapRadius, tapLod) * 0.10;
  diffused += sampleBackdropLod(localPixel, opticalOffset + vec2(0.3827, -0.9239) * tapRadius, tapLod) * 0.10;
  diffused += sampleBackdropLod(localPixel, opticalOffset + vec2(0.9239, -0.3827) * tapRadius, tapLod) * 0.10;

  // Frosted glass mixes neighbouring rays and partially depolarizes their
  // colour.  The haze below is derived only from that broadly diffused light;
  // there is no random grain and no fixed white veil that could form spots.
  float luminance = dot(diffused, vec3(0.2126, 0.7152, 0.0722));
  diffused = mix(diffused, vec3(luminance), 0.20 * amount);
  diffused = mix(diffused, sqrt(clamp(diffused, 0.0, 1.0)), 0.14 * amount);
  return clamp(diffused, 0.0, 1.0);
}

void main() {
  // gl_FragCoord is bottom-up and in device pixels; the optical model is
  // top-down and in CSS pixels, exactly like SV_Position on the native side.
  vec2 frag = vec2(gl_FragCoord.x,
                   resolution.y * pixelRatio - gl_FragCoord.y) / pixelRatio;
  vec2 p = (frag - resolution * 0.5) / scale;
  float radius = profileRadius;
  float geometryScale = radius / 47.0;
  float crownHeight = radius * 0.4681;
  float d = lensSdf(p);

  // Internal-reflection range is purely a spatial-width control.  Keep its
  // optical surface fixed at the calibrated default profile so changing the
  // slider cannot alter the normal, reflected-ray direction, or image reach.
  const float reflectionProfileScale = 0.70;
  vec2 reflectionGradient = internalReflectionStrength <= 0.0001
      ? vec2(0.0, 0.0)
      : lensHeightGradient(p, reflectionProfileScale) * reflectionProfileScale;
  vec3 topNormal = normalize(vec3(-reflectionGradient * crownHeight, 1.0));
  float viewCosine = clamp(topNormal.z, 0.0, 1.0);
  // Derivatives are evaluated before any early exit so that the whole quad
  // still holds a defined value when the lens boundary crosses it.
  float angularSoftness = 0.14 + min(fwidth(viewCosine) * 1.5, 0.08);

  float bodyHalfWidth = max(halfSize.x - cornerRadius, 0.0);
  float bodyHalfHeight = max(halfSize.y - cornerRadius, 0.0);
  vec2 shadowShift = vec2(19.0, 22.0) * geometryScale;
  vec2 shadowGrow = vec2(bodyHalfWidth * 0.025 + radius * 0.06,
                         bodyHalfHeight * 0.025 + radius * 0.06);
  float shadowDistance =
      roundedBoxSdf(p - shadowShift, halfSize + shadowGrow, cornerRadius * 1.06);
  float shadowOuter = 1.0 - smoothstep(0.0, 28.0 * geometryScale, shadowDistance);
  float shadowInner = smoothstep(-20.0 * geometryScale,
                                 1.5 * geometryScale, shadowDistance);
  float shadow = shadowOuter * shadowInner;
  vec2 causticShift = vec2(30.0, 29.0) * geometryScale;
  vec2 causticShrink = vec2(bodyHalfWidth * 0.09 + radius * 0.12,
                            bodyHalfHeight * 0.09 + radius * 0.12);
  float causticDistance = abs(roundedBoxSdf(
      p - causticShift, halfSize - causticShrink, cornerRadius * 0.88));
  float caustic = exp(-causticDistance * causticDistance /
                       (18.0 * geometryScale * geometryScale)) *
                   smoothstep(-0.2, 0.9, p.y / (70.0 * geometryScale));

  if (d > 0.0) {
    float shadowAlpha = shadow * 0.14 * shadowDepth;
    float causticAlpha = caustic * 0.12;
    float alpha = clamp(shadowAlpha + causticAlpha, 0.0, 1.0);
    vec3 background = sampleBackdrop(frag, vec2(0.0, 0.0));
    vec3 concentratedBackground = clamp(background * 1.12, 0.0, 1.0);
    // Premultiplied output: the shadow removes background energy, while the
    // caustic redistributes the sampled background light.  No fixed hue is
    // injected outside the glass.
    fragmentColor = vec4(concentratedBackground * causticAlpha, alpha);
    return;
  }

  // These two controls are spatial ranges, not refractive-index or brightness
  // multipliers.  Zero remains an exact direct-through path.
  float refractionRange = clamp(edgeRefractionStrength * 0.5, 0.0, 1.0);
  float reflectionRange = clamp(internalReflectionStrength * 0.5, 0.0, 1.0);
  float refractionProfileScale = 0.30 + 1.10 * refractionRange;
  float height = lensHeight(p, refractionProfileScale);
  vec2 refractionGradient = edgeRefractionStrength <= 0.0001
      ? vec2(0.0, 0.0)
      : lensHeightGradient(p, refractionProfileScale) * refractionProfileScale;
  vec2 baseGradient = lensHeightGradient(p, 1.0);
  float refractionGradientLength = length(refractionGradient);
  float reflectionGradientLength = length(reflectionGradient);
  vec2 refractionOutward = refractionGradientLength > 0.0001
      ? -refractionGradient / refractionGradientLength
      : vec2(0.0, 0.0);
  vec2 reflectionOutward = reflectionGradientLength > 0.0001
      ? -reflectionGradient / reflectionGradientLength
      : refractionOutward;
  float baseGradientLength = length(baseGradient);
  vec2 baseOutward = baseGradientLength > 0.0001
      ? -baseGradient / baseGradientLength
      : reflectionOutward;
  vec3 baseNormal = normalize(vec3(-baseGradient * crownHeight, 1.0));
  float baseViewCosine = clamp(baseNormal.z, 0.0, 1.0);

  // Trace red, green and blue independently through the same physical
  // profile.  The tiny IOR difference creates dispersion only where the
  // shoulder actually bends the ray; the flat center remains undistorted.
  const float ior = 1.510;
  vec2 greenOffset = traceThroughGlass(refractionGradient, height, ior, radius);
  vec3 refractionNormal =
      normalize(vec3(-refractionGradient * crownHeight, 1.0));
  // Dispersion controls the channel-separation distance.  It remains visible
  // across the refracting shoulder instead of being hidden by the reflection
  // branch below.
  float dispersionPixels = dispersionAmount * geometryScale *
      (3.5 + 18.5 * (1.0 - clamp(refractionNormal.z, 0.0, 1.0)));
  vec2 dispersionOffset = refractionOutward * dispersionPixels;

  const float fresnelZero = 0.041;

  // Light rising from the background meets the curved top/side interface
  // from inside the glass.  Both transmission and reflection use this same
  // local normal, so their transition follows the actual curvature.
  vec2 inwardDirection = -reflectionOutward;
  float criticalCosine = sqrt(1.0 - 1.0 / (ior * ior));
  float criticalTransition =
      1.0 - smoothstep(criticalCosine - angularSoftness,
                       criticalCosine + angularSoftness, viewCosine);
  float localFresnel = glassToAirReflectance(viewCosine, ior);
  float curvatureFresnel =
      clamp((localFresnel - fresnelZero) / (1.0 - fresnelZero), 0.0, 1.0);
  float physicalReflection = clamp(
      criticalTransition +
      curvatureFresnel * 0.18 * (1.0 - criticalTransition), 0.0, 1.0);
  // Map 0..200% continuously onto a zero-to-maximum edge band.  This curve
  // preserves the previous calibrated width at 100% (0.42 * radius) and at
  // 200% (0.74 * radius), while removing the old 0.10-radius jump just above
  // zero.  No other reflection calculation consumes reflectionRange.
  float reflectionExtent =
      radius * reflectionRange * (0.94 - 0.20 * reflectionRange);
  float reflectionDepth = max(-d, 0.0);
  // The critical-angle band is represented as a smooth inward falloff.  The
  // control changes its reach; it never scales the reflected light itself.
  float normalizedReflectionDepth =
      reflectionDepth / max(reflectionExtent, 0.0001);
  float reflectionRangeMask =
      pow(clamp(1.0 - normalizedReflectionDepth, 0.0, 1.0), 1.55);
  float reflectionField = reflectionRange <= 0.0001
      ? 0.0
      : reflectionRangeMask * (0.28 + 0.72 * physicalReflection);

  // The reflected ray remains inside the body and travels inward.  A reflected
  // path crosses substantially more glass than the transmitted path before
  // returning toward the background.  Expressing the travel in lens radii
  // keeps that separation apparent at every user-selected size.
  float reflectionReach = radius * (0.34 + 0.90 * (1.0 - viewCosine));
  vec2 internalReflectionOffset = inwardDirection * reflectionReach;

  // Morph one ray coordinate from refraction into internal reflection.
  // Sampling once per colour avoids double images, seams, and the blur that
  // was previously introduced by averaging several reflected textures.
  vec2 activeRay = mix(greenOffset, internalReflectionOffset, reflectionField);
  vec2 reflectedDispersion =
      dispersionOffset * mix(1.0, 0.48, reflectionField);
  vec2 finalRedOffset = activeRay + reflectedDispersion;
  vec2 finalGreenOffset = activeRay;
  vec2 finalBlueOffset = activeRay - reflectedDispersion;
  vec3 color;
  color.r = sampleBackdrop(frag, finalRedOffset).r;
  color.g = sampleBackdrop(frag, finalGreenOffset).g;
  color.b = sampleBackdrop(frag, finalBlueOffset).b;

  // Optional frosted inner laminate.  At zero the branch is skipped; enabled
  // values add progressively wider multi-scale light diffusion.
  if (internalBlurAmount > 0.0001) {
    float frostRadius = geometryScale * (2.5 + 16.5 * internalBlurAmount);
    color = mix(color,
                sampleFrostedBackdrop(frag, finalGreenOffset, frostRadius,
                                      internalBlurAmount),
                clamp(internalBlurAmount, 0.0, 1.0));
  }

  // Outside-environment reflection is deliberately separate from the
  // internal-reflection path.  Its calibrated default is 80%.
  if (externalReflectionStrength > 0.0001) {
    float externalField = clamp(
        pow(1.0 - baseViewCosine, 1.35) * externalReflectionStrength * 0.72,
        0.0, 1.0);
    vec2 externalOffset =
        baseOutward * geometryScale * (9.0 + 25.0 * (1.0 - baseViewCosine));
    color = mix(color, sampleBackdrop(frag, externalOffset), externalField);
  }

  // Optional illumination from an external directional source.  It is
  // restricted to the outer curved surface band: liquid glass carries a
  // grazing rim, not a specular stripe painted across its flat interior.
  if (highlightStrength > 0.0001) {
    vec2 lightDirection =
        vec2(cos(highlightDirection), sin(highlightDirection));
    float sourceFacing =
        pow(clamp(dot(baseOutward, lightDirection), 0.0, 1.0), 4.0);
    float edgeDepth = max(-d, 0.0);
    float edgeBand =
        1.0 - smoothstep(radius * 0.025, radius * 0.145, edgeDepth);
    float curvatureBand = smoothstep(0.10, 0.72, 1.0 - baseViewCosine);
    float grazing = pow(clamp(1.0 - baseViewCosine, 0.0, 1.0), 1.35);
    float illumination = clamp(
        highlightStrength * edgeBand * curvatureBand * sourceFacing *
        (0.22 + 0.78 * grazing) * 0.92, 0.0, 1.0);
    const vec3 illuminantColor = vec3(1.0, 0.985, 0.95);
    color = clamp(color + illuminantColor * illumination * (1.0 - color),
                  0.0, 1.0);
  }

  // The captured page is the transmitted image, so it replaces rather than
  // alpha-blends with the live page below; this prevents a second
  // un-refracted ghost.
  fragmentColor = vec4(color, 1.0);
}
`;

const UNIFORM_NAMES = [
  'resolution', 'backdropSize', 'windowPosition', 'halfSize', 'pixelRatio',
  'scale', 'cornerRadius', 'profileRadius', 'dispersionAmount',
  'internalReflectionStrength', 'edgeRefractionStrength',
  'externalReflectionStrength', 'shadowDepth', 'highlightDirection',
  'highlightStrength', 'internalBlurAmount', 'maximumLod', 'backdropTexture',
];

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`液态玻璃着色器编译失败: ${log}`);
  }
  return shader;
}

function createProgram(gl) {
  const program = gl.createProgram();
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`液态玻璃着色器链接失败: ${log}`);
  }
  return program;
}

// A backdrop source exposes the pixels beneath the glass plus the client-space
// rectangle those pixels cover, which is all the shader needs to map a
// fragment onto the page.
class ElementBackdrop {
  constructor(element, onReady) {
    this.element = element;
    this.version = 0;
    this.isVideo = element.tagName === 'VIDEO';
    this.onReady = onReady;
    const wake = () => {
      this.version++;
      if (this.onReady) this.onReady();
    };
    this.wake = wake;
    element.addEventListener(this.isVideo ? 'loadeddata' : 'load', wake);
  }

  get source() {
    return this.element;
  }

  get live() {
    return this.isVideo;
  }

  get rect() {
    const rect = this.element.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      width: Math.max(1, rect.width),
      height: Math.max(1, rect.height),
    };
  }

  get ready() {
    if (this.isVideo) return this.element.readyState >= 2;
    if (this.element.tagName === 'IMG') return this.element.complete;
    return true;
  }

  invalidate() {
    this.version++;
  }

  update() {
    if (this.isVideo) this.version++;
  }

  destroy() {
    this.element.removeEventListener(
        this.isVideo ? 'loadeddata' : 'load', this.wake);
  }
}

class CallbackBackdrop {
  constructor(draw, pixelRatio, live) {
    this.draw = draw;
    this.pixelRatio = pixelRatio;
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute(EXCLUDE_ATTRIBUTE, '');
    this.context = this.canvas.getContext('2d', {alpha: false});
    this.version = 0;
    this.dirty = true;
    this.live = live !== false;
  }

  get source() {
    return this.canvas;
  }

  get ready() {
    return this.canvas.width > 0;
  }

  get rect() {
    return {
      left: 0,
      top: 0,
      width: Math.max(1, window.innerWidth),
      height: Math.max(1, window.innerHeight),
    };
  }

  invalidate() {
    this.dirty = true;
  }

  update() {
    const rect = this.rect;
    const ratio = this.pixelRatio;
    const width = Math.round(rect.width * ratio);
    const height = Math.round(rect.height * ratio);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.dirty = true;
    }
    if (!this.dirty) return;
    this.dirty = false;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.draw(this.context, rect.width, rect.height);
    this.version++;
  }

  destroy() {}
}

class DomBackdrop {
  constructor(root, pixelRatio, refreshInterval, onCaptured) {
    this.root = root;
    this.snapshot = acquireSharedSnapshot(root, pixelRatio);
    this.refreshInterval = refreshInterval;
    this.onCaptured = onCaptured;
    this.lastCapture = 0;
    this.retryHandle = 0;
    this.queued = false;
    this.capturing = false;
    this.live = false;
  }

  get source() {
    return this.snapshot.canvas;
  }

  get version() {
    return this.snapshot.version;
  }

  get ready() {
    return this.snapshot.version > 0;
  }

  get rect() {
    return {
      left: this.snapshot.left,
      top: this.snapshot.top,
      width: this.snapshot.width,
      height: this.snapshot.height,
    };
  }

  invalidate() {
    this.queued = true;
  }

  // Rasterization is asynchronous, so the renderer is woken again once new
  // pixels land instead of polling for them.
  update() {
    if (this.capturing) return;
    if (!this.queued && this.snapshot.version > 0) return;
    const now = performance.now();
    if (this.snapshot.version > 0 &&
        now - this.lastCapture < this.refreshInterval) {
      if (!this.retryHandle) {
        this.retryHandle = setTimeout(() => {
          this.retryHandle = 0;
          if (this.onCaptured) this.onCaptured();
        }, this.refreshInterval);
      }
      return;
    }
    this.queued = false;
    this.capturing = true;
    this.lastCapture = now;
    this.snapshot.capture().then(() => {
      this.capturing = false;
      this.lastCapture = performance.now();
      if (this.onCaptured) this.onCaptured();
    }, () => {
      this.capturing = false;
    });
  }

  destroy() {
    if (this.retryHandle) clearTimeout(this.retryHandle);
    releaseSharedSnapshot(this.root);
  }
}

let instanceCounter = 0;

export class LiquidGlass {
  constructor(options = {}) {
    this.options = options;
    this.id = ++instanceCounter;
    this.settings = {...DEFAULT_SETTINGS, ...(options.settings || {})};
    this.pixelRatio = options.pixelRatio || window.devicePixelRatio || 1;
    this.container = options.container || document.body;
    this.draggable = options.draggable !== false && !options.follow;
    this.followElement = options.follow || null;
    this.profileRadiusOverride = options.profileRadius || null;
    this.interactive = options.interactive !== false;
    this.onSettingsChange = options.onSettingsChange || null;
    this.onClose = options.onClose || null;
    this.onContextMenu = options.onContextMenu || null;

    this.scale = 1.0;
    this.scaleTarget = 1.0;
    this.scaleVelocity = 0.0;
    this.hovered = false;
    this.pointerPressed = false;
    this.pressStartedOnLens = false;
    this.hoverPulseActive = false;
    this.hoverPulseEnd = 0;
    this.lastFrameTime = 0;
    this.trackedHighlightDirection = 315.0 * DEGREES;
    this.pointerClient = {x: 0, y: 0};
    this.dragOrigin = {x: 0, y: 0};
    this.dragCenterOrigin = {x: 0, y: 0};
    this.frameHandle = 0;
    this.destroyed = false;
    this.uploadedVersion = -1;
    this.geometry = null;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'liquid-glass-surface';
    this.canvas.setAttribute(EXCLUDE_ATTRIBUTE, '');
    this.canvas.style.cssText =
        'position:fixed;left:0;top:0;pointer-events:none;' +
        `z-index:${options.zIndex ?? 2147483000};will-change:transform;` +
        'touch-action:none';
    this.container.appendChild(this.canvas);

    const gl = this.canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      this.canvas.remove();
      throw new Error('液态玻璃需要 WebGL2 支持。');
    }
    this.gl = gl;
    this.program = createProgram(gl);
    this.uniforms = {};
    for (const name of UNIFORM_NAMES) {
      this.uniforms[name] = gl.getUniformLocation(this.program, name);
    }
    this.vertexArray = gl.createVertexArray();
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    this.mipmapped = false;
    this.maximumLod = 0;

    this.backdrop = this.createBackdrop(options);
    this.applyGeometry();
    this.placeInitialPosition(options);
    this.bindEvents();
    this.backdrop.invalidate();
    this.requestFrame();
  }

  createBackdrop(options) {
    const source = options.backdrop;
    if (typeof source === 'function') {
      return new CallbackBackdrop(
          source, this.pixelRatio, options.backdropLive);
    }
    if (source instanceof HTMLElement && (
        source.tagName === 'IMG' || source.tagName === 'VIDEO' ||
        source.tagName === 'CANVAS')) {
      return new ElementBackdrop(source, () => this.requestFrame());
    }
    return new DomBackdrop(
        options.backdropRoot || document.body, this.pixelRatio,
        options.refreshInterval ?? 120, () => this.requestFrame());
  }

  // Geometry mirrors ResizeGlassForCurrentSettings: the surface is the lens
  // body at its maximum pressed scale plus the padding the shadow and caustic
  // need to the lower right.
  computeGeometry() {
    if (this.followElement) {
      const rect = this.followElement.getBoundingClientRect();
      const style = window.getComputedStyle(this.followElement);
      const parsed = parseFloat(style.borderTopLeftRadius) || 0;
      const halfSize = [
        Math.max(rect.width * 0.5, 1),
        Math.max(rect.height * 0.5, 1),
      ];
      const cornerRadius = Math.min(parsed, halfSize[0], halfSize[1]);
      const profileRadius = this.profileRadiusOverride ||
          Math.max(Math.min(cornerRadius, halfSize[1]), 8);
      return {
        halfSize,
        cornerRadius,
        profileRadius,
        centerX: rect.left + rect.width * 0.5,
        centerY: rect.top + rect.height * 0.5,
      };
    }
    const sizeScale = this.settings.size / 100.0;
    const profileRadius = BASE_LENS_RADIUS * sizeScale;
    const halfBody = this.settings.circle
        ? 0.0
        : BASE_LENS_HALF_BODY * sizeScale * (this.settings.length / 100.0);
    return {
      halfSize: [halfBody + profileRadius, profileRadius],
      cornerRadius: profileRadius,
      profileRadius,
      centerX: this.geometry ? this.geometry.centerX : 0,
      centerY: this.geometry ? this.geometry.centerY : 0,
    };
  }

  applyGeometry() {
    const previous = this.geometry;
    const geometry = this.computeGeometry();
    if (previous && !this.followElement) {
      geometry.centerX = previous.centerX;
      geometry.centerY = previous.centerY;
    }
    // effectPadding in the native build is max(90, 60 * sizeScale), and
    // sizeScale is profileRadius / 47.
    const padding = Math.max(90.0, 1.2766 * geometry.profileRadius);
    geometry.width = Math.ceil(
        2.0 * geometry.halfSize[0] * PRESSED_SCALE + padding * 2.0);
    geometry.height = Math.ceil(
        2.0 * geometry.halfSize[1] * PRESSED_SCALE + padding * 2.0);
    this.geometry = geometry;

    const ratio = this.pixelRatio;
    const width = Math.round(geometry.width * ratio);
    const height = Math.round(geometry.height * ratio);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.canvas.style.width = `${geometry.width}px`;
    this.canvas.style.height = `${geometry.height}px`;
    this.updateTransform();
  }

  placeInitialPosition(options) {
    if (this.followElement) return;
    const position = options.position;
    if (position && typeof position.centerX === 'number') {
      this.geometry.centerX = position.centerX;
      this.geometry.centerY = position.centerY;
    } else if (position && typeof position.left === 'number') {
      this.geometry.centerX = position.left + this.geometry.width * 0.5;
      this.geometry.centerY = position.top + this.geometry.height * 0.5;
    } else {
      this.geometry.centerX = window.innerWidth * 0.5;
      this.geometry.centerY = window.innerHeight / 3.0;
    }
    this.updateTransform();
  }

  get left() {
    return this.geometry.centerX - this.geometry.width * 0.5;
  }

  get top() {
    return this.geometry.centerY - this.geometry.height * 0.5;
  }

  updateTransform() {
    this.canvas.style.transform =
        `translate3d(${this.left.toFixed(2)}px, ${this.top.toFixed(2)}px, 0)`;
  }

  moveTo(centerX, centerY) {
    if (this.followElement) return;
    this.geometry.centerX = centerX;
    this.geometry.centerY = centerY;
    this.updateTransform();
    this.requestFrame();
  }

  // Port of IsInsideLens: client coordinates, undone by the current spring
  // scale, tested against the same signed distance field the shader uses.
  isInside(clientX, clientY) {
    const geometry = this.geometry;
    const scale = Math.max(this.scale, 0.001);
    const x = (clientX - geometry.centerX) / scale;
    const y = (clientY - geometry.centerY) / scale;
    const radius = geometry.cornerRadius;
    const extentX = Math.max(geometry.halfSize[0] - radius, 0);
    const extentY = Math.max(geometry.halfSize[1] - radius, 0);
    const qx = Math.abs(x) - extentX;
    const qy = Math.abs(y) - extentY;
    const distance = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
        Math.min(Math.max(qx, qy), 0) - radius;
    return distance <= 3.0;
  }

  updateSettings(patch) {
    const previous = {...this.settings};
    Object.assign(this.settings, patch);
    const geometryChanged =
        previous.size !== this.settings.size ||
        previous.length !== this.settings.length ||
        previous.circle !== this.settings.circle;
    if (geometryChanged) this.applyGeometry();
    // Matches HandleSettingsCommand: switching either feedback off retires the
    // spring immediately instead of leaving the lens enlarged.
    if ((previous.touchFeedback && !this.settings.touchFeedback) ||
        (previous.dragFeedback && !this.settings.dragFeedback)) {
      this.resetFeedbackAnimation();
    }
    if (this.onSettingsChange) this.onSettingsChange(this.settings);
    this.requestFrame();
  }

  resetFeedbackAnimation() {
    this.hoverPulseActive = false;
    this.scaleTarget = 1.0;
    if (!this.settings.dragFeedback) {
      this.scale = 1.0;
      this.scaleVelocity = 0.0;
    } else if (!this.pointerPressed) {
      this.scaleVelocity = Math.min(this.scaleVelocity, -0.18);
    }
  }

  refreshBackdrop() {
    this.backdrop.invalidate();
    this.requestFrame();
  }

  bindEvents() {
    const passive = {passive: true};
    // Overlays that are kept out of the backdrop — the settings panel above
    // all — sit on top of the lens.  Their input must not be swallowed by the
    // capture-phase handlers below.
    const isOverlayEvent = (event) => {
      const target = event.target;
      return Boolean(target && target.closest &&
                     target.closest(`[${EXCLUDE_ATTRIBUTE}]`));
    };

    this.handlePointerMove = (event) => {
      this.pointerClient = {x: event.clientX, y: event.clientY};
      if (this.pointerPressed && this.draggable) {
        this.moveTo(
            this.dragCenterOrigin.x + (event.clientX - this.dragOrigin.x),
            this.dragCenterOrigin.y + (event.clientY - this.dragOrigin.y));
      }
      if (!this.interactive) {
        if (this.settings.highlightFollowMouse) this.requestFrame();
        return;
      }
      const inside = this.isInside(event.clientX, event.clientY);
      if (!this.pointerPressed && inside && !this.hovered) {
        this.hovered = true;
        if (this.settings.touchFeedback) {
          this.hoverPulseActive = true;
          this.hoverPulseEnd = performance.now() + 120;
          this.scaleTarget = HOVER_SCALE;
          this.scaleVelocity = Math.max(this.scaleVelocity, 0.12);
        }
      } else if (!this.pointerPressed && !inside && this.hovered) {
        this.hovered = false;
        this.hoverPulseActive = false;
        this.scaleTarget = 1.0;
      }
      this.canvas.style.cursor = inside ? 'grab' : '';
      this.requestFrame();
    };

    this.handlePointerDown = (event) => {
      if (!this.interactive || event.button !== 0) return;
      if (isOverlayEvent(event)) return;
      if (!this.isInside(event.clientX, event.clientY)) return;
      event.preventDefault();
      event.stopPropagation();
      this.pointerPressed = true;
      this.pressStartedOnLens = true;
      this.hoverPulseActive = false;
      if (this.settings.dragFeedback) {
        this.scaleTarget = PRESSED_SCALE;
        this.scaleVelocity = Math.max(this.scaleVelocity, 0.45);
      } else {
        this.scaleTarget = 1.0;
      }
      this.dragOrigin = {x: event.clientX, y: event.clientY};
      this.dragCenterOrigin = {
        x: this.geometry.centerX,
        y: this.geometry.centerY,
      };
      this.requestFrame();
    };

    this.handlePointerUp = () => {
      if (!this.pointerPressed) return;
      this.pointerPressed = false;
      this.pressStartedOnLens = false;
      this.scaleTarget = 1.0;
      if (this.settings.dragFeedback) {
        this.scaleVelocity = Math.min(this.scaleVelocity, -0.32);
      } else {
        this.scale = 1.0;
        this.scaleVelocity = 0.0;
      }
      this.requestFrame();
    };

    this.handleContextMenu = (event) => {
      if (!this.interactive || isOverlayEvent(event)) return;
      if (!this.isInside(event.clientX, event.clientY)) return;
      event.preventDefault();
      event.stopPropagation();
      if (this.onContextMenu) this.onContextMenu(event, this);
    };

    this.handleClickCapture = (event) => {
      if (!this.interactive || isOverlayEvent(event)) return;
      if (this.isInside(event.clientX, event.clientY)) {
        event.stopPropagation();
      }
    };

    this.handleScroll = () => {
      this.backdrop.invalidate();
      if (this.followElement) this.applyGeometry();
      this.requestFrame();
    };

    this.handleResize = () => {
      this.backdrop.invalidate();
      this.applyGeometry();
      this.requestFrame();
    };

    window.addEventListener('pointermove', this.handlePointerMove, passive);
    window.addEventListener('pointerdown', this.handlePointerDown, true);
    window.addEventListener('pointerup', this.handlePointerUp, true);
    window.addEventListener('pointercancel', this.handlePointerUp, true);
    window.addEventListener('contextmenu', this.handleContextMenu, true);
    window.addEventListener('click', this.handleClickCapture, true);
    window.addEventListener('scroll', this.handleScroll, true);
    window.addEventListener('resize', this.handleResize);

    if (this.backdrop instanceof DomBackdrop) {
      // The glass surface and its settings panel live in the same document.
      // Ignoring them here is the web counterpart of WDA_EXCLUDEFROMCAPTURE:
      // without it, dragging the lens would invalidate its own backdrop on
      // every frame.
      const isExcludedNode = (node) => {
        if (!node) return false;
        const element = node.nodeType === Node.ELEMENT_NODE
            ? node : node.parentElement;
        return Boolean(element && element.closest(`[${EXCLUDE_ATTRIBUTE}]`));
      };
      this.observer = new MutationObserver((records) => {
        for (const record of records) {
          if (isExcludedNode(record.target)) continue;
          // A childList record reports the parent as its target, so the
          // inserted glass surface or settings panel would otherwise look
          // like a page change and retrigger rasterization forever.
          if (record.type === 'childList') {
            const touched = [...record.addedNodes, ...record.removedNodes];
            if (touched.length && touched.every(isExcludedNode)) continue;
          }
          this.backdrop.invalidate();
          this.requestFrame();
          return;
        }
      });
      this.observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'src', 'value'],
      });
    }
  }

  requestFrame() {
    if (this.destroyed || this.frameHandle) return;
    this.frameHandle = requestAnimationFrame(this.tick);
  }

  tick = (now) => {
    this.frameHandle = 0;
    if (this.destroyed) return;
    this.advanceAnimation(now);
    this.render();
    if (this.isAnimating() || this.backdrop.live ||
        (this.backdrop.queued ?? false)) {
      this.requestFrame();
    }
  };

  isAnimating() {
    return this.pointerPressed || this.hoverPulseActive ||
        Math.abs(this.scaleTarget - this.scale) > 0.0001 ||
        Math.abs(this.scaleVelocity) > 0.0001;
  }

  // A damped spring gives both the one-shot hover pulse and the held press
  // response the same continuous, liquid motion.
  advanceAnimation(now) {
    if (this.hoverPulseActive && now >= this.hoverPulseEnd) {
      this.hoverPulseActive = false;
      if (!this.pointerPressed) this.scaleTarget = 1.0;
    }
    let deltaTime = 1.0 / 60.0;
    if (this.lastFrameTime) {
      deltaTime = Math.min(
          Math.max((now - this.lastFrameTime) / 1000.0, 1.0 / 240.0),
          1.0 / 30.0);
    }
    this.lastFrameTime = now;
    const springStrength = 420.0;
    const springDamping = 28.0;
    this.scaleVelocity +=
        (this.scaleTarget - this.scale) * springStrength * deltaTime;
    this.scaleVelocity *= Math.exp(-springDamping * deltaTime);
    this.scale += this.scaleVelocity * deltaTime;
    if (Math.abs(this.scaleTarget - this.scale) < 0.00005 &&
        Math.abs(this.scaleVelocity) < 0.00005) {
      this.scale = this.scaleTarget;
      this.scaleVelocity = 0.0;
    }
  }

  uploadBackdrop() {
    const gl = this.gl;
    this.backdrop.update();
    if (!this.backdrop.ready) return false;
    const version = this.backdrop.version;
    const needsUpload = version !== this.uploadedVersion;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    if (needsUpload) {
      this.uploadedVersion = version;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                    this.backdrop.source);
      const wantsMipmaps = this.settings.internalBlur > 0;
      if (wantsMipmaps) {
        const source = this.backdrop.source;
        const width = source.width || source.videoWidth || 1;
        const height = source.height || source.videoHeight || 1;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                         gl.LINEAR_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        this.maximumLod = Math.log2(Math.max(width, height));
        this.mipmapped = true;
      } else if (this.mipmapped) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        this.mipmapped = false;
        this.maximumLod = 0;
      }
    } else if (this.settings.internalBlur > 0 && !this.mipmapped) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                       gl.LINEAR_MIPMAP_LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
      const source = this.backdrop.source;
      this.maximumLod = Math.log2(Math.max(
          source.width || source.videoWidth || 1,
          source.height || source.videoHeight || 1));
      this.mipmapped = true;
    }
    return true;
  }

  currentHighlightDirection() {
    if (!this.settings.highlightFollowMouse) {
      return this.settings.highlightDirection * DEGREES;
    }
    const deltaX = this.pointerClient.x - this.geometry.centerX;
    const deltaY = this.pointerClient.y - this.geometry.centerY;
    if (deltaX * deltaX + deltaY * deltaY > 16.0) {
      this.trackedHighlightDirection = Math.atan2(deltaY, deltaX);
    }
    return this.trackedHighlightDirection;
  }

  render() {
    const gl = this.gl;
    if (this.followElement) {
      const geometry = this.computeGeometry();
      if (geometry.centerX !== this.geometry.centerX ||
          geometry.centerY !== this.geometry.centerY ||
          geometry.halfSize[0] !== this.geometry.halfSize[0] ||
          geometry.halfSize[1] !== this.geometry.halfSize[1]) {
        this.applyGeometry();
      }
    }
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!this.uploadBackdrop()) return;

    const rect = this.backdrop.rect;
    const settings = this.settings;
    const geometry = this.geometry;
    const uniforms = this.uniforms;
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vertexArray);
    gl.uniform2f(uniforms.resolution, geometry.width, geometry.height);
    gl.uniform2f(uniforms.backdropSize, rect.width, rect.height);
    gl.uniform2f(uniforms.windowPosition,
                 this.left - rect.left, this.top - rect.top);
    gl.uniform2f(uniforms.halfSize, geometry.halfSize[0], geometry.halfSize[1]);
    gl.uniform1f(uniforms.pixelRatio, this.pixelRatio);
    gl.uniform1f(uniforms.scale, this.scale);
    gl.uniform1f(uniforms.cornerRadius, geometry.cornerRadius);
    gl.uniform1f(uniforms.profileRadius, geometry.profileRadius);
    gl.uniform1f(uniforms.dispersionAmount, settings.dispersion / 100.0);
    gl.uniform1f(uniforms.internalReflectionStrength,
                 settings.internalReflection / 100.0);
    gl.uniform1f(uniforms.edgeRefractionStrength,
                 settings.edgeRefraction / 100.0);
    gl.uniform1f(uniforms.externalReflectionStrength,
                 settings.externalReflection / 100.0);
    gl.uniform1f(uniforms.shadowDepth, settings.shadowDepth / 100.0);
    gl.uniform1f(uniforms.highlightDirection, this.currentHighlightDirection());
    gl.uniform1f(uniforms.highlightStrength, settings.highlightStrength / 100.0);
    gl.uniform1f(uniforms.internalBlurAmount, settings.internalBlur / 100.0);
    gl.uniform1f(uniforms.maximumLod, this.maximumLod);
    gl.uniform1i(uniforms.backdropTexture, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  hide() {
    this.canvas.style.display = 'none';
  }

  show() {
    this.canvas.style.display = '';
    this.refreshBackdrop();
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.frameHandle) cancelAnimationFrame(this.frameHandle);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerdown', this.handlePointerDown, true);
    window.removeEventListener('pointerup', this.handlePointerUp, true);
    window.removeEventListener('pointercancel', this.handlePointerUp, true);
    window.removeEventListener('contextmenu', this.handleContextMenu, true);
    window.removeEventListener('click', this.handleClickCapture, true);
    window.removeEventListener('scroll', this.handleScroll, true);
    window.removeEventListener('resize', this.handleResize);
    if (this.observer) this.observer.disconnect();
    this.backdrop.destroy();
    const gl = this.gl;
    gl.deleteTexture(this.texture);
    gl.deleteVertexArray(this.vertexArray);
    gl.deleteProgram(this.program);
    this.canvas.remove();
    if (this.onClose) this.onClose(this);
  }
}

export function createLiquidGlass(options) {
  return new LiquidGlass(options);
}
