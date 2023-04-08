import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tag } from '@app/tags/entities/tag.entity';
import { TagsService } from '@app/tags/tags.service';
import { TagsController } from '@app/tags/tags.controller';
import { TagSubscriber } from '@app/tags/subscribers/tag.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagsController],
  providers: [TagsService, TagSubscriber],
})
export class TagsModule {}
