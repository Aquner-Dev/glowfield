"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type GlowfieldProps = {
  colors?: string[];
  speed?: number;
  intensity?: number;
  waveCount?: number;
  debugMode?: boolean;
  className?: string;
};

export function AuroraCanvas({
  colors = ["#0a1929", "#1e40af", "#60a5fa"],
  speed = 0.5,
  intensity = 0.85,
  waveCount = 8,
  debugMode = false,
  className
}: GlowfieldProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

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

    const uniforms: Record<string, THREE.IUniform> = {
      u_time: { value: 0 },
      u_res: { value: new THREE.Vector2(el.clientWidth, el.clientHeight) },
      u_intensity: { value: intensity },
      u_speed: { value: speed },
      u_waveCount: { value: Math.max(1, Math.min(8, waveCount)) },
      u_debugMode: { value: debugMode ? 1.0 : 0.0 },
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

      // より滑らかなノイズ関数（パーリン風）
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

      // フラクタルノイズ（複数オクターブ）
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

        // 画面外の遠い複数の中心点
        vec2 center1 = vec2(3.5, 2.0);  // 右上の遠く
        vec2 center2 = vec2(-2.8, -3.2); // 左下の遠く
        vec2 center3 = vec2(2.0, -4.5);  // 右下の遠く
        vec2 center4 = vec2(-3.0, 3.8);  // 左上の遠く

        // それぞれの中心からの距離
        float dist1 = length(p - center1);
        float dist2 = length(p - center2);
        float dist3 = length(p - center3);
        float dist4 = length(p - center4);

        // フローフィールドで歪ませる（時間でゆらめく）
        float flowT1 = sin(t * u_speed * 0.15) * 2.0;
        float flowT2 = cos(t * u_speed * 0.12) * 2.0;
        vec2 flowDir = vec2(fbm(p * 1.2 + flowT1), fbm(p * 1.2 + flowT2));
        vec2 distortedP = p + flowDir * 0.4;

        // 動的に波を生成
        int numWaves = int(u_waveCount);
        float combined = 0.0;
        float totalWeight = 0.0;

        // 歪んだ位置も計算
        float dist1d = length(distortedP - center1);
        float dist2d = length(distortedP - center2);

        // 波のパラメータ配列（最大8波）
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

          // 基本周波数と位相（位置は固定）
          float baseFreq = 4.0 + fi * 0.4;
          float phase = fi * 0.785;

          // 時間でゆらめく振幅と周波数
          float freqModulation = sin(t * u_speed * (0.3 + fi * 0.05)) * 0.3;
          float amplitudeModulation = sin(t * u_speed * (0.2 + fi * 0.04) + phase) * 0.5 + 0.5;

          // 周波数が時間とともに変化（ゆらめき）
          float dynamicFreq = baseFreq * (1.0 + freqModulation);

          // 波形（ゆるやかにゆらめく）
          float wave = sin(dist * dynamicFreq + phase) * 0.5 + 0.5;

          // 振幅も時間で変化
          wave = wave * (0.7 + amplitudeModulation * 0.3);

          float weight = 0.25 / (1.0 + fi * 0.15);

          combined += wave * weight;
          totalWeight += weight;
        }

        // FBMでさらに複雑に（ゆらめく）
        float fbmT = sin(t * u_speed * 0.1) * 1.5;
        float fbmPattern = fbm(p * 2.5 + fbmT);
        combined = (combined / totalWeight) * 0.85 + fbmPattern * 0.15;

        // 明るさベースのブレンディング
        float brightness = smoothstep(0.3, 0.7, combined);

        // 暗い夜空から始まる青のグラデーション
        vec3 col = mix(u_c0, u_c1, brightness);
        col = mix(col, u_c2, smoothstep(0.5, 0.8, combined));

        // 波の干渉パターンで光を追加（ゆらめく）
        float glow = 0.0;
        if(numWaves >= 2) {
          // 周波数がゆらめく
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

        // オーロラのような光を加算
        col += u_c2 * glow * 1.2;
        col += u_c1 * pow(glow + 0.01, 2.0) * 0.6;

        // 波の重なりで明るいハイライト
        if(numWaves >= 5) {
          float freq1 = 4.0 * (1.0 + sin(t * u_speed * 0.3) * 0.3);
          float freq5 = 5.2 * (1.0 + sin(t * u_speed * 0.22) * 0.3);
          float w1 = sin(dist1 * freq1) * 0.5 + 0.5;
          float w5 = sin(dist1d * freq5) * 0.5 + 0.5;
          float highlight = pow(w1 * w5, 2.5) * 0.4;
          col += u_c2 * highlight;
        }

        // 複数の波が重なる場所に輝きを追加
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

        // デバッグモード: 波の外形だけを表示
        if(u_debugMode > 0.5) {
          // 各波のエッジを検出
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

            // 波形
            float wave = sin(dist * dynamicFreq + phase) * 0.5 + 0.5;

            // エッジを検出（波が極値に近い場所）
            float edge = 1.0 - smoothstep(0.0, 0.08, abs(wave - 0.5));
            edges += edge;
          }

          // 白い線で波の外形を表示
          col = vec3(edges * 1.5);
        } else {
          // 通常モード: グラデーション表示
          col = col * u_intensity;

          // 距離による自然な減衰（控えめ）
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
      (uniforms.u_res.value as THREE.Vector2).set(w, h);
    });
    ro.observe(el);

    let raf = 0;
    const loop = (now: number) => {
      uniforms.u_time.value = now * 0.001;
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

  return <div ref={wrapRef} className={className} style={{position:"absolute", inset:0}} aria-hidden />;
}
