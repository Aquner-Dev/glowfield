## glowfield

[![npm version](https://img.shields.io/npm/v/glowfield.svg)](https://www.npmjs.com/package/glowfield)

WebGL / Three.js と GLSL シェーダーでオーロラのような光の揺らぎを描画する React コンポーネントです。ヒーローセクションやフルスクリーン背景にドロップインで導入できます。

### 特徴

- LUT（1D テクスチャ）で色を制御し、ブランドカラーや既存アセットとの一致が容易
- 複数のサインウェーブとソフトなノイズで画面全体を満たす滑らかなオーロラグラデーションを描画
- ポインタの慣性モーションと時間経過をミックスし、デモサイトのような自然なインタラクションを付与
- `prefers-reduced-motion` に対応し、モーションを自動で停止するアクセシブルな実装

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
import { useMemo } from "react";
import { AuroraCanvas } from "glowfield";

export default function Hero() {
  const lut = useMemo(
    () => ["#38bdf8", "#9333ea", "#f472b6", "#facc15"],
    []
  );

  return (
    <section className="relative h-[480px] overflow-hidden bg-slate-950">
      <AuroraCanvas
        lut={lut}
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

| プロパティ              | 型                                                                 | 既定値            | 説明                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `lut`                   | `string[] \| number[] \| Uint8Array \| Float32Array \| THREE.DataTexture` | 内部プリセット    | オーロラ色を定義する 1D LUT。RGBA の数値配列や DataTexture を直接渡せます。`string[]` の場合は hex を RGBA に変換します。                    |
| `colors` *(deprecated)* | `string[]`                                                         | —                 | 旧来の簡易指定。`lut` が未指定の場合のフォールバックとして扱われます。                                                                      |
| `speed`                 | `number`                                                           | `0.3`             | アニメーション速度。値を上げると揺らぎが速くなります。                                                                                    |
| `intensity`             | `number`                                                           | `0.9`             | 発光の強さ。1.0 以上で鮮やかに、0.4 以下で落ち着いた雰囲気になります。                                                                      |
| `pointerStrength`       | `number`                                                           | `0.2`             | ポインタ入力がカーブ全体に与える影響量。0 に近づけると時間ベース中心のモーションになります。                                                 |
| `className`             | `string`                                                           | —                 | ラッパー要素に付与するクラス。Tailwind CSS などでサイズやブレンドモードを調整できます。                                                     |

> `prefers-reduced-motion: reduce` の環境ではモーションが自動停止し、ポインタを動かした瞬間のみレンダリングが更新されます。

---

### カスタマイズ例

```tsx
const electricLut = useMemo(
  () => ["#020617", "#1d4ed8", "#60a5fa", "#a855f7", "#f9a8d4", "#fde68a"],
  []
);

return (
  <AuroraCanvas
    lut={electricLut}
    speed={0.25}
    intensity={1.1}
    pointerStrength={0.15}
    className="mix-blend-lighten opacity-80 blur-[1px]"
  />
);
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
A. `speed` や `intensity` を下げるほか、配色（LUT）を暗めにすると描画コストが下がります。`prefers-reduced-motion` が有効な環境では自動的にモーションが停止します。さらに制御したい場合は GitHub リポジトリをフォークし、`AuroraCanvas.tsx` 内のノイズレイヤー設定を変更してください。

---

### 変更履歴

詳細な差分は GitHub (https://github.com/Aquner-Dev/glowfield) のリリース・コミットをご確認ください。Issue や Pull Request での改善提案も歓迎しています。

---

### ライセンス

MIT
