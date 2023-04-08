import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { Post } from '@app/posts/entities/post.entity';
import { User } from '@app/users/entities/user.entity';

@Entity({ name: 'likes' })
export class Like {
  @PrimaryColumn({ name: 'post_id' })
  postId: string;

  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Post, (post) => post.likes)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
