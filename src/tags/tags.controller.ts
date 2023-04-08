import { Controller, Get, Param } from '@nestjs/common';

import { TagsService } from '@app/tags/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') slug: string) {
    return this.tagsService.findOneBySlug(slug);
  }
}
