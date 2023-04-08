import { faker as Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';

import { User } from '@app/users/entities/user.entity';

define(User, (faker: typeof Faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.username = faker.internet.userName();

  return user;
});
