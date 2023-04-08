import { PartialType } from '@nestjs/mapped-types';

import { CreatePostDto } from '@app/posts/dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
