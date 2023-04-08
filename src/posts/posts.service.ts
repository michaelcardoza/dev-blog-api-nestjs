import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { PostgresErrorCode } from '@app/database/postgres-error-codes.enum';
import { buildQueryParams } from '@app/shared/utils/query-params';
import { QueryDto } from '@app/shared/dto';
import { CreatePostDto, UpdatePostDto } from '@app/posts/dto';
import { Post, PostStatus } from '@app/posts/entities/post.entity';
import { Tag } from '@app/tags/entities/tag.entity';
import { User } from '@app/users/entities/user.entity';
import { Like } from '@app/shared/entities';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async create(userId: string, data: CreatePostDto) {
    try {
      const tags = await this.tagRepository.find({
        where: { id: In(data.tags) },
      });
      const author = await this.userRepository.findOne({
        where: { id: userId },
      });
      const postCreated = this.postRepository.create({
        ...data,
        tags,
        author,
      });
      const post = await this.postRepository.save(postCreated);

      return this.mapDynamic(post);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(['Post with that slug already exists']);
      }
      throw new InternalServerErrorException(['Something went wrong']);
    }
  }

  async findAll(userId: string, query: QueryDto) {
    const { skip, take, page, sort } = buildQueryParams(query);
    const [posts, count] = await this.postRepository.findAndCount({
      where: { author: { id: userId } },
      relations: { tags: true },
      skip,
      take,
      order: sort,
    });

    return {
      data: posts ? posts.map((post) => this.mapDynamic(post)) : [],
      count: count ?? 0,
      hasMore: count - take * page > 0,
    };
  }

  async findOne(userId: string, postId: string) {
    try {
      const post = await this.postRepository.findOneOrFail({
        where: { id: postId, author: { id: userId } },
        relations: { tags: true },
      });

      return this.mapDynamic(post);
    } catch (error) {
      throw new NotFoundException(['Post not found.']);
    }
  }

  async findOneBySlug(slug: string) {
    try {
      const post = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.tags', 'tag')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('author.profile', 'profile')
        .loadRelationCountAndMap('post.likeCount', 'post.likes')
        .loadRelationCountAndMap('post.commentCount', 'post.comments')
        .where('post.slug = :slug AND post.status = :status', {
          slug,
          status: PostStatus.PUBLISHED,
        })
        .select([
          'post.id',
          'post.title',
          'post.slug',
          'post.excerpt',
          'post.content',
          'post.image',
          'post.status',
          'post.createdAt',
          'tag.name',
          'author.id',
          'author.username',
          'author.email',
          'profile.firstName',
          'profile.lastName',
          'profile.bio',
          'profile.image',
        ])
        .getOneOrFail();

      return this.mapDynamic(post);
    } catch (error) {
      throw new NotFoundException(['Post not found.']);
    }
  }

  async update(userId: string, postId: string, changes: UpdatePostDto) {
    try {
      const { tags: tagIds, ...data } = changes;
      const post = await this.postRepository.findOneOrFail({
        where: { id: postId, author: { id: userId } },
        relations: { tags: true },
      });

      if (tagIds) {
        const tags = await this.tagRepository.find({
          where: { id: In(tagIds) },
        });
        post.tags = tags;
      }

      this.postRepository.merge(post, data);
      const postSaved = await this.postRepository.save(post);

      return this.mapDynamic(postSaved);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(['Post with that slug already exists']);
      }
      throw new InternalServerErrorException(['Something went wrong']);
    }
  }

  async remove(userId: string, postId: string) {
    try {
      const post = await this.postRepository.findOneOrFail({
        where: { id: postId, author: { id: userId } },
      });
      await this.postRepository.remove(post);

      return post;
    } catch (error) {
      throw new NotFoundException(['Post not found.']);
    }
  }

  async addTagByPost(userId: string, postId: string, tagId: string) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId, author: { id: userId } },
        relations: { tags: true },
      });

      if (!post) {
        throw new Error('Post not found.');
      }

      if (!post.tags.find((tag) => tag.id === tagId)) {
        const tag = await this.tagRepository.findOne({
          where: { id: tagId },
        });

        if (!tag) {
          throw new Error('Tag not found.');
        }

        post.tags.push(tag);
        const postSaved = await this.postRepository.save(post);

        return this.mapDynamic(postSaved);
      }

      return this.mapDynamic(post);
    } catch (error) {
      throw new NotFoundException([error?.message]);
    }
  }

  async removeTagByPost(userId: string, postId: string, tagId: string) {
    try {
      const post = await this.postRepository.findOneOrFail({
        where: { id: postId, author: { id: userId } },
        relations: { tags: true },
      });
      const tags = post.tags.filter((tag) => tag.id !== tagId);
      post.tags = tags;
      const postSaved = await this.postRepository.save(post);

      return this.mapDynamic(postSaved);
    } catch (error) {
      throw new NotFoundException(['Post not found.']);
    }
  }

  async addLikeByPost(userId: string, postId: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      const post = await this.postRepository.findOneBy({ id: postId });
      const likeByPost = this.likeRepository.create({
        user,
        post,
      });

      await this.likeRepository.insert(likeByPost);

      return {
        message: 'A like was added',
      };
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(['Already has a like']);
      }
      throw new InternalServerErrorException(['Something went wrong']);
    }
  }

  async removeLikeByPost(userId: string, postId: string) {
    try {
      const like = await this.likeRepository.findOneBy({
        user: { id: userId },
        post: { id: postId },
      });
      await this.likeRepository.remove(like);

      return {
        message: 'A like was removed',
      };
    } catch (error) {
      throw new NotFoundException(['Post not found.']);
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
