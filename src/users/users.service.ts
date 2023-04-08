import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { SignupDto } from '@app/auth/dto';
import { User } from '@app/users/entities/user.entity';
import { Profile } from '@app/users/entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private dataSource: DataSource,
  ) {}

  async create(data: SignupDto) {
    let userId;

    await this.dataSource.transaction(async (manager) => {
      const { email, password, username, firstName, lastName } = data;

      const user = this.userRepository.create({
        email,
        username,
        password,
      });
      const userSaved = await manager.save(user);

      const profile = this.profileRepository.create({
        firstName,
        lastName,
        user: userSaved,
      });
      await manager.save(profile);

      userId = userSaved.id;
    });

    if (userId) {
      return this.profile(userId);
    }

    throw new InternalServerErrorException(['Server Internal Error']);
  }

  async profile(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        profile: true,
      },
    });

    return this.mapDynamic(user);
  }

  async findOneByUsername(username: string, select) {
    const user = await this.userRepository.findOneOrFail({
      where: [{ username }, { email: username }],
      select,
      relations: {
        profile: true,
      },
    });

    return this.mapDynamic(user);
  }

  private mapDynamic(data: any) {
    const {
      profile: { id, ...profile },
      ...user
    } = data;

    return {
      ...user,
      profile,
    };
  }
}
