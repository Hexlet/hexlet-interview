import * as path from 'path';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import { getConnection, getRepository, Connection } from 'typeorm';

export const loadFixtures = async (): Promise<any> => {
  const fixturesPath = path.resolve(__dirname, './fixtures');
  let connection: Connection;

  try {
    connection = await getConnection('default');

    const loader = new Loader();
    loader.load(path.resolve(fixturesPath));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(connection, new Parser());

    const entities = {};
    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture);
      const entityName = entity.constructor.name;
      const entitySaved = await getRepository(entityName).save(entity);
      if (!entities[entityName]) {
        entities[entityName] = {};
      }
      entities[entityName][fixture.name] = entitySaved;
    }

    return entities;
  } catch (err) {
    throw err;
  }
};
