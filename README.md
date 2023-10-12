### 概要
- VSCode の DevContainer テスト
- DevContainerでNext.js

### Setup
#### 1. Devcontainer (https://note.com/shift_tech/n/nf9c647e5264c)
- 開発コンテナー構成ファイルを追加
- テンプレートからimage選択 (Node.js & Typescript)
- devcontainer.jsonに追記
  - git の`fatal: detected dubious ownership in repository`対策
　　- https://qiita.com/P-man_Brown/items/5628ef68f51d1acf38e0
- コンテナーで再度開く
#### 2. Next.js Install (https://nextjs.org/learn/basics/create-nextjs-app/setup)
- `npx create-next-app@latest nextjs-p-ground --use-npm --example "https://github.com/vercel/next-learn/tree/main/basics/learn-starter"`
- 疎通確認
  ```
  cd nextjs-p-ground
  yarn run dev
  ```