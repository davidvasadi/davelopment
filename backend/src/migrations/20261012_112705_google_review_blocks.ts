import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Kézzel írt, célzott migráció — KIZÁRÓLAG a két új dynamic_zone blokk
// (google-review-story, google-review-hero) tábláit hozza létre. Szándékosan
// nem a `payload migrate:create` auto-diffje, mert a dev DB március óta csak
// push:true-val (nem migrációval) szinkronizált, így az auto-diff rengeteg,
// ezzel a változtatással semmilyen kapcsolatban nem álló, meglévő enumot is
// kétértelműnek jelzett (rename vs. create) — ezt nem lehetett volna
// biztonságosan, vakon végigkattintani production ellen. A DDL az alábbi
// táblákhoz a dev adatbázisból (pg_dump --schema-only) lett átemelve, a
// meglévő blokkokkal azonos mintát követve (pl. pages_blocks_cta).

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE "pages_blocks_google_review_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar NOT NULL,
  	"card1_heading" varchar,
  	"card1_cta_text" varchar,
  	"card1_cta_url" varchar,
  	"card2_media_id" integer,
  	"card2_caption" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "pages_blocks_google_review_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "pages_blocks_google_review_hero_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar NOT NULL,
  	"label" varchar
  );

  CREATE TABLE "_pages_v_blocks_google_review_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"card1_heading" varchar,
  	"card1_cta_text" varchar,
  	"card1_cta_url" varchar,
  	"card2_media_id" integer,
  	"card2_caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_google_review_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );

  CREATE TABLE "_pages_v_blocks_google_review_hero_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );

  ALTER TABLE "pages_blocks_google_review_story" ADD CONSTRAINT "pages_blocks_google_review_story_pkey" PRIMARY KEY ("id");
  ALTER TABLE "pages_blocks_google_review_hero" ADD CONSTRAINT "pages_blocks_google_review_hero_pkey" PRIMARY KEY ("id");
  ALTER TABLE "pages_blocks_google_review_hero_tags" ADD CONSTRAINT "pages_blocks_google_review_hero_tags_pkey" PRIMARY KEY ("id");

  ALTER TABLE "pages_blocks_google_review_story" ADD CONSTRAINT "pages_blocks_google_review_story_card2_media_id_media_id_fk" FOREIGN KEY ("card2_media_id") REFERENCES "public"."media"("id") ON DELETE SET NULL ON UPDATE no action;
  ALTER TABLE "pages_blocks_google_review_story" ADD CONSTRAINT "pages_blocks_google_review_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE CASCADE ON UPDATE no action;
  ALTER TABLE "pages_blocks_google_review_hero" ADD CONSTRAINT "pages_blocks_google_review_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE SET NULL ON UPDATE no action;
  ALTER TABLE "pages_blocks_google_review_hero" ADD CONSTRAINT "pages_blocks_google_review_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE CASCADE ON UPDATE no action;
  ALTER TABLE "pages_blocks_google_review_hero_tags" ADD CONSTRAINT "pages_blocks_google_review_hero_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_google_review_hero"("id") ON DELETE CASCADE ON UPDATE no action;

  ALTER TABLE "_pages_v_blocks_google_review_story" ADD CONSTRAINT "_pages_v_blocks_google_review_story_card2_media_id_media_id_fk" FOREIGN KEY ("card2_media_id") REFERENCES "public"."media"("id") ON DELETE SET NULL ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_google_review_story" ADD CONSTRAINT "_pages_v_blocks_google_review_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE CASCADE ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_google_review_hero" ADD CONSTRAINT "_pages_v_blocks_google_review_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE SET NULL ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_google_review_hero" ADD CONSTRAINT "_pages_v_blocks_google_review_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE CASCADE ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_google_review_hero_tags" ADD CONSTRAINT "_pages_v_blocks_google_review_hero_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_google_review_hero"("id") ON DELETE CASCADE ON UPDATE no action;

  CREATE INDEX "pages_blocks_google_review_story_order_idx" ON "pages_blocks_google_review_story" USING btree ("_order");
  CREATE INDEX "pages_blocks_google_review_story_parent_id_idx" ON "pages_blocks_google_review_story" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_google_review_story_path_idx" ON "pages_blocks_google_review_story" USING btree ("_path");
  CREATE INDEX "pages_blocks_google_review_story_locale_idx" ON "pages_blocks_google_review_story" USING btree ("_locale");
  CREATE INDEX "pages_blocks_google_review_story_card2_media_idx" ON "pages_blocks_google_review_story" USING btree ("card2_media_id");

  CREATE INDEX "pages_blocks_google_review_hero_order_idx" ON "pages_blocks_google_review_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_google_review_hero_parent_id_idx" ON "pages_blocks_google_review_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_google_review_hero_path_idx" ON "pages_blocks_google_review_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_google_review_hero_locale_idx" ON "pages_blocks_google_review_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_google_review_hero_image_idx" ON "pages_blocks_google_review_hero" USING btree ("image_id");

  CREATE INDEX "pages_blocks_google_review_hero_tags_order_idx" ON "pages_blocks_google_review_hero_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_google_review_hero_tags_parent_id_idx" ON "pages_blocks_google_review_hero_tags" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_google_review_hero_tags_locale_idx" ON "pages_blocks_google_review_hero_tags" USING btree ("_locale");

  CREATE INDEX "_pages_v_blocks_google_review_story_order_idx" ON "_pages_v_blocks_google_review_story" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_google_review_story_parent_id_idx" ON "_pages_v_blocks_google_review_story" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_google_review_story_path_idx" ON "_pages_v_blocks_google_review_story" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_google_review_story_locale_idx" ON "_pages_v_blocks_google_review_story" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_google_review_story_card2_media_idx" ON "_pages_v_blocks_google_review_story" USING btree ("card2_media_id");

  CREATE INDEX "_pages_v_blocks_google_review_hero_order_idx" ON "_pages_v_blocks_google_review_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_google_review_hero_parent_id_idx" ON "_pages_v_blocks_google_review_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_google_review_hero_path_idx" ON "_pages_v_blocks_google_review_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_google_review_hero_locale_idx" ON "_pages_v_blocks_google_review_hero" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_google_review_hero_image_idx" ON "_pages_v_blocks_google_review_hero" USING btree ("image_id");

  CREATE INDEX "_pages_v_blocks_google_review_hero_tags_order_idx" ON "_pages_v_blocks_google_review_hero_tags" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_google_review_hero_tags_parent_id_idx" ON "_pages_v_blocks_google_review_hero_tags" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_google_review_hero_tags_locale_idx" ON "_pages_v_blocks_google_review_hero_tags" USING btree ("_locale");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "pages_blocks_google_review_hero_tags" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_google_review_hero" CASCADE;
  DROP TABLE IF EXISTS "pages_blocks_google_review_story" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_google_review_hero_tags" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_google_review_hero" CASCADE;
  DROP TABLE IF EXISTS "_pages_v_blocks_google_review_story" CASCADE;
  `)
}
