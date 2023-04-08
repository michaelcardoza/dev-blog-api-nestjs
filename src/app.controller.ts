import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { FeedQueryDto } from '@app/shared/dto';
import { AppService } from '@app/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('feed')
  feed(@Query() query?: FeedQueryDto) {
    return this.appService.feed(query);
  }

  @Get('feed/:id')
  findOne(@Param('id', ParseUUIDPipe) postId: string) {
    return this.appService.findOne(postId);
  }
}
