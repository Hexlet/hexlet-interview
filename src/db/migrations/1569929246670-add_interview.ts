import {MigrationInterface, QueryRunner} from "typeorm";

const interview={
  interviewer: 'Алексей Пирогов',
  interviewee: 'Евгений Губа',
  profession: 'PHP',
  position: 'Middle',
  videoLink: 'https://youtu.be/PmhdRXq1QBE',
  date: '2019-09-30 19:00:00',
  createdAt: `${new Date()}`,
};


export class addInterview1569929246670 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      const pastInterviewRepo = queryRunner.manager.getRepository(
        'past_interview',
      );
      await pastInterviewRepo.save(interview);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    const pastInterviewRepo = queryRunner.manager.getRepository(
      'past_interview',
    );
    const { createdAt, ...restInterviewData } = interview;
    const interviewRecord = await pastInterviewRepo.find(restInterviewData);
    await pastInterviewRepo.remove(interviewRecord);
    }

}
