import { faker as Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';

import { Profile } from '@app/users/entities/profile.entity';

define(Profile, (faker: typeof Faker) => {
  const profile = new Profile();
  profile.firstName = faker.name.firstName();
  profile.lastName = faker.name.lastName();
  profile.bio = faker.lorem.text();
  profile.work = faker.name.jobTitle();
  profile.location = faker.address.country();

  return profile;
});
