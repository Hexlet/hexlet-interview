import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class interview1568057021616 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(new Table({
        name: 'interview',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'state',
            type: 'varchar',
          },
          {
            name: 'interviewer',
            type: 'varchar',
          },
          {
            name: 'interviewee',
            type: 'varchar',
          },
          {
            name: 'video_link',
            type: 'varchar',
          },
        ],
      }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropTable('interview');
    }

}
