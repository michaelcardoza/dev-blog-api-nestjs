import { MigrationInterface, QueryRunner } from "typeorm";

export class init1677567708695 implements MigrationInterface {
    name = 'init1677567708695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "tags" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"),
                CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "posts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "excerpt" character varying,
                "content" text NOT NULL,
                "image" character varying,
                "status" character varying NOT NULL DEFAULT 'draft',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "author_id" uuid NOT NULL,
                CONSTRAINT "UQ_54ddf9075260407dcfdd7248577" UNIQUE ("slug"),
                CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "likes" (
                "post_id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_723da61de46f65bb3e3096750d2" PRIMARY KEY ("post_id", "user_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "profile" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "image" character varying,
                "bio" character varying,
                "work" character varying,
                "location" character varying,
                "website" character varying,
                "user_id" uuid,
                CONSTRAINT "REL_d752442f45f258a8bdefeebb2f" UNIQUE ("user_id"),
                CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "comments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "comment" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                "post_id" uuid,
                "parent_comment_id" uuid,
                CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "post_tag" (
                "post_id" uuid NOT NULL,
                "tag_id" uuid NOT NULL,
                CONSTRAINT "PK_c6d49aa86322a6f58c39ea25a5d" PRIMARY KEY ("post_id", "tag_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b5ec92f15aaa1e371f2662f681" ON "post_tag" ("post_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_d2fd5340bb68556fe93650fedc" ON "post_tag" ("tag_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "posts"
            ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "likes"
            ADD CONSTRAINT "FK_741df9b9b72f328a6d6f63e79ff" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "likes"
            ADD CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "profile"
            ADD CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_93ce08bdbea73c0c7ee673ec35a" FOREIGN KEY ("parent_comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "post_tag"
            ADD CONSTRAINT "FK_b5ec92f15aaa1e371f2662f6812" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "post_tag"
            ADD CONSTRAINT "FK_d2fd5340bb68556fe93650fedc1" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post_tag" DROP CONSTRAINT "FK_d2fd5340bb68556fe93650fedc1"
        `);
        await queryRunner.query(`
            ALTER TABLE "post_tag" DROP CONSTRAINT "FK_b5ec92f15aaa1e371f2662f6812"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_93ce08bdbea73c0c7ee673ec35a"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"
        `);
        await queryRunner.query(`
            ALTER TABLE "profile" DROP CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2"
        `);
        await queryRunner.query(`
            ALTER TABLE "likes" DROP CONSTRAINT "FK_3f519ed95f775c781a254089171"
        `);
        await queryRunner.query(`
            ALTER TABLE "likes" DROP CONSTRAINT "FK_741df9b9b72f328a6d6f63e79ff"
        `);
        await queryRunner.query(`
            ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_d2fd5340bb68556fe93650fedc"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b5ec92f15aaa1e371f2662f681"
        `);
        await queryRunner.query(`
            DROP TABLE "post_tag"
        `);
        await queryRunner.query(`
            DROP TABLE "comments"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "profile"
        `);
        await queryRunner.query(`
            DROP TABLE "likes"
        `);
        await queryRunner.query(`
            DROP TABLE "posts"
        `);
        await queryRunner.query(`
            DROP TABLE "tags"
        `);
    }

}
