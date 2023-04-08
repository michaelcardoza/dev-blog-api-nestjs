import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tag } from '@app/tags/entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll() {
    return await this.tagRepository.find();
  }

  async findOneBySlug(slug: string) {
    try {
      return await this.tagRepository.findOneOrFail({
        where: {
          name: slug,
        },
      });
    } catch (error) {
      throw new NotFoundException(['Tag not found.']);
    }
  }
}
