import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class updateUsers1569401705190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'confirmation_token',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'verified',
        default: false,
        type: 'boolean',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('user', 'confirmation_token');
    await queryRunner.dropColumn('user', 'verified');
  }
}
