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
function AuroraCanvas({
  colors = ["#0a1929", "#1e40af", "#60a5fa"],
  speed = 0.5,
  intensity = 0.85,
  waveCount = 8,
  debugMode = false,
  className
}) {
  const wrapRef = (0, import_react.useRef)(null);
  const rendererRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const el = wrapRef.current;
    if (!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      u_time: { value: 0 },
      u_res: { value: new THREE.Vector2(el.clientWidth, el.clientHeight) },
      u_intensity: { value: intensity },
      u_speed: { value: speed },
      u_waveCount: { value: Math.max(1, Math.min(8, waveCount)) },
      u_debugMode: { value: debugMode ? 1 : 0 },
      u_c0: { value: new THREE.Color(colors[0]) },
      u_c1: { value: new THREE.Color(colors[1]) },
      u_c2: { value: new THREE.Color(colors[2]) }
    };
    const frag = `
      precision highp float;
      uniform float u_time; uniform vec2 u_res;
      uniform float u_speed; uniform float u_intensity;
      uniform float u_waveCount;
      uniform float u_debugMode;
      uniform vec3 u_c0; uniform vec3 u_c1; uniform vec3 u_c2;

      // \u3088\u308A\u6ED1\u3089\u304B\u306A\u30CE\u30A4\u30BA\u95A2\u6570\uFF08\u30D1\u30FC\u30EA\u30F3\u98A8\uFF09
      vec2 hash22(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
              dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
          mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
              dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
      }

      // \u30D5\u30E9\u30AF\u30BF\u30EB\u30CE\u30A4\u30BA\uFF08\u8907\u6570\u30AA\u30AF\u30BF\u30FC\u30D6\uFF09
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for(int i = 0; i < 5; i++) {
          value += amplitude * noise(p * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / u_res;
        vec2 p = (uv - 0.5) * vec2(u_res.x/u_res.y, 1.0);
        float t = u_time * u_speed;

        // \u753B\u9762\u5916\u306E\u9060\u3044\u8907\u6570\u306E\u4E2D\u5FC3\u70B9
        vec2 center1 = vec2(3.5, 2.0);  // \u53F3\u4E0A\u306E\u9060\u304F
        vec2 center2 = vec2(-2.8, -3.2); // \u5DE6\u4E0B\u306E\u9060\u304F
        vec2 center3 = vec2(2.0, -4.5);  // \u53F3\u4E0B\u306E\u9060\u304F
        vec2 center4 = vec2(-3.0, 3.8);  // \u5DE6\u4E0A\u306E\u9060\u304F

        // \u305D\u308C\u305E\u308C\u306E\u4E2D\u5FC3\u304B\u3089\u306E\u8DDD\u96E2
        float dist1 = length(p - center1);
        float dist2 = length(p - center2);
        float dist3 = length(p - center3);
        float dist4 = length(p - center4);

        // \u30D5\u30ED\u30FC\u30D5\u30A3\u30FC\u30EB\u30C9\u3067\u6B6A\u307E\u305B\u308B\uFF08\u6642\u9593\u3067\u3086\u3089\u3081\u304F\uFF09
        float flowT1 = sin(t * u_speed * 0.15) * 2.0;
        float flowT2 = cos(t * u_speed * 0.12) * 2.0;
        vec2 flowDir = vec2(fbm(p * 1.2 + flowT1), fbm(p * 1.2 + flowT2));
        vec2 distortedP = p + flowDir * 0.4;

        // \u52D5\u7684\u306B\u6CE2\u3092\u751F\u6210
        int numWaves = int(u_waveCount);
        float combined = 0.0;
        float totalWeight = 0.0;

        // \u6B6A\u3093\u3060\u4F4D\u7F6E\u3082\u8A08\u7B97
        float dist1d = length(distortedP - center1);
        float dist2d = length(distortedP - center2);

        // \u6CE2\u306E\u30D1\u30E9\u30E1\u30FC\u30BF\u914D\u5217\uFF08\u6700\u59278\u6CE2\uFF09
        for(int i = 0; i < 8; i++) {
          if(i >= numWaves) break;

          float fi = float(i);
          float dist = i == 0 ? dist1 :
                       i == 1 ? dist2 :
                       i == 2 ? dist3 :
                       i == 3 ? dist4 :
                       i == 4 ? dist1d :
                       i == 5 ? dist2d :
                       i == 6 ? dist3 : dist4;

          // \u57FA\u672C\u5468\u6CE2\u6570\u3068\u4F4D\u76F8\uFF08\u4F4D\u7F6E\u306F\u56FA\u5B9A\uFF09
          float baseFreq = 4.0 + fi * 0.4;
          float phase = fi * 0.785;

          // \u6642\u9593\u3067\u3086\u3089\u3081\u304F\u632F\u5E45\u3068\u5468\u6CE2\u6570
          float freqModulation = sin(t * u_speed * (0.3 + fi * 0.05)) * 0.3;
          float amplitudeModulation = sin(t * u_speed * (0.2 + fi * 0.04) + phase) * 0.5 + 0.5;

          // \u5468\u6CE2\u6570\u304C\u6642\u9593\u3068\u3068\u3082\u306B\u5909\u5316\uFF08\u3086\u3089\u3081\u304D\uFF09
          float dynamicFreq = baseFreq * (1.0 + freqModulation);

          // \u6CE2\u5F62\uFF08\u3086\u308B\u3084\u304B\u306B\u3086\u3089\u3081\u304F\uFF09
          float wave = sin(dist * dynamicFreq + phase) * 0.5 + 0.5;

          // \u632F\u5E45\u3082\u6642\u9593\u3067\u5909\u5316
          wave = wave * (0.7 + amplitudeModulation * 0.3);

          float weight = 0.25 / (1.0 + fi * 0.15);

          combined += wave * weight;
          totalWeight += weight;
        }

        // FBM\u3067\u3055\u3089\u306B\u8907\u96D1\u306B\uFF08\u3086\u3089\u3081\u304F\uFF09
        float fbmT = sin(t * u_speed * 0.1) * 1.5;
        float fbmPattern = fbm(p * 2.5 + fbmT);
        combined = (combined / totalWeight) * 0.85 + fbmPattern * 0.15;

        // \u660E\u308B\u3055\u30D9\u30FC\u30B9\u306E\u30D6\u30EC\u30F3\u30C7\u30A3\u30F3\u30B0
        float brightness = smoothstep(0.3, 0.7, combined);

        // \u6697\u3044\u591C\u7A7A\u304B\u3089\u59CB\u307E\u308B\u9752\u306E\u30B0\u30E9\u30C7\u30FC\u30B7\u30E7\u30F3
        vec3 col = mix(u_c0, u_c1, brightness);
        col = mix(col, u_c2, smoothstep(0.5, 0.8, combined));

        // \u6CE2\u306E\u5E72\u6E09\u30D1\u30BF\u30FC\u30F3\u3067\u5149\u3092\u8FFD\u52A0\uFF08\u3086\u3089\u3081\u304F\uFF09
        float glow = 0.0;
        if(numWaves >= 2) {
          // \u5468\u6CE2\u6570\u304C\u3086\u3089\u3081\u304F
          float freq1 = 4.0 * (1.0 + sin(t * u_speed * 0.3) * 0.3);
          float freq2 = 4.8 * (1.0 + sin(t * u_speed * 0.25) * 0.3);
          float w1 = sin(dist1 * freq1) * 0.5 + 0.5;
          float w2 = sin(dist2 * freq2 + 1.57) * 0.5 + 0.5;
          glow += pow(w1 * w2, 1.8) * 0.25;
        }
        if(numWaves >= 4) {
          float freq3 = 4.4 * (1.0 + sin(t * u_speed * 0.28) * 0.3);
          float freq5 = 5.2 * (1.0 + sin(t * u_speed * 0.22) * 0.3);
          float w3 = sin(dist3 * freq3) * 0.5 + 0.5;
          float w5 = sin(dist1d * freq5) * 0.5 + 0.5;
          glow += pow(w3 * w5, 2.0) * 0.2;
        }
        if(numWaves >= 6) {
          float freq4 = 4.6 * (1.0 + sin(t * u_speed * 0.26) * 0.3);
          float freq6 = 5.0 * (1.0 + sin(t * u_speed * 0.24) * 0.3);
          float w4 = sin(dist4 * freq4 + 3.14) * 0.5 + 0.5;
          float w6 = sin(dist2d * freq6) * 0.5 + 0.5;
          glow += pow(w4 * w6, 2.2) * 0.15;
        }

        // \u30AA\u30FC\u30ED\u30E9\u306E\u3088\u3046\u306A\u5149\u3092\u52A0\u7B97
        col += u_c2 * glow * 1.2;
        col += u_c1 * pow(glow + 0.01, 2.0) * 0.6;

        // \u6CE2\u306E\u91CD\u306A\u308A\u3067\u660E\u308B\u3044\u30CF\u30A4\u30E9\u30A4\u30C8
        if(numWaves >= 5) {
          float freq1 = 4.0 * (1.0 + sin(t * u_speed * 0.3) * 0.3);
          float freq5 = 5.2 * (1.0 + sin(t * u_speed * 0.22) * 0.3);
          float w1 = sin(dist1 * freq1) * 0.5 + 0.5;
          float w5 = sin(dist1d * freq5) * 0.5 + 0.5;
          float highlight = pow(w1 * w5, 2.5) * 0.4;
          col += u_c2 * highlight;
        }

        // \u8907\u6570\u306E\u6CE2\u304C\u91CD\u306A\u308B\u5834\u6240\u306B\u8F1D\u304D\u3092\u8FFD\u52A0
        if(numWaves >= 3) {
          float freq1 = 4.0 * (1.0 + sin(t * u_speed * 0.3) * 0.3);
          float freq2 = 4.8 * (1.0 + sin(t * u_speed * 0.25) * 0.3);
          float freq3 = 4.4 * (1.0 + sin(t * u_speed * 0.28) * 0.3);
          float w1 = sin(dist1 * freq1) * 0.5 + 0.5;
          float w2 = sin(dist2 * freq2 + 1.57) * 0.5 + 0.5;
          float w3 = sin(dist3 * freq3) * 0.5 + 0.5;
          float multiWave = w1 * w2 * w3;
          col += vec3(u_c2 * 0.5) * pow(multiWave, 2.0);
        }

        // \u30C7\u30D0\u30C3\u30B0\u30E2\u30FC\u30C9: \u6CE2\u306E\u5916\u5F62\u3060\u3051\u3092\u8868\u793A
        if(u_debugMode > 0.5) {
          // \u5404\u6CE2\u306E\u30A8\u30C3\u30B8\u3092\u691C\u51FA
          float edges = 0.0;
          for(int i = 0; i < 8; i++) {
            if(i >= numWaves) break;
            float fi = float(i);
            float dist = i == 0 ? dist1 :
                         i == 1 ? dist2 :
                         i == 2 ? dist3 :
                         i == 3 ? dist4 :
                         i == 4 ? dist1d :
                         i == 5 ? dist2d :
                         i == 6 ? dist3 : dist4;

            float baseFreq = 4.0 + fi * 0.4;
            float phase = fi * 0.785;
            float freqModulation = sin(t * u_speed * (0.3 + fi * 0.05)) * 0.3;
            float dynamicFreq = baseFreq * (1.0 + freqModulation);

            // \u6CE2\u5F62
            float wave = sin(dist * dynamicFreq + phase) * 0.5 + 0.5;

            // \u30A8\u30C3\u30B8\u3092\u691C\u51FA\uFF08\u6CE2\u304C\u6975\u5024\u306B\u8FD1\u3044\u5834\u6240\uFF09
            float edge = 1.0 - smoothstep(0.0, 0.08, abs(wave - 0.5));
            edges += edge;
          }

          // \u767D\u3044\u7DDA\u3067\u6CE2\u306E\u5916\u5F62\u3092\u8868\u793A
          col = vec3(edges * 1.5);
        } else {
          // \u901A\u5E38\u30E2\u30FC\u30C9: \u30B0\u30E9\u30C7\u30FC\u30B7\u30E7\u30F3\u8868\u793A
          col = col * u_intensity;

          // \u8DDD\u96E2\u306B\u3088\u308B\u81EA\u7136\u306A\u6E1B\u8870\uFF08\u63A7\u3048\u3081\uFF09
          float localDist = min(min(dist1, dist2), min(dist3, dist4));
          float falloff = 1.0 - smoothstep(2.0, 6.0, localDist);
          col *= 0.55 + 0.45 * falloff;
        }

        gl_FragColor = vec4(col, 1.0);
      }`;
    const mat = new THREE.ShaderMaterial({
      vertexShader: `void main(){ gl_Position = vec4(position,1.0); }`,
      fragmentShader: frag,
      uniforms,
      transparent: true
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(quad);
    const ro = new ResizeObserver(() => {
      if (!rendererRef.current || !wrapRef.current) return;
      const w = wrapRef.current.clientWidth, h = wrapRef.current.clientHeight;
      rendererRef.current.setSize(w, h);
      uniforms.u_res.value.set(w, h);
    });
    ro.observe(el);
    let raf = 0;
    const loop = (now) => {
      uniforms.u_time.value = now * 1e-3;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [colors.join(","), speed, intensity, waveCount, debugMode]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: wrapRef, className, style: { position: "absolute", inset: 0 }, "aria-hidden": true });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuroraCanvas
});
//# sourceMappingURL=index.js.map