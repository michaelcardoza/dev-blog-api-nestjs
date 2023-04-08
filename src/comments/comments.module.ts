import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentsService } from '@app/comments/comments.service';
import { Post } from '@app/posts/entities/post.entity';
import { Comment } from '@app/comments/entities/comment.entity';
import { User } from '@app/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment])],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
