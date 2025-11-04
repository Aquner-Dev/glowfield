## glowfield

Three.js と GLSL シェーダーでオーロラのようなグラデーションを描画する React コンポーネントです。Next.js の `app` / `pages` ルートいずれでも利用でき、背景用のキャンバスとして手軽に導入できます。

### 特徴
- WebGL ベースのシェーダー表現でリッチなアニメーションを実現
- `colors` / `speed` / `intensity` を調整して雰囲気を簡単にカスタマイズ
- レイアウト制御用の `className` フックを提供

---

### インストール

```bash
npm install glowfield three
```

> `react` / `react-dom` は peerDependencies として 17 以上が必須です。

---

### 使い方

```tsx
import { AuroraCanvas } from "glowfield";

export default function Hero() {
  return (
    <section className="relative h-[480px] overflow-hidden">
      <AuroraCanvas
        colors={["#38bdf8", "#9333ea", "#f472b6"]}
        speed={0.35}
        intensity={0.8}
        className="pointer-events-none"
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

コンポーネントは `position: absolute` でラップされた `div` を返します。親要素に `relative` を付与し、必要に応じて `overflow-hidden` で切り取ってください。

---

### プロパティ

| プロパティ | 型 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `colors` | `string[]` | `["#7dd3fc", "#93c5fd", "#c4b5fd"]` | グラデーションに使用する 3 色。16 進カラーコード推奨です。 |
| `speed` | `number` | `0.2` | アニメーション速度。値を上げるほど動きが速くなります。 |
| `intensity` | `number` | `0.7` | 輝度。1.0 以上にすると光が強くなります。 |
| `className` | `string` | — | ラッパー要素に追加するクラス。Tailwind 等でレイアウトを調整できます。 |

---

### ローカル開発・ビルド

```bash
# リポジトリ全体で依存を取得
npm install

# パッケージをビルド
npm run build
```

`dist/` ディレクトリは `tsup` によって自動生成され、`package.json` の `files` フィールドにより npm 公開時に含まれます。

---

### npm 公開手順

1. バージョン更新  
   ```bash
   cd packages/glowfield
   npm version patch # または minor / major
   ```
2. ビルド成果物の更新  
   ```bash
   npm run build
   ```
3. 公開前確認（任意）  
   ```bash
   npm pack
   ```
4. npm にログインして公開  
   ```bash
   npm login
   npm publish --access public
   ```
5. 生成された git タグと変更をリポジトリにプッシュ  
   ```bash
   git push && git push --tags
   ```

`package.json` には `publishConfig.access = "public"` が設定済みです。scoped パッケージではないため、`--access public` を付与すれば初回公開時もエラーになりません。

---

### ライセンス

MIT
