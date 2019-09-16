import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class user1568273019623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',        },
          {
            name: 'firstname',
            type: 'varchar',
          },
          {
            name: 'lastname',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'enabled',
            type: 'integer',
          },
      ],
      }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user');
    }

}
