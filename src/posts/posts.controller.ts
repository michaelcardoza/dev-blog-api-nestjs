import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';

import { QueryDto } from '@app/shared/dto';
import { AccessTokenGuard } from '@app/auth/guards';
import { AuthUser } from '@app/auth/decorators';
import { PostsService } from '@app/posts/posts.service';
import { CommentsService } from '@app/comments/comments.service';
import { CreatePostDto, UpdatePostDto } from '@app/posts/dto';
import { CreateCommentDto } from '@app/comments/dto/create-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@AuthUser() user, @Body() data: CreatePostDto) {
    return this.postsService.create(user.id, data);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@AuthUser() user, @Query() query?: QueryDto) {
    return this.postsService.findAll(user.id, query);
  }

  // @UseGuards(AccessTokenGuard)
  // @Get(':id')
  // findOne(@AuthUser() user, @Param('id', ParseUUIDPipe) postId: string) {
  //   return this.postsService.findOne(user.id, postId);
  // }

  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.postsService.findOneBySlug(slug);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @AuthUser() user,
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() data: UpdatePostDto,
  ) {
    return this.postsService.update(user.id, postId, data);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@AuthUser() user, @Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.remove(user.id, id);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/tags/:tagId')
  addTagByPost(
    @AuthUser() user,
    @Param('id', ParseUUIDPipe) postId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ) {
    return this.postsService.addTagByPost(user.id, postId, tagId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id/tags/:tagId')
  removeTagByPost(
    @AuthUser() user,
    @Param('id', ParseUUIDPipe) postId: string,
    @Param('tagId', ParseUUIDPipe) tagId: string,
  ) {
    return this.postsService.removeTagByPost(user.id, postId, tagId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/likes')
  addLikeByPost(@AuthUser() user, @Param('id', ParseUUIDPipe) postId: string) {
    return this.postsService.addLikeByPost(user.id, postId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id/likes')
  removeLikeByPost(
    @AuthUser() user,
    @Param('id', ParseUUIDPipe) postId: string,
  ) {
    return this.postsService.removeLikeByPost(user.id, postId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/comments')
  addCommentByPost(
    @AuthUser() user,
    @Param('id', ParseUUIDPipe) postId: string,
    @Body() data: CreateCommentDto,
  ) {
    return this.commentsService.create(user.id, postId, data);
  }

  @Get(':id/comments')
  findCommentsByPost(
    @Param('id', ParseUUIDPipe) postId: string,
    @Query() query?: QueryDto,
  ) {
    return this.commentsService.findAll(postId, query);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id/comments/:commentId')
  removeCommentsByPost(
    @AuthUser() user,
    @Param('id', ParseUUIDPipe) postId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.commentsService.remove(user.id, postId, commentId);
  }
}
