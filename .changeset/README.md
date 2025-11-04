## Changesets

このディレクトリには `npx changeset` で生成される変更チケットが入ります。  
ライブラリに修正を加えたら `npm run changeset` を実行し、バージョン種別（patch / minor / major）と変更内容を選択してください。

GitHub Actions の自動リリースワークフローは、`main` ブランチにマージされた未公開の changeset を検出すると新しいバージョンを生成し、npm に公開します。
