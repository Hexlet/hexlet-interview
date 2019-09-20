import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { datetime } from '../datetime.adapter';

export class pastInterview1568998724054 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const databaseType = queryRunner.connection.options.type;
    await queryRunner.createTable(
      new Table({
        name: 'past_interview',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'interviewer',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'interviewee',
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
            name: 'video_link',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'date',
            type: datetime(databaseType),
            isNullable: true,
          },
          {
            name: 'created_at',
            type: datetime(databaseType),
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('past_interview');
  }

}
