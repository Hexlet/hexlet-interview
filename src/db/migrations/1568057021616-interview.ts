import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { datetime } from '../datetime.adapter';

export class interview1568057021616 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const databaseType = queryRunner.connection.options.type;
    await queryRunner.createTable(
      new Table({
        name: 'interview',
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
            name: 'description',
            type: 'text',
            isNullable: true,
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
    await queryRunner.dropTable('interview');
  }
}
