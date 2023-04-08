import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

import { generateSlug } from '@app/shared/utils/strings';
import { Tag } from '@app/tags/entities/tag.entity';

@EventSubscriber()
export class TagSubscriber implements EntitySubscriberInterface<Tag> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Tag;
  }

  beforeInsert(event: InsertEvent<Tag>) {
    const { entity } = event;

    entity.name = generateSlug(entity.name);
  }
}
