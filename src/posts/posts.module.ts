import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Like } from '@app/shared/entities';
import { Post } from '@app/posts/entities/post.entity';
import { Tag } from '@app/tags/entities/tag.entity';
import { User } from '@app/users/entities/user.entity';
import { Comment } from '@app/comments/entities/comment.entity';
import { PostSubscriber } from '@app/posts/subscribers/post.subscriber';
import { PostsService } from '@app/posts/posts.service';
import { PostsController } from '@app/posts/posts.controller';
import { CommentsModule } from '@app/comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Tag, User, Like, Comment]),
    CommentsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostSubscriber],
})
export class PostsModule {}
