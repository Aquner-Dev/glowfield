// src/AuroraCanvas.tsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { jsx } from "react/jsx-runtime";
function AuroraCanvas({
  colors = ["#7dd3fc", "#93c5fd", "#c4b5fd"],
  speed = 0.2,
  intensity = 0.7,
  className
}) {
  const wrapRef = useRef(null);
  const rendererRef = useRef(null);
  useEffect(() => {
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
  return /* @__PURE__ */ jsx("div", { ref: wrapRef, className, style: { position: "absolute", inset: 0 }, "aria-hidden": true });
}
export {
  AuroraCanvas
};
//# sourceMappingURL=index.mjs.map