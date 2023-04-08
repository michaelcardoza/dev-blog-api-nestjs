import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from './query.dto';

export class FeedQueryDto extends QueryDto {
  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  tag?: string;
}
