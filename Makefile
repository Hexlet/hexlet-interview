test:
	npm run test

setup:
	cp -n .env.example development.env || true
	npm run fixtures:load

install:
	npm install

start:
	npm run start:dev

lint:
	npm run lint

db-console:
	sqlite3 interview.sqlite

fixtures-load:
	npm run fixtures:load

.PHONY: test
