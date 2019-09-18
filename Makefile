test:
	npm run test

setup:
	cp -n .env.example development.env || true

install:
	npm install

start:
	npm run start:dev

lint:
	npm run lint

db-console:
	sqlite3 interview

.PHONY: test
