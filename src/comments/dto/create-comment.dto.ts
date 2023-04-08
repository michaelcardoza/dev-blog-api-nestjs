import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsString()
  @IsOptional()
  parentCommentId: string;
}
