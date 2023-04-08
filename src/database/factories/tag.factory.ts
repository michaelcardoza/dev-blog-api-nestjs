import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';

import { Tag } from '@app/tags/entities/tag.entity';

define(Tag, (faker: typeof Faker) => {
  const tag = new Tag();
  return tag;
});
