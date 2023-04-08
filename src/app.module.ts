import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from '@app/posts/entities/post.entity';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { DatabaseModule } from '@app/database/database.module';
import { AuthModule } from '@app/auth/auth.module';
import { UsersModule } from '@app/users/users.module';
import { PostsModule } from '@app/posts/posts.module';
import { TagsModule } from '@app/tags/tags.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    DatabaseModule,
    PostsModule,
    TagsModule,
    UsersModule,
    AuthModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
