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
                isNullable: false,
              },
              {
                name: 'first_name',
                type: 'varchar',
                length: '255',
                isPrimary: false,
                isNullable: false,
              },
              {
                name: 'last_name',
                type: 'varchar',
                length: '255',
                isPrimary: false,
                isNullable: false,
              },
              {
                name: 'email',
                type: 'varchar',
                length: '255',
                isPrimary: false,
                isNullable: false,
              },
              {
                name: 'password',
                type: 'varchar',
                length: '255',
                isPrimary: false,
                isNullable: false,
              },
              {
                name: 'enabled',
                type: 'boolean',
                isPrimary: false,
                isNullable: false
              },
              {
                name: 'role',
                type: 'varchar',
                length: '255',
                isPrimary: false,
                isNullable: false
              }
          ],
          }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user');
    }

}
