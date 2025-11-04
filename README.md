## glowfield monorepo

Three.js ベースのオーロラ背景コンポーネント `glowfield` と、そのデモアプリを管理する npm ワークスペース構成のモノレポです。ライブラリ自体の README は `packages/glowfield/README.md` にまとまっています。

---

### リポジトリ構成

- `packages/glowfield`  
  React / Next.js 向けのオーロラ描画コンポーネント。`tsup` でビルドし npm に公開します。
- `apps/demo`  
  Next.js 製のデモアプリ。ローカルでコンポーネントの動作を確認するためのワークスペースです。

---

### 必要環境

- Node.js 18 以上推奨（Next.js 14 / フロントエンドツール群のサポート範囲）
- npm 10 系（ワークスペース対応）

---

### セットアップ

```bash
npm install
```

初回インストールで各ワークスペースの依存関係が揃います。

---

### 開発ワークフロー

- ライブラリをローカルビルド  
  ```bash
  npm run build
  ```
- デモアプリを起動  
  ```bash
  npm run dev
  ```
  ブラウザで `http://localhost:3000` にアクセスすると、最新の `glowfield` を参照したデモを確認できます。

ビルド成果物は `packages/glowfield/dist` に出力されます。git では追跡対象ですが、npm 公開時には `files` フィールドを通じて自動的に含まれます。

---

### npm 公開メモ

パッケージ公開の詳細手順は `packages/glowfield/README.md` を参照してください。概要は以下のとおりです。

1. `packages/glowfield` でバージョン番号を更新 (`npm version patch` など)
2. `npm run build` で最新の `dist/` を生成
3. 内容を確認 (`npm pack`) してから `npm publish --access public`
4. 変更とタグをリモートにプッシュ

---

### ライセンス

本リポジトリは MIT ライセンスです。
