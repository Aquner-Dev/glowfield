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
  colors = ["#7dd3fc", "#93c5fd", "#c4b5fd"],
  speed = 0.2,
  intensity = 0.7,
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
      u_c0: { value: new THREE.Color(colors[0]) },
      u_c1: { value: new THREE.Color(colors[1]) },
      u_c2: { value: new THREE.Color(colors[2]) }
    };
    const frag = `
      precision highp float;
      uniform float u_time; uniform vec2 u_res;
      uniform float u_speed; uniform float u_intensity;
      uniform vec3 u_c0; uniform vec3 u_c1; uniform vec3 u_c2;
      float n2(vec2 p){ return sin(p.x)*sin(p.y); }
      void main(){
        vec2 uv = gl_FragCoord.xy / u_res;
        vec2 p = (uv - 0.5) * vec2(u_res.x/u_res.y, 1.0);
        float t = u_time * u_speed;
        float l1 = n2(p*3.0 + vec2(t*0.6, t*0.4));
        float l2 = n2(p*2.0 - vec2(t*0.2, t*0.3));
        float l3 = n2(p*4.0 + vec2(t*0.1, -t*0.5));
        float band = smoothstep(0.0, 0.6, l1*0.5 + l2*0.35 + l3*0.15);
        vec3 col = mix(u_c0, u_c1, band);
        col = mix(col, u_c2, 0.5 + 0.5*sin(t*0.5 + l2*3.1415));
        col *= u_intensity * (0.7 + 0.3 * smoothstep(0.0,1.0,1.0-length(p)));
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
  }, [colors.join(","), speed, intensity]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: wrapRef, className, style: { position: "absolute", inset: 0 }, "aria-hidden": true });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuroraCanvas
});
//# sourceMappingURL=index.js.map