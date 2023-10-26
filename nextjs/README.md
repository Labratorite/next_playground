This is a starter template for [Learn Next.js](https://nextjs.org/learn).

### Usage
- 1. VSCodeにて拡張機能Devcontainer(ms-vscode-remote.remote-containers) をinstall
- 2. 開発コンテナーから開く
  - 初回にcontainerが作成される
- 3. メニュー＞ファイル＞ファイルでワークスペースを開く＞.code-workspace を選択して開く
  - 主にdebugerのためなので必須ではない
- 4. /nextjs 配下でターミナルを開いてsetup
  - `npm install`
  - DBコンテナ作成、migration、seeding
    - `make init` でOK
    - 個別に実行する場合
      ```
      docker-compose up -d
      npx sequelize-cli db:migrate
      npx sequelize-cli db:seed
      ```
- 4. `npm run dev`

### NOTE
- page router と app routerを共存させています
- [Page Rourter](https://nextjs.org/docs/app/api-reference/file-conventions)