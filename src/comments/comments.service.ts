import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { QueryDto } from '@app/shared/dto';
import { Comment } from '@app/comments/entities/comment.entity';
import { User } from '@app/users/entities/user.entity';
import { Post } from '@app/posts/entities/post.entity';
import { CreateCommentDto } from '@app/comments/dto/create-comment.dto';
import { buildQueryParams } from '@app/shared/utils/query-params';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(userId: string, postId: string, data: CreateCommentDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const post = await this.postRepository.findOneBy({ id: postId });

    if (!post) {
      throw new NotFoundException(['Post not found.']);
    }

    const commentCreated = this.commentRepository.create({
      user,
      post,
      comment: data.comment,
    });

    if (data?.parentCommentId) {
      commentCreated.parent = await this.commentRepository.findOneBy({
        id: data.parentCommentId,
      });
    }

    const commentSaved = await this.commentRepository.save(commentCreated);

    return {
      id: commentSaved.id,
      comment: commentSaved.comment,
      parent: commentSaved?.parent?.id,
      createdAt: commentSaved.createdAt,
    };
  }

  async findAll(postId: string, query: QueryDto) {
    const { skip, take, page, sort } = buildQueryParams(query);
    const [comments, count] = await this.commentRepository.findAndCount({
      where: {
        post: { id: postId },
        parent: IsNull(),
      },
      relations: { children: true },
      skip,
      take,
      order: sort,
    });

    return {
      data: comments,
      count: count ?? 0,
      hasMore: count - take * page > 0,
    };
  }

  async remove(userId: string, postId: string, commentId: string) {
    try {
      const comment = await this.commentRepository.findOneBy({
        id: commentId,
        user: { id: userId },
        post: { id: postId },
      });

      return await this.commentRepository.remove(comment);
    } catch (error) {
      throw new NotFoundException(['Comment not found']);
    }
  }
}
