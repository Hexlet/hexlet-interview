/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import path from 'path';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../src/modules/user/user.entity';
import { Interview } from '../src/modules/interview/interview.entity';

interface Fixtures {
  User: { [key: string]: User };
  Interview: { [key: string]: Interview };
}

export const loadFixtures = async (): Promise<Fixtures> => {
  const fixturesPath = path.resolve(__dirname, './fixtures');
  const connection = await getConnection('default');

  const loader = new Loader();
  loader.load(path.resolve(fixturesPath));

  const resolver = new Resolver();
  const fixtures = resolver.resolve(loader.fixtureConfigs);
  const builder = new Builder(connection, new Parser());

  const entities = {};
  for (const fixture of fixturesIterator(fixtures)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entity: any = await builder.build(fixture);
    const entityName = entity.constructor.name;
    const entitySaved = await getRepository(entityName).save(entity);
    if (!entities[entityName]) {
      entities[entityName] = {};
    }
    entities[entityName][fixture.name] = entitySaved;
  }

  return entities;
};

export const clearDb = async (): Promise<void> => {
  const connection = await getConnection('default');
  await connection.dropDatabase();
  await connection.close();
};
