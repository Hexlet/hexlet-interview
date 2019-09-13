import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User, UserRole } from '../../modules/user/user.entity';

define(User, (faker: typeof Faker, settings: { role: string }) => {
    const user = new User();
    user.id = faker.random.number(1);
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.email = faker.internet.email(user.firstName, user.lastName);
    user.password = '1234';
    user.role = UserRole.USER;
    return user;
});
