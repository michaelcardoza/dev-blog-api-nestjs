import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { buildQueryParams } from '@app/shared/utils/query-params';
import { FeedQueryDto } from '@app/shared/dto';
import { Post, PostStatus } from '@app/posts/entities/post.entity';

@Injectable()
export class AppService {
  private fields = [
    'post.id',
    'post.title',
    'post.slug',
    'post.excerpt',
    'post.image',
    'post.status',
    'post.createdAt',
    'tag.name',
    'author.id',
    'author.username',
    'author.email',
    'profile.firstName',
    'profile.lastName',
    'profile.image',
  ];

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async feed(query: FeedQueryDto) {
    const { skip, take, page, sort } = buildQueryParams(query, {
      alias: 'post',
    });
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .loadRelationCountAndMap('post.likeCount', 'post.likes')
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .where('post.status = :status', { status: PostStatus.PUBLISHED })
      .select(this.fields)
      .skip(skip)
      .take(take)
      .orderBy(sort);

    if (query?.author) {
      queryBuilder.andWhere('author.username = :username', {
        username: query.author.trim(),
      });
    }

    if (query?.tag) {
      queryBuilder.andWhere('tag.name = :tag', { tag: query.tag.trim() });
    }

    const [posts, count] = await queryBuilder.getManyAndCount();

    return {
      data: posts ? posts.map((post) => this.mapDynamic(post)) : [],
      count: count ?? 0,
      hasMore: count - take * page > 0,
    };
  }

  async findOne(postId: string) {
    try {
      const post = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.tags', 'tag')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('author.profile', 'profile')
        .loadRelationCountAndMap('post.likeCount', 'post.likes')
        .loadRelationCountAndMap('post.commentCount', 'post.comments')
        .where('post.id = :postId AND post.status = :status', {
          postId,
          status: PostStatus.PUBLISHED,
        })
        .select(this.fields)
        .getOneOrFail();

      return this.mapDynamic(post);
    } catch (error) {
      throw new NotFoundException(['Post not found']);
    }
  }

  private mapDynamic(data: Post) {
    const { tags, author, ...post } = data;

    return {
      ...post,
      author,
      tags: tags.map((tag) => tag.name) ?? [],
    };
  }
}
