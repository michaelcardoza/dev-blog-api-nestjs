import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { PostStatus } from '@app/posts/entities/post.entity';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  slug?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  image?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsUUID('all', { each: true })
  tags: string[];
}
