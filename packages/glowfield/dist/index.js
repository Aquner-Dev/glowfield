"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuroraCanvas: () => AuroraCanvas
});
module.exports = __toCommonJS(index_exports);

// src/AuroraCanvas.tsx
var import_react = require("react");
var THREE = __toESM(require("three"));
var import_jsx_runtime = require("react/jsx-runtime");
var DEFAULT_LUT = [
  "#0f172a",
  "#1e3a8a",
  "#4c1d95",
  "#7e22ce",
  "#f472b6",
  "#fcd34d"
];
function toUint8ArrayFromHex(colors) {
  const data = new Uint8Array(colors.length * 4);
  colors.forEach((hex, index) => {
    const color = new THREE.Color(hex);
    const offset = index * 4;
    data[offset] = Math.round(color.r * 255);
    data[offset + 1] = Math.round(color.g * 255);
    data[offset + 2] = Math.round(color.b * 255);
    data[offset + 3] = 255;
  });
  return data;
}
function configureLutTexture(texture) {
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
}
function createLutTexture(lut, fallback) {
  if (lut instanceof THREE.DataTexture) {
    configureLutTexture(lut);
    return { texture: lut, disposeOnCleanup: false };
  }
  let data;
  let width = 0;
  let type = THREE.UnsignedByteType;
  if (Array.isArray(lut)) {
    const allStrings = lut.every((value) => typeof value === "string");
    if (allStrings) {
      data = toUint8ArrayFromHex(lut);
      width = lut.length;
    } else if (lut.every((value) => typeof value === "number")) {
      const numeric = lut;
      if (numeric.length % 4 !== 0) {
        throw new Error(
          "Numeric LUT array length must be a multiple of 4 (RGBA per stop)."
        );
      }
      data = new Float32Array(numeric);
      width = numeric.length / 4;
      type = THREE.FloatType;
    } else {
      throw new Error(
        "Unsupported LUT array contents. Provide hex strings or RGBA numeric data."
      );
    }
  } else if (lut instanceof Uint8Array || lut instanceof Float32Array) {
    data = lut;
    width = lut.length / 4;
    type = lut instanceof Float32Array ? THREE.FloatType : THREE.UnsignedByteType;
  } else {
    data = toUint8ArrayFromHex(fallback);
    width = fallback.length;
  }
  if (!Number.isInteger(width) || width <= 0) {
    throw new Error("LUT width must be a positive integer.");
  }
  const texture = new THREE.DataTexture(data, width, 1, THREE.RGBAFormat, type);
  configureLutTexture(texture);
  return { texture, disposeOnCleanup: true };
}
function AuroraCanvas({
  lut,
  colors,
  speed = 0.3,
  intensity = 0.9,
  pointerStrength = 0.2,
  className
}) {
  const wrapRef = (0, import_react.useRef)(null);
  const rendererRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const el = wrapRef.current;
    if (!el) return;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance"
    });
    if (!context) {
      console.warn(
        "[glowfield] WebGL2 \u30B3\u30F3\u30C6\u30AD\u30B9\u30C8\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u305F\u305F\u3081\u63CF\u753B\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\u3002"
      );
      return;
    }
    const renderer = new THREE.WebGLRenderer({ canvas, context });
    rendererRef.current = renderer;
    renderer.autoClear = true;
    renderer.setClearColor(0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const fallbackColors = colors && colors.length ? colors : DEFAULT_LUT;
    const { texture: lutTexture, disposeOnCleanup } = createLutTexture(
      lut,
      fallbackColors
    );
    const pointerUniform = new THREE.Vector2(0.5, 0.5);
    const pointerTarget = new THREE.Vector2(0.5, 0.5);
    const pointerMomentum = new THREE.Vector2(0, 0);
    const pointerDelta = new THREE.Vector2(0, 0);
    const uniforms = {
      u_time: { value: 0 },
      u_res: { value: new THREE.Vector2(el.clientWidth, el.clientHeight) },
      u_intensity: { value: intensity },
      u_speed: { value: speed },
      u_pointer: { value: pointerUniform },
      u_pointerStrength: { value: pointerStrength },
      u_pointerMomentum: { value: pointerMomentum },
      u_motionEnabled: { value: 1 },
      u_lut: { value: lutTexture }
    };
    const fragmentShader = `precision highp float;

uniform float u_time;
uniform vec2 u_res;
uniform float u_speed;
uniform float u_intensity;
uniform vec2 u_pointer;
uniform float u_pointerStrength;
uniform vec2 u_pointerMomentum;
uniform float u_motionEnabled;
uniform sampler2D u_lut;

const float PI = 3.141592653589793;

out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  mat2 m = mat2(1.6, -1.2, 1.2, 1.6);
  for (int i = 0; i < 3; i++) {
    value += amplitude * noise(p);
    p = m * p;
    amplitude *= 0.52;
  }
  return clamp(value, 0.0, 1.0);
}

float smoothWave(vec2 p, float freqX, float freqY, float phase, float bend) {
  float w = sin(p.x * freqX + phase);
  w += sin((p.x * 0.6 + p.y * bend) * freqY + phase * 0.6) * 0.6;
  w += sin((p.y * freqY - p.x * 0.35) - phase * 0.4) * 0.45;
  return w;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv - 0.5;
  float aspect = u_res.x / u_res.y;
  p.x *= aspect;

  float time = u_time * u_speed * u_motionEnabled;

  vec2 pointer = (u_pointer - vec2(0.5)) * 2.0;
  pointer.x *= aspect;
  vec2 influence = (pointer + u_pointerMomentum * 1.7) * u_pointerStrength;

  vec2 warped = p;
  warped += vec2(
    sin((p.y + time * 0.22) * 1.6),
    sin((p.x - time * 0.18) * 1.4)
  ) * 0.12;
  warped += influence * 0.35;

  float base = smoothWave(warped, 1.9, 1.1, time * 0.45 + influence.x * 2.2, 1.05);
  float cross = smoothWave(warped.yx, 1.4, 0.8, -time * 0.38 + influence.y * 1.8, 0.7);
  float sweep = sin((warped.x * 1.15 + warped.y * 1.4) + time * 0.55 + influence.x * 2.4) * 0.35;
  float drift = sin((warped.x * 0.7 - warped.y * 0.9) - time * 0.33 + influence.y * 2.1) * 0.28;
  float secondary = sin((warped.x + warped.y) * 0.9 + time * 0.3) * 0.18;

  float field = 0.5
    + base * 0.34
    + cross * 0.28
    + sweep * 0.26
    + drift * 0.22
    + secondary;

  float micro = fbm(warped * 2.2 + vec2(time * 0.16, time * 0.12)) * 0.22;
  float slowGrad = smoothstep(-1.1, 1.1, warped.y + sin(warped.x * 0.7 + time * 0.2) * 0.12) * 0.18;
  field += micro + slowGrad;

  field += dot(influence, vec2(0.5, -0.42));
  field = clamp(field, 0.0, 1.0);

  float breathing = 0.93 + 0.1 * sin(time * 0.52 + micro * PI * 4.0);

  vec3 color = texture(u_lut, vec2(field, 0.5)).rgb;
  color *= breathing * u_intensity;

  fragColor = vec4(color, 1.0);
}
    `;
    const material = new THREE.RawShaderMaterial({
      vertexShader: `
in vec3 position;
void main() {
  gl_Position = vec4(position, 1.0);
}
      `.trim(),
      fragmentShader,
      uniforms,
      transparent: true,
      glslVersion: THREE.GLSL3
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);
    const resizeObserver = new ResizeObserver(() => {
      if (!rendererRef.current || !wrapRef.current) return;
      const width = wrapRef.current.clientWidth;
      const height = wrapRef.current.clientHeight;
      rendererRef.current.setSize(width, height);
      uniforms.u_res.value.set(width, height);
    });
    resizeObserver.observe(el);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      const enabled = media.matches ? 0 : 1;
      uniforms.u_motionEnabled.value = enabled;
      if (enabled === 0) {
        if (rafId !== 0) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        renderer.render(scene, camera);
      } else if (rafId === 0) {
        rafId = requestAnimationFrame(loop);
      }
    };
    media.addEventListener("change", updateMotionPreference);
    let rafId = 0;
    const loop = (now) => {
      pointerDelta.copy(pointerTarget).sub(pointerUniform);
      pointerUniform.addScaledVector(pointerDelta, 0.05);
      pointerMomentum.lerp(pointerDelta, 0.16);
      uniforms.u_pointerMomentum.value.set(
        pointerMomentum.x,
        pointerMomentum.y
      );
      uniforms.u_time.value = now * 1e-3;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(loop);
    };
    const handlePointerMove = (event) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      pointerTarget.set(
        THREE.MathUtils.clamp(x, 0, 1),
        THREE.MathUtils.clamp(1 - y, 0, 1)
      );
      if (uniforms.u_motionEnabled.value === 0) {
        pointerUniform.copy(pointerTarget);
        pointerMomentum.set(0, 0);
        uniforms.u_pointerMomentum.value.set(0, 0);
        renderer.render(scene, camera);
      }
    };
    const resetPointer = () => {
      pointerTarget.set(0.5, 0.5);
    };
    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", resetPointer);
    updateMotionPreference();
    if (uniforms.u_motionEnabled.value === 1) {
      rafId = requestAnimationFrame(loop);
    } else {
      renderer.render(scene, camera);
    }
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      media.removeEventListener("change", updateMotionPreference);
      resizeObserver.disconnect();
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", resetPointer);
      scene.remove(quad);
      quad.geometry.dispose();
      material.dispose();
      if (disposeOnCleanup) lutTexture.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [lut, colors ? colors.join(",") : "", speed, intensity, pointerStrength]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      ref: wrapRef,
      className,
      style: { position: "absolute", inset: 0 },
      "aria-hidden": true
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuroraCanvas
});
//# sourceMappingURL=index.js.map