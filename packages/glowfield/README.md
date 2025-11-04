## glowfield

[![npm version](https://img.shields.io/npm/v/glowfield.svg)](https://www.npmjs.com/package/glowfield)

WebGL / Three.js と GLSL シェーダーでオーロラのような光の揺らぎを描画する React コンポーネントです。ヒーローセクションやフルスクリーン背景にドロップインで導入できます。

### 特徴

- Three.js ベースのフラグメントシェーダーで滑らかなグラデーションアニメーションを実現
- `colors` / `speed` / `intensity` を変えるだけで雰囲気を簡単に調整
- `className` でレイアウトやブレンドモードを柔軟に制御
- TypeScript 型定義を同梱。`AuroraCanvas` の Props も補完されます。

---

### インストール

```bash
npm install glowfield
```

> peerDependencies として `react` / `react-dom` が 17 以上必要です。Next.js 14 で動作確認済みです。

---

### クイックスタート

```tsx
"use client";
import { AuroraCanvas } from "glowfield";

export default function Hero() {
  return (
    <section className="relative h-[480px] overflow-hidden bg-slate-950">
      <AuroraCanvas
        colors={["#38bdf8", "#9333ea", "#f472b6"]}
        speed={0.35}
        intensity={0.8}
        className="pointer-events-none mix-blend-screen"
      />
      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="text-4xl font-semibold text-white drop-shadow">
          Glowfield Aurora
        </h1>
      </div>
    </section>
  );
}
```

`AuroraCanvas` は `position: absolute` のラッパー要素と WebGL キャンバスを返します。背景オーバーレイとして使う場合は、親要素に `position: relative` と `overflow-hidden` を指定すると扱いやすくなります。

Next.js `app` ルーターなどで利用する場合は、上記のように呼び出しファイルの冒頭で `"use client";` を宣言してください。

---

### プロパティ

| プロパティ  | 型         | 既定値                              | 説明                                                                                    |
| ----------- | ---------- | ----------------------------------- | --------------------------------------------------------------------------------------- |
| `colors`    | `string[]` | `["#7dd3fc", "#93c5fd", "#c4b5fd"]` | グラデーションに使用する 3 色。ベース → 中間 → ハイライトの順で混色されます。           |
| `speed`     | `number`   | `0.2`                               | アニメーション速度。値を上げると揺らぎが速くなります。                                  |
| `intensity` | `number`   | `0.7`                               | 発光の強さ。1.0 以上で鮮やかに、0.4 以下で落ち着いた雰囲気になります。                  |
| `className` | `string`   | —                                   | ラッパー要素に付与するクラス。Tailwind CSS などでサイズやブレンドモードを調整できます。 |

---

### カスタマイズ例

```tsx
<AuroraCanvas
  colors={["#9deafe", "#6366f1", "#f0abfc"]}
  speed={0.25}
  intensity={1.1}
  className="mix-blend-lighten opacity-80 blur-[1px]"
/>
```

- ハイライトカラーをピンク系に変更し、`mix-blend-lighten` で背景と柔らかく合成しています。
- ほんのりブラーをかけると UI との境界が自然になります。

---

### よくある質問

**Q. SSR (Next.js) でエラーが出ます。**
A. WebGL 描画はクライアント側で行うため、必ずクライアントコンポーネント内でレンダーしてください。`"use client";` の付与と、サーバーコンポーネントからの直接レンダーを避けることがポイントです。

**Q. Canvas のサイズを固定したい。**
A. ラッパー要素のサイズに追従するため、親要素に `height` / `width` / `min-height` を指定します。フルスクリーンの場合は `className="fixed inset-0"` のように指定してください。

**Q. パフォーマンスを抑えたい。**
A. `speed` や `intensity` を下げるほか、配色を暗めにすると描画コストが下がります。さらに制御したい場合は GitHub リポジトリをフォークし、`AuroraCanvas.tsx` 内のレンダラー設定を変更してください。

---

### 変更履歴

詳細な差分は GitHub (https://github.com/Aquner-Dev/glowfield) のリリース・コミットをご確認ください。Issue や Pull Request での改善提案も歓迎しています。

---

### ライセンス

MIT
