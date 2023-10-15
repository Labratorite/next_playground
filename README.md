### 概要
- VSCode の DevContainer テスト
- DevContainerでNext.js
- Docker in DockerでDevContainerにmysql構築
- SequelizeでDB Migration

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
  yarn dev
  ```
- tsconfig.json初期化
  ```
  # cd nextjs-p-ground
  touch tsconfig.json
  yarn devdd
  ```
#### 2. MYSQL image 作成　with Docker in Docker (https://github.com/devcontainers/templates/blob/main/src/docker-in-docker/README.md)

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
  # cd nextjs-p-ground
  npm install sequelize  --save
  npm install mysql2  --save
  
  npm install sequelize-cli --save-dev

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
  ```