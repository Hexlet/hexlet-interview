import { MigrationInterface, QueryRunner } from 'typeorm';

const interviewsData = [
  {
    interviewer: 'Кирилл Мокевнин',
    interviewee: 'Денис Кривощеков',
    profession: 'Ruby on Rails',
    position: 'Junior',
    videoLink: 'https://youtu.be/YrXJzD2E6NU',
    date: '2016-03-02 00:00:00',
    createdAt: `${new Date()}`,
  },
  {
    interviewer: 'Кирилл Мокевнин',
    interviewee: 'Евгений Синицын',
    profession: 'PHP',
    position: 'Junior',
    videoLink: 'https://youtu.be/H8OZ3B2_X3U',
    date: '2016-03-11 00:00:00',
    createdAt: `${new Date()}`,
  },
  {
    interviewer: 'Кирилл Мокевнин',
    interviewee: 'Данияр Супиев',
    profession: 'Python',
    position: 'Junior',
    videoLink: 'https://youtu.be/QirXa-T8C2k',
    date: '2016-03-25 00:00:00',
    createdAt: `${new Date()}`,
  },
  {
    interviewer: 'Данил Письменный',
    interviewee: 'Денис Товстоган',
    profession: 'Python',
    position: 'Junior',
    videoLink: 'https://youtu.be/YstIUUh6aFU',
    date: '2016-04-22 00:00:00',
    createdAt: `${new Date()}`,
  },
  {
    interviewer: 'Антон Сергеев',
    interviewee: 'Антон Маркелов',
    profession: 'Python',
    position: 'Junior',
    videoLink: 'https://youtu.be/C8SlKzeLAgQ',
    date: '2016-05-06 00:00:00',
    createdAt: `${new Date()}`,
  },
  {
    interviewer: 'Кирилл Мокевнин',
    interviewee: 'Дмитрий Струнгарь',
    profession: 'JavaScript frontend',
    position: 'Junior',
    videoLink: 'https://youtu.be/JERUf-xKU1o',
    date: '2018-06-25 00:00:00',
    createdAt: `${new Date()}`,
  },
  {
    interviewer: 'Кирилл Мокевнин',
    interviewee: 'Демид Каширин',
    profession: 'JavaScript backend',
    position: 'Junior',
    videoLink: 'https://youtu.be/HM42MlWbhFI',
    date: '2018-09-07 00:00:00',
    createdAt: `${new Date()}`,
  },
  {
    interviewer: 'Егор Бугаенко',
    interviewee: 'Сагындык Мухамбетов',
    profession: 'Java',
    position: 'Junior',
    videoLink: 'https://youtu.be/UUhB4rVlIoU',
    date: '2018-12-07 00:00:00',
    createdAt: `${new Date()}`,
  },
  {
    interviewer: 'Василий Васильков',
    interviewee: 'Тимур Маликин',
    profession: 'Java',
    position: 'Junior',
    videoLink: 'https://youtu.be/boDeUHdsfAI',
    date: '2018-12-15 00:00:00',
    createdAt: `${new Date()}`,
  },
];

export class seedPastInterview1569001287252 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const pastInterviewRepo = queryRunner.manager.getRepository(
      'past_interview',
    );
    await pastInterviewRepo.save(interviewsData);
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    const pastInterviewRepo = queryRunner.manager.getRepository(
      'past_interview',
    );
    await pastInterviewRepo.clear();
  }
}
