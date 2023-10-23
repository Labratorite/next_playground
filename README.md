### 概要
- VSCode の DevContainer テスト
- DevContainerでNext.js
- Docker in DockerでDevContainerにmysql構築
- SequelizeでDB Migration
- Sequelizeのtypescript対応
#### nextjs
- [Pages Router](https://nextjs.org/docs/pages)でbasic チュートリアル
- Pages Router から App Router にmigrate


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



### Setup Record
#### 1. Devcontainer (https://note.com/shift_tech/n/nf9c647e5264c)
- 開発コンテナー構成ファイルを追加
- テンプレートからimage選択 (Node.js & Typescript)
- devcontainer.jsonに追記
  - git の`fatal: detected dubious ownership in repository`対策
    - https://qiita.com/P-man_Brown/items/5628ef68f51d1acf38e0
- コンテナーで再度開く
#### 2. Next.js Install (https://nextjs.org/learn/basics/create-nextjs-app/setup)
- `npx create-next-app@latest nextjs --use-npm --example "https://github.com/vercel/next-learn/tree/main/basics/learn-starter"`
- 疎通確認
  ```
  cd nextjs
  yarn dev
  ```
- tsconfig.json初期化
  ```
  # cd nextjs
  touch tsconfig.json
  yarn devdd
  ```
#### 2. MYSQL image 作成　with [Docker in Docker](https://github.com/devcontainers/templates/blob/main/src/docker-in-docker/README.md)

- Docker in DockerをDevContainerに追加 
  ```
  	"features": {
		"ghcr.io/devcontainers/features/docker-in-docker:2": {
			"version": "latest",
			"enableNonRootDocker": "true",
			"moby": "true"
		}
	},
  ```
  - 追加できるfeature https://containers.dev/features
- DevContainer を再作成
- docker-compose.yml を作成して、構築したいserviceの設定追加
  ```
  touch docker-compose.yml
  # 略
  docker-compose up 
  ```
### 3. SequelizeでDB Migration
- install (https://sequelize.org/docs/v6/getting-started/)
  ```
  # cd nextjs
  npm install sequelize  --save
  npm install mysql2  --save
  
  # v6.6.1 では*.tsのconfigが処理できなかった
  #npm install sequelize-cli --save-dev
  npm i sequelize-cli@6.3.0 --save-dev

  touch .sequelizerc

  npx sequelize-cli init
  ```
- model create(https://sequelize.org/docs/v7/cli/)
  ```
  # 例
  npx sequelize-cli model:generate --name User  --underscored --attributes firstName:string,lastName:string,email:string
  # modelがもうある
  npx sequelize-cli migration:generate --name user
  ```

#### コマンド
- migration
  ```
  npx sequelize-cli db:migrate
  ## undo the most recent migration.
  # npx sequelize-cli db:migrate:undo
  ## all of migrations
  # npx sequelize-cli db:migrate:undo:all
  ## revert back to a specific migration by passing its name with the --to option.
  # npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js
  ```
- seeding
  ```
  npx sequelize-cli seed:generate --name demo-user
  npx sequelize-cli db:seed:all
  ```
#### Sequelizeのtypescript対応
https://sequelize.org/docs/v6/other-topics/typescript/
```
We're working hard on making Sequelize a breeze to use in TypeScript. Some parts are still a work in progress. We recommend using sequelize-typescript to bridge the gap until our improvements are ready to be released.
```
- sequelize-typescript install(https://github.com/sequelize/sequelize-typescript)
  ```
  npm install --save-dev @types/validator
  npm install reflect-metadata sequelize-typescript
  ```
- configをts化
  ```
  npm i dotenv
  git mv config/database.json config/database.js
  ```

### 5. Debug環境作成
- next.jsアプリがサブフォルダで動いているので、workspaceで開く
   ```
   touch workspaces.code-workspace
   // 内部に、ルートディレクトリのworkspacesと、nextjsのworkspaceを定義
	"folders": [
	 {
	  "name": "root",
	  "path": "."
	 },
	 {
	  "name": "nextjs",
	  "path": "./nextjs"
	 }
	],
   ```
  - メニューファイル＞ファイルでワークスペースを開く＞上記code-workspaceを指定
    - 拡張機能への影響参考：https://qiita.com/YuichiNukiyama/items/ef16a0219f46ea03a045#%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%E3%81%B8%E3%81%AE%E5%BD%B1%E9%9F%BF
- nextjsのworkspaceに、デバッグ構成定義
  https://nextjs.org/docs/pages/building-your-application/configuring/debugging#debugging-with-vs-code

### 6. ESLint config
- https://nextjs.org/docs/pages/building-your-application/configuring/eslint
- package.json にscript追加
  - `"lint": "next lint"`
- `yarn lint`
  - .eslintrc.jsonが作成され、`eslint-config-next`がinstallされる
- Prettierとの連携(https://nextjs.org/docs/pages/building-your-application/configuring/eslint#usage-with-other-tools)
  - install
    ```
    npm i  -D prettier
    touch .prettierrc.json
    ```
  - `npm install --save-dev eslint-config-prettier`
  - .eslintrc.jsonに追記

### 7. pages から appに migrate
- https://nextjs.org/docs/pages/building-your-application/upgrading/app-router-migration#migrating-from-pages-to-app
- app routings時、Static レンダリングのためにはネイティブの`fetch`で`{ cache: 'no-store' }`を指定して実行する必要があるが、ネイティブの`fetch`は相対urlを許容していない

### その他
- `npm i swr`
- `npm i date-fns`
- `npm i -D sass`
- `npm i clsx`
- `// npm install -D tailwindcss autoprefixer postcss`
- `npm i gray-matter`
  - https://nextjs.org/learn/basics/data-fetching/blog-data
- `npm install remark remark-html`
  - https://nextjs.org/learn/basics/dynamic-routes/render-markdown
- `npm install @faker-js/faker --save-dev`