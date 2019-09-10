/* tslint:disable max-line-length */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1568118669227 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "interview" ("id" SERIAL NOT NULL, "interviewer" character varying NOT NULL, "interviewee" character varying NOT NULL, "video_link" character varying NOT NULL, CONSTRAINT "PK_44c49a4feadefa5c6fa78bfb7d1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "interview"`);
  }
}
