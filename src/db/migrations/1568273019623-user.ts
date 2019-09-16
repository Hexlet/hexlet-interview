import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { stringLiteral } from "@babel/types";

export class user1568273019623 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: 'user',
            columns: [
              {
                name: 'id',
                type: 'number',
                length: '255',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',              },
              {
                name: 'firstname',
                type: 'varchar',
                length: '255',
              },
              {
                name: 'lastname',
                type: 'varchar',
                length: '255',
              },
              {
                name: 'email',
                type: 'varchar',
                length: '255',
              },
              {
                name: 'password',
                type: 'varchar',
                length: '255',
              },
              {
                name: 'enabled',
                type: 'boolean',
              },
              {
                name: 'role',
                type: 'varchar',
                length: '255',
              }
          ],
          }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user');
    }

}
