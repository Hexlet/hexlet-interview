web: node dist/main.js
release: ./node_modules/typeorm/cli.js --config dist/ormconfig.js schema:drop && ./node_modules/typeorm/cli.js --config dist/ormconfig.js migration:run
