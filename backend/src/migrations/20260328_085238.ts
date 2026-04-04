import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('hu', 'en');
  CREATE TYPE "public"."enum_articles_blocks_cta_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_articles_blocks_cta_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_articles_person_card_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_articles_person_card_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_blocks_cta_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__articles_v_blocks_cta_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__articles_v_version_person_card_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__articles_v_version_person_card_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('hu', 'en');
  CREATE TYPE "public"."enum_contacts_state" AS ENUM('new', 'in_progress', 'done');
  CREATE TYPE "public"."enum__contacts_v_version_state" AS ENUM('new', 'in_progress', 'done');
  CREATE TYPE "public"."enum_newsletters_language" AS ENUM('hu', 'en');
  CREATE TYPE "public"."enum_pages_blocks_hero_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_pages_blocks_hero_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_pages_blocks_hero_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_pages_blocks_hero_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_pages_blocks_cta_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_pages_blocks_cta_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_pages_blocks_blog_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_pages_blocks_blog_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum_pages_blocks_why_choose_us_cards_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum_pages_blocks_form_section_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum_pages_blocks_form_section_benefits_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum_pages_blocks_form_section_policy_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_pages_blocks_form_section_social_links_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_pages_blocks_form_section_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_pages_blocks_form_section_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_blog_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__pages_v_blocks_blog_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum__pages_v_blocks_why_choose_us_cards_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum__pages_v_blocks_form_section_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum__pages_v_blocks_form_section_benefits_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum__pages_v_blocks_form_section_policy_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__pages_v_blocks_form_section_social_links_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__pages_v_blocks_form_section_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__pages_v_blocks_form_section_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('hu', 'en');
  CREATE TYPE "public"."enum_plans_cta_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_plans_cta_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_plans_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_plans_plan_type" AS ENUM('starter', 'pro', 'studio', 'project', 'monthly', 'enterprise');
  CREATE TYPE "public"."enum__plans_v_version_cta_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__plans_v_version_cta_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__plans_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__plans_v_published_locale" AS ENUM('hu', 'en');
  CREATE TYPE "public"."enum__plans_v_version_plan_type" AS ENUM('starter', 'pro', 'studio', 'project', 'monthly', 'enterprise');
  CREATE TYPE "public"."enum_products_blocks_cta_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_products_blocks_cta_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_products_blocks_form_section_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum_products_blocks_form_section_benefits_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum_products_blocks_form_section_policy_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_products_blocks_form_section_social_links_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_products_blocks_form_section_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_products_blocks_form_section_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_products_blocks_newsletter_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum_products_button_center_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_products_button_center_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_products_button_bottom_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_products_button_bottom_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_blocks_cta_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__products_v_blocks_cta_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__products_v_blocks_form_section_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum__products_v_blocks_form_section_benefits_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum__products_v_blocks_form_section_policy_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__products_v_blocks_form_section_social_links_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__products_v_blocks_form_section_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__products_v_blocks_form_section_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__products_v_blocks_newsletter_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum__products_v_version_button_center_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__products_v_version_button_center_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__products_v_version_button_bottom_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__products_v_version_button_bottom_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('hu', 'en');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_published_locale" AS ENUM('hu', 'en');
  CREATE TYPE "public"."enum_blog_page_blocks_hero_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_blog_page_blocks_hero_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_blog_page_blocks_hero_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_blog_page_blocks_hero_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_blog_page_blocks_form_section_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum_blog_page_blocks_form_section_benefits_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum_blog_page_blocks_form_section_policy_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_blog_page_blocks_form_section_social_links_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_blog_page_blocks_form_section_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_blog_page_blocks_form_section_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_blog_page_blocks_cta_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_blog_page_blocks_cta_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_product_page_blocks_hero_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_product_page_blocks_hero_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_product_page_blocks_hero_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_product_page_blocks_hero_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_product_page_blocks_cta_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_product_page_blocks_cta_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_product_page_blocks_blog_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_product_page_blocks_blog_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_product_page_blocks_newsletter_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum_product_page_blocks_why_choose_us_cards_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum_product_page_blocks_form_section_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum_product_page_blocks_form_section_benefits_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum_product_page_blocks_form_section_policy_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_product_page_blocks_form_section_social_links_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_product_page_blocks_form_section_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_product_page_blocks_form_section_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_global_navbar_left_navbar_items_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_global_navbar_right_navbar_items_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_global_navbar_policy_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_global_footer_internal_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_global_footer_policy_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_global_footer_social_media_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_service_blocks_hero_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_service_blocks_hero_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_service_blocks_hero_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_service_blocks_hero_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_service_blocks_cta_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_service_blocks_cta_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_service_blocks_blog_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_service_blocks_blog_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_service_blocks_newsletter_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum_service_blocks_why_choose_us_cards_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum_service_blocks_form_section_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum_service_blocks_form_section_benefits_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum_service_blocks_form_section_policy_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_service_blocks_form_section_social_links_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_service_blocks_form_section_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum_service_blocks_form_section_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum_service_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__service_v_blocks_hero_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__service_v_blocks_hero_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__service_v_blocks_hero_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__service_v_blocks_hero_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__service_v_blocks_cta_c_t_as_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__service_v_blocks_cta_c_t_as_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__service_v_blocks_blog_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__service_v_blocks_blog_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__service_v_blocks_newsletter_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum__service_v_blocks_why_choose_us_cards_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum__service_v_blocks_form_section_form_inputs_type" AS ENUM('text', 'email', 'textarea', 'checkbox', 'submit');
  CREATE TYPE "public"."enum__service_v_blocks_form_section_benefits_icon" AS ENUM('rotate', 'step', 'check', 'clock');
  CREATE TYPE "public"."enum__service_v_blocks_form_section_policy_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__service_v_blocks_form_section_social_links_links_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__service_v_blocks_form_section_person_button_target" AS ENUM('_self', '_blank', '_parent', '_top');
  CREATE TYPE "public"."enum__service_v_blocks_form_section_person_button_variant" AS ENUM('primary', 'outline', 'simple', 'muted');
  CREATE TYPE "public"."enum__service_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__service_v_published_locale" AS ENUM('hu', 'en');
  CREATE TABLE "articles_blocks_cta_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_articles_blocks_cta_c_t_as_target" DEFAULT '_self',
  	"variant" "enum_articles_blocks_cta_c_t_as_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "articles_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_cta_locales" (
  	"badge_label" varchar,
  	"heading" varchar,
  	"heading_highlight" varchar,
  	"sub_heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "articles_blocks_related_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "articles_blocks_related_articles_locales" (
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"person_card_name" varchar,
  	"person_card_role" varchar,
  	"person_card_org" varchar,
  	"person_card_image_id" integer,
  	"person_card_button_text" varchar,
  	"person_card_button_url" varchar,
  	"person_card_button_target" "enum_articles_person_card_button_target" DEFAULT '_self',
  	"person_card_button_variant" "enum_articles_person_card_button_variant" DEFAULT 'primary',
  	"social_media_card_heading" varchar,
  	"social_media_card_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"content" jsonb,
  	"image_id" integer,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_meta_image_id" integer,
  	"seo_keywords" varchar,
  	"seo_meta_robots" varchar,
  	"seo_structured_data" jsonb,
  	"seo_meta_viewport" varchar,
  	"seo_canonical_u_r_l" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"categories_id" integer,
  	"media_id" integer,
  	"articles_id" integer
  );
  
  CREATE TABLE "_articles_v_blocks_cta_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum__articles_v_blocks_cta_c_t_as_target" DEFAULT '_self',
  	"variant" "enum__articles_v_blocks_cta_c_t_as_variant" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_cta_locales" (
  	"badge_label" varchar,
  	"heading" varchar,
  	"heading_highlight" varchar,
  	"sub_heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v_blocks_related_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_articles_v_blocks_related_articles_locales" (
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_person_card_name" varchar,
  	"version_person_card_role" varchar,
  	"version_person_card_org" varchar,
  	"version_person_card_image_id" integer,
  	"version_person_card_button_text" varchar,
  	"version_person_card_button_url" varchar,
  	"version_person_card_button_target" "enum__articles_v_version_person_card_button_target" DEFAULT '_self',
  	"version_person_card_button_variant" "enum__articles_v_version_person_card_button_variant" DEFAULT 'primary',
  	"version_social_media_card_heading" varchar,
  	"version_social_media_card_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__articles_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_content" jsonb,
  	"version_image_id" integer,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_meta_image_id" integer,
  	"version_seo_keywords" varchar,
  	"version_seo_meta_robots" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_seo_meta_viewport" varchar,
  	"version_seo_canonical_u_r_l" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"categories_id" integer,
  	"media_id" integer,
  	"articles_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"product_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer
  );
  
  CREATE TABLE "contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"email" varchar NOT NULL,
  	"message" varchar,
  	"page" varchar,
  	"language" varchar,
  	"state" "enum_contacts_state" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_contacts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_email" varchar NOT NULL,
  	"version_message" varchar,
  	"version_page" varchar,
  	"version_language" varchar,
  	"version_state" "enum__contacts_v_version_state" DEFAULT 'new',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "logos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company" varchar NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "newsletters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"name" varchar,
  	"language" "enum_newsletters_language",
  	"source" varchar,
  	"gdpr_accepted" boolean DEFAULT true,
  	"confirmed" boolean DEFAULT true,
  	"unsubscribed" boolean DEFAULT false,
  	"subscribed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_pages_blocks_hero_c_t_as_target" DEFAULT '_self',
  	"variant" "enum_pages_blocks_hero_c_t_as_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_hero_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"description_lead" varchar,
  	"description_body" varchar,
  	"description_text" varchar,
  	"copyright" varchar,
  	"anchor_id" varchar DEFAULT 'kapcsolat',
  	"video_id" integer,
  	"video_poster_id" integer,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum_pages_blocks_hero_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum_pages_blocks_hero_person_button_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_features_ray_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_features_graph_card_top_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric
  );
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"globe_card_heading" varchar,
  	"globe_card_description" varchar,
  	"ray_card_heading" varchar,
  	"graph_card_heading" varchar,
  	"graph_card_description" varchar,
  	"social_media_card_heading" varchar,
  	"social_media_card_description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"stat_rating" numeric,
  	"stat_rating_max" numeric,
  	"stat_description" varchar,
  	"stat_description_bold" varchar,
  	"stat_trust_label" varchar,
  	"stat_cta_text" varchar,
  	"stat_cta_url" varchar,
  	"stat_brand" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_pages_blocks_cta_c_t_as_target" DEFAULT '_self',
  	"variant" "enum_pages_blocks_cta_c_t_as_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"heading_highlight" varchar,
  	"sub_heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"currency" varchar,
  	"project_label" varchar,
  	"monthly_label" varchar,
  	"addon_title" varchar,
  	"addon_description" varchar,
  	"addon_price" numeric,
  	"time_label" varchar,
  	"time_value" varchar,
  	"question" varchar,
  	"profile_label" varchar,
  	"profile_description" varchar,
  	"profile_job" varchar,
  	"profile_image_id" integer,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_how_it_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"video_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_elements_service_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"cta_title" varchar,
  	"cta_anchor" varchar,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_brands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading_left" varchar,
  	"heading_right" varchar,
  	"description" jsonb,
  	"highlight_heading" varchar,
  	"highlight_subheading" varchar,
  	"highlight_image_id" integer,
  	"button_text" varchar,
  	"button_url" varchar,
  	"button_target" "enum_pages_blocks_blog_button_target" DEFAULT '_self',
  	"button_variant" "enum_pages_blocks_blog_button_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_newsletter_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_newsletter_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar
  );
  
  CREATE TABLE "pages_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"heading_left" varchar,
  	"heading_right" varchar,
  	"description" varchar,
  	"source" varchar,
  	"profile_name" varchar,
  	"profile_role" varchar,
  	"profile_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_launches_launches" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mission_number" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_launches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_products_projects_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_products_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"badge_label" varchar,
  	"result_line" varchar,
  	"is_featured" boolean
  );
  
  CREATE TABLE "pages_blocks_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_related_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_related_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_why_choose_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_why_choose_us_cards_icon",
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_why_choose_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_section_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_form_section_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar
  );
  
  CREATE TABLE "pages_blocks_form_section_section_users" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"firstname" varchar,
  	"lastname" varchar,
  	"job" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_form_section_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_form_section_benefits_icon",
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_form_section_policy_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_pages_blocks_form_section_policy_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "pages_blocks_form_section_social_links_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_pages_blocks_form_section_social_links_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "pages_blocks_form_section_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"copyright" varchar,
  	"policy_prefix" varchar,
  	"policy_and_word" varchar,
  	"video_id" integer,
  	"section_heading" varchar,
  	"section_sub_heading" varchar,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum_pages_blocks_form_section_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum_pages_blocks_form_section_person_button_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"label" varchar,
  	"slug" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_meta_image_id" integer,
  	"seo_keywords" varchar,
  	"seo_meta_robots" varchar,
  	"seo_structured_data" jsonb,
  	"seo_meta_viewport" varchar,
  	"seo_canonical_u_r_l" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"plans_id" integer,
  	"logos_id" integer,
  	"articles_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum__pages_v_blocks_hero_c_t_as_target" DEFAULT '_self',
  	"variant" "enum__pages_v_blocks_hero_c_t_as_variant" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"description_lead" varchar,
  	"description_body" varchar,
  	"description_text" varchar,
  	"copyright" varchar,
  	"anchor_id" varchar DEFAULT 'kapcsolat',
  	"video_id" integer,
  	"video_poster_id" integer,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum__pages_v_blocks_hero_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum__pages_v_blocks_hero_person_button_variant" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_ray_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_graph_card_top_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"globe_card_heading" varchar,
  	"globe_card_description" varchar,
  	"ray_card_heading" varchar,
  	"graph_card_heading" varchar,
  	"graph_card_description" varchar,
  	"social_media_card_heading" varchar,
  	"social_media_card_description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"stat_rating" numeric,
  	"stat_rating_max" numeric,
  	"stat_description" varchar,
  	"stat_description_bold" varchar,
  	"stat_trust_label" varchar,
  	"stat_cta_text" varchar,
  	"stat_cta_url" varchar,
  	"stat_brand" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum__pages_v_blocks_cta_c_t_as_target" DEFAULT '_self',
  	"variant" "enum__pages_v_blocks_cta_c_t_as_variant" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"heading_highlight" varchar,
  	"sub_heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"currency" varchar,
  	"project_label" varchar,
  	"monthly_label" varchar,
  	"addon_title" varchar,
  	"addon_description" varchar,
  	"addon_price" numeric,
  	"time_label" varchar,
  	"time_value" varchar,
  	"question" varchar,
  	"profile_label" varchar,
  	"profile_description" varchar,
  	"profile_job" varchar,
  	"profile_image_id" integer,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_how_it_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"video_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_elements_service_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"cta_title" varchar,
  	"cta_anchor" varchar,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_brands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading_left" varchar,
  	"heading_right" varchar,
  	"description" jsonb,
  	"highlight_heading" varchar,
  	"highlight_subheading" varchar,
  	"highlight_image_id" integer,
  	"button_text" varchar,
  	"button_url" varchar,
  	"button_target" "enum__pages_v_blocks_blog_button_target" DEFAULT '_self',
  	"button_variant" "enum__pages_v_blocks_blog_button_variant" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_newsletter_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"heading_left" varchar,
  	"heading_right" varchar,
  	"description" varchar,
  	"source" varchar,
  	"profile_name" varchar,
  	"profile_role" varchar,
  	"profile_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_launches_launches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"mission_number" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_launches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_products_projects_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_products_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"badge_label" varchar,
  	"result_line" varchar,
  	"is_featured" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_related_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_related_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_why_choose_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_why_choose_us_cards_icon",
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_why_choose_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_section_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_form_section_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_section_section_users" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"firstname" varchar,
  	"lastname" varchar,
  	"job" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_section_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_form_section_benefits_icon",
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_section_policy_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum__pages_v_blocks_form_section_policy_links_target" DEFAULT '_self',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_section_social_links_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum__pages_v_blocks_form_section_social_links_links_target" DEFAULT '_self',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_section_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"copyright" varchar,
  	"policy_prefix" varchar,
  	"policy_and_word" varchar,
  	"video_id" integer,
  	"section_heading" varchar,
  	"section_sub_heading" varchar,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum__pages_v_blocks_form_section_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum__pages_v_blocks_form_section_person_button_variant" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_label" varchar,
  	"version_slug" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_meta_image_id" integer,
  	"version_seo_keywords" varchar,
  	"version_seo_meta_robots" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_seo_meta_viewport" varchar,
  	"version_seo_canonical_u_r_l" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"plans_id" integer,
  	"logos_id" integer,
  	"articles_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "plans_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "plans_additional_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_text" varchar,
  	"cta_url" varchar,
  	"cta_target" "enum_plans_cta_target" DEFAULT '_self',
  	"cta_variant" "enum_plans_cta_variant" DEFAULT 'primary',
  	"product_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_plans_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "plans_locales" (
  	"name" varchar,
  	"plan_type" "enum_plans_plan_type",
  	"price" numeric,
  	"currency" varchar,
  	"currency_project_label" varchar,
  	"sub_text" varchar,
  	"featured" boolean DEFAULT false,
  	"addon_title" varchar,
  	"addon_description" varchar,
  	"addon_price" numeric,
  	"time_label" varchar,
  	"time_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_plans_v_version_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_plans_v_version_additional_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_plans_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_cta_text" varchar,
  	"version_cta_url" varchar,
  	"version_cta_target" "enum__plans_v_version_cta_target" DEFAULT '_self',
  	"version_cta_variant" "enum__plans_v_version_cta_variant" DEFAULT 'primary',
  	"version_product_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__plans_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__plans_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_plans_v_locales" (
  	"version_name" varchar,
  	"version_plan_type" "enum__plans_v_version_plan_type",
  	"version_price" numeric,
  	"version_currency" varchar,
  	"version_currency_project_label" varchar,
  	"version_sub_text" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_addon_title" varchar,
  	"version_addon_description" varchar,
  	"version_addon_price" numeric,
  	"version_time_label" varchar,
  	"version_time_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "products_blocks_related_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_cta_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_products_blocks_cta_c_t_as_target" DEFAULT '_self',
  	"variant" "enum_products_blocks_cta_c_t_as_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "products_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_cta_locales" (
  	"badge_label" varchar,
  	"heading" varchar,
  	"heading_highlight" varchar,
  	"sub_heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"stat_rating" numeric,
  	"stat_rating_max" numeric,
  	"stat_description" varchar,
  	"stat_description_bold" varchar,
  	"stat_trust_label" varchar,
  	"stat_cta_text" varchar,
  	"stat_cta_url" varchar,
  	"stat_brand" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_form_section_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_products_blocks_form_section_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar
  );
  
  CREATE TABLE "products_blocks_form_section_section_users" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"firstname" varchar,
  	"lastname" varchar,
  	"job" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "products_blocks_form_section_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_products_blocks_form_section_benefits_icon",
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "products_blocks_form_section_policy_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_products_blocks_form_section_policy_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "products_blocks_form_section_social_links_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_products_blocks_form_section_social_links_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "products_blocks_form_section_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "products_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"copyright" varchar,
  	"policy_prefix" varchar,
  	"policy_and_word" varchar,
  	"video_id" integer,
  	"section_heading" varchar,
  	"section_sub_heading" varchar,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum_products_blocks_form_section_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum_products_blocks_form_section_person_button_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_newsletter_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_products_blocks_newsletter_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar
  );
  
  CREATE TABLE "products_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"heading_left" varchar,
  	"heading_right" varchar,
  	"description" varchar,
  	"source" varchar,
  	"profile_name" varchar,
  	"profile_role" varchar,
  	"profile_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"button_center_text" varchar,
  	"button_center_url" varchar,
  	"button_center_target" "enum_products_button_center_target" DEFAULT '_self',
  	"button_center_variant" "enum_products_button_center_variant" DEFAULT 'primary',
  	"button_bottom_text" varchar,
  	"button_bottom_url" varchar,
  	"button_bottom_target" "enum_products_button_bottom_target" DEFAULT '_self',
  	"button_bottom_variant" "enum_products_button_bottom_variant" DEFAULT 'primary',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"name" varchar,
  	"slug" varchar,
  	"badge_label" varchar,
  	"badge_label_center" varchar,
  	"badge_label_bottom" varchar,
  	"price" numeric,
  	"description" varchar,
  	"heading_center" varchar,
  	"description_center" varchar,
  	"heading_bottom" varchar,
  	"description_bottom" varchar,
  	"year" varchar,
  	"industry" varchar,
  	"scope" varchar,
  	"timeline" varchar,
  	"featured" boolean DEFAULT false,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_meta_image_id" integer,
  	"seo_keywords" varchar,
  	"seo_meta_robots" varchar,
  	"seo_structured_data" jsonb,
  	"seo_meta_viewport" varchar,
  	"seo_canonical_u_r_l" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer,
  	"plans_id" integer,
  	"categories_id" integer,
  	"products_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "_products_v_version_perks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_related_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_cta_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum__products_v_blocks_cta_c_t_as_target" DEFAULT '_self',
  	"variant" "enum__products_v_blocks_cta_c_t_as_variant" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_cta_locales" (
  	"badge_label" varchar,
  	"heading" varchar,
  	"heading_highlight" varchar,
  	"sub_heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"stat_rating" numeric,
  	"stat_rating_max" numeric,
  	"stat_description" varchar,
  	"stat_description_bold" varchar,
  	"stat_trust_label" varchar,
  	"stat_cta_text" varchar,
  	"stat_cta_url" varchar,
  	"stat_brand" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_form_section_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__products_v_blocks_form_section_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_form_section_section_users" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"firstname" varchar,
  	"lastname" varchar,
  	"job" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_form_section_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__products_v_blocks_form_section_benefits_icon",
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_form_section_policy_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum__products_v_blocks_form_section_policy_links_target" DEFAULT '_self',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_form_section_social_links_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum__products_v_blocks_form_section_social_links_links_target" DEFAULT '_self',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_form_section_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"copyright" varchar,
  	"policy_prefix" varchar,
  	"policy_and_word" varchar,
  	"video_id" integer,
  	"section_heading" varchar,
  	"section_sub_heading" varchar,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum__products_v_blocks_form_section_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum__products_v_blocks_form_section_person_button_variant" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_newsletter_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__products_v_blocks_newsletter_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"heading_left" varchar,
  	"heading_right" varchar,
  	"description" varchar,
  	"source" varchar,
  	"profile_name" varchar,
  	"profile_role" varchar,
  	"profile_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_logo_id" integer,
  	"version_button_center_text" varchar,
  	"version_button_center_url" varchar,
  	"version_button_center_target" "enum__products_v_version_button_center_target" DEFAULT '_self',
  	"version_button_center_variant" "enum__products_v_version_button_center_variant" DEFAULT 'primary',
  	"version_button_bottom_text" varchar,
  	"version_button_bottom_url" varchar,
  	"version_button_bottom_target" "enum__products_v_version_button_bottom_target" DEFAULT '_self',
  	"version_button_bottom_variant" "enum__products_v_version_button_bottom_variant" DEFAULT 'primary',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_badge_label" varchar,
  	"version_badge_label_center" varchar,
  	"version_badge_label_bottom" varchar,
  	"version_price" numeric,
  	"version_description" varchar,
  	"version_heading_center" varchar,
  	"version_description_center" varchar,
  	"version_heading_bottom" varchar,
  	"version_description_bottom" varchar,
  	"version_year" varchar,
  	"version_industry" varchar,
  	"version_scope" varchar,
  	"version_timeline" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_meta_image_id" integer,
  	"version_seo_keywords" varchar,
  	"version_seo_meta_robots" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_seo_meta_viewport" varchar,
  	"version_seo_canonical_u_r_l" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"media_id" integer,
  	"plans_id" integer,
  	"categories_id" integer,
  	"products_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "redirections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" varchar NOT NULL,
  	"destination" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "testimonials_locales" (
  	"text" varchar,
  	"rating" numeric,
  	"user_firstname" varchar,
  	"user_lastname" varchar,
  	"user_job" varchar,
  	"user_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__testimonials_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_testimonials_v_locales" (
  	"version_text" varchar,
  	"version_rating" numeric,
  	"version_user_firstname" varchar,
  	"version_user_lastname" varchar,
  	"version_user_job" varchar,
  	"version_user_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "blog_page_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"stat_rating" numeric,
  	"stat_rating_max" numeric,
  	"stat_description" varchar,
  	"stat_description_bold" varchar,
  	"stat_trust_label" varchar,
  	"stat_cta_text" varchar,
  	"stat_cta_url" varchar,
  	"stat_brand" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_page_blocks_related_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_page_blocks_related_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_page_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"currency" varchar,
  	"project_label" varchar,
  	"monthly_label" varchar,
  	"addon_title" varchar,
  	"addon_description" varchar,
  	"addon_price" numeric,
  	"time_label" varchar,
  	"time_value" varchar,
  	"question" varchar,
  	"profile_label" varchar,
  	"profile_description" varchar,
  	"profile_job" varchar,
  	"profile_image_id" integer,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_page_blocks_launches_launches" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mission_number" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "blog_page_blocks_launches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_page_blocks_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "blog_page_blocks_how_it_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"video_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_page_blocks_hero_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_blog_page_blocks_hero_c_t_as_target" DEFAULT '_self',
  	"variant" "enum_blog_page_blocks_hero_c_t_as_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "blog_page_blocks_hero_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "blog_page_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"description_lead" varchar,
  	"description_body" varchar,
  	"description_text" varchar,
  	"copyright" varchar,
  	"anchor_id" varchar DEFAULT 'kapcsolat',
  	"video_id" integer,
  	"video_poster_id" integer,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum_blog_page_blocks_hero_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum_blog_page_blocks_hero_person_button_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_page_blocks_form_section_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_blog_page_blocks_form_section_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar
  );
  
  CREATE TABLE "blog_page_blocks_form_section_section_users" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"firstname" varchar,
  	"lastname" varchar,
  	"job" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "blog_page_blocks_form_section_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_blog_page_blocks_form_section_benefits_icon",
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "blog_page_blocks_form_section_policy_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_blog_page_blocks_form_section_policy_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "blog_page_blocks_form_section_social_links_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_blog_page_blocks_form_section_social_links_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "blog_page_blocks_form_section_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "blog_page_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"copyright" varchar,
  	"policy_prefix" varchar,
  	"policy_and_word" varchar,
  	"video_id" integer,
  	"section_heading" varchar,
  	"section_sub_heading" varchar,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum_blog_page_blocks_form_section_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum_blog_page_blocks_form_section_person_button_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_page_blocks_features_ray_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "blog_page_blocks_features_graph_card_top_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric
  );
  
  CREATE TABLE "blog_page_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"globe_card_heading" varchar,
  	"globe_card_description" varchar,
  	"ray_card_heading" varchar,
  	"graph_card_heading" varchar,
  	"graph_card_description" varchar,
  	"social_media_card_heading" varchar,
  	"social_media_card_description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_page_blocks_cta_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_blog_page_blocks_cta_c_t_as_target" DEFAULT '_self',
  	"variant" "enum_blog_page_blocks_cta_c_t_as_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "blog_page_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"heading_highlight" varchar,
  	"sub_heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_page_blocks_brands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_page_locales" (
  	"heading" varchar,
  	"sub_heading" varchar,
  	"sub_heading_2" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_meta_image_id" integer,
  	"seo_keywords" varchar,
  	"seo_meta_robots" varchar,
  	"seo_structured_data" jsonb,
  	"seo_meta_viewport" varchar,
  	"seo_canonical_u_r_l" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "blog_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"testimonials_id" integer,
  	"products_id" integer,
  	"articles_id" integer,
  	"plans_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"logos_id" integer
  );
  
  CREATE TABLE "product_page_blocks_hero_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_product_page_blocks_hero_c_t_as_target" DEFAULT '_self',
  	"variant" "enum_product_page_blocks_hero_c_t_as_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "product_page_blocks_hero_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "product_page_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"description_lead" varchar,
  	"description_body" varchar,
  	"description_text" varchar,
  	"copyright" varchar,
  	"anchor_id" varchar DEFAULT 'kapcsolat',
  	"video_id" integer,
  	"video_poster_id" integer,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum_product_page_blocks_hero_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum_product_page_blocks_hero_person_button_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_features_ray_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "product_page_blocks_features_graph_card_top_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric
  );
  
  CREATE TABLE "product_page_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"globe_card_heading" varchar,
  	"globe_card_description" varchar,
  	"ray_card_heading" varchar,
  	"graph_card_heading" varchar,
  	"graph_card_description" varchar,
  	"social_media_card_heading" varchar,
  	"social_media_card_description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"stat_rating" numeric,
  	"stat_rating_max" numeric,
  	"stat_description" varchar,
  	"stat_description_bold" varchar,
  	"stat_trust_label" varchar,
  	"stat_cta_text" varchar,
  	"stat_cta_url" varchar,
  	"stat_brand" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_cta_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_product_page_blocks_cta_c_t_as_target" DEFAULT '_self',
  	"variant" "enum_product_page_blocks_cta_c_t_as_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "product_page_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"heading_highlight" varchar,
  	"sub_heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"currency" varchar,
  	"project_label" varchar,
  	"monthly_label" varchar,
  	"addon_title" varchar,
  	"addon_description" varchar,
  	"addon_price" numeric,
  	"time_label" varchar,
  	"time_value" varchar,
  	"question" varchar,
  	"profile_label" varchar,
  	"profile_description" varchar,
  	"profile_job" varchar,
  	"profile_image_id" integer,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "product_page_blocks_how_it_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"video_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_services_elements_service_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "product_page_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"cta_title" varchar,
  	"cta_anchor" varchar,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_brands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading_left" varchar,
  	"heading_right" varchar,
  	"description" jsonb,
  	"highlight_heading" varchar,
  	"highlight_subheading" varchar,
  	"highlight_image_id" integer,
  	"button_text" varchar,
  	"button_url" varchar,
  	"button_target" "enum_product_page_blocks_blog_button_target" DEFAULT '_self',
  	"button_variant" "enum_product_page_blocks_blog_button_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_newsletter_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_product_page_blocks_newsletter_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar
  );
  
  CREATE TABLE "product_page_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"heading_left" varchar,
  	"heading_right" varchar,
  	"description" varchar,
  	"source" varchar,
  	"profile_name" varchar,
  	"profile_role" varchar,
  	"profile_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_launches_launches" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mission_number" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "product_page_blocks_launches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_products_projects_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "product_page_blocks_products_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"badge_label" varchar,
  	"result_line" varchar,
  	"is_featured" boolean
  );
  
  CREATE TABLE "product_page_blocks_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_related_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_related_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_why_choose_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_product_page_blocks_why_choose_us_cards_icon",
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "product_page_blocks_why_choose_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page_blocks_form_section_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_product_page_blocks_form_section_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar
  );
  
  CREATE TABLE "product_page_blocks_form_section_section_users" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"firstname" varchar,
  	"lastname" varchar,
  	"job" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "product_page_blocks_form_section_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_product_page_blocks_form_section_benefits_icon",
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "product_page_blocks_form_section_policy_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_product_page_blocks_form_section_policy_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "product_page_blocks_form_section_social_links_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_product_page_blocks_form_section_social_links_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "product_page_blocks_form_section_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "product_page_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"copyright" varchar,
  	"policy_prefix" varchar,
  	"policy_and_word" varchar,
  	"video_id" integer,
  	"section_heading" varchar,
  	"section_sub_heading" varchar,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum_product_page_blocks_form_section_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum_product_page_blocks_form_section_person_button_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "product_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_page_locales" (
  	"heading" varchar,
  	"sub_heading" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_meta_image_id" integer,
  	"seo_keywords" varchar,
  	"seo_meta_robots" varchar,
  	"seo_structured_data" jsonb,
  	"seo_meta_viewport" varchar,
  	"seo_canonical_u_r_l" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "product_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"plans_id" integer,
  	"logos_id" integer,
  	"articles_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer,
  	"categories_id" integer,
  	"contacts_id" integer,
  	"faqs_id" integer,
  	"logos_id" integer,
  	"media_id" integer,
  	"newsletters_id" integer,
  	"pages_id" integer,
  	"plans_id" integer,
  	"products_id" integer,
  	"redirections_id" integer,
  	"testimonials_id" integer,
  	"users_id" integer,
  	"blog_page_id" integer,
  	"product_page_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "global_navbar_left_navbar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_global_navbar_left_navbar_items_target" DEFAULT '_self'
  );
  
  CREATE TABLE "global_navbar_right_navbar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_global_navbar_right_navbar_items_target" DEFAULT '_self'
  );
  
  CREATE TABLE "global_navbar_policy" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_global_navbar_policy_target" DEFAULT '_self'
  );
  
  CREATE TABLE "global_footer_internal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_global_footer_internal_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "global_footer_policy_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_global_footer_policy_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "global_footer_social_media_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_global_footer_social_media_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "global" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"navbar_logo_id" integer,
  	"navbar_copyright" varchar,
  	"navbar_copyright_enabled" boolean,
  	"footer_logo_id" integer,
  	"footer_description" varchar,
  	"footer_copyright" varchar,
  	"footer_designed_developed_by" varchar,
  	"footer_built_with" varchar,
  	"footer_navigation_title" varchar,
  	"footer_social_title" varchar,
  	"footer_profile_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "global_locales" (
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_meta_image_id" integer,
  	"seo_keywords" varchar,
  	"seo_meta_robots" varchar,
  	"seo_structured_data" jsonb,
  	"seo_meta_viewport" varchar,
  	"seo_canonical_u_r_l" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "service_blocks_hero_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_service_blocks_hero_c_t_as_target" DEFAULT '_self',
  	"variant" "enum_service_blocks_hero_c_t_as_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "service_blocks_hero_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "service_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"description_lead" varchar,
  	"description_body" varchar,
  	"description_text" varchar,
  	"copyright" varchar,
  	"anchor_id" varchar DEFAULT 'kapcsolat',
  	"video_id" integer,
  	"video_poster_id" integer,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum_service_blocks_hero_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum_service_blocks_hero_person_button_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_features_ray_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "service_blocks_features_graph_card_top_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric
  );
  
  CREATE TABLE "service_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"globe_card_heading" varchar,
  	"globe_card_description" varchar,
  	"ray_card_heading" varchar,
  	"graph_card_heading" varchar,
  	"graph_card_description" varchar,
  	"social_media_card_heading" varchar,
  	"social_media_card_description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"stat_rating" numeric,
  	"stat_rating_max" numeric,
  	"stat_description" varchar,
  	"stat_description_bold" varchar,
  	"stat_trust_label" varchar,
  	"stat_cta_text" varchar,
  	"stat_cta_url" varchar,
  	"stat_brand" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_cta_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_service_blocks_cta_c_t_as_target" DEFAULT '_self',
  	"variant" "enum_service_blocks_cta_c_t_as_variant" DEFAULT 'primary'
  );
  
  CREATE TABLE "service_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_cta_locales" (
  	"badge_label" varchar,
  	"heading" varchar,
  	"heading_highlight" varchar,
  	"sub_heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "service_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"currency" varchar,
  	"project_label" varchar,
  	"monthly_label" varchar,
  	"addon_title" varchar,
  	"addon_description" varchar,
  	"addon_price" numeric,
  	"time_label" varchar,
  	"time_value" varchar,
  	"question" varchar,
  	"profile_label" varchar,
  	"profile_description" varchar,
  	"profile_job" varchar,
  	"profile_image_id" integer,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "service_blocks_how_it_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"video_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_services_elements_service_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "service_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"cta_title" varchar,
  	"cta_anchor" varchar,
  	"background_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_brands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading_left" varchar,
  	"heading_right" varchar,
  	"description" jsonb,
  	"highlight_heading" varchar,
  	"highlight_subheading" varchar,
  	"highlight_image_id" integer,
  	"button_text" varchar,
  	"button_url" varchar,
  	"button_target" "enum_service_blocks_blog_button_target" DEFAULT '_self',
  	"button_variant" "enum_service_blocks_blog_button_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_newsletter_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_service_blocks_newsletter_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar
  );
  
  CREATE TABLE "service_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"heading_left" varchar,
  	"heading_right" varchar,
  	"description" varchar,
  	"source" varchar,
  	"profile_name" varchar,
  	"profile_role" varchar,
  	"profile_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_launches_launches" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mission_number" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "service_blocks_launches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_products_projects_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "service_blocks_products_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"badge_label" varchar,
  	"result_line" varchar,
  	"is_featured" boolean
  );
  
  CREATE TABLE "service_blocks_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_related_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_related_articles_locales" (
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "service_blocks_related_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_why_choose_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_service_blocks_why_choose_us_cards_icon",
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "service_blocks_why_choose_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "service_blocks_form_section_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_service_blocks_form_section_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar
  );
  
  CREATE TABLE "service_blocks_form_section_section_users" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"firstname" varchar,
  	"lastname" varchar,
  	"job" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "service_blocks_form_section_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_service_blocks_form_section_benefits_icon",
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "service_blocks_form_section_policy_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_service_blocks_form_section_policy_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "service_blocks_form_section_social_links_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum_service_blocks_form_section_social_links_links_target" DEFAULT '_self'
  );
  
  CREATE TABLE "service_blocks_form_section_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "service_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"copyright" varchar,
  	"policy_prefix" varchar,
  	"policy_and_word" varchar,
  	"video_id" integer,
  	"section_heading" varchar,
  	"section_sub_heading" varchar,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum_service_blocks_form_section_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum_service_blocks_form_section_person_button_variant" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "service" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_service_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "service_locales" (
  	"heading" varchar,
  	"sub_heading" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_meta_image_id" integer,
  	"seo_keywords" varchar,
  	"seo_meta_robots" varchar,
  	"seo_structured_data" jsonb,
  	"seo_meta_viewport" varchar,
  	"seo_canonical_u_r_l" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "service_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"pages_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"plans_id" integer,
  	"logos_id" integer,
  	"articles_id" integer,
  	"products_id" integer
  );
  
  CREATE TABLE "_service_v_blocks_hero_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum__service_v_blocks_hero_c_t_as_target" DEFAULT '_self',
  	"variant" "enum__service_v_blocks_hero_c_t_as_variant" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_hero_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"description_lead" varchar,
  	"description_body" varchar,
  	"description_text" varchar,
  	"copyright" varchar,
  	"anchor_id" varchar DEFAULT 'kapcsolat',
  	"video_id" integer,
  	"video_poster_id" integer,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum__service_v_blocks_hero_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum__service_v_blocks_hero_person_button_variant" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_features_ray_card_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_features_graph_card_top_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"globe_card_heading" varchar,
  	"globe_card_description" varchar,
  	"ray_card_heading" varchar,
  	"graph_card_heading" varchar,
  	"graph_card_description" varchar,
  	"social_media_card_heading" varchar,
  	"social_media_card_description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"stat_rating" numeric,
  	"stat_rating_max" numeric,
  	"stat_description" varchar,
  	"stat_description_bold" varchar,
  	"stat_trust_label" varchar,
  	"stat_cta_text" varchar,
  	"stat_cta_url" varchar,
  	"stat_brand" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_cta_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum__service_v_blocks_cta_c_t_as_target" DEFAULT '_self',
  	"variant" "enum__service_v_blocks_cta_c_t_as_variant" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_cta_locales" (
  	"badge_label" varchar,
  	"heading" varchar,
  	"heading_highlight" varchar,
  	"sub_heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_service_v_blocks_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"currency" varchar,
  	"project_label" varchar,
  	"monthly_label" varchar,
  	"addon_title" varchar,
  	"addon_description" varchar,
  	"addon_price" numeric,
  	"time_label" varchar,
  	"time_value" varchar,
  	"question" varchar,
  	"profile_label" varchar,
  	"profile_description" varchar,
  	"profile_job" varchar,
  	"profile_image_id" integer,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_how_it_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"video_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_services_elements_service_item" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"cta_title" varchar,
  	"cta_anchor" varchar,
  	"background_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_brands" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading_left" varchar,
  	"heading_right" varchar,
  	"description" jsonb,
  	"highlight_heading" varchar,
  	"highlight_subheading" varchar,
  	"highlight_image_id" integer,
  	"button_text" varchar,
  	"button_url" varchar,
  	"button_target" "enum__service_v_blocks_blog_button_target" DEFAULT '_self',
  	"button_variant" "enum__service_v_blocks_blog_button_variant" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_newsletter_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__service_v_blocks_newsletter_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"heading_left" varchar,
  	"heading_right" varchar,
  	"description" varchar,
  	"source" varchar,
  	"profile_name" varchar,
  	"profile_role" varchar,
  	"profile_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_launches_launches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"mission_number" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_launches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_products_projects_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_products_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"badge_label" varchar,
  	"result_line" varchar,
  	"is_featured" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"badge_label" varchar,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_related_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_related_articles_locales" (
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_service_v_blocks_related_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_why_choose_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__service_v_blocks_why_choose_us_cards_icon",
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_why_choose_us" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"badge_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v_blocks_form_section_form_inputs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__service_v_blocks_form_section_form_inputs_type",
  	"name" varchar,
  	"placeholder" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_form_section_section_users" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"firstname" varchar,
  	"lastname" varchar,
  	"job" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_form_section_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__service_v_blocks_form_section_benefits_icon",
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_form_section_policy_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum__service_v_blocks_form_section_policy_links_target" DEFAULT '_self',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_form_section_social_links_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"target" "enum__service_v_blocks_form_section_social_links_links_target" DEFAULT '_self',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_form_section_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_service_v_blocks_form_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"sub_heading" varchar,
  	"copyright" varchar,
  	"policy_prefix" varchar,
  	"policy_and_word" varchar,
  	"video_id" integer,
  	"section_heading" varchar,
  	"section_sub_heading" varchar,
  	"person_name" varchar,
  	"person_role" varchar,
  	"person_org" varchar,
  	"person_image_id" integer,
  	"person_button_text" varchar,
  	"person_button_url" varchar,
  	"person_button_target" "enum__service_v_blocks_form_section_person_button_target" DEFAULT '_self',
  	"person_button_variant" "enum__service_v_blocks_form_section_person_button_variant" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_service_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__service_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__service_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_service_v_locales" (
  	"version_heading" varchar,
  	"version_sub_heading" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_meta_image_id" integer,
  	"version_seo_keywords" varchar,
  	"version_seo_meta_robots" varchar,
  	"version_seo_structured_data" jsonb,
  	"version_seo_meta_viewport" varchar,
  	"version_seo_canonical_u_r_l" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_service_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"locale" "_locales",
  	"pages_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"plans_id" integer,
  	"logos_id" integer,
  	"articles_id" integer,
  	"products_id" integer
  );
  
  ALTER TABLE "articles_blocks_cta_c_t_as" ADD CONSTRAINT "articles_blocks_cta_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_cta" ADD CONSTRAINT "articles_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_cta_locales" ADD CONSTRAINT "articles_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_related_articles" ADD CONSTRAINT "articles_blocks_related_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_blocks_related_articles_locales" ADD CONSTRAINT "articles_blocks_related_articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_blocks_related_articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_person_card_image_id_media_id_fk" FOREIGN KEY ("person_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_seo_meta_image_id_media_id_fk" FOREIGN KEY ("seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_cta_c_t_as" ADD CONSTRAINT "_articles_v_blocks_cta_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_cta" ADD CONSTRAINT "_articles_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_cta_locales" ADD CONSTRAINT "_articles_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_related_articles" ADD CONSTRAINT "_articles_v_blocks_related_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_blocks_related_articles_locales" ADD CONSTRAINT "_articles_v_blocks_related_articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_blocks_related_articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_person_card_image_id_media_id_fk" FOREIGN KEY ("version_person_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_version_seo_meta_image_id_media_id_fk" FOREIGN KEY ("version_seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v" ADD CONSTRAINT "_contacts_v_parent_id_contacts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "logos" ADD CONSTRAINT "logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_c_t_as" ADD CONSTRAINT "pages_blocks_hero_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_services" ADD CONSTRAINT "pages_blocks_hero_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_ray_card_items" ADD CONSTRAINT "pages_blocks_features_ray_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features_graph_card_top_items" ADD CONSTRAINT "pages_blocks_features_graph_card_top_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_c_t_as" ADD CONSTRAINT "pages_blocks_cta_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing" ADD CONSTRAINT "pages_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_it_works_steps" ADD CONSTRAINT "pages_blocks_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_it_works_steps" ADD CONSTRAINT "pages_blocks_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_it_works" ADD CONSTRAINT "pages_blocks_how_it_works_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_how_it_works" ADD CONSTRAINT "pages_blocks_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_elements_service_item" ADD CONSTRAINT "pages_blocks_services_elements_service_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services" ADD CONSTRAINT "pages_blocks_services_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_services" ADD CONSTRAINT "pages_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_brands" ADD CONSTRAINT "pages_blocks_brands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog" ADD CONSTRAINT "pages_blocks_blog_highlight_image_id_media_id_fk" FOREIGN KEY ("highlight_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_blog" ADD CONSTRAINT "pages_blocks_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter_form_inputs" ADD CONSTRAINT "pages_blocks_newsletter_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter" ADD CONSTRAINT "pages_blocks_newsletter_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter" ADD CONSTRAINT "pages_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_launches_launches" ADD CONSTRAINT "pages_blocks_launches_launches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_launches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_launches" ADD CONSTRAINT "pages_blocks_launches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_products_projects_tags" ADD CONSTRAINT "pages_blocks_products_projects_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_products_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_products_projects" ADD CONSTRAINT "pages_blocks_products_projects_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_products_projects" ADD CONSTRAINT "pages_blocks_products_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_products" ADD CONSTRAINT "pages_blocks_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_related_articles" ADD CONSTRAINT "pages_blocks_related_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_related_products" ADD CONSTRAINT "pages_blocks_related_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_choose_us_cards" ADD CONSTRAINT "pages_blocks_why_choose_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_why_choose_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_why_choose_us" ADD CONSTRAINT "pages_blocks_why_choose_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section_form_inputs" ADD CONSTRAINT "pages_blocks_form_section_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section_section_users" ADD CONSTRAINT "pages_blocks_form_section_section_users_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section_section_users" ADD CONSTRAINT "pages_blocks_form_section_section_users_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section_benefits" ADD CONSTRAINT "pages_blocks_form_section_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section_policy_links" ADD CONSTRAINT "pages_blocks_form_section_policy_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section_social_links_links" ADD CONSTRAINT "pages_blocks_form_section_social_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_section_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section_social_links" ADD CONSTRAINT "pages_blocks_form_section_social_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section_social_links" ADD CONSTRAINT "pages_blocks_form_section_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section" ADD CONSTRAINT "pages_blocks_form_section_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section" ADD CONSTRAINT "pages_blocks_form_section_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_section" ADD CONSTRAINT "pages_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_seo_meta_image_id_media_id_fk" FOREIGN KEY ("seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_c_t_as" ADD CONSTRAINT "_pages_v_blocks_hero_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_services" ADD CONSTRAINT "_pages_v_blocks_hero_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_ray_card_items" ADD CONSTRAINT "_pages_v_blocks_features_ray_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_graph_card_top_items" ADD CONSTRAINT "_pages_v_blocks_features_graph_card_top_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_c_t_as" ADD CONSTRAINT "_pages_v_blocks_cta_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing" ADD CONSTRAINT "_pages_v_blocks_pricing_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing" ADD CONSTRAINT "_pages_v_blocks_pricing_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing" ADD CONSTRAINT "_pages_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_it_works_steps" ADD CONSTRAINT "_pages_v_blocks_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_it_works_steps" ADD CONSTRAINT "_pages_v_blocks_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_it_works" ADD CONSTRAINT "_pages_v_blocks_how_it_works_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_how_it_works" ADD CONSTRAINT "_pages_v_blocks_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_elements_service_item" ADD CONSTRAINT "_pages_v_blocks_services_elements_service_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services" ADD CONSTRAINT "_pages_v_blocks_services_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services" ADD CONSTRAINT "_pages_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_brands" ADD CONSTRAINT "_pages_v_blocks_brands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_blog" ADD CONSTRAINT "_pages_v_blocks_blog_highlight_image_id_media_id_fk" FOREIGN KEY ("highlight_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_blog" ADD CONSTRAINT "_pages_v_blocks_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter_form_inputs" ADD CONSTRAINT "_pages_v_blocks_newsletter_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter" ADD CONSTRAINT "_pages_v_blocks_newsletter_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter" ADD CONSTRAINT "_pages_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_launches_launches" ADD CONSTRAINT "_pages_v_blocks_launches_launches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_launches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_launches" ADD CONSTRAINT "_pages_v_blocks_launches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_products_projects_tags" ADD CONSTRAINT "_pages_v_blocks_products_projects_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_products_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_products_projects" ADD CONSTRAINT "_pages_v_blocks_products_projects_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_products_projects" ADD CONSTRAINT "_pages_v_blocks_products_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_products" ADD CONSTRAINT "_pages_v_blocks_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_related_articles" ADD CONSTRAINT "_pages_v_blocks_related_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_related_products" ADD CONSTRAINT "_pages_v_blocks_related_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_choose_us_cards" ADD CONSTRAINT "_pages_v_blocks_why_choose_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_why_choose_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_why_choose_us" ADD CONSTRAINT "_pages_v_blocks_why_choose_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_section_form_inputs" ADD CONSTRAINT "_pages_v_blocks_form_section_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_section_section_users" ADD CONSTRAINT "_pages_v_blocks_form_section_section_users_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_section_section_users" ADD CONSTRAINT "_pages_v_blocks_form_section_section_users_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_section_benefits" ADD CONSTRAINT "_pages_v_blocks_form_section_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_section_policy_links" ADD CONSTRAINT "_pages_v_blocks_form_section_policy_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_section_social_links_links" ADD CONSTRAINT "_pages_v_blocks_form_section_social_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_section_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_section_social_links" ADD CONSTRAINT "_pages_v_blocks_form_section_social_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_section_social_links" ADD CONSTRAINT "_pages_v_blocks_form_section_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_section" ADD CONSTRAINT "_pages_v_blocks_form_section_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_section" ADD CONSTRAINT "_pages_v_blocks_form_section_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_section" ADD CONSTRAINT "_pages_v_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_seo_meta_image_id_media_id_fk" FOREIGN KEY ("version_seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plans_perks" ADD CONSTRAINT "plans_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plans_additional_perks" ADD CONSTRAINT "plans_additional_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plans" ADD CONSTRAINT "plans_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "plans_locales" ADD CONSTRAINT "plans_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_plans_v_version_perks" ADD CONSTRAINT "_plans_v_version_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_plans_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_plans_v_version_additional_perks" ADD CONSTRAINT "_plans_v_version_additional_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_plans_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_plans_v" ADD CONSTRAINT "_plans_v_parent_id_plans_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_plans_v" ADD CONSTRAINT "_plans_v_version_product_id_products_id_fk" FOREIGN KEY ("version_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_plans_v_locales" ADD CONSTRAINT "_plans_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_plans_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_perks" ADD CONSTRAINT "products_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_related_products" ADD CONSTRAINT "products_blocks_related_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_cta_c_t_as" ADD CONSTRAINT "products_blocks_cta_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_cta" ADD CONSTRAINT "products_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_cta_locales" ADD CONSTRAINT "products_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_testimonials" ADD CONSTRAINT "products_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_form_section_form_inputs" ADD CONSTRAINT "products_blocks_form_section_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_form_section_section_users" ADD CONSTRAINT "products_blocks_form_section_section_users_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_form_section_section_users" ADD CONSTRAINT "products_blocks_form_section_section_users_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_form_section_benefits" ADD CONSTRAINT "products_blocks_form_section_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_form_section_policy_links" ADD CONSTRAINT "products_blocks_form_section_policy_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_form_section_social_links_links" ADD CONSTRAINT "products_blocks_form_section_social_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_form_section_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_form_section_social_links" ADD CONSTRAINT "products_blocks_form_section_social_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_form_section_social_links" ADD CONSTRAINT "products_blocks_form_section_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_form_section" ADD CONSTRAINT "products_blocks_form_section_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_form_section" ADD CONSTRAINT "products_blocks_form_section_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_form_section" ADD CONSTRAINT "products_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_newsletter_form_inputs" ADD CONSTRAINT "products_blocks_newsletter_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_newsletter" ADD CONSTRAINT "products_blocks_newsletter_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_newsletter" ADD CONSTRAINT "products_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq" ADD CONSTRAINT "products_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_logo_id_logos_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."logos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_seo_meta_image_id_media_id_fk" FOREIGN KEY ("seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_perks" ADD CONSTRAINT "_products_v_version_perks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_related_products" ADD CONSTRAINT "_products_v_blocks_related_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_cta_c_t_as" ADD CONSTRAINT "_products_v_blocks_cta_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_cta" ADD CONSTRAINT "_products_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_cta_locales" ADD CONSTRAINT "_products_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_testimonials" ADD CONSTRAINT "_products_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_section_form_inputs" ADD CONSTRAINT "_products_v_blocks_form_section_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_section_section_users" ADD CONSTRAINT "_products_v_blocks_form_section_section_users_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_section_section_users" ADD CONSTRAINT "_products_v_blocks_form_section_section_users_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_section_benefits" ADD CONSTRAINT "_products_v_blocks_form_section_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_section_policy_links" ADD CONSTRAINT "_products_v_blocks_form_section_policy_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_section_social_links_links" ADD CONSTRAINT "_products_v_blocks_form_section_social_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_form_section_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_section_social_links" ADD CONSTRAINT "_products_v_blocks_form_section_social_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_section_social_links" ADD CONSTRAINT "_products_v_blocks_form_section_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_section" ADD CONSTRAINT "_products_v_blocks_form_section_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_section" ADD CONSTRAINT "_products_v_blocks_form_section_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_section" ADD CONSTRAINT "_products_v_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_newsletter_form_inputs" ADD CONSTRAINT "_products_v_blocks_newsletter_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_newsletter" ADD CONSTRAINT "_products_v_blocks_newsletter_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_newsletter" ADD CONSTRAINT "_products_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_faq" ADD CONSTRAINT "_products_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_logo_id_logos_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."logos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_version_seo_meta_image_id_media_id_fk" FOREIGN KEY ("version_seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_user_image_id_media_id_fk" FOREIGN KEY ("user_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v_locales" ADD CONSTRAINT "_testimonials_v_locales_version_user_image_id_media_id_fk" FOREIGN KEY ("version_user_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v_locales" ADD CONSTRAINT "_testimonials_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_testimonials" ADD CONSTRAINT "blog_page_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_related_products" ADD CONSTRAINT "blog_page_blocks_related_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_related_articles" ADD CONSTRAINT "blog_page_blocks_related_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_pricing" ADD CONSTRAINT "blog_page_blocks_pricing_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_pricing" ADD CONSTRAINT "blog_page_blocks_pricing_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_pricing" ADD CONSTRAINT "blog_page_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_launches_launches" ADD CONSTRAINT "blog_page_blocks_launches_launches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_launches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_launches" ADD CONSTRAINT "blog_page_blocks_launches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_how_it_works_steps" ADD CONSTRAINT "blog_page_blocks_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_how_it_works_steps" ADD CONSTRAINT "blog_page_blocks_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_how_it_works" ADD CONSTRAINT "blog_page_blocks_how_it_works_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_how_it_works" ADD CONSTRAINT "blog_page_blocks_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_hero_c_t_as" ADD CONSTRAINT "blog_page_blocks_hero_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_hero_services" ADD CONSTRAINT "blog_page_blocks_hero_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_hero" ADD CONSTRAINT "blog_page_blocks_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_hero" ADD CONSTRAINT "blog_page_blocks_hero_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_hero" ADD CONSTRAINT "blog_page_blocks_hero_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_hero" ADD CONSTRAINT "blog_page_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_form_section_form_inputs" ADD CONSTRAINT "blog_page_blocks_form_section_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_form_section_section_users" ADD CONSTRAINT "blog_page_blocks_form_section_section_users_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_form_section_section_users" ADD CONSTRAINT "blog_page_blocks_form_section_section_users_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_form_section_benefits" ADD CONSTRAINT "blog_page_blocks_form_section_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_form_section_policy_links" ADD CONSTRAINT "blog_page_blocks_form_section_policy_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_form_section_social_links_links" ADD CONSTRAINT "blog_page_blocks_form_section_social_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_form_section_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_form_section_social_links" ADD CONSTRAINT "blog_page_blocks_form_section_social_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_form_section_social_links" ADD CONSTRAINT "blog_page_blocks_form_section_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_form_section" ADD CONSTRAINT "blog_page_blocks_form_section_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_form_section" ADD CONSTRAINT "blog_page_blocks_form_section_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_form_section" ADD CONSTRAINT "blog_page_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_features_ray_card_items" ADD CONSTRAINT "blog_page_blocks_features_ray_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_features_graph_card_top_items" ADD CONSTRAINT "blog_page_blocks_features_graph_card_top_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_features" ADD CONSTRAINT "blog_page_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_faq" ADD CONSTRAINT "blog_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_cta_c_t_as" ADD CONSTRAINT "blog_page_blocks_cta_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_cta" ADD CONSTRAINT "blog_page_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_blocks_brands" ADD CONSTRAINT "blog_page_blocks_brands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_locales" ADD CONSTRAINT "blog_page_locales_seo_meta_image_id_media_id_fk" FOREIGN KEY ("seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_page_locales" ADD CONSTRAINT "blog_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_rels" ADD CONSTRAINT "blog_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_rels" ADD CONSTRAINT "blog_page_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_rels" ADD CONSTRAINT "blog_page_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_rels" ADD CONSTRAINT "blog_page_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_rels" ADD CONSTRAINT "blog_page_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_rels" ADD CONSTRAINT "blog_page_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_rels" ADD CONSTRAINT "blog_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_page_rels" ADD CONSTRAINT "blog_page_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_hero_c_t_as" ADD CONSTRAINT "product_page_blocks_hero_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_hero_services" ADD CONSTRAINT "product_page_blocks_hero_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_hero" ADD CONSTRAINT "product_page_blocks_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_hero" ADD CONSTRAINT "product_page_blocks_hero_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_hero" ADD CONSTRAINT "product_page_blocks_hero_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_hero" ADD CONSTRAINT "product_page_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_features_ray_card_items" ADD CONSTRAINT "product_page_blocks_features_ray_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_features_graph_card_top_items" ADD CONSTRAINT "product_page_blocks_features_graph_card_top_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_features" ADD CONSTRAINT "product_page_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_testimonials" ADD CONSTRAINT "product_page_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_faq" ADD CONSTRAINT "product_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_cta_c_t_as" ADD CONSTRAINT "product_page_blocks_cta_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_cta" ADD CONSTRAINT "product_page_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_pricing" ADD CONSTRAINT "product_page_blocks_pricing_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_pricing" ADD CONSTRAINT "product_page_blocks_pricing_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_pricing" ADD CONSTRAINT "product_page_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_how_it_works_steps" ADD CONSTRAINT "product_page_blocks_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_how_it_works_steps" ADD CONSTRAINT "product_page_blocks_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_how_it_works" ADD CONSTRAINT "product_page_blocks_how_it_works_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_how_it_works" ADD CONSTRAINT "product_page_blocks_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_services_elements_service_item" ADD CONSTRAINT "product_page_blocks_services_elements_service_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_services" ADD CONSTRAINT "product_page_blocks_services_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_services" ADD CONSTRAINT "product_page_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_brands" ADD CONSTRAINT "product_page_blocks_brands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_blog" ADD CONSTRAINT "product_page_blocks_blog_highlight_image_id_media_id_fk" FOREIGN KEY ("highlight_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_blog" ADD CONSTRAINT "product_page_blocks_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_newsletter_form_inputs" ADD CONSTRAINT "product_page_blocks_newsletter_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_newsletter" ADD CONSTRAINT "product_page_blocks_newsletter_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_newsletter" ADD CONSTRAINT "product_page_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_launches_launches" ADD CONSTRAINT "product_page_blocks_launches_launches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_launches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_launches" ADD CONSTRAINT "product_page_blocks_launches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_products_projects_tags" ADD CONSTRAINT "product_page_blocks_products_projects_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_products_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_products_projects" ADD CONSTRAINT "product_page_blocks_products_projects_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_products_projects" ADD CONSTRAINT "product_page_blocks_products_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_products" ADD CONSTRAINT "product_page_blocks_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_related_articles" ADD CONSTRAINT "product_page_blocks_related_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_related_products" ADD CONSTRAINT "product_page_blocks_related_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_why_choose_us_cards" ADD CONSTRAINT "product_page_blocks_why_choose_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_why_choose_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_why_choose_us" ADD CONSTRAINT "product_page_blocks_why_choose_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_form_section_form_inputs" ADD CONSTRAINT "product_page_blocks_form_section_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_form_section_section_users" ADD CONSTRAINT "product_page_blocks_form_section_section_users_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_form_section_section_users" ADD CONSTRAINT "product_page_blocks_form_section_section_users_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_form_section_benefits" ADD CONSTRAINT "product_page_blocks_form_section_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_form_section_policy_links" ADD CONSTRAINT "product_page_blocks_form_section_policy_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_form_section_social_links_links" ADD CONSTRAINT "product_page_blocks_form_section_social_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_form_section_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_form_section_social_links" ADD CONSTRAINT "product_page_blocks_form_section_social_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_form_section_social_links" ADD CONSTRAINT "product_page_blocks_form_section_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_blocks_form_section" ADD CONSTRAINT "product_page_blocks_form_section_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_form_section" ADD CONSTRAINT "product_page_blocks_form_section_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_blocks_form_section" ADD CONSTRAINT "product_page_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_locales" ADD CONSTRAINT "product_page_locales_seo_meta_image_id_media_id_fk" FOREIGN KEY ("seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_page_locales" ADD CONSTRAINT "product_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_rels" ADD CONSTRAINT "product_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_rels" ADD CONSTRAINT "product_page_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_rels" ADD CONSTRAINT "product_page_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_rels" ADD CONSTRAINT "product_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_rels" ADD CONSTRAINT "product_page_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_rels" ADD CONSTRAINT "product_page_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_rels" ADD CONSTRAINT "product_page_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_page_rels" ADD CONSTRAINT "product_page_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletters_fk" FOREIGN KEY ("newsletters_id") REFERENCES "public"."newsletters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirections_fk" FOREIGN KEY ("redirections_id") REFERENCES "public"."redirections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_page_fk" FOREIGN KEY ("blog_page_id") REFERENCES "public"."blog_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_page_fk" FOREIGN KEY ("product_page_id") REFERENCES "public"."product_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_navbar_left_navbar_items" ADD CONSTRAINT "global_navbar_left_navbar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_navbar_right_navbar_items" ADD CONSTRAINT "global_navbar_right_navbar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_navbar_policy" ADD CONSTRAINT "global_navbar_policy_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_footer_internal_links" ADD CONSTRAINT "global_footer_internal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_footer_policy_links" ADD CONSTRAINT "global_footer_policy_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global_footer_social_media_links" ADD CONSTRAINT "global_footer_social_media_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "global" ADD CONSTRAINT "global_navbar_logo_id_logos_id_fk" FOREIGN KEY ("navbar_logo_id") REFERENCES "public"."logos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "global" ADD CONSTRAINT "global_footer_logo_id_logos_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."logos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "global" ADD CONSTRAINT "global_footer_profile_id_media_id_fk" FOREIGN KEY ("footer_profile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "global_locales" ADD CONSTRAINT "global_locales_seo_meta_image_id_media_id_fk" FOREIGN KEY ("seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "global_locales" ADD CONSTRAINT "global_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."global"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_hero_c_t_as" ADD CONSTRAINT "service_blocks_hero_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_hero_services" ADD CONSTRAINT "service_blocks_hero_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_hero" ADD CONSTRAINT "service_blocks_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_hero" ADD CONSTRAINT "service_blocks_hero_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_hero" ADD CONSTRAINT "service_blocks_hero_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_hero" ADD CONSTRAINT "service_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_features_ray_card_items" ADD CONSTRAINT "service_blocks_features_ray_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_features_graph_card_top_items" ADD CONSTRAINT "service_blocks_features_graph_card_top_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_features" ADD CONSTRAINT "service_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_testimonials" ADD CONSTRAINT "service_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_faq" ADD CONSTRAINT "service_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_cta_c_t_as" ADD CONSTRAINT "service_blocks_cta_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_cta" ADD CONSTRAINT "service_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_cta_locales" ADD CONSTRAINT "service_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_pricing" ADD CONSTRAINT "service_blocks_pricing_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_pricing" ADD CONSTRAINT "service_blocks_pricing_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_pricing" ADD CONSTRAINT "service_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_how_it_works_steps" ADD CONSTRAINT "service_blocks_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_how_it_works_steps" ADD CONSTRAINT "service_blocks_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_how_it_works" ADD CONSTRAINT "service_blocks_how_it_works_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_how_it_works" ADD CONSTRAINT "service_blocks_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_services_elements_service_item" ADD CONSTRAINT "service_blocks_services_elements_service_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_services" ADD CONSTRAINT "service_blocks_services_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_services" ADD CONSTRAINT "service_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_brands" ADD CONSTRAINT "service_blocks_brands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_blog" ADD CONSTRAINT "service_blocks_blog_highlight_image_id_media_id_fk" FOREIGN KEY ("highlight_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_blog" ADD CONSTRAINT "service_blocks_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_newsletter_form_inputs" ADD CONSTRAINT "service_blocks_newsletter_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_newsletter" ADD CONSTRAINT "service_blocks_newsletter_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_newsletter" ADD CONSTRAINT "service_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_launches_launches" ADD CONSTRAINT "service_blocks_launches_launches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_launches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_launches" ADD CONSTRAINT "service_blocks_launches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_products_projects_tags" ADD CONSTRAINT "service_blocks_products_projects_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_products_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_products_projects" ADD CONSTRAINT "service_blocks_products_projects_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_products_projects" ADD CONSTRAINT "service_blocks_products_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_products" ADD CONSTRAINT "service_blocks_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_related_articles" ADD CONSTRAINT "service_blocks_related_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_related_articles_locales" ADD CONSTRAINT "service_blocks_related_articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_related_articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_related_products" ADD CONSTRAINT "service_blocks_related_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_why_choose_us_cards" ADD CONSTRAINT "service_blocks_why_choose_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_why_choose_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_why_choose_us" ADD CONSTRAINT "service_blocks_why_choose_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_form_section_form_inputs" ADD CONSTRAINT "service_blocks_form_section_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_form_section_section_users" ADD CONSTRAINT "service_blocks_form_section_section_users_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_form_section_section_users" ADD CONSTRAINT "service_blocks_form_section_section_users_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_form_section_benefits" ADD CONSTRAINT "service_blocks_form_section_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_form_section_policy_links" ADD CONSTRAINT "service_blocks_form_section_policy_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_form_section_social_links_links" ADD CONSTRAINT "service_blocks_form_section_social_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_form_section_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_form_section_social_links" ADD CONSTRAINT "service_blocks_form_section_social_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_form_section_social_links" ADD CONSTRAINT "service_blocks_form_section_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_blocks_form_section" ADD CONSTRAINT "service_blocks_form_section_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_form_section" ADD CONSTRAINT "service_blocks_form_section_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_blocks_form_section" ADD CONSTRAINT "service_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_locales" ADD CONSTRAINT "service_locales_seo_meta_image_id_media_id_fk" FOREIGN KEY ("seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_locales" ADD CONSTRAINT "service_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_rels" ADD CONSTRAINT "service_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_rels" ADD CONSTRAINT "service_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_rels" ADD CONSTRAINT "service_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_rels" ADD CONSTRAINT "service_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_rels" ADD CONSTRAINT "service_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_rels" ADD CONSTRAINT "service_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_rels" ADD CONSTRAINT "service_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_rels" ADD CONSTRAINT "service_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_rels" ADD CONSTRAINT "service_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_hero_c_t_as" ADD CONSTRAINT "_service_v_blocks_hero_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_hero_services" ADD CONSTRAINT "_service_v_blocks_hero_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_hero" ADD CONSTRAINT "_service_v_blocks_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_hero" ADD CONSTRAINT "_service_v_blocks_hero_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_hero" ADD CONSTRAINT "_service_v_blocks_hero_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_hero" ADD CONSTRAINT "_service_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_features_ray_card_items" ADD CONSTRAINT "_service_v_blocks_features_ray_card_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_features_graph_card_top_items" ADD CONSTRAINT "_service_v_blocks_features_graph_card_top_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_features" ADD CONSTRAINT "_service_v_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_testimonials" ADD CONSTRAINT "_service_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_faq" ADD CONSTRAINT "_service_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_cta_c_t_as" ADD CONSTRAINT "_service_v_blocks_cta_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_cta" ADD CONSTRAINT "_service_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_cta_locales" ADD CONSTRAINT "_service_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_pricing" ADD CONSTRAINT "_service_v_blocks_pricing_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_pricing" ADD CONSTRAINT "_service_v_blocks_pricing_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_pricing" ADD CONSTRAINT "_service_v_blocks_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_how_it_works_steps" ADD CONSTRAINT "_service_v_blocks_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_how_it_works_steps" ADD CONSTRAINT "_service_v_blocks_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_how_it_works" ADD CONSTRAINT "_service_v_blocks_how_it_works_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_how_it_works" ADD CONSTRAINT "_service_v_blocks_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_services_elements_service_item" ADD CONSTRAINT "_service_v_blocks_services_elements_service_item_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_services" ADD CONSTRAINT "_service_v_blocks_services_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_services" ADD CONSTRAINT "_service_v_blocks_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_brands" ADD CONSTRAINT "_service_v_blocks_brands_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_blog" ADD CONSTRAINT "_service_v_blocks_blog_highlight_image_id_media_id_fk" FOREIGN KEY ("highlight_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_blog" ADD CONSTRAINT "_service_v_blocks_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_newsletter_form_inputs" ADD CONSTRAINT "_service_v_blocks_newsletter_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_newsletter" ADD CONSTRAINT "_service_v_blocks_newsletter_profile_image_id_media_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_newsletter" ADD CONSTRAINT "_service_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_launches_launches" ADD CONSTRAINT "_service_v_blocks_launches_launches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_launches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_launches" ADD CONSTRAINT "_service_v_blocks_launches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_products_projects_tags" ADD CONSTRAINT "_service_v_blocks_products_projects_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_products_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_products_projects" ADD CONSTRAINT "_service_v_blocks_products_projects_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_products_projects" ADD CONSTRAINT "_service_v_blocks_products_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_products" ADD CONSTRAINT "_service_v_blocks_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_related_articles" ADD CONSTRAINT "_service_v_blocks_related_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_related_articles_locales" ADD CONSTRAINT "_service_v_blocks_related_articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_related_articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_related_products" ADD CONSTRAINT "_service_v_blocks_related_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_why_choose_us_cards" ADD CONSTRAINT "_service_v_blocks_why_choose_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_why_choose_us"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_why_choose_us" ADD CONSTRAINT "_service_v_blocks_why_choose_us_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_form_section_form_inputs" ADD CONSTRAINT "_service_v_blocks_form_section_form_inputs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_form_section_section_users" ADD CONSTRAINT "_service_v_blocks_form_section_section_users_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_form_section_section_users" ADD CONSTRAINT "_service_v_blocks_form_section_section_users_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_form_section_benefits" ADD CONSTRAINT "_service_v_blocks_form_section_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_form_section_policy_links" ADD CONSTRAINT "_service_v_blocks_form_section_policy_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_form_section_social_links_links" ADD CONSTRAINT "_service_v_blocks_form_section_social_links_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_form_section_social_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_form_section_social_links" ADD CONSTRAINT "_service_v_blocks_form_section_social_links_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_form_section_social_links" ADD CONSTRAINT "_service_v_blocks_form_section_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v_blocks_form_section"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_form_section" ADD CONSTRAINT "_service_v_blocks_form_section_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_form_section" ADD CONSTRAINT "_service_v_blocks_form_section_person_image_id_media_id_fk" FOREIGN KEY ("person_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_blocks_form_section" ADD CONSTRAINT "_service_v_blocks_form_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_locales" ADD CONSTRAINT "_service_v_locales_version_seo_meta_image_id_media_id_fk" FOREIGN KEY ("version_seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_service_v_locales" ADD CONSTRAINT "_service_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_rels" ADD CONSTRAINT "_service_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_service_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_rels" ADD CONSTRAINT "_service_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_rels" ADD CONSTRAINT "_service_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_rels" ADD CONSTRAINT "_service_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_rels" ADD CONSTRAINT "_service_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_rels" ADD CONSTRAINT "_service_v_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_rels" ADD CONSTRAINT "_service_v_rels_logos_fk" FOREIGN KEY ("logos_id") REFERENCES "public"."logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_rels" ADD CONSTRAINT "_service_v_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_service_v_rels" ADD CONSTRAINT "_service_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_blocks_cta_c_t_as_order_idx" ON "articles_blocks_cta_c_t_as" USING btree ("_order");
  CREATE INDEX "articles_blocks_cta_c_t_as_parent_id_idx" ON "articles_blocks_cta_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_cta_c_t_as_locale_idx" ON "articles_blocks_cta_c_t_as" USING btree ("_locale");
  CREATE INDEX "articles_blocks_cta_order_idx" ON "articles_blocks_cta" USING btree ("_order");
  CREATE INDEX "articles_blocks_cta_parent_id_idx" ON "articles_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_cta_path_idx" ON "articles_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "articles_blocks_cta_locales_locale_parent_id_unique" ON "articles_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_blocks_related_articles_order_idx" ON "articles_blocks_related_articles" USING btree ("_order");
  CREATE INDEX "articles_blocks_related_articles_parent_id_idx" ON "articles_blocks_related_articles" USING btree ("_parent_id");
  CREATE INDEX "articles_blocks_related_articles_path_idx" ON "articles_blocks_related_articles" USING btree ("_path");
  CREATE UNIQUE INDEX "articles_blocks_related_articles_locales_locale_parent_id_un" ON "articles_blocks_related_articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_person_card_person_card_image_idx" ON "articles" USING btree ("person_card_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles_locales" USING btree ("slug","_locale");
  CREATE INDEX "articles_image_idx" ON "articles_locales" USING btree ("image_id","_locale");
  CREATE INDEX "articles_seo_seo_meta_image_idx" ON "articles_locales" USING btree ("seo_meta_image_id");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_locale_idx" ON "articles_rels" USING btree ("locale");
  CREATE INDEX "articles_rels_categories_id_idx" ON "articles_rels" USING btree ("categories_id","locale");
  CREATE INDEX "articles_rels_media_id_idx" ON "articles_rels" USING btree ("media_id","locale");
  CREATE INDEX "articles_rels_articles_id_idx" ON "articles_rels" USING btree ("articles_id","locale");
  CREATE INDEX "_articles_v_blocks_cta_c_t_as_order_idx" ON "_articles_v_blocks_cta_c_t_as" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_cta_c_t_as_parent_id_idx" ON "_articles_v_blocks_cta_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_cta_c_t_as_locale_idx" ON "_articles_v_blocks_cta_c_t_as" USING btree ("_locale");
  CREATE INDEX "_articles_v_blocks_cta_order_idx" ON "_articles_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_cta_parent_id_idx" ON "_articles_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_cta_path_idx" ON "_articles_v_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_articles_v_blocks_cta_locales_locale_parent_id_unique" ON "_articles_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_blocks_related_articles_order_idx" ON "_articles_v_blocks_related_articles" USING btree ("_order");
  CREATE INDEX "_articles_v_blocks_related_articles_parent_id_idx" ON "_articles_v_blocks_related_articles" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_blocks_related_articles_path_idx" ON "_articles_v_blocks_related_articles" USING btree ("_path");
  CREATE UNIQUE INDEX "_articles_v_blocks_related_articles_locales_locale_parent_id" ON "_articles_v_blocks_related_articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_person_card_version_person_card_imag_idx" ON "_articles_v" USING btree ("version_person_card_image_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_snapshot_idx" ON "_articles_v" USING btree ("snapshot");
  CREATE INDEX "_articles_v_published_locale_idx" ON "_articles_v" USING btree ("published_locale");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_articles_v_version_version_image_idx" ON "_articles_v_locales" USING btree ("version_image_id","_locale");
  CREATE INDEX "_articles_v_version_seo_version_seo_meta_image_idx" ON "_articles_v_locales" USING btree ("version_seo_meta_image_id");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_locale_idx" ON "_articles_v_rels" USING btree ("locale");
  CREATE INDEX "_articles_v_rels_categories_id_idx" ON "_articles_v_rels" USING btree ("categories_id","locale");
  CREATE INDEX "_articles_v_rels_media_id_idx" ON "_articles_v_rels" USING btree ("media_id","locale");
  CREATE INDEX "_articles_v_rels_articles_id_idx" ON "_articles_v_rels" USING btree ("articles_id","locale");
  CREATE INDEX "categories_product_idx" ON "categories" USING btree ("product_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "categories_rels_order_idx" ON "categories_rels" USING btree ("order");
  CREATE INDEX "categories_rels_parent_idx" ON "categories_rels" USING btree ("parent_id");
  CREATE INDEX "categories_rels_path_idx" ON "categories_rels" USING btree ("path");
  CREATE INDEX "categories_rels_articles_id_idx" ON "categories_rels" USING btree ("articles_id");
  CREATE INDEX "contacts_updated_at_idx" ON "contacts" USING btree ("updated_at");
  CREATE INDEX "contacts_created_at_idx" ON "contacts" USING btree ("created_at");
  CREATE INDEX "_contacts_v_parent_idx" ON "_contacts_v" USING btree ("parent_id");
  CREATE INDEX "_contacts_v_version_version_updated_at_idx" ON "_contacts_v" USING btree ("version_updated_at");
  CREATE INDEX "_contacts_v_version_version_created_at_idx" ON "_contacts_v" USING btree ("version_created_at");
  CREATE INDEX "_contacts_v_created_at_idx" ON "_contacts_v" USING btree ("created_at");
  CREATE INDEX "_contacts_v_updated_at_idx" ON "_contacts_v" USING btree ("updated_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "logos_image_idx" ON "logos" USING btree ("image_id");
  CREATE INDEX "logos_updated_at_idx" ON "logos" USING btree ("updated_at");
  CREATE INDEX "logos_created_at_idx" ON "logos" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "newsletters_email_idx" ON "newsletters" USING btree ("email");
  CREATE INDEX "newsletters_updated_at_idx" ON "newsletters" USING btree ("updated_at");
  CREATE INDEX "newsletters_created_at_idx" ON "newsletters" USING btree ("created_at");
  CREATE INDEX "pages_blocks_hero_c_t_as_order_idx" ON "pages_blocks_hero_c_t_as" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_c_t_as_parent_id_idx" ON "pages_blocks_hero_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_c_t_as_locale_idx" ON "pages_blocks_hero_c_t_as" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_services_order_idx" ON "pages_blocks_hero_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_services_parent_id_idx" ON "pages_blocks_hero_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_services_locale_idx" ON "pages_blocks_hero_services" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_locale_idx" ON "pages_blocks_hero" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_video_idx" ON "pages_blocks_hero" USING btree ("video_id");
  CREATE INDEX "pages_blocks_hero_video_poster_idx" ON "pages_blocks_hero" USING btree ("video_poster_id");
  CREATE INDEX "pages_blocks_hero_person_person_image_idx" ON "pages_blocks_hero" USING btree ("person_image_id");
  CREATE INDEX "pages_blocks_features_ray_card_items_order_idx" ON "pages_blocks_features_ray_card_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_ray_card_items_parent_id_idx" ON "pages_blocks_features_ray_card_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_ray_card_items_locale_idx" ON "pages_blocks_features_ray_card_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_features_graph_card_top_items_order_idx" ON "pages_blocks_features_graph_card_top_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_graph_card_top_items_parent_id_idx" ON "pages_blocks_features_graph_card_top_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_graph_card_top_items_locale_idx" ON "pages_blocks_features_graph_card_top_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_features_locale_idx" ON "pages_blocks_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_locale_idx" ON "pages_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_locale_idx" ON "pages_blocks_faq" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_c_t_as_order_idx" ON "pages_blocks_cta_c_t_as" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_c_t_as_parent_id_idx" ON "pages_blocks_cta_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_c_t_as_locale_idx" ON "pages_blocks_cta_c_t_as" USING btree ("_locale");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_locale_idx" ON "pages_blocks_cta" USING btree ("_locale");
  CREATE INDEX "pages_blocks_pricing_order_idx" ON "pages_blocks_pricing" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_parent_id_idx" ON "pages_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_path_idx" ON "pages_blocks_pricing" USING btree ("_path");
  CREATE INDEX "pages_blocks_pricing_locale_idx" ON "pages_blocks_pricing" USING btree ("_locale");
  CREATE INDEX "pages_blocks_pricing_profile_image_idx" ON "pages_blocks_pricing" USING btree ("profile_image_id");
  CREATE INDEX "pages_blocks_pricing_background_idx" ON "pages_blocks_pricing" USING btree ("background_id");
  CREATE INDEX "pages_blocks_how_it_works_steps_order_idx" ON "pages_blocks_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_how_it_works_steps_parent_id_idx" ON "pages_blocks_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_how_it_works_steps_locale_idx" ON "pages_blocks_how_it_works_steps" USING btree ("_locale");
  CREATE INDEX "pages_blocks_how_it_works_steps_image_idx" ON "pages_blocks_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "pages_blocks_how_it_works_order_idx" ON "pages_blocks_how_it_works" USING btree ("_order");
  CREATE INDEX "pages_blocks_how_it_works_parent_id_idx" ON "pages_blocks_how_it_works" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_how_it_works_path_idx" ON "pages_blocks_how_it_works" USING btree ("_path");
  CREATE INDEX "pages_blocks_how_it_works_locale_idx" ON "pages_blocks_how_it_works" USING btree ("_locale");
  CREATE INDEX "pages_blocks_how_it_works_video_idx" ON "pages_blocks_how_it_works" USING btree ("video_id");
  CREATE INDEX "pages_blocks_services_elements_service_item_order_idx" ON "pages_blocks_services_elements_service_item" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_elements_service_item_parent_id_idx" ON "pages_blocks_services_elements_service_item" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_elements_service_item_locale_idx" ON "pages_blocks_services_elements_service_item" USING btree ("_locale");
  CREATE INDEX "pages_blocks_services_order_idx" ON "pages_blocks_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_parent_id_idx" ON "pages_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_path_idx" ON "pages_blocks_services" USING btree ("_path");
  CREATE INDEX "pages_blocks_services_locale_idx" ON "pages_blocks_services" USING btree ("_locale");
  CREATE INDEX "pages_blocks_services_background_idx" ON "pages_blocks_services" USING btree ("background_id");
  CREATE INDEX "pages_blocks_brands_order_idx" ON "pages_blocks_brands" USING btree ("_order");
  CREATE INDEX "pages_blocks_brands_parent_id_idx" ON "pages_blocks_brands" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_brands_path_idx" ON "pages_blocks_brands" USING btree ("_path");
  CREATE INDEX "pages_blocks_brands_locale_idx" ON "pages_blocks_brands" USING btree ("_locale");
  CREATE INDEX "pages_blocks_blog_order_idx" ON "pages_blocks_blog" USING btree ("_order");
  CREATE INDEX "pages_blocks_blog_parent_id_idx" ON "pages_blocks_blog" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_blog_path_idx" ON "pages_blocks_blog" USING btree ("_path");
  CREATE INDEX "pages_blocks_blog_locale_idx" ON "pages_blocks_blog" USING btree ("_locale");
  CREATE INDEX "pages_blocks_blog_highlight_image_idx" ON "pages_blocks_blog" USING btree ("highlight_image_id");
  CREATE INDEX "pages_blocks_newsletter_form_inputs_order_idx" ON "pages_blocks_newsletter_form_inputs" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_form_inputs_parent_id_idx" ON "pages_blocks_newsletter_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_form_inputs_locale_idx" ON "pages_blocks_newsletter_form_inputs" USING btree ("_locale");
  CREATE INDEX "pages_blocks_newsletter_order_idx" ON "pages_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_parent_id_idx" ON "pages_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_path_idx" ON "pages_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "pages_blocks_newsletter_locale_idx" ON "pages_blocks_newsletter" USING btree ("_locale");
  CREATE INDEX "pages_blocks_newsletter_profile_image_idx" ON "pages_blocks_newsletter" USING btree ("profile_image_id");
  CREATE INDEX "pages_blocks_launches_launches_order_idx" ON "pages_blocks_launches_launches" USING btree ("_order");
  CREATE INDEX "pages_blocks_launches_launches_parent_id_idx" ON "pages_blocks_launches_launches" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_launches_launches_locale_idx" ON "pages_blocks_launches_launches" USING btree ("_locale");
  CREATE INDEX "pages_blocks_launches_order_idx" ON "pages_blocks_launches" USING btree ("_order");
  CREATE INDEX "pages_blocks_launches_parent_id_idx" ON "pages_blocks_launches" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_launches_path_idx" ON "pages_blocks_launches" USING btree ("_path");
  CREATE INDEX "pages_blocks_launches_locale_idx" ON "pages_blocks_launches" USING btree ("_locale");
  CREATE INDEX "pages_blocks_products_projects_tags_order_idx" ON "pages_blocks_products_projects_tags" USING btree ("_order");
  CREATE INDEX "pages_blocks_products_projects_tags_parent_id_idx" ON "pages_blocks_products_projects_tags" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_products_projects_tags_locale_idx" ON "pages_blocks_products_projects_tags" USING btree ("_locale");
  CREATE INDEX "pages_blocks_products_projects_order_idx" ON "pages_blocks_products_projects" USING btree ("_order");
  CREATE INDEX "pages_blocks_products_projects_parent_id_idx" ON "pages_blocks_products_projects" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_products_projects_locale_idx" ON "pages_blocks_products_projects" USING btree ("_locale");
  CREATE INDEX "pages_blocks_products_projects_product_idx" ON "pages_blocks_products_projects" USING btree ("product_id");
  CREATE INDEX "pages_blocks_products_order_idx" ON "pages_blocks_products" USING btree ("_order");
  CREATE INDEX "pages_blocks_products_parent_id_idx" ON "pages_blocks_products" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_products_path_idx" ON "pages_blocks_products" USING btree ("_path");
  CREATE INDEX "pages_blocks_products_locale_idx" ON "pages_blocks_products" USING btree ("_locale");
  CREATE INDEX "pages_blocks_related_articles_order_idx" ON "pages_blocks_related_articles" USING btree ("_order");
  CREATE INDEX "pages_blocks_related_articles_parent_id_idx" ON "pages_blocks_related_articles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_related_articles_path_idx" ON "pages_blocks_related_articles" USING btree ("_path");
  CREATE INDEX "pages_blocks_related_articles_locale_idx" ON "pages_blocks_related_articles" USING btree ("_locale");
  CREATE INDEX "pages_blocks_related_products_order_idx" ON "pages_blocks_related_products" USING btree ("_order");
  CREATE INDEX "pages_blocks_related_products_parent_id_idx" ON "pages_blocks_related_products" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_related_products_path_idx" ON "pages_blocks_related_products" USING btree ("_path");
  CREATE INDEX "pages_blocks_related_products_locale_idx" ON "pages_blocks_related_products" USING btree ("_locale");
  CREATE INDEX "pages_blocks_why_choose_us_cards_order_idx" ON "pages_blocks_why_choose_us_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_choose_us_cards_parent_id_idx" ON "pages_blocks_why_choose_us_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_choose_us_cards_locale_idx" ON "pages_blocks_why_choose_us_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_why_choose_us_order_idx" ON "pages_blocks_why_choose_us" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_choose_us_parent_id_idx" ON "pages_blocks_why_choose_us" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_choose_us_path_idx" ON "pages_blocks_why_choose_us" USING btree ("_path");
  CREATE INDEX "pages_blocks_why_choose_us_locale_idx" ON "pages_blocks_why_choose_us" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_section_form_inputs_order_idx" ON "pages_blocks_form_section_form_inputs" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_section_form_inputs_parent_id_idx" ON "pages_blocks_form_section_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_section_form_inputs_locale_idx" ON "pages_blocks_form_section_form_inputs" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_section_section_users_order_idx" ON "pages_blocks_form_section_section_users" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_section_section_users_parent_id_idx" ON "pages_blocks_form_section_section_users" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_section_section_users_locale_idx" ON "pages_blocks_form_section_section_users" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_section_section_users_image_idx" ON "pages_blocks_form_section_section_users" USING btree ("image_id");
  CREATE INDEX "pages_blocks_form_section_benefits_order_idx" ON "pages_blocks_form_section_benefits" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_section_benefits_parent_id_idx" ON "pages_blocks_form_section_benefits" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_section_benefits_locale_idx" ON "pages_blocks_form_section_benefits" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_section_policy_links_order_idx" ON "pages_blocks_form_section_policy_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_section_policy_links_parent_id_idx" ON "pages_blocks_form_section_policy_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_section_policy_links_locale_idx" ON "pages_blocks_form_section_policy_links" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_section_social_links_links_order_idx" ON "pages_blocks_form_section_social_links_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_section_social_links_links_parent_id_idx" ON "pages_blocks_form_section_social_links_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_section_social_links_links_locale_idx" ON "pages_blocks_form_section_social_links_links" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_section_social_links_order_idx" ON "pages_blocks_form_section_social_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_section_social_links_parent_id_idx" ON "pages_blocks_form_section_social_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_section_social_links_locale_idx" ON "pages_blocks_form_section_social_links" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_section_social_links_image_idx" ON "pages_blocks_form_section_social_links" USING btree ("image_id");
  CREATE INDEX "pages_blocks_form_section_order_idx" ON "pages_blocks_form_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_section_parent_id_idx" ON "pages_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_section_path_idx" ON "pages_blocks_form_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_section_locale_idx" ON "pages_blocks_form_section" USING btree ("_locale");
  CREATE INDEX "pages_blocks_form_section_video_idx" ON "pages_blocks_form_section" USING btree ("video_id");
  CREATE INDEX "pages_blocks_form_section_person_person_image_idx" ON "pages_blocks_form_section" USING btree ("person_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE INDEX "pages_seo_seo_meta_image_idx" ON "pages_locales" USING btree ("seo_meta_image_id");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_locale_idx" ON "pages_rels" USING btree ("locale");
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "pages_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "pages_rels_faqs_id_idx" ON "pages_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id","locale");
  CREATE INDEX "pages_rels_plans_id_idx" ON "pages_rels" USING btree ("plans_id","locale");
  CREATE INDEX "pages_rels_logos_id_idx" ON "pages_rels" USING btree ("logos_id","locale");
  CREATE INDEX "pages_rels_articles_id_idx" ON "pages_rels" USING btree ("articles_id","locale");
  CREATE INDEX "pages_rels_products_id_idx" ON "pages_rels" USING btree ("products_id","locale");
  CREATE INDEX "_pages_v_blocks_hero_c_t_as_order_idx" ON "_pages_v_blocks_hero_c_t_as" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_c_t_as_parent_id_idx" ON "_pages_v_blocks_hero_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_c_t_as_locale_idx" ON "_pages_v_blocks_hero_c_t_as" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_services_order_idx" ON "_pages_v_blocks_hero_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_services_parent_id_idx" ON "_pages_v_blocks_hero_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_services_locale_idx" ON "_pages_v_blocks_hero_services" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_locale_idx" ON "_pages_v_blocks_hero" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_video_idx" ON "_pages_v_blocks_hero" USING btree ("video_id");
  CREATE INDEX "_pages_v_blocks_hero_video_poster_idx" ON "_pages_v_blocks_hero" USING btree ("video_poster_id");
  CREATE INDEX "_pages_v_blocks_hero_person_person_image_idx" ON "_pages_v_blocks_hero" USING btree ("person_image_id");
  CREATE INDEX "_pages_v_blocks_features_ray_card_items_order_idx" ON "_pages_v_blocks_features_ray_card_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_ray_card_items_parent_id_idx" ON "_pages_v_blocks_features_ray_card_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_ray_card_items_locale_idx" ON "_pages_v_blocks_features_ray_card_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_features_graph_card_top_items_order_idx" ON "_pages_v_blocks_features_graph_card_top_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_graph_card_top_items_parent_id_idx" ON "_pages_v_blocks_features_graph_card_top_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_graph_card_top_items_locale_idx" ON "_pages_v_blocks_features_graph_card_top_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_features_order_idx" ON "_pages_v_blocks_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_parent_id_idx" ON "_pages_v_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_path_idx" ON "_pages_v_blocks_features" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_features_locale_idx" ON "_pages_v_blocks_features" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_locale_idx" ON "_pages_v_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_locale_idx" ON "_pages_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_c_t_as_order_idx" ON "_pages_v_blocks_cta_c_t_as" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_c_t_as_parent_id_idx" ON "_pages_v_blocks_cta_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_c_t_as_locale_idx" ON "_pages_v_blocks_cta_c_t_as" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_locale_idx" ON "_pages_v_blocks_cta" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_pricing_order_idx" ON "_pages_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_parent_id_idx" ON "_pages_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_path_idx" ON "_pages_v_blocks_pricing" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pricing_locale_idx" ON "_pages_v_blocks_pricing" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_pricing_profile_image_idx" ON "_pages_v_blocks_pricing" USING btree ("profile_image_id");
  CREATE INDEX "_pages_v_blocks_pricing_background_idx" ON "_pages_v_blocks_pricing" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_how_it_works_steps_order_idx" ON "_pages_v_blocks_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_how_it_works_steps_parent_id_idx" ON "_pages_v_blocks_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_how_it_works_steps_locale_idx" ON "_pages_v_blocks_how_it_works_steps" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_how_it_works_steps_image_idx" ON "_pages_v_blocks_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_how_it_works_order_idx" ON "_pages_v_blocks_how_it_works" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_how_it_works_parent_id_idx" ON "_pages_v_blocks_how_it_works" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_how_it_works_path_idx" ON "_pages_v_blocks_how_it_works" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_how_it_works_locale_idx" ON "_pages_v_blocks_how_it_works" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_how_it_works_video_idx" ON "_pages_v_blocks_how_it_works" USING btree ("video_id");
  CREATE INDEX "_pages_v_blocks_services_elements_service_item_order_idx" ON "_pages_v_blocks_services_elements_service_item" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_elements_service_item_parent_id_idx" ON "_pages_v_blocks_services_elements_service_item" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_elements_service_item_locale_idx" ON "_pages_v_blocks_services_elements_service_item" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_services_order_idx" ON "_pages_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_parent_id_idx" ON "_pages_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_path_idx" ON "_pages_v_blocks_services" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_services_locale_idx" ON "_pages_v_blocks_services" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_services_background_idx" ON "_pages_v_blocks_services" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_brands_order_idx" ON "_pages_v_blocks_brands" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_brands_parent_id_idx" ON "_pages_v_blocks_brands" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_brands_path_idx" ON "_pages_v_blocks_brands" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_brands_locale_idx" ON "_pages_v_blocks_brands" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_blog_order_idx" ON "_pages_v_blocks_blog" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_blog_parent_id_idx" ON "_pages_v_blocks_blog" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_blog_path_idx" ON "_pages_v_blocks_blog" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_blog_locale_idx" ON "_pages_v_blocks_blog" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_blog_highlight_image_idx" ON "_pages_v_blocks_blog" USING btree ("highlight_image_id");
  CREATE INDEX "_pages_v_blocks_newsletter_form_inputs_order_idx" ON "_pages_v_blocks_newsletter_form_inputs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_form_inputs_parent_id_idx" ON "_pages_v_blocks_newsletter_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_form_inputs_locale_idx" ON "_pages_v_blocks_newsletter_form_inputs" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_newsletter_order_idx" ON "_pages_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_parent_id_idx" ON "_pages_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_path_idx" ON "_pages_v_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_newsletter_locale_idx" ON "_pages_v_blocks_newsletter" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_newsletter_profile_image_idx" ON "_pages_v_blocks_newsletter" USING btree ("profile_image_id");
  CREATE INDEX "_pages_v_blocks_launches_launches_order_idx" ON "_pages_v_blocks_launches_launches" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_launches_launches_parent_id_idx" ON "_pages_v_blocks_launches_launches" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_launches_launches_locale_idx" ON "_pages_v_blocks_launches_launches" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_launches_order_idx" ON "_pages_v_blocks_launches" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_launches_parent_id_idx" ON "_pages_v_blocks_launches" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_launches_path_idx" ON "_pages_v_blocks_launches" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_launches_locale_idx" ON "_pages_v_blocks_launches" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_products_projects_tags_order_idx" ON "_pages_v_blocks_products_projects_tags" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_products_projects_tags_parent_id_idx" ON "_pages_v_blocks_products_projects_tags" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_products_projects_tags_locale_idx" ON "_pages_v_blocks_products_projects_tags" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_products_projects_order_idx" ON "_pages_v_blocks_products_projects" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_products_projects_parent_id_idx" ON "_pages_v_blocks_products_projects" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_products_projects_locale_idx" ON "_pages_v_blocks_products_projects" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_products_projects_product_idx" ON "_pages_v_blocks_products_projects" USING btree ("product_id");
  CREATE INDEX "_pages_v_blocks_products_order_idx" ON "_pages_v_blocks_products" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_products_parent_id_idx" ON "_pages_v_blocks_products" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_products_path_idx" ON "_pages_v_blocks_products" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_products_locale_idx" ON "_pages_v_blocks_products" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_related_articles_order_idx" ON "_pages_v_blocks_related_articles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_related_articles_parent_id_idx" ON "_pages_v_blocks_related_articles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_related_articles_path_idx" ON "_pages_v_blocks_related_articles" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_related_articles_locale_idx" ON "_pages_v_blocks_related_articles" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_related_products_order_idx" ON "_pages_v_blocks_related_products" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_related_products_parent_id_idx" ON "_pages_v_blocks_related_products" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_related_products_path_idx" ON "_pages_v_blocks_related_products" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_related_products_locale_idx" ON "_pages_v_blocks_related_products" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_why_choose_us_cards_order_idx" ON "_pages_v_blocks_why_choose_us_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_why_choose_us_cards_parent_id_idx" ON "_pages_v_blocks_why_choose_us_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_why_choose_us_cards_locale_idx" ON "_pages_v_blocks_why_choose_us_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_why_choose_us_order_idx" ON "_pages_v_blocks_why_choose_us" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_why_choose_us_parent_id_idx" ON "_pages_v_blocks_why_choose_us" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_why_choose_us_path_idx" ON "_pages_v_blocks_why_choose_us" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_why_choose_us_locale_idx" ON "_pages_v_blocks_why_choose_us" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_section_form_inputs_order_idx" ON "_pages_v_blocks_form_section_form_inputs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_section_form_inputs_parent_id_idx" ON "_pages_v_blocks_form_section_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_section_form_inputs_locale_idx" ON "_pages_v_blocks_form_section_form_inputs" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_section_section_users_order_idx" ON "_pages_v_blocks_form_section_section_users" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_section_section_users_parent_id_idx" ON "_pages_v_blocks_form_section_section_users" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_section_section_users_locale_idx" ON "_pages_v_blocks_form_section_section_users" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_section_section_users_image_idx" ON "_pages_v_blocks_form_section_section_users" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_form_section_benefits_order_idx" ON "_pages_v_blocks_form_section_benefits" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_section_benefits_parent_id_idx" ON "_pages_v_blocks_form_section_benefits" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_section_benefits_locale_idx" ON "_pages_v_blocks_form_section_benefits" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_section_policy_links_order_idx" ON "_pages_v_blocks_form_section_policy_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_section_policy_links_parent_id_idx" ON "_pages_v_blocks_form_section_policy_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_section_policy_links_locale_idx" ON "_pages_v_blocks_form_section_policy_links" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_section_social_links_links_order_idx" ON "_pages_v_blocks_form_section_social_links_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_section_social_links_links_parent_id_idx" ON "_pages_v_blocks_form_section_social_links_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_section_social_links_links_locale_idx" ON "_pages_v_blocks_form_section_social_links_links" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_section_social_links_order_idx" ON "_pages_v_blocks_form_section_social_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_section_social_links_parent_id_idx" ON "_pages_v_blocks_form_section_social_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_section_social_links_locale_idx" ON "_pages_v_blocks_form_section_social_links" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_section_social_links_image_idx" ON "_pages_v_blocks_form_section_social_links" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_form_section_order_idx" ON "_pages_v_blocks_form_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_section_parent_id_idx" ON "_pages_v_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_section_path_idx" ON "_pages_v_blocks_form_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_section_locale_idx" ON "_pages_v_blocks_form_section" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_form_section_video_idx" ON "_pages_v_blocks_form_section" USING btree ("video_id");
  CREATE INDEX "_pages_v_blocks_form_section_person_person_image_idx" ON "_pages_v_blocks_form_section" USING btree ("person_image_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_pages_v_version_seo_version_seo_meta_image_idx" ON "_pages_v_locales" USING btree ("version_seo_meta_image_id");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_locale_idx" ON "_pages_v_rels" USING btree ("locale");
  CREATE INDEX "_pages_v_rels_testimonials_id_idx" ON "_pages_v_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "_pages_v_rels_faqs_id_idx" ON "_pages_v_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id","locale");
  CREATE INDEX "_pages_v_rels_plans_id_idx" ON "_pages_v_rels" USING btree ("plans_id","locale");
  CREATE INDEX "_pages_v_rels_logos_id_idx" ON "_pages_v_rels" USING btree ("logos_id","locale");
  CREATE INDEX "_pages_v_rels_articles_id_idx" ON "_pages_v_rels" USING btree ("articles_id","locale");
  CREATE INDEX "_pages_v_rels_products_id_idx" ON "_pages_v_rels" USING btree ("products_id","locale");
  CREATE INDEX "plans_perks_order_idx" ON "plans_perks" USING btree ("_order");
  CREATE INDEX "plans_perks_parent_id_idx" ON "plans_perks" USING btree ("_parent_id");
  CREATE INDEX "plans_perks_locale_idx" ON "plans_perks" USING btree ("_locale");
  CREATE INDEX "plans_additional_perks_order_idx" ON "plans_additional_perks" USING btree ("_order");
  CREATE INDEX "plans_additional_perks_parent_id_idx" ON "plans_additional_perks" USING btree ("_parent_id");
  CREATE INDEX "plans_additional_perks_locale_idx" ON "plans_additional_perks" USING btree ("_locale");
  CREATE INDEX "plans_product_idx" ON "plans" USING btree ("product_id");
  CREATE INDEX "plans_updated_at_idx" ON "plans" USING btree ("updated_at");
  CREATE INDEX "plans_created_at_idx" ON "plans" USING btree ("created_at");
  CREATE INDEX "plans__status_idx" ON "plans" USING btree ("_status");
  CREATE UNIQUE INDEX "plans_locales_locale_parent_id_unique" ON "plans_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_plans_v_version_perks_order_idx" ON "_plans_v_version_perks" USING btree ("_order");
  CREATE INDEX "_plans_v_version_perks_parent_id_idx" ON "_plans_v_version_perks" USING btree ("_parent_id");
  CREATE INDEX "_plans_v_version_perks_locale_idx" ON "_plans_v_version_perks" USING btree ("_locale");
  CREATE INDEX "_plans_v_version_additional_perks_order_idx" ON "_plans_v_version_additional_perks" USING btree ("_order");
  CREATE INDEX "_plans_v_version_additional_perks_parent_id_idx" ON "_plans_v_version_additional_perks" USING btree ("_parent_id");
  CREATE INDEX "_plans_v_version_additional_perks_locale_idx" ON "_plans_v_version_additional_perks" USING btree ("_locale");
  CREATE INDEX "_plans_v_parent_idx" ON "_plans_v" USING btree ("parent_id");
  CREATE INDEX "_plans_v_version_version_product_idx" ON "_plans_v" USING btree ("version_product_id");
  CREATE INDEX "_plans_v_version_version_updated_at_idx" ON "_plans_v" USING btree ("version_updated_at");
  CREATE INDEX "_plans_v_version_version_created_at_idx" ON "_plans_v" USING btree ("version_created_at");
  CREATE INDEX "_plans_v_version_version__status_idx" ON "_plans_v" USING btree ("version__status");
  CREATE INDEX "_plans_v_created_at_idx" ON "_plans_v" USING btree ("created_at");
  CREATE INDEX "_plans_v_updated_at_idx" ON "_plans_v" USING btree ("updated_at");
  CREATE INDEX "_plans_v_snapshot_idx" ON "_plans_v" USING btree ("snapshot");
  CREATE INDEX "_plans_v_published_locale_idx" ON "_plans_v" USING btree ("published_locale");
  CREATE INDEX "_plans_v_latest_idx" ON "_plans_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_plans_v_locales_locale_parent_id_unique" ON "_plans_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_perks_order_idx" ON "products_perks" USING btree ("_order");
  CREATE INDEX "products_perks_parent_id_idx" ON "products_perks" USING btree ("_parent_id");
  CREATE INDEX "products_perks_locale_idx" ON "products_perks" USING btree ("_locale");
  CREATE INDEX "products_blocks_related_products_order_idx" ON "products_blocks_related_products" USING btree ("_order");
  CREATE INDEX "products_blocks_related_products_parent_id_idx" ON "products_blocks_related_products" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_related_products_path_idx" ON "products_blocks_related_products" USING btree ("_path");
  CREATE INDEX "products_blocks_cta_c_t_as_order_idx" ON "products_blocks_cta_c_t_as" USING btree ("_order");
  CREATE INDEX "products_blocks_cta_c_t_as_parent_id_idx" ON "products_blocks_cta_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_cta_c_t_as_locale_idx" ON "products_blocks_cta_c_t_as" USING btree ("_locale");
  CREATE INDEX "products_blocks_cta_order_idx" ON "products_blocks_cta" USING btree ("_order");
  CREATE INDEX "products_blocks_cta_parent_id_idx" ON "products_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_cta_path_idx" ON "products_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_cta_locales_locale_parent_id_unique" ON "products_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_testimonials_order_idx" ON "products_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "products_blocks_testimonials_parent_id_idx" ON "products_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_testimonials_path_idx" ON "products_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "products_blocks_form_section_form_inputs_order_idx" ON "products_blocks_form_section_form_inputs" USING btree ("_order");
  CREATE INDEX "products_blocks_form_section_form_inputs_parent_id_idx" ON "products_blocks_form_section_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_form_section_section_users_order_idx" ON "products_blocks_form_section_section_users" USING btree ("_order");
  CREATE INDEX "products_blocks_form_section_section_users_parent_id_idx" ON "products_blocks_form_section_section_users" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_form_section_section_users_image_idx" ON "products_blocks_form_section_section_users" USING btree ("image_id");
  CREATE INDEX "products_blocks_form_section_benefits_order_idx" ON "products_blocks_form_section_benefits" USING btree ("_order");
  CREATE INDEX "products_blocks_form_section_benefits_parent_id_idx" ON "products_blocks_form_section_benefits" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_form_section_policy_links_order_idx" ON "products_blocks_form_section_policy_links" USING btree ("_order");
  CREATE INDEX "products_blocks_form_section_policy_links_parent_id_idx" ON "products_blocks_form_section_policy_links" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_form_section_social_links_links_order_idx" ON "products_blocks_form_section_social_links_links" USING btree ("_order");
  CREATE INDEX "products_blocks_form_section_social_links_links_parent_id_idx" ON "products_blocks_form_section_social_links_links" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_form_section_social_links_order_idx" ON "products_blocks_form_section_social_links" USING btree ("_order");
  CREATE INDEX "products_blocks_form_section_social_links_parent_id_idx" ON "products_blocks_form_section_social_links" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_form_section_social_links_image_idx" ON "products_blocks_form_section_social_links" USING btree ("image_id");
  CREATE INDEX "products_blocks_form_section_order_idx" ON "products_blocks_form_section" USING btree ("_order");
  CREATE INDEX "products_blocks_form_section_parent_id_idx" ON "products_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_form_section_path_idx" ON "products_blocks_form_section" USING btree ("_path");
  CREATE INDEX "products_blocks_form_section_video_idx" ON "products_blocks_form_section" USING btree ("video_id");
  CREATE INDEX "products_blocks_form_section_person_person_image_idx" ON "products_blocks_form_section" USING btree ("person_image_id");
  CREATE INDEX "products_blocks_newsletter_form_inputs_order_idx" ON "products_blocks_newsletter_form_inputs" USING btree ("_order");
  CREATE INDEX "products_blocks_newsletter_form_inputs_parent_id_idx" ON "products_blocks_newsletter_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_newsletter_order_idx" ON "products_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "products_blocks_newsletter_parent_id_idx" ON "products_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_newsletter_path_idx" ON "products_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "products_blocks_newsletter_profile_image_idx" ON "products_blocks_newsletter" USING btree ("profile_image_id");
  CREATE INDEX "products_blocks_faq_order_idx" ON "products_blocks_faq" USING btree ("_order");
  CREATE INDEX "products_blocks_faq_parent_id_idx" ON "products_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_faq_path_idx" ON "products_blocks_faq" USING btree ("_path");
  CREATE INDEX "products_logo_idx" ON "products" USING btree ("logo_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products_locales" USING btree ("slug","_locale");
  CREATE INDEX "products_seo_seo_meta_image_idx" ON "products_locales" USING btree ("seo_meta_image_id");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_locale_idx" ON "products_rels" USING btree ("locale");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id","locale");
  CREATE INDEX "products_rels_plans_id_idx" ON "products_rels" USING btree ("plans_id","locale");
  CREATE INDEX "products_rels_categories_id_idx" ON "products_rels" USING btree ("categories_id","locale");
  CREATE INDEX "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id","locale");
  CREATE INDEX "products_rels_testimonials_id_idx" ON "products_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "products_rels_faqs_id_idx" ON "products_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "_products_v_version_perks_order_idx" ON "_products_v_version_perks" USING btree ("_order");
  CREATE INDEX "_products_v_version_perks_parent_id_idx" ON "_products_v_version_perks" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_perks_locale_idx" ON "_products_v_version_perks" USING btree ("_locale");
  CREATE INDEX "_products_v_blocks_related_products_order_idx" ON "_products_v_blocks_related_products" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_related_products_parent_id_idx" ON "_products_v_blocks_related_products" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_related_products_path_idx" ON "_products_v_blocks_related_products" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_cta_c_t_as_order_idx" ON "_products_v_blocks_cta_c_t_as" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_cta_c_t_as_parent_id_idx" ON "_products_v_blocks_cta_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_cta_c_t_as_locale_idx" ON "_products_v_blocks_cta_c_t_as" USING btree ("_locale");
  CREATE INDEX "_products_v_blocks_cta_order_idx" ON "_products_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_cta_parent_id_idx" ON "_products_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_cta_path_idx" ON "_products_v_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_products_v_blocks_cta_locales_locale_parent_id_unique" ON "_products_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_testimonials_order_idx" ON "_products_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_testimonials_parent_id_idx" ON "_products_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_testimonials_path_idx" ON "_products_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_form_section_form_inputs_order_idx" ON "_products_v_blocks_form_section_form_inputs" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_form_section_form_inputs_parent_id_idx" ON "_products_v_blocks_form_section_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_form_section_section_users_order_idx" ON "_products_v_blocks_form_section_section_users" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_form_section_section_users_parent_id_idx" ON "_products_v_blocks_form_section_section_users" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_form_section_section_users_image_idx" ON "_products_v_blocks_form_section_section_users" USING btree ("image_id");
  CREATE INDEX "_products_v_blocks_form_section_benefits_order_idx" ON "_products_v_blocks_form_section_benefits" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_form_section_benefits_parent_id_idx" ON "_products_v_blocks_form_section_benefits" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_form_section_policy_links_order_idx" ON "_products_v_blocks_form_section_policy_links" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_form_section_policy_links_parent_id_idx" ON "_products_v_blocks_form_section_policy_links" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_form_section_social_links_links_order_idx" ON "_products_v_blocks_form_section_social_links_links" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_form_section_social_links_links_parent_id_idx" ON "_products_v_blocks_form_section_social_links_links" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_form_section_social_links_order_idx" ON "_products_v_blocks_form_section_social_links" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_form_section_social_links_parent_id_idx" ON "_products_v_blocks_form_section_social_links" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_form_section_social_links_image_idx" ON "_products_v_blocks_form_section_social_links" USING btree ("image_id");
  CREATE INDEX "_products_v_blocks_form_section_order_idx" ON "_products_v_blocks_form_section" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_form_section_parent_id_idx" ON "_products_v_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_form_section_path_idx" ON "_products_v_blocks_form_section" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_form_section_video_idx" ON "_products_v_blocks_form_section" USING btree ("video_id");
  CREATE INDEX "_products_v_blocks_form_section_person_person_image_idx" ON "_products_v_blocks_form_section" USING btree ("person_image_id");
  CREATE INDEX "_products_v_blocks_newsletter_form_inputs_order_idx" ON "_products_v_blocks_newsletter_form_inputs" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_newsletter_form_inputs_parent_id_idx" ON "_products_v_blocks_newsletter_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_newsletter_order_idx" ON "_products_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_newsletter_parent_id_idx" ON "_products_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_newsletter_path_idx" ON "_products_v_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_newsletter_profile_image_idx" ON "_products_v_blocks_newsletter" USING btree ("profile_image_id");
  CREATE INDEX "_products_v_blocks_faq_order_idx" ON "_products_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_faq_parent_id_idx" ON "_products_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_faq_path_idx" ON "_products_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_logo_idx" ON "_products_v" USING btree ("version_logo_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_products_v_version_seo_version_seo_meta_image_idx" ON "_products_v_locales" USING btree ("version_seo_meta_image_id");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_locale_idx" ON "_products_v_rels" USING btree ("locale");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id","locale");
  CREATE INDEX "_products_v_rels_plans_id_idx" ON "_products_v_rels" USING btree ("plans_id","locale");
  CREATE INDEX "_products_v_rels_categories_id_idx" ON "_products_v_rels" USING btree ("categories_id","locale");
  CREATE INDEX "_products_v_rels_products_id_idx" ON "_products_v_rels" USING btree ("products_id","locale");
  CREATE INDEX "_products_v_rels_testimonials_id_idx" ON "_products_v_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "_products_v_rels_faqs_id_idx" ON "_products_v_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "redirections_updated_at_idx" ON "redirections" USING btree ("updated_at");
  CREATE INDEX "redirections_created_at_idx" ON "redirections" USING btree ("created_at");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE INDEX "testimonials_user_user_image_idx" ON "testimonials_locales" USING btree ("user_image_id");
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_snapshot_idx" ON "_testimonials_v" USING btree ("snapshot");
  CREATE INDEX "_testimonials_v_published_locale_idx" ON "_testimonials_v" USING btree ("published_locale");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "_testimonials_v_version_user_version_user_image_idx" ON "_testimonials_v_locales" USING btree ("version_user_image_id");
  CREATE UNIQUE INDEX "_testimonials_v_locales_locale_parent_id_unique" ON "_testimonials_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "blog_page_blocks_testimonials_order_idx" ON "blog_page_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_testimonials_parent_id_idx" ON "blog_page_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_testimonials_path_idx" ON "blog_page_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "blog_page_blocks_testimonials_locale_idx" ON "blog_page_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_related_products_order_idx" ON "blog_page_blocks_related_products" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_related_products_parent_id_idx" ON "blog_page_blocks_related_products" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_related_products_path_idx" ON "blog_page_blocks_related_products" USING btree ("_path");
  CREATE INDEX "blog_page_blocks_related_products_locale_idx" ON "blog_page_blocks_related_products" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_related_articles_order_idx" ON "blog_page_blocks_related_articles" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_related_articles_parent_id_idx" ON "blog_page_blocks_related_articles" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_related_articles_path_idx" ON "blog_page_blocks_related_articles" USING btree ("_path");
  CREATE INDEX "blog_page_blocks_related_articles_locale_idx" ON "blog_page_blocks_related_articles" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_pricing_order_idx" ON "blog_page_blocks_pricing" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_pricing_parent_id_idx" ON "blog_page_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_pricing_path_idx" ON "blog_page_blocks_pricing" USING btree ("_path");
  CREATE INDEX "blog_page_blocks_pricing_locale_idx" ON "blog_page_blocks_pricing" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_pricing_profile_image_idx" ON "blog_page_blocks_pricing" USING btree ("profile_image_id");
  CREATE INDEX "blog_page_blocks_pricing_background_idx" ON "blog_page_blocks_pricing" USING btree ("background_id");
  CREATE INDEX "blog_page_blocks_launches_launches_order_idx" ON "blog_page_blocks_launches_launches" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_launches_launches_parent_id_idx" ON "blog_page_blocks_launches_launches" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_launches_launches_locale_idx" ON "blog_page_blocks_launches_launches" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_launches_order_idx" ON "blog_page_blocks_launches" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_launches_parent_id_idx" ON "blog_page_blocks_launches" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_launches_path_idx" ON "blog_page_blocks_launches" USING btree ("_path");
  CREATE INDEX "blog_page_blocks_launches_locale_idx" ON "blog_page_blocks_launches" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_how_it_works_steps_order_idx" ON "blog_page_blocks_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_how_it_works_steps_parent_id_idx" ON "blog_page_blocks_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_how_it_works_steps_locale_idx" ON "blog_page_blocks_how_it_works_steps" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_how_it_works_steps_image_idx" ON "blog_page_blocks_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "blog_page_blocks_how_it_works_order_idx" ON "blog_page_blocks_how_it_works" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_how_it_works_parent_id_idx" ON "blog_page_blocks_how_it_works" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_how_it_works_path_idx" ON "blog_page_blocks_how_it_works" USING btree ("_path");
  CREATE INDEX "blog_page_blocks_how_it_works_locale_idx" ON "blog_page_blocks_how_it_works" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_how_it_works_video_idx" ON "blog_page_blocks_how_it_works" USING btree ("video_id");
  CREATE INDEX "blog_page_blocks_hero_c_t_as_order_idx" ON "blog_page_blocks_hero_c_t_as" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_hero_c_t_as_parent_id_idx" ON "blog_page_blocks_hero_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_hero_c_t_as_locale_idx" ON "blog_page_blocks_hero_c_t_as" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_hero_services_order_idx" ON "blog_page_blocks_hero_services" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_hero_services_parent_id_idx" ON "blog_page_blocks_hero_services" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_hero_services_locale_idx" ON "blog_page_blocks_hero_services" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_hero_order_idx" ON "blog_page_blocks_hero" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_hero_parent_id_idx" ON "blog_page_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_hero_path_idx" ON "blog_page_blocks_hero" USING btree ("_path");
  CREATE INDEX "blog_page_blocks_hero_locale_idx" ON "blog_page_blocks_hero" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_hero_video_idx" ON "blog_page_blocks_hero" USING btree ("video_id");
  CREATE INDEX "blog_page_blocks_hero_video_poster_idx" ON "blog_page_blocks_hero" USING btree ("video_poster_id");
  CREATE INDEX "blog_page_blocks_hero_person_person_image_idx" ON "blog_page_blocks_hero" USING btree ("person_image_id");
  CREATE INDEX "blog_page_blocks_form_section_form_inputs_order_idx" ON "blog_page_blocks_form_section_form_inputs" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_form_section_form_inputs_parent_id_idx" ON "blog_page_blocks_form_section_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_form_section_form_inputs_locale_idx" ON "blog_page_blocks_form_section_form_inputs" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_form_section_section_users_order_idx" ON "blog_page_blocks_form_section_section_users" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_form_section_section_users_parent_id_idx" ON "blog_page_blocks_form_section_section_users" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_form_section_section_users_locale_idx" ON "blog_page_blocks_form_section_section_users" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_form_section_section_users_image_idx" ON "blog_page_blocks_form_section_section_users" USING btree ("image_id");
  CREATE INDEX "blog_page_blocks_form_section_benefits_order_idx" ON "blog_page_blocks_form_section_benefits" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_form_section_benefits_parent_id_idx" ON "blog_page_blocks_form_section_benefits" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_form_section_benefits_locale_idx" ON "blog_page_blocks_form_section_benefits" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_form_section_policy_links_order_idx" ON "blog_page_blocks_form_section_policy_links" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_form_section_policy_links_parent_id_idx" ON "blog_page_blocks_form_section_policy_links" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_form_section_policy_links_locale_idx" ON "blog_page_blocks_form_section_policy_links" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_form_section_social_links_links_order_idx" ON "blog_page_blocks_form_section_social_links_links" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_form_section_social_links_links_parent_id_idx" ON "blog_page_blocks_form_section_social_links_links" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_form_section_social_links_links_locale_idx" ON "blog_page_blocks_form_section_social_links_links" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_form_section_social_links_order_idx" ON "blog_page_blocks_form_section_social_links" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_form_section_social_links_parent_id_idx" ON "blog_page_blocks_form_section_social_links" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_form_section_social_links_locale_idx" ON "blog_page_blocks_form_section_social_links" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_form_section_social_links_image_idx" ON "blog_page_blocks_form_section_social_links" USING btree ("image_id");
  CREATE INDEX "blog_page_blocks_form_section_order_idx" ON "blog_page_blocks_form_section" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_form_section_parent_id_idx" ON "blog_page_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_form_section_path_idx" ON "blog_page_blocks_form_section" USING btree ("_path");
  CREATE INDEX "blog_page_blocks_form_section_locale_idx" ON "blog_page_blocks_form_section" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_form_section_video_idx" ON "blog_page_blocks_form_section" USING btree ("video_id");
  CREATE INDEX "blog_page_blocks_form_section_person_person_image_idx" ON "blog_page_blocks_form_section" USING btree ("person_image_id");
  CREATE INDEX "blog_page_blocks_features_ray_card_items_order_idx" ON "blog_page_blocks_features_ray_card_items" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_features_ray_card_items_parent_id_idx" ON "blog_page_blocks_features_ray_card_items" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_features_ray_card_items_locale_idx" ON "blog_page_blocks_features_ray_card_items" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_features_graph_card_top_items_order_idx" ON "blog_page_blocks_features_graph_card_top_items" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_features_graph_card_top_items_parent_id_idx" ON "blog_page_blocks_features_graph_card_top_items" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_features_graph_card_top_items_locale_idx" ON "blog_page_blocks_features_graph_card_top_items" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_features_order_idx" ON "blog_page_blocks_features" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_features_parent_id_idx" ON "blog_page_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_features_path_idx" ON "blog_page_blocks_features" USING btree ("_path");
  CREATE INDEX "blog_page_blocks_features_locale_idx" ON "blog_page_blocks_features" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_faq_order_idx" ON "blog_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_faq_parent_id_idx" ON "blog_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_faq_path_idx" ON "blog_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "blog_page_blocks_faq_locale_idx" ON "blog_page_blocks_faq" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_cta_c_t_as_order_idx" ON "blog_page_blocks_cta_c_t_as" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_cta_c_t_as_parent_id_idx" ON "blog_page_blocks_cta_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_cta_c_t_as_locale_idx" ON "blog_page_blocks_cta_c_t_as" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_cta_order_idx" ON "blog_page_blocks_cta" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_cta_parent_id_idx" ON "blog_page_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_cta_path_idx" ON "blog_page_blocks_cta" USING btree ("_path");
  CREATE INDEX "blog_page_blocks_cta_locale_idx" ON "blog_page_blocks_cta" USING btree ("_locale");
  CREATE INDEX "blog_page_blocks_brands_order_idx" ON "blog_page_blocks_brands" USING btree ("_order");
  CREATE INDEX "blog_page_blocks_brands_parent_id_idx" ON "blog_page_blocks_brands" USING btree ("_parent_id");
  CREATE INDEX "blog_page_blocks_brands_path_idx" ON "blog_page_blocks_brands" USING btree ("_path");
  CREATE INDEX "blog_page_blocks_brands_locale_idx" ON "blog_page_blocks_brands" USING btree ("_locale");
  CREATE INDEX "blog_page_updated_at_idx" ON "blog_page" USING btree ("updated_at");
  CREATE INDEX "blog_page_created_at_idx" ON "blog_page" USING btree ("created_at");
  CREATE INDEX "blog_page_seo_seo_meta_image_idx" ON "blog_page_locales" USING btree ("seo_meta_image_id");
  CREATE UNIQUE INDEX "blog_page_locales_locale_parent_id_unique" ON "blog_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blog_page_rels_order_idx" ON "blog_page_rels" USING btree ("order");
  CREATE INDEX "blog_page_rels_parent_idx" ON "blog_page_rels" USING btree ("parent_id");
  CREATE INDEX "blog_page_rels_path_idx" ON "blog_page_rels" USING btree ("path");
  CREATE INDEX "blog_page_rels_locale_idx" ON "blog_page_rels" USING btree ("locale");
  CREATE INDEX "blog_page_rels_testimonials_id_idx" ON "blog_page_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "blog_page_rels_products_id_idx" ON "blog_page_rels" USING btree ("products_id","locale");
  CREATE INDEX "blog_page_rels_articles_id_idx" ON "blog_page_rels" USING btree ("articles_id","locale");
  CREATE INDEX "blog_page_rels_plans_id_idx" ON "blog_page_rels" USING btree ("plans_id","locale");
  CREATE INDEX "blog_page_rels_faqs_id_idx" ON "blog_page_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "blog_page_rels_media_id_idx" ON "blog_page_rels" USING btree ("media_id","locale");
  CREATE INDEX "blog_page_rels_logos_id_idx" ON "blog_page_rels" USING btree ("logos_id","locale");
  CREATE INDEX "product_page_blocks_hero_c_t_as_order_idx" ON "product_page_blocks_hero_c_t_as" USING btree ("_order");
  CREATE INDEX "product_page_blocks_hero_c_t_as_parent_id_idx" ON "product_page_blocks_hero_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_hero_c_t_as_locale_idx" ON "product_page_blocks_hero_c_t_as" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_hero_services_order_idx" ON "product_page_blocks_hero_services" USING btree ("_order");
  CREATE INDEX "product_page_blocks_hero_services_parent_id_idx" ON "product_page_blocks_hero_services" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_hero_services_locale_idx" ON "product_page_blocks_hero_services" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_hero_order_idx" ON "product_page_blocks_hero" USING btree ("_order");
  CREATE INDEX "product_page_blocks_hero_parent_id_idx" ON "product_page_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_hero_path_idx" ON "product_page_blocks_hero" USING btree ("_path");
  CREATE INDEX "product_page_blocks_hero_locale_idx" ON "product_page_blocks_hero" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_hero_video_idx" ON "product_page_blocks_hero" USING btree ("video_id");
  CREATE INDEX "product_page_blocks_hero_video_poster_idx" ON "product_page_blocks_hero" USING btree ("video_poster_id");
  CREATE INDEX "product_page_blocks_hero_person_person_image_idx" ON "product_page_blocks_hero" USING btree ("person_image_id");
  CREATE INDEX "product_page_blocks_features_ray_card_items_order_idx" ON "product_page_blocks_features_ray_card_items" USING btree ("_order");
  CREATE INDEX "product_page_blocks_features_ray_card_items_parent_id_idx" ON "product_page_blocks_features_ray_card_items" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_features_ray_card_items_locale_idx" ON "product_page_blocks_features_ray_card_items" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_features_graph_card_top_items_order_idx" ON "product_page_blocks_features_graph_card_top_items" USING btree ("_order");
  CREATE INDEX "product_page_blocks_features_graph_card_top_items_parent_id_idx" ON "product_page_blocks_features_graph_card_top_items" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_features_graph_card_top_items_locale_idx" ON "product_page_blocks_features_graph_card_top_items" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_features_order_idx" ON "product_page_blocks_features" USING btree ("_order");
  CREATE INDEX "product_page_blocks_features_parent_id_idx" ON "product_page_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_features_path_idx" ON "product_page_blocks_features" USING btree ("_path");
  CREATE INDEX "product_page_blocks_features_locale_idx" ON "product_page_blocks_features" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_testimonials_order_idx" ON "product_page_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "product_page_blocks_testimonials_parent_id_idx" ON "product_page_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_testimonials_path_idx" ON "product_page_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "product_page_blocks_testimonials_locale_idx" ON "product_page_blocks_testimonials" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_faq_order_idx" ON "product_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "product_page_blocks_faq_parent_id_idx" ON "product_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_faq_path_idx" ON "product_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "product_page_blocks_faq_locale_idx" ON "product_page_blocks_faq" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_cta_c_t_as_order_idx" ON "product_page_blocks_cta_c_t_as" USING btree ("_order");
  CREATE INDEX "product_page_blocks_cta_c_t_as_parent_id_idx" ON "product_page_blocks_cta_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_cta_c_t_as_locale_idx" ON "product_page_blocks_cta_c_t_as" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_cta_order_idx" ON "product_page_blocks_cta" USING btree ("_order");
  CREATE INDEX "product_page_blocks_cta_parent_id_idx" ON "product_page_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_cta_path_idx" ON "product_page_blocks_cta" USING btree ("_path");
  CREATE INDEX "product_page_blocks_cta_locale_idx" ON "product_page_blocks_cta" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_pricing_order_idx" ON "product_page_blocks_pricing" USING btree ("_order");
  CREATE INDEX "product_page_blocks_pricing_parent_id_idx" ON "product_page_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_pricing_path_idx" ON "product_page_blocks_pricing" USING btree ("_path");
  CREATE INDEX "product_page_blocks_pricing_locale_idx" ON "product_page_blocks_pricing" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_pricing_profile_image_idx" ON "product_page_blocks_pricing" USING btree ("profile_image_id");
  CREATE INDEX "product_page_blocks_pricing_background_idx" ON "product_page_blocks_pricing" USING btree ("background_id");
  CREATE INDEX "product_page_blocks_how_it_works_steps_order_idx" ON "product_page_blocks_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "product_page_blocks_how_it_works_steps_parent_id_idx" ON "product_page_blocks_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_how_it_works_steps_locale_idx" ON "product_page_blocks_how_it_works_steps" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_how_it_works_steps_image_idx" ON "product_page_blocks_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "product_page_blocks_how_it_works_order_idx" ON "product_page_blocks_how_it_works" USING btree ("_order");
  CREATE INDEX "product_page_blocks_how_it_works_parent_id_idx" ON "product_page_blocks_how_it_works" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_how_it_works_path_idx" ON "product_page_blocks_how_it_works" USING btree ("_path");
  CREATE INDEX "product_page_blocks_how_it_works_locale_idx" ON "product_page_blocks_how_it_works" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_how_it_works_video_idx" ON "product_page_blocks_how_it_works" USING btree ("video_id");
  CREATE INDEX "product_page_blocks_services_elements_service_item_order_idx" ON "product_page_blocks_services_elements_service_item" USING btree ("_order");
  CREATE INDEX "product_page_blocks_services_elements_service_item_parent_id_idx" ON "product_page_blocks_services_elements_service_item" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_services_elements_service_item_locale_idx" ON "product_page_blocks_services_elements_service_item" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_services_order_idx" ON "product_page_blocks_services" USING btree ("_order");
  CREATE INDEX "product_page_blocks_services_parent_id_idx" ON "product_page_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_services_path_idx" ON "product_page_blocks_services" USING btree ("_path");
  CREATE INDEX "product_page_blocks_services_locale_idx" ON "product_page_blocks_services" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_services_background_idx" ON "product_page_blocks_services" USING btree ("background_id");
  CREATE INDEX "product_page_blocks_brands_order_idx" ON "product_page_blocks_brands" USING btree ("_order");
  CREATE INDEX "product_page_blocks_brands_parent_id_idx" ON "product_page_blocks_brands" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_brands_path_idx" ON "product_page_blocks_brands" USING btree ("_path");
  CREATE INDEX "product_page_blocks_brands_locale_idx" ON "product_page_blocks_brands" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_blog_order_idx" ON "product_page_blocks_blog" USING btree ("_order");
  CREATE INDEX "product_page_blocks_blog_parent_id_idx" ON "product_page_blocks_blog" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_blog_path_idx" ON "product_page_blocks_blog" USING btree ("_path");
  CREATE INDEX "product_page_blocks_blog_locale_idx" ON "product_page_blocks_blog" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_blog_highlight_image_idx" ON "product_page_blocks_blog" USING btree ("highlight_image_id");
  CREATE INDEX "product_page_blocks_newsletter_form_inputs_order_idx" ON "product_page_blocks_newsletter_form_inputs" USING btree ("_order");
  CREATE INDEX "product_page_blocks_newsletter_form_inputs_parent_id_idx" ON "product_page_blocks_newsletter_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_newsletter_form_inputs_locale_idx" ON "product_page_blocks_newsletter_form_inputs" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_newsletter_order_idx" ON "product_page_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "product_page_blocks_newsletter_parent_id_idx" ON "product_page_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_newsletter_path_idx" ON "product_page_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "product_page_blocks_newsletter_locale_idx" ON "product_page_blocks_newsletter" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_newsletter_profile_image_idx" ON "product_page_blocks_newsletter" USING btree ("profile_image_id");
  CREATE INDEX "product_page_blocks_launches_launches_order_idx" ON "product_page_blocks_launches_launches" USING btree ("_order");
  CREATE INDEX "product_page_blocks_launches_launches_parent_id_idx" ON "product_page_blocks_launches_launches" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_launches_launches_locale_idx" ON "product_page_blocks_launches_launches" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_launches_order_idx" ON "product_page_blocks_launches" USING btree ("_order");
  CREATE INDEX "product_page_blocks_launches_parent_id_idx" ON "product_page_blocks_launches" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_launches_path_idx" ON "product_page_blocks_launches" USING btree ("_path");
  CREATE INDEX "product_page_blocks_launches_locale_idx" ON "product_page_blocks_launches" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_products_projects_tags_order_idx" ON "product_page_blocks_products_projects_tags" USING btree ("_order");
  CREATE INDEX "product_page_blocks_products_projects_tags_parent_id_idx" ON "product_page_blocks_products_projects_tags" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_products_projects_tags_locale_idx" ON "product_page_blocks_products_projects_tags" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_products_projects_order_idx" ON "product_page_blocks_products_projects" USING btree ("_order");
  CREATE INDEX "product_page_blocks_products_projects_parent_id_idx" ON "product_page_blocks_products_projects" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_products_projects_locale_idx" ON "product_page_blocks_products_projects" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_products_projects_product_idx" ON "product_page_blocks_products_projects" USING btree ("product_id");
  CREATE INDEX "product_page_blocks_products_order_idx" ON "product_page_blocks_products" USING btree ("_order");
  CREATE INDEX "product_page_blocks_products_parent_id_idx" ON "product_page_blocks_products" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_products_path_idx" ON "product_page_blocks_products" USING btree ("_path");
  CREATE INDEX "product_page_blocks_products_locale_idx" ON "product_page_blocks_products" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_related_articles_order_idx" ON "product_page_blocks_related_articles" USING btree ("_order");
  CREATE INDEX "product_page_blocks_related_articles_parent_id_idx" ON "product_page_blocks_related_articles" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_related_articles_path_idx" ON "product_page_blocks_related_articles" USING btree ("_path");
  CREATE INDEX "product_page_blocks_related_articles_locale_idx" ON "product_page_blocks_related_articles" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_related_products_order_idx" ON "product_page_blocks_related_products" USING btree ("_order");
  CREATE INDEX "product_page_blocks_related_products_parent_id_idx" ON "product_page_blocks_related_products" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_related_products_path_idx" ON "product_page_blocks_related_products" USING btree ("_path");
  CREATE INDEX "product_page_blocks_related_products_locale_idx" ON "product_page_blocks_related_products" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_why_choose_us_cards_order_idx" ON "product_page_blocks_why_choose_us_cards" USING btree ("_order");
  CREATE INDEX "product_page_blocks_why_choose_us_cards_parent_id_idx" ON "product_page_blocks_why_choose_us_cards" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_why_choose_us_cards_locale_idx" ON "product_page_blocks_why_choose_us_cards" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_why_choose_us_order_idx" ON "product_page_blocks_why_choose_us" USING btree ("_order");
  CREATE INDEX "product_page_blocks_why_choose_us_parent_id_idx" ON "product_page_blocks_why_choose_us" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_why_choose_us_path_idx" ON "product_page_blocks_why_choose_us" USING btree ("_path");
  CREATE INDEX "product_page_blocks_why_choose_us_locale_idx" ON "product_page_blocks_why_choose_us" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_form_section_form_inputs_order_idx" ON "product_page_blocks_form_section_form_inputs" USING btree ("_order");
  CREATE INDEX "product_page_blocks_form_section_form_inputs_parent_id_idx" ON "product_page_blocks_form_section_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_form_section_form_inputs_locale_idx" ON "product_page_blocks_form_section_form_inputs" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_form_section_section_users_order_idx" ON "product_page_blocks_form_section_section_users" USING btree ("_order");
  CREATE INDEX "product_page_blocks_form_section_section_users_parent_id_idx" ON "product_page_blocks_form_section_section_users" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_form_section_section_users_locale_idx" ON "product_page_blocks_form_section_section_users" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_form_section_section_users_image_idx" ON "product_page_blocks_form_section_section_users" USING btree ("image_id");
  CREATE INDEX "product_page_blocks_form_section_benefits_order_idx" ON "product_page_blocks_form_section_benefits" USING btree ("_order");
  CREATE INDEX "product_page_blocks_form_section_benefits_parent_id_idx" ON "product_page_blocks_form_section_benefits" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_form_section_benefits_locale_idx" ON "product_page_blocks_form_section_benefits" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_form_section_policy_links_order_idx" ON "product_page_blocks_form_section_policy_links" USING btree ("_order");
  CREATE INDEX "product_page_blocks_form_section_policy_links_parent_id_idx" ON "product_page_blocks_form_section_policy_links" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_form_section_policy_links_locale_idx" ON "product_page_blocks_form_section_policy_links" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_form_section_social_links_links_order_idx" ON "product_page_blocks_form_section_social_links_links" USING btree ("_order");
  CREATE INDEX "product_page_blocks_form_section_social_links_links_parent_id_idx" ON "product_page_blocks_form_section_social_links_links" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_form_section_social_links_links_locale_idx" ON "product_page_blocks_form_section_social_links_links" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_form_section_social_links_order_idx" ON "product_page_blocks_form_section_social_links" USING btree ("_order");
  CREATE INDEX "product_page_blocks_form_section_social_links_parent_id_idx" ON "product_page_blocks_form_section_social_links" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_form_section_social_links_locale_idx" ON "product_page_blocks_form_section_social_links" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_form_section_social_links_image_idx" ON "product_page_blocks_form_section_social_links" USING btree ("image_id");
  CREATE INDEX "product_page_blocks_form_section_order_idx" ON "product_page_blocks_form_section" USING btree ("_order");
  CREATE INDEX "product_page_blocks_form_section_parent_id_idx" ON "product_page_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX "product_page_blocks_form_section_path_idx" ON "product_page_blocks_form_section" USING btree ("_path");
  CREATE INDEX "product_page_blocks_form_section_locale_idx" ON "product_page_blocks_form_section" USING btree ("_locale");
  CREATE INDEX "product_page_blocks_form_section_video_idx" ON "product_page_blocks_form_section" USING btree ("video_id");
  CREATE INDEX "product_page_blocks_form_section_person_person_image_idx" ON "product_page_blocks_form_section" USING btree ("person_image_id");
  CREATE INDEX "product_page_updated_at_idx" ON "product_page" USING btree ("updated_at");
  CREATE INDEX "product_page_created_at_idx" ON "product_page" USING btree ("created_at");
  CREATE INDEX "product_page_seo_seo_meta_image_idx" ON "product_page_locales" USING btree ("seo_meta_image_id");
  CREATE UNIQUE INDEX "product_page_locales_locale_parent_id_unique" ON "product_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "product_page_rels_order_idx" ON "product_page_rels" USING btree ("order");
  CREATE INDEX "product_page_rels_parent_idx" ON "product_page_rels" USING btree ("parent_id");
  CREATE INDEX "product_page_rels_path_idx" ON "product_page_rels" USING btree ("path");
  CREATE INDEX "product_page_rels_locale_idx" ON "product_page_rels" USING btree ("locale");
  CREATE INDEX "product_page_rels_testimonials_id_idx" ON "product_page_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "product_page_rels_faqs_id_idx" ON "product_page_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "product_page_rels_media_id_idx" ON "product_page_rels" USING btree ("media_id","locale");
  CREATE INDEX "product_page_rels_plans_id_idx" ON "product_page_rels" USING btree ("plans_id","locale");
  CREATE INDEX "product_page_rels_logos_id_idx" ON "product_page_rels" USING btree ("logos_id","locale");
  CREATE INDEX "product_page_rels_articles_id_idx" ON "product_page_rels" USING btree ("articles_id","locale");
  CREATE INDEX "product_page_rels_products_id_idx" ON "product_page_rels" USING btree ("products_id","locale");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("contacts_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_logos_id_idx" ON "payload_locked_documents_rels" USING btree ("logos_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_newsletters_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletters_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("plans_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_redirections_id_idx" ON "payload_locked_documents_rels" USING btree ("redirections_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_blog_page_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_page_id");
  CREATE INDEX "payload_locked_documents_rels_product_page_id_idx" ON "payload_locked_documents_rels" USING btree ("product_page_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "global_navbar_left_navbar_items_order_idx" ON "global_navbar_left_navbar_items" USING btree ("_order");
  CREATE INDEX "global_navbar_left_navbar_items_parent_id_idx" ON "global_navbar_left_navbar_items" USING btree ("_parent_id");
  CREATE INDEX "global_navbar_right_navbar_items_order_idx" ON "global_navbar_right_navbar_items" USING btree ("_order");
  CREATE INDEX "global_navbar_right_navbar_items_parent_id_idx" ON "global_navbar_right_navbar_items" USING btree ("_parent_id");
  CREATE INDEX "global_navbar_policy_order_idx" ON "global_navbar_policy" USING btree ("_order");
  CREATE INDEX "global_navbar_policy_parent_id_idx" ON "global_navbar_policy" USING btree ("_parent_id");
  CREATE INDEX "global_footer_internal_links_order_idx" ON "global_footer_internal_links" USING btree ("_order");
  CREATE INDEX "global_footer_internal_links_parent_id_idx" ON "global_footer_internal_links" USING btree ("_parent_id");
  CREATE INDEX "global_footer_policy_links_order_idx" ON "global_footer_policy_links" USING btree ("_order");
  CREATE INDEX "global_footer_policy_links_parent_id_idx" ON "global_footer_policy_links" USING btree ("_parent_id");
  CREATE INDEX "global_footer_social_media_links_order_idx" ON "global_footer_social_media_links" USING btree ("_order");
  CREATE INDEX "global_footer_social_media_links_parent_id_idx" ON "global_footer_social_media_links" USING btree ("_parent_id");
  CREATE INDEX "global_navbar_navbar_logo_idx" ON "global" USING btree ("navbar_logo_id");
  CREATE INDEX "global_footer_footer_logo_idx" ON "global" USING btree ("footer_logo_id");
  CREATE INDEX "global_footer_footer_profile_idx" ON "global" USING btree ("footer_profile_id");
  CREATE INDEX "global_seo_seo_meta_image_idx" ON "global_locales" USING btree ("seo_meta_image_id");
  CREATE UNIQUE INDEX "global_locales_locale_parent_id_unique" ON "global_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "service_blocks_hero_c_t_as_order_idx" ON "service_blocks_hero_c_t_as" USING btree ("_order");
  CREATE INDEX "service_blocks_hero_c_t_as_parent_id_idx" ON "service_blocks_hero_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_hero_services_order_idx" ON "service_blocks_hero_services" USING btree ("_order");
  CREATE INDEX "service_blocks_hero_services_parent_id_idx" ON "service_blocks_hero_services" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_hero_order_idx" ON "service_blocks_hero" USING btree ("_order");
  CREATE INDEX "service_blocks_hero_parent_id_idx" ON "service_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_hero_path_idx" ON "service_blocks_hero" USING btree ("_path");
  CREATE INDEX "service_blocks_hero_video_idx" ON "service_blocks_hero" USING btree ("video_id");
  CREATE INDEX "service_blocks_hero_video_poster_idx" ON "service_blocks_hero" USING btree ("video_poster_id");
  CREATE INDEX "service_blocks_hero_person_person_image_idx" ON "service_blocks_hero" USING btree ("person_image_id");
  CREATE INDEX "service_blocks_features_ray_card_items_order_idx" ON "service_blocks_features_ray_card_items" USING btree ("_order");
  CREATE INDEX "service_blocks_features_ray_card_items_parent_id_idx" ON "service_blocks_features_ray_card_items" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_features_graph_card_top_items_order_idx" ON "service_blocks_features_graph_card_top_items" USING btree ("_order");
  CREATE INDEX "service_blocks_features_graph_card_top_items_parent_id_idx" ON "service_blocks_features_graph_card_top_items" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_features_order_idx" ON "service_blocks_features" USING btree ("_order");
  CREATE INDEX "service_blocks_features_parent_id_idx" ON "service_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_features_path_idx" ON "service_blocks_features" USING btree ("_path");
  CREATE INDEX "service_blocks_testimonials_order_idx" ON "service_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "service_blocks_testimonials_parent_id_idx" ON "service_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_testimonials_path_idx" ON "service_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "service_blocks_faq_order_idx" ON "service_blocks_faq" USING btree ("_order");
  CREATE INDEX "service_blocks_faq_parent_id_idx" ON "service_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_faq_path_idx" ON "service_blocks_faq" USING btree ("_path");
  CREATE INDEX "service_blocks_cta_c_t_as_order_idx" ON "service_blocks_cta_c_t_as" USING btree ("_order");
  CREATE INDEX "service_blocks_cta_c_t_as_parent_id_idx" ON "service_blocks_cta_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_cta_c_t_as_locale_idx" ON "service_blocks_cta_c_t_as" USING btree ("_locale");
  CREATE INDEX "service_blocks_cta_order_idx" ON "service_blocks_cta" USING btree ("_order");
  CREATE INDEX "service_blocks_cta_parent_id_idx" ON "service_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_cta_path_idx" ON "service_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "service_blocks_cta_locales_locale_parent_id_unique" ON "service_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "service_blocks_pricing_order_idx" ON "service_blocks_pricing" USING btree ("_order");
  CREATE INDEX "service_blocks_pricing_parent_id_idx" ON "service_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_pricing_path_idx" ON "service_blocks_pricing" USING btree ("_path");
  CREATE INDEX "service_blocks_pricing_profile_image_idx" ON "service_blocks_pricing" USING btree ("profile_image_id");
  CREATE INDEX "service_blocks_pricing_background_idx" ON "service_blocks_pricing" USING btree ("background_id");
  CREATE INDEX "service_blocks_how_it_works_steps_order_idx" ON "service_blocks_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "service_blocks_how_it_works_steps_parent_id_idx" ON "service_blocks_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_how_it_works_steps_image_idx" ON "service_blocks_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "service_blocks_how_it_works_order_idx" ON "service_blocks_how_it_works" USING btree ("_order");
  CREATE INDEX "service_blocks_how_it_works_parent_id_idx" ON "service_blocks_how_it_works" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_how_it_works_path_idx" ON "service_blocks_how_it_works" USING btree ("_path");
  CREATE INDEX "service_blocks_how_it_works_video_idx" ON "service_blocks_how_it_works" USING btree ("video_id");
  CREATE INDEX "service_blocks_services_elements_service_item_order_idx" ON "service_blocks_services_elements_service_item" USING btree ("_order");
  CREATE INDEX "service_blocks_services_elements_service_item_parent_id_idx" ON "service_blocks_services_elements_service_item" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_services_order_idx" ON "service_blocks_services" USING btree ("_order");
  CREATE INDEX "service_blocks_services_parent_id_idx" ON "service_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_services_path_idx" ON "service_blocks_services" USING btree ("_path");
  CREATE INDEX "service_blocks_services_background_idx" ON "service_blocks_services" USING btree ("background_id");
  CREATE INDEX "service_blocks_brands_order_idx" ON "service_blocks_brands" USING btree ("_order");
  CREATE INDEX "service_blocks_brands_parent_id_idx" ON "service_blocks_brands" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_brands_path_idx" ON "service_blocks_brands" USING btree ("_path");
  CREATE INDEX "service_blocks_blog_order_idx" ON "service_blocks_blog" USING btree ("_order");
  CREATE INDEX "service_blocks_blog_parent_id_idx" ON "service_blocks_blog" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_blog_path_idx" ON "service_blocks_blog" USING btree ("_path");
  CREATE INDEX "service_blocks_blog_highlight_image_idx" ON "service_blocks_blog" USING btree ("highlight_image_id");
  CREATE INDEX "service_blocks_newsletter_form_inputs_order_idx" ON "service_blocks_newsletter_form_inputs" USING btree ("_order");
  CREATE INDEX "service_blocks_newsletter_form_inputs_parent_id_idx" ON "service_blocks_newsletter_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_newsletter_order_idx" ON "service_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "service_blocks_newsletter_parent_id_idx" ON "service_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_newsletter_path_idx" ON "service_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "service_blocks_newsletter_profile_image_idx" ON "service_blocks_newsletter" USING btree ("profile_image_id");
  CREATE INDEX "service_blocks_launches_launches_order_idx" ON "service_blocks_launches_launches" USING btree ("_order");
  CREATE INDEX "service_blocks_launches_launches_parent_id_idx" ON "service_blocks_launches_launches" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_launches_order_idx" ON "service_blocks_launches" USING btree ("_order");
  CREATE INDEX "service_blocks_launches_parent_id_idx" ON "service_blocks_launches" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_launches_path_idx" ON "service_blocks_launches" USING btree ("_path");
  CREATE INDEX "service_blocks_products_projects_tags_order_idx" ON "service_blocks_products_projects_tags" USING btree ("_order");
  CREATE INDEX "service_blocks_products_projects_tags_parent_id_idx" ON "service_blocks_products_projects_tags" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_products_projects_order_idx" ON "service_blocks_products_projects" USING btree ("_order");
  CREATE INDEX "service_blocks_products_projects_parent_id_idx" ON "service_blocks_products_projects" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_products_projects_product_idx" ON "service_blocks_products_projects" USING btree ("product_id");
  CREATE INDEX "service_blocks_products_order_idx" ON "service_blocks_products" USING btree ("_order");
  CREATE INDEX "service_blocks_products_parent_id_idx" ON "service_blocks_products" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_products_path_idx" ON "service_blocks_products" USING btree ("_path");
  CREATE INDEX "service_blocks_related_articles_order_idx" ON "service_blocks_related_articles" USING btree ("_order");
  CREATE INDEX "service_blocks_related_articles_parent_id_idx" ON "service_blocks_related_articles" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_related_articles_path_idx" ON "service_blocks_related_articles" USING btree ("_path");
  CREATE UNIQUE INDEX "service_blocks_related_articles_locales_locale_parent_id_uni" ON "service_blocks_related_articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "service_blocks_related_products_order_idx" ON "service_blocks_related_products" USING btree ("_order");
  CREATE INDEX "service_blocks_related_products_parent_id_idx" ON "service_blocks_related_products" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_related_products_path_idx" ON "service_blocks_related_products" USING btree ("_path");
  CREATE INDEX "service_blocks_why_choose_us_cards_order_idx" ON "service_blocks_why_choose_us_cards" USING btree ("_order");
  CREATE INDEX "service_blocks_why_choose_us_cards_parent_id_idx" ON "service_blocks_why_choose_us_cards" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_why_choose_us_order_idx" ON "service_blocks_why_choose_us" USING btree ("_order");
  CREATE INDEX "service_blocks_why_choose_us_parent_id_idx" ON "service_blocks_why_choose_us" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_why_choose_us_path_idx" ON "service_blocks_why_choose_us" USING btree ("_path");
  CREATE INDEX "service_blocks_form_section_form_inputs_order_idx" ON "service_blocks_form_section_form_inputs" USING btree ("_order");
  CREATE INDEX "service_blocks_form_section_form_inputs_parent_id_idx" ON "service_blocks_form_section_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_form_section_section_users_order_idx" ON "service_blocks_form_section_section_users" USING btree ("_order");
  CREATE INDEX "service_blocks_form_section_section_users_parent_id_idx" ON "service_blocks_form_section_section_users" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_form_section_section_users_image_idx" ON "service_blocks_form_section_section_users" USING btree ("image_id");
  CREATE INDEX "service_blocks_form_section_benefits_order_idx" ON "service_blocks_form_section_benefits" USING btree ("_order");
  CREATE INDEX "service_blocks_form_section_benefits_parent_id_idx" ON "service_blocks_form_section_benefits" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_form_section_policy_links_order_idx" ON "service_blocks_form_section_policy_links" USING btree ("_order");
  CREATE INDEX "service_blocks_form_section_policy_links_parent_id_idx" ON "service_blocks_form_section_policy_links" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_form_section_social_links_links_order_idx" ON "service_blocks_form_section_social_links_links" USING btree ("_order");
  CREATE INDEX "service_blocks_form_section_social_links_links_parent_id_idx" ON "service_blocks_form_section_social_links_links" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_form_section_social_links_order_idx" ON "service_blocks_form_section_social_links" USING btree ("_order");
  CREATE INDEX "service_blocks_form_section_social_links_parent_id_idx" ON "service_blocks_form_section_social_links" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_form_section_social_links_image_idx" ON "service_blocks_form_section_social_links" USING btree ("image_id");
  CREATE INDEX "service_blocks_form_section_order_idx" ON "service_blocks_form_section" USING btree ("_order");
  CREATE INDEX "service_blocks_form_section_parent_id_idx" ON "service_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX "service_blocks_form_section_path_idx" ON "service_blocks_form_section" USING btree ("_path");
  CREATE INDEX "service_blocks_form_section_video_idx" ON "service_blocks_form_section" USING btree ("video_id");
  CREATE INDEX "service_blocks_form_section_person_person_image_idx" ON "service_blocks_form_section" USING btree ("person_image_id");
  CREATE INDEX "service__status_idx" ON "service" USING btree ("_status");
  CREATE INDEX "service_seo_seo_meta_image_idx" ON "service_locales" USING btree ("seo_meta_image_id");
  CREATE UNIQUE INDEX "service_locales_locale_parent_id_unique" ON "service_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "service_rels_order_idx" ON "service_rels" USING btree ("order");
  CREATE INDEX "service_rels_parent_idx" ON "service_rels" USING btree ("parent_id");
  CREATE INDEX "service_rels_path_idx" ON "service_rels" USING btree ("path");
  CREATE INDEX "service_rels_locale_idx" ON "service_rels" USING btree ("locale");
  CREATE INDEX "service_rels_pages_id_idx" ON "service_rels" USING btree ("pages_id","locale");
  CREATE INDEX "service_rels_testimonials_id_idx" ON "service_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "service_rels_faqs_id_idx" ON "service_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "service_rels_media_id_idx" ON "service_rels" USING btree ("media_id","locale");
  CREATE INDEX "service_rels_plans_id_idx" ON "service_rels" USING btree ("plans_id","locale");
  CREATE INDEX "service_rels_logos_id_idx" ON "service_rels" USING btree ("logos_id","locale");
  CREATE INDEX "service_rels_articles_id_idx" ON "service_rels" USING btree ("articles_id","locale");
  CREATE INDEX "service_rels_products_id_idx" ON "service_rels" USING btree ("products_id","locale");
  CREATE INDEX "_service_v_blocks_hero_c_t_as_order_idx" ON "_service_v_blocks_hero_c_t_as" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_hero_c_t_as_parent_id_idx" ON "_service_v_blocks_hero_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_hero_services_order_idx" ON "_service_v_blocks_hero_services" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_hero_services_parent_id_idx" ON "_service_v_blocks_hero_services" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_hero_order_idx" ON "_service_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_hero_parent_id_idx" ON "_service_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_hero_path_idx" ON "_service_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_hero_video_idx" ON "_service_v_blocks_hero" USING btree ("video_id");
  CREATE INDEX "_service_v_blocks_hero_video_poster_idx" ON "_service_v_blocks_hero" USING btree ("video_poster_id");
  CREATE INDEX "_service_v_blocks_hero_person_person_image_idx" ON "_service_v_blocks_hero" USING btree ("person_image_id");
  CREATE INDEX "_service_v_blocks_features_ray_card_items_order_idx" ON "_service_v_blocks_features_ray_card_items" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_features_ray_card_items_parent_id_idx" ON "_service_v_blocks_features_ray_card_items" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_features_graph_card_top_items_order_idx" ON "_service_v_blocks_features_graph_card_top_items" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_features_graph_card_top_items_parent_id_idx" ON "_service_v_blocks_features_graph_card_top_items" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_features_order_idx" ON "_service_v_blocks_features" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_features_parent_id_idx" ON "_service_v_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_features_path_idx" ON "_service_v_blocks_features" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_testimonials_order_idx" ON "_service_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_testimonials_parent_id_idx" ON "_service_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_testimonials_path_idx" ON "_service_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_faq_order_idx" ON "_service_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_faq_parent_id_idx" ON "_service_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_faq_path_idx" ON "_service_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_cta_c_t_as_order_idx" ON "_service_v_blocks_cta_c_t_as" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_cta_c_t_as_parent_id_idx" ON "_service_v_blocks_cta_c_t_as" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_cta_c_t_as_locale_idx" ON "_service_v_blocks_cta_c_t_as" USING btree ("_locale");
  CREATE INDEX "_service_v_blocks_cta_order_idx" ON "_service_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_cta_parent_id_idx" ON "_service_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_cta_path_idx" ON "_service_v_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_service_v_blocks_cta_locales_locale_parent_id_unique" ON "_service_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_service_v_blocks_pricing_order_idx" ON "_service_v_blocks_pricing" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_pricing_parent_id_idx" ON "_service_v_blocks_pricing" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_pricing_path_idx" ON "_service_v_blocks_pricing" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_pricing_profile_image_idx" ON "_service_v_blocks_pricing" USING btree ("profile_image_id");
  CREATE INDEX "_service_v_blocks_pricing_background_idx" ON "_service_v_blocks_pricing" USING btree ("background_id");
  CREATE INDEX "_service_v_blocks_how_it_works_steps_order_idx" ON "_service_v_blocks_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_how_it_works_steps_parent_id_idx" ON "_service_v_blocks_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_how_it_works_steps_image_idx" ON "_service_v_blocks_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "_service_v_blocks_how_it_works_order_idx" ON "_service_v_blocks_how_it_works" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_how_it_works_parent_id_idx" ON "_service_v_blocks_how_it_works" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_how_it_works_path_idx" ON "_service_v_blocks_how_it_works" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_how_it_works_video_idx" ON "_service_v_blocks_how_it_works" USING btree ("video_id");
  CREATE INDEX "_service_v_blocks_services_elements_service_item_order_idx" ON "_service_v_blocks_services_elements_service_item" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_services_elements_service_item_parent_id_idx" ON "_service_v_blocks_services_elements_service_item" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_services_order_idx" ON "_service_v_blocks_services" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_services_parent_id_idx" ON "_service_v_blocks_services" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_services_path_idx" ON "_service_v_blocks_services" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_services_background_idx" ON "_service_v_blocks_services" USING btree ("background_id");
  CREATE INDEX "_service_v_blocks_brands_order_idx" ON "_service_v_blocks_brands" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_brands_parent_id_idx" ON "_service_v_blocks_brands" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_brands_path_idx" ON "_service_v_blocks_brands" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_blog_order_idx" ON "_service_v_blocks_blog" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_blog_parent_id_idx" ON "_service_v_blocks_blog" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_blog_path_idx" ON "_service_v_blocks_blog" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_blog_highlight_image_idx" ON "_service_v_blocks_blog" USING btree ("highlight_image_id");
  CREATE INDEX "_service_v_blocks_newsletter_form_inputs_order_idx" ON "_service_v_blocks_newsletter_form_inputs" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_newsletter_form_inputs_parent_id_idx" ON "_service_v_blocks_newsletter_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_newsletter_order_idx" ON "_service_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_newsletter_parent_id_idx" ON "_service_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_newsletter_path_idx" ON "_service_v_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_newsletter_profile_image_idx" ON "_service_v_blocks_newsletter" USING btree ("profile_image_id");
  CREATE INDEX "_service_v_blocks_launches_launches_order_idx" ON "_service_v_blocks_launches_launches" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_launches_launches_parent_id_idx" ON "_service_v_blocks_launches_launches" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_launches_order_idx" ON "_service_v_blocks_launches" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_launches_parent_id_idx" ON "_service_v_blocks_launches" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_launches_path_idx" ON "_service_v_blocks_launches" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_products_projects_tags_order_idx" ON "_service_v_blocks_products_projects_tags" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_products_projects_tags_parent_id_idx" ON "_service_v_blocks_products_projects_tags" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_products_projects_order_idx" ON "_service_v_blocks_products_projects" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_products_projects_parent_id_idx" ON "_service_v_blocks_products_projects" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_products_projects_product_idx" ON "_service_v_blocks_products_projects" USING btree ("product_id");
  CREATE INDEX "_service_v_blocks_products_order_idx" ON "_service_v_blocks_products" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_products_parent_id_idx" ON "_service_v_blocks_products" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_products_path_idx" ON "_service_v_blocks_products" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_related_articles_order_idx" ON "_service_v_blocks_related_articles" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_related_articles_parent_id_idx" ON "_service_v_blocks_related_articles" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_related_articles_path_idx" ON "_service_v_blocks_related_articles" USING btree ("_path");
  CREATE UNIQUE INDEX "_service_v_blocks_related_articles_locales_locale_parent_id_" ON "_service_v_blocks_related_articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_service_v_blocks_related_products_order_idx" ON "_service_v_blocks_related_products" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_related_products_parent_id_idx" ON "_service_v_blocks_related_products" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_related_products_path_idx" ON "_service_v_blocks_related_products" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_why_choose_us_cards_order_idx" ON "_service_v_blocks_why_choose_us_cards" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_why_choose_us_cards_parent_id_idx" ON "_service_v_blocks_why_choose_us_cards" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_why_choose_us_order_idx" ON "_service_v_blocks_why_choose_us" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_why_choose_us_parent_id_idx" ON "_service_v_blocks_why_choose_us" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_why_choose_us_path_idx" ON "_service_v_blocks_why_choose_us" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_form_section_form_inputs_order_idx" ON "_service_v_blocks_form_section_form_inputs" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_form_section_form_inputs_parent_id_idx" ON "_service_v_blocks_form_section_form_inputs" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_form_section_section_users_order_idx" ON "_service_v_blocks_form_section_section_users" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_form_section_section_users_parent_id_idx" ON "_service_v_blocks_form_section_section_users" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_form_section_section_users_image_idx" ON "_service_v_blocks_form_section_section_users" USING btree ("image_id");
  CREATE INDEX "_service_v_blocks_form_section_benefits_order_idx" ON "_service_v_blocks_form_section_benefits" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_form_section_benefits_parent_id_idx" ON "_service_v_blocks_form_section_benefits" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_form_section_policy_links_order_idx" ON "_service_v_blocks_form_section_policy_links" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_form_section_policy_links_parent_id_idx" ON "_service_v_blocks_form_section_policy_links" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_form_section_social_links_links_order_idx" ON "_service_v_blocks_form_section_social_links_links" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_form_section_social_links_links_parent_id_idx" ON "_service_v_blocks_form_section_social_links_links" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_form_section_social_links_order_idx" ON "_service_v_blocks_form_section_social_links" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_form_section_social_links_parent_id_idx" ON "_service_v_blocks_form_section_social_links" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_form_section_social_links_image_idx" ON "_service_v_blocks_form_section_social_links" USING btree ("image_id");
  CREATE INDEX "_service_v_blocks_form_section_order_idx" ON "_service_v_blocks_form_section" USING btree ("_order");
  CREATE INDEX "_service_v_blocks_form_section_parent_id_idx" ON "_service_v_blocks_form_section" USING btree ("_parent_id");
  CREATE INDEX "_service_v_blocks_form_section_path_idx" ON "_service_v_blocks_form_section" USING btree ("_path");
  CREATE INDEX "_service_v_blocks_form_section_video_idx" ON "_service_v_blocks_form_section" USING btree ("video_id");
  CREATE INDEX "_service_v_blocks_form_section_person_person_image_idx" ON "_service_v_blocks_form_section" USING btree ("person_image_id");
  CREATE INDEX "_service_v_version_version__status_idx" ON "_service_v" USING btree ("version__status");
  CREATE INDEX "_service_v_created_at_idx" ON "_service_v" USING btree ("created_at");
  CREATE INDEX "_service_v_updated_at_idx" ON "_service_v" USING btree ("updated_at");
  CREATE INDEX "_service_v_snapshot_idx" ON "_service_v" USING btree ("snapshot");
  CREATE INDEX "_service_v_published_locale_idx" ON "_service_v" USING btree ("published_locale");
  CREATE INDEX "_service_v_latest_idx" ON "_service_v" USING btree ("latest");
  CREATE INDEX "_service_v_version_seo_version_seo_meta_image_idx" ON "_service_v_locales" USING btree ("version_seo_meta_image_id");
  CREATE UNIQUE INDEX "_service_v_locales_locale_parent_id_unique" ON "_service_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_service_v_rels_order_idx" ON "_service_v_rels" USING btree ("order");
  CREATE INDEX "_service_v_rels_parent_idx" ON "_service_v_rels" USING btree ("parent_id");
  CREATE INDEX "_service_v_rels_path_idx" ON "_service_v_rels" USING btree ("path");
  CREATE INDEX "_service_v_rels_locale_idx" ON "_service_v_rels" USING btree ("locale");
  CREATE INDEX "_service_v_rels_pages_id_idx" ON "_service_v_rels" USING btree ("pages_id","locale");
  CREATE INDEX "_service_v_rels_testimonials_id_idx" ON "_service_v_rels" USING btree ("testimonials_id","locale");
  CREATE INDEX "_service_v_rels_faqs_id_idx" ON "_service_v_rels" USING btree ("faqs_id","locale");
  CREATE INDEX "_service_v_rels_media_id_idx" ON "_service_v_rels" USING btree ("media_id","locale");
  CREATE INDEX "_service_v_rels_plans_id_idx" ON "_service_v_rels" USING btree ("plans_id","locale");
  CREATE INDEX "_service_v_rels_logos_id_idx" ON "_service_v_rels" USING btree ("logos_id","locale");
  CREATE INDEX "_service_v_rels_articles_id_idx" ON "_service_v_rels" USING btree ("articles_id","locale");
  CREATE INDEX "_service_v_rels_products_id_idx" ON "_service_v_rels" USING btree ("products_id","locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "articles_blocks_cta_c_t_as" CASCADE;
  DROP TABLE "articles_blocks_cta" CASCADE;
  DROP TABLE "articles_blocks_cta_locales" CASCADE;
  DROP TABLE "articles_blocks_related_articles" CASCADE;
  DROP TABLE "articles_blocks_related_articles_locales" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v_blocks_cta_c_t_as" CASCADE;
  DROP TABLE "_articles_v_blocks_cta" CASCADE;
  DROP TABLE "_articles_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_articles_v_blocks_related_articles" CASCADE;
  DROP TABLE "_articles_v_blocks_related_articles_locales" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_rels" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TABLE "_contacts_v" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "logos" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "newsletters" CASCADE;
  DROP TABLE "pages_blocks_hero_c_t_as" CASCADE;
  DROP TABLE "pages_blocks_hero_services" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_features_ray_card_items" CASCADE;
  DROP TABLE "pages_blocks_features_graph_card_top_items" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_cta_c_t_as" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_pricing" CASCADE;
  DROP TABLE "pages_blocks_how_it_works_steps" CASCADE;
  DROP TABLE "pages_blocks_how_it_works" CASCADE;
  DROP TABLE "pages_blocks_services_elements_service_item" CASCADE;
  DROP TABLE "pages_blocks_services" CASCADE;
  DROP TABLE "pages_blocks_brands" CASCADE;
  DROP TABLE "pages_blocks_blog" CASCADE;
  DROP TABLE "pages_blocks_newsletter_form_inputs" CASCADE;
  DROP TABLE "pages_blocks_newsletter" CASCADE;
  DROP TABLE "pages_blocks_launches_launches" CASCADE;
  DROP TABLE "pages_blocks_launches" CASCADE;
  DROP TABLE "pages_blocks_products_projects_tags" CASCADE;
  DROP TABLE "pages_blocks_products_projects" CASCADE;
  DROP TABLE "pages_blocks_products" CASCADE;
  DROP TABLE "pages_blocks_related_articles" CASCADE;
  DROP TABLE "pages_blocks_related_products" CASCADE;
  DROP TABLE "pages_blocks_why_choose_us_cards" CASCADE;
  DROP TABLE "pages_blocks_why_choose_us" CASCADE;
  DROP TABLE "pages_blocks_form_section_form_inputs" CASCADE;
  DROP TABLE "pages_blocks_form_section_section_users" CASCADE;
  DROP TABLE "pages_blocks_form_section_benefits" CASCADE;
  DROP TABLE "pages_blocks_form_section_policy_links" CASCADE;
  DROP TABLE "pages_blocks_form_section_social_links_links" CASCADE;
  DROP TABLE "pages_blocks_form_section_social_links" CASCADE;
  DROP TABLE "pages_blocks_form_section" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_c_t_as" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_services" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_features_ray_card_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features_graph_card_top_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_c_t_as" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing" CASCADE;
  DROP TABLE "_pages_v_blocks_how_it_works_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_how_it_works" CASCADE;
  DROP TABLE "_pages_v_blocks_services_elements_service_item" CASCADE;
  DROP TABLE "_pages_v_blocks_services" CASCADE;
  DROP TABLE "_pages_v_blocks_brands" CASCADE;
  DROP TABLE "_pages_v_blocks_blog" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter_form_inputs" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter" CASCADE;
  DROP TABLE "_pages_v_blocks_launches_launches" CASCADE;
  DROP TABLE "_pages_v_blocks_launches" CASCADE;
  DROP TABLE "_pages_v_blocks_products_projects_tags" CASCADE;
  DROP TABLE "_pages_v_blocks_products_projects" CASCADE;
  DROP TABLE "_pages_v_blocks_products" CASCADE;
  DROP TABLE "_pages_v_blocks_related_articles" CASCADE;
  DROP TABLE "_pages_v_blocks_related_products" CASCADE;
  DROP TABLE "_pages_v_blocks_why_choose_us_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_why_choose_us" CASCADE;
  DROP TABLE "_pages_v_blocks_form_section_form_inputs" CASCADE;
  DROP TABLE "_pages_v_blocks_form_section_section_users" CASCADE;
  DROP TABLE "_pages_v_blocks_form_section_benefits" CASCADE;
  DROP TABLE "_pages_v_blocks_form_section_policy_links" CASCADE;
  DROP TABLE "_pages_v_blocks_form_section_social_links_links" CASCADE;
  DROP TABLE "_pages_v_blocks_form_section_social_links" CASCADE;
  DROP TABLE "_pages_v_blocks_form_section" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "plans_perks" CASCADE;
  DROP TABLE "plans_additional_perks" CASCADE;
  DROP TABLE "plans" CASCADE;
  DROP TABLE "plans_locales" CASCADE;
  DROP TABLE "_plans_v_version_perks" CASCADE;
  DROP TABLE "_plans_v_version_additional_perks" CASCADE;
  DROP TABLE "_plans_v" CASCADE;
  DROP TABLE "_plans_v_locales" CASCADE;
  DROP TABLE "products_perks" CASCADE;
  DROP TABLE "products_blocks_related_products" CASCADE;
  DROP TABLE "products_blocks_cta_c_t_as" CASCADE;
  DROP TABLE "products_blocks_cta" CASCADE;
  DROP TABLE "products_blocks_cta_locales" CASCADE;
  DROP TABLE "products_blocks_testimonials" CASCADE;
  DROP TABLE "products_blocks_form_section_form_inputs" CASCADE;
  DROP TABLE "products_blocks_form_section_section_users" CASCADE;
  DROP TABLE "products_blocks_form_section_benefits" CASCADE;
  DROP TABLE "products_blocks_form_section_policy_links" CASCADE;
  DROP TABLE "products_blocks_form_section_social_links_links" CASCADE;
  DROP TABLE "products_blocks_form_section_social_links" CASCADE;
  DROP TABLE "products_blocks_form_section" CASCADE;
  DROP TABLE "products_blocks_newsletter_form_inputs" CASCADE;
  DROP TABLE "products_blocks_newsletter" CASCADE;
  DROP TABLE "products_blocks_faq" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_perks" CASCADE;
  DROP TABLE "_products_v_blocks_related_products" CASCADE;
  DROP TABLE "_products_v_blocks_cta_c_t_as" CASCADE;
  DROP TABLE "_products_v_blocks_cta" CASCADE;
  DROP TABLE "_products_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_products_v_blocks_testimonials" CASCADE;
  DROP TABLE "_products_v_blocks_form_section_form_inputs" CASCADE;
  DROP TABLE "_products_v_blocks_form_section_section_users" CASCADE;
  DROP TABLE "_products_v_blocks_form_section_benefits" CASCADE;
  DROP TABLE "_products_v_blocks_form_section_policy_links" CASCADE;
  DROP TABLE "_products_v_blocks_form_section_social_links_links" CASCADE;
  DROP TABLE "_products_v_blocks_form_section_social_links" CASCADE;
  DROP TABLE "_products_v_blocks_form_section" CASCADE;
  DROP TABLE "_products_v_blocks_newsletter_form_inputs" CASCADE;
  DROP TABLE "_products_v_blocks_newsletter" CASCADE;
  DROP TABLE "_products_v_blocks_faq" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "redirections" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "_testimonials_v_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "blog_page_blocks_testimonials" CASCADE;
  DROP TABLE "blog_page_blocks_related_products" CASCADE;
  DROP TABLE "blog_page_blocks_related_articles" CASCADE;
  DROP TABLE "blog_page_blocks_pricing" CASCADE;
  DROP TABLE "blog_page_blocks_launches_launches" CASCADE;
  DROP TABLE "blog_page_blocks_launches" CASCADE;
  DROP TABLE "blog_page_blocks_how_it_works_steps" CASCADE;
  DROP TABLE "blog_page_blocks_how_it_works" CASCADE;
  DROP TABLE "blog_page_blocks_hero_c_t_as" CASCADE;
  DROP TABLE "blog_page_blocks_hero_services" CASCADE;
  DROP TABLE "blog_page_blocks_hero" CASCADE;
  DROP TABLE "blog_page_blocks_form_section_form_inputs" CASCADE;
  DROP TABLE "blog_page_blocks_form_section_section_users" CASCADE;
  DROP TABLE "blog_page_blocks_form_section_benefits" CASCADE;
  DROP TABLE "blog_page_blocks_form_section_policy_links" CASCADE;
  DROP TABLE "blog_page_blocks_form_section_social_links_links" CASCADE;
  DROP TABLE "blog_page_blocks_form_section_social_links" CASCADE;
  DROP TABLE "blog_page_blocks_form_section" CASCADE;
  DROP TABLE "blog_page_blocks_features_ray_card_items" CASCADE;
  DROP TABLE "blog_page_blocks_features_graph_card_top_items" CASCADE;
  DROP TABLE "blog_page_blocks_features" CASCADE;
  DROP TABLE "blog_page_blocks_faq" CASCADE;
  DROP TABLE "blog_page_blocks_cta_c_t_as" CASCADE;
  DROP TABLE "blog_page_blocks_cta" CASCADE;
  DROP TABLE "blog_page_blocks_brands" CASCADE;
  DROP TABLE "blog_page" CASCADE;
  DROP TABLE "blog_page_locales" CASCADE;
  DROP TABLE "blog_page_rels" CASCADE;
  DROP TABLE "product_page_blocks_hero_c_t_as" CASCADE;
  DROP TABLE "product_page_blocks_hero_services" CASCADE;
  DROP TABLE "product_page_blocks_hero" CASCADE;
  DROP TABLE "product_page_blocks_features_ray_card_items" CASCADE;
  DROP TABLE "product_page_blocks_features_graph_card_top_items" CASCADE;
  DROP TABLE "product_page_blocks_features" CASCADE;
  DROP TABLE "product_page_blocks_testimonials" CASCADE;
  DROP TABLE "product_page_blocks_faq" CASCADE;
  DROP TABLE "product_page_blocks_cta_c_t_as" CASCADE;
  DROP TABLE "product_page_blocks_cta" CASCADE;
  DROP TABLE "product_page_blocks_pricing" CASCADE;
  DROP TABLE "product_page_blocks_how_it_works_steps" CASCADE;
  DROP TABLE "product_page_blocks_how_it_works" CASCADE;
  DROP TABLE "product_page_blocks_services_elements_service_item" CASCADE;
  DROP TABLE "product_page_blocks_services" CASCADE;
  DROP TABLE "product_page_blocks_brands" CASCADE;
  DROP TABLE "product_page_blocks_blog" CASCADE;
  DROP TABLE "product_page_blocks_newsletter_form_inputs" CASCADE;
  DROP TABLE "product_page_blocks_newsletter" CASCADE;
  DROP TABLE "product_page_blocks_launches_launches" CASCADE;
  DROP TABLE "product_page_blocks_launches" CASCADE;
  DROP TABLE "product_page_blocks_products_projects_tags" CASCADE;
  DROP TABLE "product_page_blocks_products_projects" CASCADE;
  DROP TABLE "product_page_blocks_products" CASCADE;
  DROP TABLE "product_page_blocks_related_articles" CASCADE;
  DROP TABLE "product_page_blocks_related_products" CASCADE;
  DROP TABLE "product_page_blocks_why_choose_us_cards" CASCADE;
  DROP TABLE "product_page_blocks_why_choose_us" CASCADE;
  DROP TABLE "product_page_blocks_form_section_form_inputs" CASCADE;
  DROP TABLE "product_page_blocks_form_section_section_users" CASCADE;
  DROP TABLE "product_page_blocks_form_section_benefits" CASCADE;
  DROP TABLE "product_page_blocks_form_section_policy_links" CASCADE;
  DROP TABLE "product_page_blocks_form_section_social_links_links" CASCADE;
  DROP TABLE "product_page_blocks_form_section_social_links" CASCADE;
  DROP TABLE "product_page_blocks_form_section" CASCADE;
  DROP TABLE "product_page" CASCADE;
  DROP TABLE "product_page_locales" CASCADE;
  DROP TABLE "product_page_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "global_navbar_left_navbar_items" CASCADE;
  DROP TABLE "global_navbar_right_navbar_items" CASCADE;
  DROP TABLE "global_navbar_policy" CASCADE;
  DROP TABLE "global_footer_internal_links" CASCADE;
  DROP TABLE "global_footer_policy_links" CASCADE;
  DROP TABLE "global_footer_social_media_links" CASCADE;
  DROP TABLE "global" CASCADE;
  DROP TABLE "global_locales" CASCADE;
  DROP TABLE "service_blocks_hero_c_t_as" CASCADE;
  DROP TABLE "service_blocks_hero_services" CASCADE;
  DROP TABLE "service_blocks_hero" CASCADE;
  DROP TABLE "service_blocks_features_ray_card_items" CASCADE;
  DROP TABLE "service_blocks_features_graph_card_top_items" CASCADE;
  DROP TABLE "service_blocks_features" CASCADE;
  DROP TABLE "service_blocks_testimonials" CASCADE;
  DROP TABLE "service_blocks_faq" CASCADE;
  DROP TABLE "service_blocks_cta_c_t_as" CASCADE;
  DROP TABLE "service_blocks_cta" CASCADE;
  DROP TABLE "service_blocks_cta_locales" CASCADE;
  DROP TABLE "service_blocks_pricing" CASCADE;
  DROP TABLE "service_blocks_how_it_works_steps" CASCADE;
  DROP TABLE "service_blocks_how_it_works" CASCADE;
  DROP TABLE "service_blocks_services_elements_service_item" CASCADE;
  DROP TABLE "service_blocks_services" CASCADE;
  DROP TABLE "service_blocks_brands" CASCADE;
  DROP TABLE "service_blocks_blog" CASCADE;
  DROP TABLE "service_blocks_newsletter_form_inputs" CASCADE;
  DROP TABLE "service_blocks_newsletter" CASCADE;
  DROP TABLE "service_blocks_launches_launches" CASCADE;
  DROP TABLE "service_blocks_launches" CASCADE;
  DROP TABLE "service_blocks_products_projects_tags" CASCADE;
  DROP TABLE "service_blocks_products_projects" CASCADE;
  DROP TABLE "service_blocks_products" CASCADE;
  DROP TABLE "service_blocks_related_articles" CASCADE;
  DROP TABLE "service_blocks_related_articles_locales" CASCADE;
  DROP TABLE "service_blocks_related_products" CASCADE;
  DROP TABLE "service_blocks_why_choose_us_cards" CASCADE;
  DROP TABLE "service_blocks_why_choose_us" CASCADE;
  DROP TABLE "service_blocks_form_section_form_inputs" CASCADE;
  DROP TABLE "service_blocks_form_section_section_users" CASCADE;
  DROP TABLE "service_blocks_form_section_benefits" CASCADE;
  DROP TABLE "service_blocks_form_section_policy_links" CASCADE;
  DROP TABLE "service_blocks_form_section_social_links_links" CASCADE;
  DROP TABLE "service_blocks_form_section_social_links" CASCADE;
  DROP TABLE "service_blocks_form_section" CASCADE;
  DROP TABLE "service" CASCADE;
  DROP TABLE "service_locales" CASCADE;
  DROP TABLE "service_rels" CASCADE;
  DROP TABLE "_service_v_blocks_hero_c_t_as" CASCADE;
  DROP TABLE "_service_v_blocks_hero_services" CASCADE;
  DROP TABLE "_service_v_blocks_hero" CASCADE;
  DROP TABLE "_service_v_blocks_features_ray_card_items" CASCADE;
  DROP TABLE "_service_v_blocks_features_graph_card_top_items" CASCADE;
  DROP TABLE "_service_v_blocks_features" CASCADE;
  DROP TABLE "_service_v_blocks_testimonials" CASCADE;
  DROP TABLE "_service_v_blocks_faq" CASCADE;
  DROP TABLE "_service_v_blocks_cta_c_t_as" CASCADE;
  DROP TABLE "_service_v_blocks_cta" CASCADE;
  DROP TABLE "_service_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_service_v_blocks_pricing" CASCADE;
  DROP TABLE "_service_v_blocks_how_it_works_steps" CASCADE;
  DROP TABLE "_service_v_blocks_how_it_works" CASCADE;
  DROP TABLE "_service_v_blocks_services_elements_service_item" CASCADE;
  DROP TABLE "_service_v_blocks_services" CASCADE;
  DROP TABLE "_service_v_blocks_brands" CASCADE;
  DROP TABLE "_service_v_blocks_blog" CASCADE;
  DROP TABLE "_service_v_blocks_newsletter_form_inputs" CASCADE;
  DROP TABLE "_service_v_blocks_newsletter" CASCADE;
  DROP TABLE "_service_v_blocks_launches_launches" CASCADE;
  DROP TABLE "_service_v_blocks_launches" CASCADE;
  DROP TABLE "_service_v_blocks_products_projects_tags" CASCADE;
  DROP TABLE "_service_v_blocks_products_projects" CASCADE;
  DROP TABLE "_service_v_blocks_products" CASCADE;
  DROP TABLE "_service_v_blocks_related_articles" CASCADE;
  DROP TABLE "_service_v_blocks_related_articles_locales" CASCADE;
  DROP TABLE "_service_v_blocks_related_products" CASCADE;
  DROP TABLE "_service_v_blocks_why_choose_us_cards" CASCADE;
  DROP TABLE "_service_v_blocks_why_choose_us" CASCADE;
  DROP TABLE "_service_v_blocks_form_section_form_inputs" CASCADE;
  DROP TABLE "_service_v_blocks_form_section_section_users" CASCADE;
  DROP TABLE "_service_v_blocks_form_section_benefits" CASCADE;
  DROP TABLE "_service_v_blocks_form_section_policy_links" CASCADE;
  DROP TABLE "_service_v_blocks_form_section_social_links_links" CASCADE;
  DROP TABLE "_service_v_blocks_form_section_social_links" CASCADE;
  DROP TABLE "_service_v_blocks_form_section" CASCADE;
  DROP TABLE "_service_v" CASCADE;
  DROP TABLE "_service_v_locales" CASCADE;
  DROP TABLE "_service_v_rels" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_articles_blocks_cta_c_t_as_target";
  DROP TYPE "public"."enum_articles_blocks_cta_c_t_as_variant";
  DROP TYPE "public"."enum_articles_person_card_button_target";
  DROP TYPE "public"."enum_articles_person_card_button_variant";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_blocks_cta_c_t_as_target";
  DROP TYPE "public"."enum__articles_v_blocks_cta_c_t_as_variant";
  DROP TYPE "public"."enum__articles_v_version_person_card_button_target";
  DROP TYPE "public"."enum__articles_v_version_person_card_button_variant";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum__articles_v_published_locale";
  DROP TYPE "public"."enum_contacts_state";
  DROP TYPE "public"."enum__contacts_v_version_state";
  DROP TYPE "public"."enum_newsletters_language";
  DROP TYPE "public"."enum_pages_blocks_hero_c_t_as_target";
  DROP TYPE "public"."enum_pages_blocks_hero_c_t_as_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_person_button_target";
  DROP TYPE "public"."enum_pages_blocks_hero_person_button_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_c_t_as_target";
  DROP TYPE "public"."enum_pages_blocks_cta_c_t_as_variant";
  DROP TYPE "public"."enum_pages_blocks_blog_button_target";
  DROP TYPE "public"."enum_pages_blocks_blog_button_variant";
  DROP TYPE "public"."enum_pages_blocks_newsletter_form_inputs_type";
  DROP TYPE "public"."enum_pages_blocks_why_choose_us_cards_icon";
  DROP TYPE "public"."enum_pages_blocks_form_section_form_inputs_type";
  DROP TYPE "public"."enum_pages_blocks_form_section_benefits_icon";
  DROP TYPE "public"."enum_pages_blocks_form_section_policy_links_target";
  DROP TYPE "public"."enum_pages_blocks_form_section_social_links_links_target";
  DROP TYPE "public"."enum_pages_blocks_form_section_person_button_target";
  DROP TYPE "public"."enum_pages_blocks_form_section_person_button_variant";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_c_t_as_target";
  DROP TYPE "public"."enum__pages_v_blocks_hero_c_t_as_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_person_button_target";
  DROP TYPE "public"."enum__pages_v_blocks_hero_person_button_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_c_t_as_target";
  DROP TYPE "public"."enum__pages_v_blocks_cta_c_t_as_variant";
  DROP TYPE "public"."enum__pages_v_blocks_blog_button_target";
  DROP TYPE "public"."enum__pages_v_blocks_blog_button_variant";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_form_inputs_type";
  DROP TYPE "public"."enum__pages_v_blocks_why_choose_us_cards_icon";
  DROP TYPE "public"."enum__pages_v_blocks_form_section_form_inputs_type";
  DROP TYPE "public"."enum__pages_v_blocks_form_section_benefits_icon";
  DROP TYPE "public"."enum__pages_v_blocks_form_section_policy_links_target";
  DROP TYPE "public"."enum__pages_v_blocks_form_section_social_links_links_target";
  DROP TYPE "public"."enum__pages_v_blocks_form_section_person_button_target";
  DROP TYPE "public"."enum__pages_v_blocks_form_section_person_button_variant";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_plans_cta_target";
  DROP TYPE "public"."enum_plans_cta_variant";
  DROP TYPE "public"."enum_plans_status";
  DROP TYPE "public"."enum_plans_plan_type";
  DROP TYPE "public"."enum__plans_v_version_cta_target";
  DROP TYPE "public"."enum__plans_v_version_cta_variant";
  DROP TYPE "public"."enum__plans_v_version_status";
  DROP TYPE "public"."enum__plans_v_published_locale";
  DROP TYPE "public"."enum__plans_v_version_plan_type";
  DROP TYPE "public"."enum_products_blocks_cta_c_t_as_target";
  DROP TYPE "public"."enum_products_blocks_cta_c_t_as_variant";
  DROP TYPE "public"."enum_products_blocks_form_section_form_inputs_type";
  DROP TYPE "public"."enum_products_blocks_form_section_benefits_icon";
  DROP TYPE "public"."enum_products_blocks_form_section_policy_links_target";
  DROP TYPE "public"."enum_products_blocks_form_section_social_links_links_target";
  DROP TYPE "public"."enum_products_blocks_form_section_person_button_target";
  DROP TYPE "public"."enum_products_blocks_form_section_person_button_variant";
  DROP TYPE "public"."enum_products_blocks_newsletter_form_inputs_type";
  DROP TYPE "public"."enum_products_button_center_target";
  DROP TYPE "public"."enum_products_button_center_variant";
  DROP TYPE "public"."enum_products_button_bottom_target";
  DROP TYPE "public"."enum_products_button_bottom_variant";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_blocks_cta_c_t_as_target";
  DROP TYPE "public"."enum__products_v_blocks_cta_c_t_as_variant";
  DROP TYPE "public"."enum__products_v_blocks_form_section_form_inputs_type";
  DROP TYPE "public"."enum__products_v_blocks_form_section_benefits_icon";
  DROP TYPE "public"."enum__products_v_blocks_form_section_policy_links_target";
  DROP TYPE "public"."enum__products_v_blocks_form_section_social_links_links_target";
  DROP TYPE "public"."enum__products_v_blocks_form_section_person_button_target";
  DROP TYPE "public"."enum__products_v_blocks_form_section_person_button_variant";
  DROP TYPE "public"."enum__products_v_blocks_newsletter_form_inputs_type";
  DROP TYPE "public"."enum__products_v_version_button_center_target";
  DROP TYPE "public"."enum__products_v_version_button_center_variant";
  DROP TYPE "public"."enum__products_v_version_button_bottom_target";
  DROP TYPE "public"."enum__products_v_version_button_bottom_variant";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum__testimonials_v_published_locale";
  DROP TYPE "public"."enum_blog_page_blocks_hero_c_t_as_target";
  DROP TYPE "public"."enum_blog_page_blocks_hero_c_t_as_variant";
  DROP TYPE "public"."enum_blog_page_blocks_hero_person_button_target";
  DROP TYPE "public"."enum_blog_page_blocks_hero_person_button_variant";
  DROP TYPE "public"."enum_blog_page_blocks_form_section_form_inputs_type";
  DROP TYPE "public"."enum_blog_page_blocks_form_section_benefits_icon";
  DROP TYPE "public"."enum_blog_page_blocks_form_section_policy_links_target";
  DROP TYPE "public"."enum_blog_page_blocks_form_section_social_links_links_target";
  DROP TYPE "public"."enum_blog_page_blocks_form_section_person_button_target";
  DROP TYPE "public"."enum_blog_page_blocks_form_section_person_button_variant";
  DROP TYPE "public"."enum_blog_page_blocks_cta_c_t_as_target";
  DROP TYPE "public"."enum_blog_page_blocks_cta_c_t_as_variant";
  DROP TYPE "public"."enum_product_page_blocks_hero_c_t_as_target";
  DROP TYPE "public"."enum_product_page_blocks_hero_c_t_as_variant";
  DROP TYPE "public"."enum_product_page_blocks_hero_person_button_target";
  DROP TYPE "public"."enum_product_page_blocks_hero_person_button_variant";
  DROP TYPE "public"."enum_product_page_blocks_cta_c_t_as_target";
  DROP TYPE "public"."enum_product_page_blocks_cta_c_t_as_variant";
  DROP TYPE "public"."enum_product_page_blocks_blog_button_target";
  DROP TYPE "public"."enum_product_page_blocks_blog_button_variant";
  DROP TYPE "public"."enum_product_page_blocks_newsletter_form_inputs_type";
  DROP TYPE "public"."enum_product_page_blocks_why_choose_us_cards_icon";
  DROP TYPE "public"."enum_product_page_blocks_form_section_form_inputs_type";
  DROP TYPE "public"."enum_product_page_blocks_form_section_benefits_icon";
  DROP TYPE "public"."enum_product_page_blocks_form_section_policy_links_target";
  DROP TYPE "public"."enum_product_page_blocks_form_section_social_links_links_target";
  DROP TYPE "public"."enum_product_page_blocks_form_section_person_button_target";
  DROP TYPE "public"."enum_product_page_blocks_form_section_person_button_variant";
  DROP TYPE "public"."enum_global_navbar_left_navbar_items_target";
  DROP TYPE "public"."enum_global_navbar_right_navbar_items_target";
  DROP TYPE "public"."enum_global_navbar_policy_target";
  DROP TYPE "public"."enum_global_footer_internal_links_target";
  DROP TYPE "public"."enum_global_footer_policy_links_target";
  DROP TYPE "public"."enum_global_footer_social_media_links_target";
  DROP TYPE "public"."enum_service_blocks_hero_c_t_as_target";
  DROP TYPE "public"."enum_service_blocks_hero_c_t_as_variant";
  DROP TYPE "public"."enum_service_blocks_hero_person_button_target";
  DROP TYPE "public"."enum_service_blocks_hero_person_button_variant";
  DROP TYPE "public"."enum_service_blocks_cta_c_t_as_target";
  DROP TYPE "public"."enum_service_blocks_cta_c_t_as_variant";
  DROP TYPE "public"."enum_service_blocks_blog_button_target";
  DROP TYPE "public"."enum_service_blocks_blog_button_variant";
  DROP TYPE "public"."enum_service_blocks_newsletter_form_inputs_type";
  DROP TYPE "public"."enum_service_blocks_why_choose_us_cards_icon";
  DROP TYPE "public"."enum_service_blocks_form_section_form_inputs_type";
  DROP TYPE "public"."enum_service_blocks_form_section_benefits_icon";
  DROP TYPE "public"."enum_service_blocks_form_section_policy_links_target";
  DROP TYPE "public"."enum_service_blocks_form_section_social_links_links_target";
  DROP TYPE "public"."enum_service_blocks_form_section_person_button_target";
  DROP TYPE "public"."enum_service_blocks_form_section_person_button_variant";
  DROP TYPE "public"."enum_service_status";
  DROP TYPE "public"."enum__service_v_blocks_hero_c_t_as_target";
  DROP TYPE "public"."enum__service_v_blocks_hero_c_t_as_variant";
  DROP TYPE "public"."enum__service_v_blocks_hero_person_button_target";
  DROP TYPE "public"."enum__service_v_blocks_hero_person_button_variant";
  DROP TYPE "public"."enum__service_v_blocks_cta_c_t_as_target";
  DROP TYPE "public"."enum__service_v_blocks_cta_c_t_as_variant";
  DROP TYPE "public"."enum__service_v_blocks_blog_button_target";
  DROP TYPE "public"."enum__service_v_blocks_blog_button_variant";
  DROP TYPE "public"."enum__service_v_blocks_newsletter_form_inputs_type";
  DROP TYPE "public"."enum__service_v_blocks_why_choose_us_cards_icon";
  DROP TYPE "public"."enum__service_v_blocks_form_section_form_inputs_type";
  DROP TYPE "public"."enum__service_v_blocks_form_section_benefits_icon";
  DROP TYPE "public"."enum__service_v_blocks_form_section_policy_links_target";
  DROP TYPE "public"."enum__service_v_blocks_form_section_social_links_links_target";
  DROP TYPE "public"."enum__service_v_blocks_form_section_person_button_target";
  DROP TYPE "public"."enum__service_v_blocks_form_section_person_button_variant";
  DROP TYPE "public"."enum__service_v_version_status";
  DROP TYPE "public"."enum__service_v_published_locale";`)
}
