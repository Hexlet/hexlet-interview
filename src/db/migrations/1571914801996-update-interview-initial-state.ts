import { MigrationInterface, QueryRunner } from 'typeorm';
import { Interview, interviewState } from '../../modules/interview/interview.entity';

export class updateInterviewInitialState1571914801996 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const interviewRepo = queryRunner.manager.getRepository(Interview);
    await interviewRepo
      .createQueryBuilder()
      .update()
      .set({
        state: interviewState.WAIT_FOR_INTERVIEWER,
      })
      .where({
        state: 'new',
      })
      .execute();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public down(): any {}
}
