"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

// ssrを無効化してglowfieldを動的読み込み
const AuroraCanvas = dynamic(
  () => import("glowfield").then((m) => m.AuroraCanvas),
  { ssr: false }
);

export default function Page() {
  const [waveCount, setWaveCount] = useState(8);
  const [speed, setSpeed] = useState(0.5);
  const [intensity, setIntensity] = useState(0.85);
  const [colors, setColors] = useState(["#0a1929", "#1e40af", "#60a5fa"]);
  const [debugMode, setDebugMode] = useState(false);

  return (
    <main
      style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
    >
      {/* 背景オーロラ */}
      <AuroraCanvas
        waveCount={waveCount}
        speed={speed}
        intensity={intensity}
        colors={colors}
        debugMode={debugMode}
      />

      {/* 表面テキスト */}
      <section style={{ position: "relative", zIndex: 1, padding: "4rem" }}>
        <h1 style={{ fontSize: "3rem", margin: 0 }}>glowfield ✨</h1>
        <p style={{ fontSize: "1.2rem" }}>
          A dynamic aurora background powered by Three.js + React.
        </p>

        {/* コントロールUI */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "rgba(10, 25, 41, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            maxWidth: "800px",
            border: "1px solid rgba(96, 165, 250, 0.2)",
          }}
        >
          <h2
            style={{
              fontSize: "1.2rem",
              marginBottom: "1.5rem",
              color: "#60a5fa",
            }}
          >
            Controls
          </h2>

          {/* Wave Count */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="waveCount"
              style={{
                display: "block",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                color: "#60a5fa",
              }}
            >
              Wave Count: {waveCount}
            </label>
            <input
              id="waveCount"
              type="range"
              min="1"
              max="8"
              step="1"
              value={waveCount}
              onChange={(e) => setWaveCount(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#3b82f6",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: "#94a3b8",
                marginTop: "0.25rem",
              }}
            >
              <span>1</span>
              <span>8</span>
            </div>
          </div>

          {/* Speed */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="speed"
              style={{
                display: "block",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                color: "#60a5fa",
              }}
            >
              Speed: {speed.toFixed(2)}
            </label>
            <input
              id="speed"
              type="range"
              min="0.1"
              max="2.0"
              step="0.05"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#3b82f6",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: "#94a3b8",
                marginTop: "0.25rem",
              }}
            >
              <span>0.1</span>
              <span>2.0</span>
            </div>
          </div>

          {/* Intensity */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="intensity"
              style={{
                display: "block",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
                color: "#60a5fa",
              }}
            >
              Intensity: {intensity.toFixed(2)}
            </label>
            <input
              id="intensity"
              type="range"
              min="0.1"
              max="2.0"
              step="0.05"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#3b82f6",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: "#94a3b8",
                marginTop: "0.25rem",
              }}
            >
              <span>0.1</span>
              <span>2.0</span>
            </div>
          </div>

          {/* Colors */}
          <div style={{ marginBottom: "0.5rem" }}>
            <div
              style={{
                fontSize: "0.9rem",
                marginBottom: "0.75rem",
                color: "#60a5fa",
              }}
            >
              Colors
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {colors.map((color, index) => (
                <div key={index} style={{ flex: "1", minWidth: "120px" }}>
                  <label
                    htmlFor={`color${index}`}
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      marginBottom: "0.25rem",
                      color: "#94a3b8",
                    }}
                  >
                    Color {index + 1}
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      id={`color${index}`}
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...colors];
                        newColors[index] = e.target.value;
                        setColors(newColors);
                      }}
                      style={{
                        width: "40px",
                        height: "40px",
                        border: "1px solid rgba(96, 165, 250, 0.3)",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...colors];
                        newColors[index] = e.target.value;
                        setColors(newColors);
                      }}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        background: "rgba(30, 64, 175, 0.3)",
                        border: "1px solid rgba(96, 165, 250, 0.3)",
                        borderRadius: "6px",
                        color: "#60a5fa",
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Debug Mode Toggle */}
          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(96, 165, 250, 0.2)",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
                fontSize: "0.9rem",
                color: "#60a5fa",
              }}
            >
              <input
                type="checkbox"
                checked={debugMode}
                onChange={(e) => setDebugMode(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  accentColor: "#3b82f6",
                }}
              />
              <span>Show Wave Outlines (Debug Mode)</span>
            </label>
          </div>
        </div>
      </section>
    </main>
  );
}
