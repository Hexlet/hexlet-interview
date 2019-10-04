/* eslint-disable @typescript-eslint/no-explicit-any */
// need await in a loop instead of Promise.all(..) to avoid race condition:
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { User } from '../../modules/user/user.entity';
import { Interview } from '../../modules/interview/interview.entity';

const interviewsData = [
  {
    interviewer: 'Кирилл Мокевнин',
    interviewee: 'Денис Кривощеков',
    profession: 'Ruby on Rails',
    position: 'Junior',
    videoLink: 'https://youtu.be/YrXJzD2E6NU',
    date: '2016-03-02 00:00:00',
  },
  {
    interviewer: 'Кирилл Мокевнин',
    interviewee: 'Евгений Синицын',
    profession: 'PHP',
    position: 'Junior',
    videoLink: 'https://youtu.be/H8OZ3B2_X3U',
    date: '2016-03-11 00:00:00',
  },
  {
    interviewer: 'Кирилл Мокевнин',
    interviewee: 'Данияр Супиев',
    profession: 'Python',
    position: 'Junior',
    videoLink: 'https://youtu.be/QirXa-T8C2k',
    date: '2016-03-25 00:00:00',
  },
  {
    interviewer: 'Данил Письменный',
    interviewee: 'Денис Товстоган',
    profession: 'Python',
    position: 'Junior',
    videoLink: 'https://youtu.be/YstIUUh6aFU',
    date: '2016-04-22 00:00:00',
  },
  {
    interviewer: 'Антон Сергеев',
    interviewee: 'Антон Маркелов',
    profession: 'Python',
    position: 'Junior',
    videoLink: 'https://youtu.be/C8SlKzeLAgQ',
    date: '2016-05-06 00:00:00',
  },
  {
    interviewer: 'Кирилл Мокевнин',
    interviewee: 'Дмитрий Струнгарь',
    profession: 'JavaScript frontend',
    position: 'Junior',
    videoLink: 'https://youtu.be/JERUf-xKU1o',
    date: '2018-06-25 00:00:00',
  },
  {
    interviewer: 'Кирилл Мокевнин',
    interviewee: 'Демид Каширин',
    profession: 'JavaScript backend',
    position: 'Junior',
    videoLink: 'https://youtu.be/HM42MlWbhFI',
    date: '2018-09-07 00:00:00',
  },
  {
    interviewer: 'Егор Бугаенко',
    interviewee: 'Сагындык Мухамбетов',
    profession: 'Java',
    position: 'Junior',
    videoLink: 'https://youtu.be/UUhB4rVlIoU',
    date: '2018-12-07 00:00:00',
  },
  {
    interviewer: 'Василий Васильков',
    interviewee: 'Тимур Маликин',
    profession: 'Java',
    position: 'Middle',
    videoLink: 'https://youtu.be/boDeUHdsfAI',
    date: '2018-12-15 00:00:00',
  },
  {
    interviewer: 'Алексей Пирогов',
    interviewee: 'Евгений Губа',
    profession: 'PHP',
    position: 'Middle',
    videoLink: 'https://youtu.be/PmhdRXq1QBE',
    date: '2019-09-30 19:00:00',
  },
];

const getUser = async (
  repo: Repository<User>,
  name: string,
  role: string,
): Promise<User> => {
  const [firstname, lastname] = name.split(' ');
  const userData = {
    firstname,
    lastname,
    role,
    enabled: false,
    archived: true,
  };
  const existingUser = await repo.findOne(userData);
  if (existingUser) {
    return existingUser;
  }
  const newUser = await repo.save(userData);
  return newUser;
};

export class seedInterwiewsToMainTable1570024303371
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const interviewRepo = queryRunner.manager.getRepository(Interview);
    const userRepo = queryRunner.manager.getRepository(User);
    for (const interview of interviewsData) {
      const {
        interviewee: intervieweeName,
        interviewer: interviewerName,
        ...rest
      } = interview;
      const interviewee = await getUser(userRepo, intervieweeName, 'user');
      const interviewer = await getUser(
        userRepo,
        interviewerName,
        'interviewer',
      );
      await interviewRepo.save({
        ...rest,
        interviewee,
        interviewer,
        state: 'passed',
        createdAt: `${new Date()}`,
        updatedAt: `${new Date()}`,
      });
    }
  }

  public async down(): Promise<any> {}
}
