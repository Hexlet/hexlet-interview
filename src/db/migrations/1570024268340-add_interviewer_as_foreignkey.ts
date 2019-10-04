import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class addInterviewerAsForeignKey1570024268340
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'interview',
      new TableColumn({
        name: 'interviewer_id',
        type: 'integer',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'interview',
      new TableForeignKey({
        columnNames: ['interviewer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.dropColumn('interview', 'interviewer');
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'archived',
        type: 'boolean',
        isNullable: true,
      }),
    );
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "enabled" TYPE boolean USING CASE WHEN enabled=0 THEN FALSE ELSE TRUE END',
    );
    await queryRunner.dropTable('past_interview');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "enabled" TYPE integer USING CASE WHEN enabled=false THEN 0 ELSE 1 END',
    );
    await queryRunner.query(
      'ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL',
    );
    await queryRunner.dropColumn('user', 'archived');
    await queryRunner.addColumn(
      'interview',
      new TableColumn({
        name: 'interviewer',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.dropColumn('interviewer', 'interviewer_id');
  }
}
