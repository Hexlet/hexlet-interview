import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User, UserRole } from '../../modules/user/user.entity';

define(User, (faker: typeof Faker, settings: { role: string }) => {
    const user = new User();
    user.id = faker.random.number(1);
    user.firstname = faker.name.firstName();
    user.lastname = faker.name.lastName();
    user.email = faker.internet.email(user.firstname, user.lastname);
    user.password = '1234';
    return user;
});
