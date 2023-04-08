import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Tag } from '@app/tags/entities/tag.entity';
import { Post } from '@app/posts/entities/post.entity';
import { User } from '@app/users/entities/user.entity';
import { Profile } from '@app/users/entities/profile.entity';

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const tagRepository = dataSource.getRepository(Tag);
    const postRepository = dataSource.getRepository(Post);
    const userRepository = dataSource.getRepository(User);

    const chunk = (arr, size) => {
      return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size),
      );
    };

    if (!(await userRepository.find()).length) {
      const password = await bcrypt.hash('password', 10);

      await factory(User)()
        .map(async (user) => {
          const profile = await factory(Profile)().create();
          user.email = 'mcardoza@test.com';
          user.username = 'mcardoza';
          user.password = password;
          user.profile = profile;
          return user;
        })
        .create();

      await factory(User)()
        .map(async (user) => {
          const profile = await factory(Profile)().create();
          user.password = password;
          user.profile = profile;
          return user;
        })
        .createMany(10);
    }

    if (!(await tagRepository.find()).length) {
      const items = [
        'javascript',
        'typescript',
        'node',
        'python',
        'linux',
        'devops',
      ];

      for (const item of items) {
        await tagRepository.insert({
          name: item,
        });
      }
    }

    if (!(await postRepository.find()).length) {
      const users = await userRepository.find();
      const tags = await tagRepository.find();
      const tagGroup = chunk(tags, 2);
      await factory(Post)()
        .map(async (post) => {
          post.tags = tagGroup[Math.floor(Math.random() * tagGroup.length)];
          post.author = users[Math.floor(Math.random() * users.length)];
          return post;
        })
        .createMany(20);
    }
  }
}
