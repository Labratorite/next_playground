init:
	@make up
	@make migrate
	npx sequelize-cli db:seed:all

migrate:
	npx sequelize-cli db:migrate

migrate-undo:
	npx sequelize-cli db:migrate:undo
# npx sequelize-cli db:migrate:undo:all
# npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js

seed:
	npx sequelize-cli db:seed

seed-undo:
	npx sequelize-cli db:seed:undo
# npx sequelize-cli db:seed:undo:all
# npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data

up:
	docker-compose up -d

destroy:
	docker-compose down --rmi all --volumes --remove-orphans

state:
	docker-compose ps
	docker-compose images
	docker volume ls
	docker network ls
