import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { generateSlug } from '@app/shared/utils/strings';
import { Post } from '@app/posts/entities/post.entity';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Post;
  }

  beforeInsert(event: InsertEvent<Post>) {
    const { entity } = event;

    if (entity?.slug) {
      entity.slug = generateSlug(entity.slug);
    } else {
      entity.slug = generateSlug(entity.title);
    }
  }
}
