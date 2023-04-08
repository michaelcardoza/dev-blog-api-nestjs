import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Like } from '@app/shared/entities';
import { User } from '@app/users/entities/user.entity';
import { Profile } from '@app/users/entities/profile.entity';
import { Post } from '@app/posts/entities/post.entity';
import { Comment } from '@app/comments/entities/comment.entity';
import { UsersService } from '@app/users/users.service';
import { UsersController } from '@app/users/users.controller';
import { UserSubscriber } from '@app/users/subscribers/user.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Post, Like, Comment])],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService],
})
export class UsersModule {}
