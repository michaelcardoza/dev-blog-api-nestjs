import { faker as Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';

import { generateSlug } from '@app/shared/utils/strings';
import { Post, PostStatus } from '@app/posts/entities/post.entity';

define(Post, (faker: typeof Faker) => {
  const post = new Post();
  post.title = faker.random.words(6);
  post.slug = generateSlug(post.title);
  post.excerpt = faker.lorem.paragraph();
  post.status = PostStatus.PUBLISHED;
  post.content = `
  # Class laoreet integer suscipit porta torquen

  Lorem ipsum dolor sit amet consectetur adipiscing elit ac tincidunt, interdum curabitur proin elementum sed at tempus congue etiam, libero placerat quis ultrices mi dis vulputate dictumst. Primis rhoncus fringilla sagittis convallis sapien quisque ornare, luctus faucibus erat a phasellus eget taciti molestie, tempus curabitur lacinia cum ultricies facilisis.

  Dis phasellus orci nec nulla vulputate suscipit elementum luctus, dapibus suspendisse aliquet eros donec scelerisque tristique maecenas, sollicitudin augue ridiculus cursus ut class pulvinar. Inceptos ridiculus ad enim habitant tempus suscipit dui, sodales nunc rhoncus quis egestas ullamcorper venenatis lacinia, ante montes mi metus parturient ultrices.

  ## Eu ut elementum est morbi pharetra

  - Commodo fringilla semper massa consequat rutrum, libero nisi donec lacus.

  - Imperdiet lobortis vulputate justo phasellus, dictum neque laoreet.

  - Etiam fermentum aliquam morbi varius sed class, taciti rutrum curabitur laoreet.

  - Sed nibh semper proin conubia suspendisse, viverra quam placerat.

  Eu cursus torquent malesuada et nam ligula mi montes tincidunt nisi mus, turpis dui erat diam nunc arcu lacinia eros habitant. Vivamus etiam placerat semper congue dignissim luctus augue, taciti diam hendrerit eget velit nam suspendisse sodales, tellus curabitur sapien donec pulvinar dictumst lacus, maecenas fermentum viverra ultricies venenatis tortor.

  Euismod rhoncus quis diam cras enim ante purus cubilia ut urna ad, netus senectus hac egestas penatibus commodo luctus class neque gravida conubia, laoreet habitasse magnis suscipit nostra aliquet fames facilisis scelerisque leo.

  Justo magnis nam ultricies ante nunc cras praesent dui neque metus potenti lectus, penatibus tellus nisl venenatis ornare gravida erat augue ridiculus vel taciti, ultrices habitasse velit molestie viverra platea accumsan parturient sociosqu est ullamcorper.
  `;

  return post;
});
