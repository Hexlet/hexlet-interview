test:
	npm run test

setup:
	cp -n .env.example .env || true

start:
	npm run start:dev

lint:
	npm run lint

.PHONY: test
