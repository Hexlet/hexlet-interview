import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { datetime } from '../datetime.adapter';

export class request1568124956212 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const databaseType = queryRunner.connection.options.type;
    await queryRunner.createTable(
      new Table({
        name: 'request',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'state',
            type: 'varchar',
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'profession',
            type: 'varchar',
          },
          {
            name: 'position',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: datetime(databaseType),
          },
          {
            name: 'updated_at',
            type: datetime(databaseType),
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('request');
  }
}
