test:
	npm run test

setup: create_development_vars fixtures-load

create_development_vars:
	cp -n .env.example development.env || true

install:
	npm ci

start:
	npm run start:dev

lint:
	npm run lint

db-up:
	docker-compose up -d

db-down:
	docker-compose down

db-console:
	docker-compose exec db psql -U test -d interview

db-console-test:
	docker-compose exec db_test psql -U test -d interview-test

db-reset:
	npm run schema:drop && npm run migration:run && npm run fixtures:load

fixtures-load:
	npm run fixtures:load

.PHONY: test
