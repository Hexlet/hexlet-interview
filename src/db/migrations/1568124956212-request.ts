import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class request1568124956212 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(new Table({
        name: 'request',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'profession',
            type: 'varchar',
          },
        ],
      }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropTable('request');
    }

}
