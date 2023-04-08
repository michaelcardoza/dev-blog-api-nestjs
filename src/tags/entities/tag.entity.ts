import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from '@app/posts/entities/post.entity';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToMany(() => Post, (post: Post) => post.tags)
  posts: Post[];
}
