db-restart:
	npm run migrations:revert
	rm src/database/migrations/*.ts
	npm run migrations:generate --name=init
	npm run migrations:run
	npm run seed:run
