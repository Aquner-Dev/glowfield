"use client";
import dynamic from "next/dynamic";

// ssrを無効化してglowfieldを動的読み込み
const AuroraCanvas = dynamic(
  () => import("glowfield").then((m) => m.AuroraCanvas),
  { ssr: false }
);

export default function Page() {
  return (
    <main
      style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
    >
      {/* 背景オーロラ */}
      <AuroraCanvas />

      {/* 表面テキスト */}
      <section style={{ position: "relative", zIndex: 1, padding: "4rem" }}>
        <h1 style={{ fontSize: "3rem", margin: 0 }}>glowfield ✨</h1>
        <p style={{ fontSize: "1.2rem" }}>
          A dynamic aurora background powered by Three.js + React.
        </p>
      </section>
    </main>
  );
}
