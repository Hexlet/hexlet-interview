import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterUserAddGhprofile1569507383187 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "lastname" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL',
    );
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'github_uid',
        type: 'varchar',
        isNullable: true,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "lastname" SET NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL',
    );
    await queryRunner.dropColumn('user', 'github_uid');
  }
}
