import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Új tábla-készlet: KeyPointsBlock (pages/service/blog_page/product_page/articles
// — mind az 5 tulajdonos, élő + _v verziós tükör) és FAQBlock az Articles
// collection-ön (korábban csak pages/service/stb. használta). Nincs új enum
// típus (a key_points/faq blokkok csak text/varchar/integer mezőket
// tartalmaznak), ezért a migráció egyszerű: csak tábla/sequence/index/FK.
// IF NOT EXISTS / duplicate_object védelemmel — biztonságosan újrafuttatható
// (pl. ha lokálisan push-sal már létrejöttek ezek a táblák).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
-- 1. Sequence-ek
CREATE SEQUENCE IF NOT EXISTS public._articles_v_blocks_faq_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._articles_v_blocks_faq_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._articles_v_blocks_key_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._articles_v_blocks_key_points_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._articles_v_blocks_key_points_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._articles_v_blocks_key_points_points_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._blog_page_v_blocks_key_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._blog_page_v_blocks_key_points_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._blog_page_v_blocks_key_points_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._blog_page_v_blocks_key_points_points_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._pages_v_blocks_key_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._pages_v_blocks_key_points_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._pp_v_blocks_key_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._pp_v_blocks_key_points_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._pp_v_blocks_key_points_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._pp_v_blocks_key_points_points_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_v_blocks_key_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public._service_v_blocks_key_points_points_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.articles_blocks_faq_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.articles_blocks_key_points_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.articles_blocks_key_points_points_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.blog_page_blocks_key_points_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.blog_page_blocks_key_points_points_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.pp_blocks_key_points_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.pp_blocks_key_points_points_locales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- 2. Táblák
CREATE TABLE IF NOT EXISTS public._articles_v_blocks_faq (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    _uuid character varying,
    block_name character varying
);
CREATE TABLE IF NOT EXISTS public._articles_v_blocks_faq_locales (
    heading character varying,
    sub_heading character varying,
    badge_label character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);
CREATE TABLE IF NOT EXISTS public._articles_v_blocks_key_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    _uuid character varying,
    block_name character varying
);
CREATE TABLE IF NOT EXISTS public._articles_v_blocks_key_points_locales (
    heading character varying DEFAULT 'Dióhéjban'::character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);
CREATE TABLE IF NOT EXISTS public._articles_v_blocks_key_points_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    _uuid character varying
);
CREATE TABLE IF NOT EXISTS public._articles_v_blocks_key_points_points_locales (
    text character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);
CREATE TABLE IF NOT EXISTS public._blog_page_v_blocks_key_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    _uuid character varying,
    block_name character varying
);
CREATE TABLE IF NOT EXISTS public._blog_page_v_blocks_key_points_locales (
    heading character varying DEFAULT 'Dióhéjban'::character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);
CREATE TABLE IF NOT EXISTS public._blog_page_v_blocks_key_points_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    _uuid character varying
);
CREATE TABLE IF NOT EXISTS public._blog_page_v_blocks_key_points_points_locales (
    text character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);
CREATE TABLE IF NOT EXISTS public._pages_v_blocks_key_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    _locale public._locales NOT NULL,
    id integer NOT NULL,
    heading character varying DEFAULT 'Dióhéjban'::character varying,
    _uuid character varying,
    block_name character varying
);
CREATE TABLE IF NOT EXISTS public._pages_v_blocks_key_points_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _locale public._locales NOT NULL,
    id integer NOT NULL,
    text character varying,
    _uuid character varying
);
CREATE TABLE IF NOT EXISTS public._pp_v_blocks_key_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id integer NOT NULL,
    _uuid character varying,
    block_name character varying
);
CREATE TABLE IF NOT EXISTS public._pp_v_blocks_key_points_locales (
    heading character varying DEFAULT 'Dióhéjban'::character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);
CREATE TABLE IF NOT EXISTS public._pp_v_blocks_key_points_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    _uuid character varying
);
CREATE TABLE IF NOT EXISTS public._pp_v_blocks_key_points_points_locales (
    text character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id integer NOT NULL
);
CREATE TABLE IF NOT EXISTS public._service_v_blocks_key_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    _locale public._locales NOT NULL,
    id integer NOT NULL,
    heading character varying DEFAULT 'Dióhéjban'::character varying,
    _uuid character varying,
    block_name character varying
);
CREATE TABLE IF NOT EXISTS public._service_v_blocks_key_points_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _locale public._locales NOT NULL,
    id integer NOT NULL,
    text character varying,
    _uuid character varying
);
CREATE TABLE IF NOT EXISTS public.articles_blocks_faq (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    block_name character varying
);
CREATE TABLE IF NOT EXISTS public.articles_blocks_faq_locales (
    heading character varying,
    sub_heading character varying,
    badge_label character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);
CREATE TABLE IF NOT EXISTS public.articles_blocks_key_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    block_name character varying
);
CREATE TABLE IF NOT EXISTS public.articles_blocks_key_points_locales (
    heading character varying DEFAULT 'Dióhéjban'::character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);
CREATE TABLE IF NOT EXISTS public.articles_blocks_key_points_points (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL
);
CREATE TABLE IF NOT EXISTS public.articles_blocks_key_points_points_locales (
    text character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);
CREATE TABLE IF NOT EXISTS public.blog_page_blocks_key_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    block_name character varying
);
CREATE TABLE IF NOT EXISTS public.blog_page_blocks_key_points_locales (
    heading character varying DEFAULT 'Dióhéjban'::character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);
CREATE TABLE IF NOT EXISTS public.blog_page_blocks_key_points_points (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL
);
CREATE TABLE IF NOT EXISTS public.blog_page_blocks_key_points_points_locales (
    text character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);
CREATE TABLE IF NOT EXISTS public.pages_blocks_key_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    _locale public._locales NOT NULL,
    id character varying NOT NULL,
    heading character varying DEFAULT 'Dióhéjban'::character varying,
    block_name character varying
);
CREATE TABLE IF NOT EXISTS public.pages_blocks_key_points_points (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    _locale public._locales NOT NULL,
    id character varying NOT NULL,
    text character varying
);
CREATE TABLE IF NOT EXISTS public.pp_blocks_key_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    id character varying NOT NULL,
    block_name character varying
);
CREATE TABLE IF NOT EXISTS public.pp_blocks_key_points_locales (
    heading character varying DEFAULT 'Dióhéjban'::character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);
CREATE TABLE IF NOT EXISTS public.pp_blocks_key_points_points (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    id character varying NOT NULL
);
CREATE TABLE IF NOT EXISTS public.pp_blocks_key_points_points_locales (
    text character varying,
    id integer NOT NULL,
    _locale public._locales NOT NULL,
    _parent_id character varying NOT NULL
);
CREATE TABLE IF NOT EXISTS public.service_blocks_key_points (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    _path text NOT NULL,
    _locale public._locales NOT NULL,
    id character varying NOT NULL,
    heading character varying DEFAULT 'Dióhéjban'::character varying,
    block_name character varying
);
CREATE TABLE IF NOT EXISTS public.service_blocks_key_points_points (
    _order integer NOT NULL,
    _parent_id character varying NOT NULL,
    _locale public._locales NOT NULL,
    id character varying NOT NULL,
    text character varying
);

-- 3. Oszlop defaultok
ALTER TABLE ONLY public._articles_v_blocks_faq ALTER COLUMN id SET DEFAULT nextval('public._articles_v_blocks_faq_id_seq'::regclass);
ALTER TABLE ONLY public._articles_v_blocks_faq_locales ALTER COLUMN id SET DEFAULT nextval('public._articles_v_blocks_faq_locales_id_seq'::regclass);
ALTER TABLE ONLY public._articles_v_blocks_key_points ALTER COLUMN id SET DEFAULT nextval('public._articles_v_blocks_key_points_id_seq'::regclass);
ALTER TABLE ONLY public._articles_v_blocks_key_points_locales ALTER COLUMN id SET DEFAULT nextval('public._articles_v_blocks_key_points_locales_id_seq'::regclass);
ALTER TABLE ONLY public._articles_v_blocks_key_points_points ALTER COLUMN id SET DEFAULT nextval('public._articles_v_blocks_key_points_points_id_seq'::regclass);
ALTER TABLE ONLY public._articles_v_blocks_key_points_points_locales ALTER COLUMN id SET DEFAULT nextval('public._articles_v_blocks_key_points_points_locales_id_seq'::regclass);
ALTER TABLE ONLY public._blog_page_v_blocks_key_points ALTER COLUMN id SET DEFAULT nextval('public._blog_page_v_blocks_key_points_id_seq'::regclass);
ALTER TABLE ONLY public._blog_page_v_blocks_key_points_locales ALTER COLUMN id SET DEFAULT nextval('public._blog_page_v_blocks_key_points_locales_id_seq'::regclass);
ALTER TABLE ONLY public._blog_page_v_blocks_key_points_points ALTER COLUMN id SET DEFAULT nextval('public._blog_page_v_blocks_key_points_points_id_seq'::regclass);
ALTER TABLE ONLY public._blog_page_v_blocks_key_points_points_locales ALTER COLUMN id SET DEFAULT nextval('public._blog_page_v_blocks_key_points_points_locales_id_seq'::regclass);
ALTER TABLE ONLY public._pages_v_blocks_key_points ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_key_points_id_seq'::regclass);
ALTER TABLE ONLY public._pages_v_blocks_key_points_points ALTER COLUMN id SET DEFAULT nextval('public._pages_v_blocks_key_points_points_id_seq'::regclass);
ALTER TABLE ONLY public._pp_v_blocks_key_points ALTER COLUMN id SET DEFAULT nextval('public._pp_v_blocks_key_points_id_seq'::regclass);
ALTER TABLE ONLY public._pp_v_blocks_key_points_locales ALTER COLUMN id SET DEFAULT nextval('public._pp_v_blocks_key_points_locales_id_seq'::regclass);
ALTER TABLE ONLY public._pp_v_blocks_key_points_points ALTER COLUMN id SET DEFAULT nextval('public._pp_v_blocks_key_points_points_id_seq'::regclass);
ALTER TABLE ONLY public._pp_v_blocks_key_points_points_locales ALTER COLUMN id SET DEFAULT nextval('public._pp_v_blocks_key_points_points_locales_id_seq'::regclass);
ALTER TABLE ONLY public._service_v_blocks_key_points ALTER COLUMN id SET DEFAULT nextval('public._service_v_blocks_key_points_id_seq'::regclass);
ALTER TABLE ONLY public._service_v_blocks_key_points_points ALTER COLUMN id SET DEFAULT nextval('public._service_v_blocks_key_points_points_id_seq'::regclass);
ALTER TABLE ONLY public.articles_blocks_faq_locales ALTER COLUMN id SET DEFAULT nextval('public.articles_blocks_faq_locales_id_seq'::regclass);
ALTER TABLE ONLY public.articles_blocks_key_points_locales ALTER COLUMN id SET DEFAULT nextval('public.articles_blocks_key_points_locales_id_seq'::regclass);
ALTER TABLE ONLY public.articles_blocks_key_points_points_locales ALTER COLUMN id SET DEFAULT nextval('public.articles_blocks_key_points_points_locales_id_seq'::regclass);
ALTER TABLE ONLY public.blog_page_blocks_key_points_locales ALTER COLUMN id SET DEFAULT nextval('public.blog_page_blocks_key_points_locales_id_seq'::regclass);
ALTER TABLE ONLY public.blog_page_blocks_key_points_points_locales ALTER COLUMN id SET DEFAULT nextval('public.blog_page_blocks_key_points_points_locales_id_seq'::regclass);
ALTER TABLE ONLY public.pp_blocks_key_points_locales ALTER COLUMN id SET DEFAULT nextval('public.pp_blocks_key_points_locales_id_seq'::regclass);
ALTER TABLE ONLY public.pp_blocks_key_points_points_locales ALTER COLUMN id SET DEFAULT nextval('public.pp_blocks_key_points_points_locales_id_seq'::regclass);

-- 4. Sequence ownership
ALTER SEQUENCE public._articles_v_blocks_faq_id_seq OWNED BY public._articles_v_blocks_faq.id;
ALTER SEQUENCE public._articles_v_blocks_faq_locales_id_seq OWNED BY public._articles_v_blocks_faq_locales.id;
ALTER SEQUENCE public._articles_v_blocks_key_points_id_seq OWNED BY public._articles_v_blocks_key_points.id;
ALTER SEQUENCE public._articles_v_blocks_key_points_locales_id_seq OWNED BY public._articles_v_blocks_key_points_locales.id;
ALTER SEQUENCE public._articles_v_blocks_key_points_points_id_seq OWNED BY public._articles_v_blocks_key_points_points.id;
ALTER SEQUENCE public._articles_v_blocks_key_points_points_locales_id_seq OWNED BY public._articles_v_blocks_key_points_points_locales.id;
ALTER SEQUENCE public._blog_page_v_blocks_key_points_id_seq OWNED BY public._blog_page_v_blocks_key_points.id;
ALTER SEQUENCE public._blog_page_v_blocks_key_points_locales_id_seq OWNED BY public._blog_page_v_blocks_key_points_locales.id;
ALTER SEQUENCE public._blog_page_v_blocks_key_points_points_id_seq OWNED BY public._blog_page_v_blocks_key_points_points.id;
ALTER SEQUENCE public._blog_page_v_blocks_key_points_points_locales_id_seq OWNED BY public._blog_page_v_blocks_key_points_points_locales.id;
ALTER SEQUENCE public._pages_v_blocks_key_points_id_seq OWNED BY public._pages_v_blocks_key_points.id;
ALTER SEQUENCE public._pages_v_blocks_key_points_points_id_seq OWNED BY public._pages_v_blocks_key_points_points.id;
ALTER SEQUENCE public._pp_v_blocks_key_points_id_seq OWNED BY public._pp_v_blocks_key_points.id;
ALTER SEQUENCE public._pp_v_blocks_key_points_locales_id_seq OWNED BY public._pp_v_blocks_key_points_locales.id;
ALTER SEQUENCE public._pp_v_blocks_key_points_points_id_seq OWNED BY public._pp_v_blocks_key_points_points.id;
ALTER SEQUENCE public._pp_v_blocks_key_points_points_locales_id_seq OWNED BY public._pp_v_blocks_key_points_points_locales.id;
ALTER SEQUENCE public._service_v_blocks_key_points_id_seq OWNED BY public._service_v_blocks_key_points.id;
ALTER SEQUENCE public._service_v_blocks_key_points_points_id_seq OWNED BY public._service_v_blocks_key_points_points.id;
ALTER SEQUENCE public.articles_blocks_faq_locales_id_seq OWNED BY public.articles_blocks_faq_locales.id;
ALTER SEQUENCE public.articles_blocks_key_points_locales_id_seq OWNED BY public.articles_blocks_key_points_locales.id;
ALTER SEQUENCE public.articles_blocks_key_points_points_locales_id_seq OWNED BY public.articles_blocks_key_points_points_locales.id;
ALTER SEQUENCE public.blog_page_blocks_key_points_locales_id_seq OWNED BY public.blog_page_blocks_key_points_locales.id;
ALTER SEQUENCE public.blog_page_blocks_key_points_points_locales_id_seq OWNED BY public.blog_page_blocks_key_points_points_locales.id;
ALTER SEQUENCE public.pp_blocks_key_points_locales_id_seq OWNED BY public.pp_blocks_key_points_locales.id;
ALTER SEQUENCE public.pp_blocks_key_points_points_locales_id_seq OWNED BY public.pp_blocks_key_points_points_locales.id;

-- 5. Primary key constraintek
DO $$ BEGIN
    ALTER TABLE ONLY public._articles_v_blocks_faq_locales ADD CONSTRAINT _articles_v_blocks_faq_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._articles_v_blocks_faq ADD CONSTRAINT _articles_v_blocks_faq_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._articles_v_blocks_key_points_locales ADD CONSTRAINT _articles_v_blocks_key_points_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._articles_v_blocks_key_points ADD CONSTRAINT _articles_v_blocks_key_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._articles_v_blocks_key_points_points_locales ADD CONSTRAINT _articles_v_blocks_key_points_points_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._articles_v_blocks_key_points_points ADD CONSTRAINT _articles_v_blocks_key_points_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._blog_page_v_blocks_key_points_locales ADD CONSTRAINT _blog_page_v_blocks_key_points_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._blog_page_v_blocks_key_points ADD CONSTRAINT _blog_page_v_blocks_key_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._blog_page_v_blocks_key_points_points_locales ADD CONSTRAINT _blog_page_v_blocks_key_points_points_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._blog_page_v_blocks_key_points_points ADD CONSTRAINT _blog_page_v_blocks_key_points_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._pages_v_blocks_key_points ADD CONSTRAINT _pages_v_blocks_key_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._pages_v_blocks_key_points_points ADD CONSTRAINT _pages_v_blocks_key_points_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._pp_v_blocks_key_points_locales ADD CONSTRAINT _pp_v_blocks_key_points_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._pp_v_blocks_key_points ADD CONSTRAINT _pp_v_blocks_key_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._pp_v_blocks_key_points_points_locales ADD CONSTRAINT _pp_v_blocks_key_points_points_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._pp_v_blocks_key_points_points ADD CONSTRAINT _pp_v_blocks_key_points_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._service_v_blocks_key_points ADD CONSTRAINT _service_v_blocks_key_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._service_v_blocks_key_points_points ADD CONSTRAINT _service_v_blocks_key_points_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.articles_blocks_faq_locales ADD CONSTRAINT articles_blocks_faq_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.articles_blocks_faq ADD CONSTRAINT articles_blocks_faq_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.articles_blocks_key_points_locales ADD CONSTRAINT articles_blocks_key_points_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.articles_blocks_key_points ADD CONSTRAINT articles_blocks_key_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.articles_blocks_key_points_points_locales ADD CONSTRAINT articles_blocks_key_points_points_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.articles_blocks_key_points_points ADD CONSTRAINT articles_blocks_key_points_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.blog_page_blocks_key_points_locales ADD CONSTRAINT blog_page_blocks_key_points_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.blog_page_blocks_key_points ADD CONSTRAINT blog_page_blocks_key_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.blog_page_blocks_key_points_points_locales ADD CONSTRAINT blog_page_blocks_key_points_points_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.blog_page_blocks_key_points_points ADD CONSTRAINT blog_page_blocks_key_points_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.pages_blocks_key_points ADD CONSTRAINT pages_blocks_key_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.pages_blocks_key_points_points ADD CONSTRAINT pages_blocks_key_points_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.pp_blocks_key_points_locales ADD CONSTRAINT pp_blocks_key_points_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.pp_blocks_key_points ADD CONSTRAINT pp_blocks_key_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.pp_blocks_key_points_points_locales ADD CONSTRAINT pp_blocks_key_points_points_locales_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.pp_blocks_key_points_points ADD CONSTRAINT pp_blocks_key_points_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.service_blocks_key_points ADD CONSTRAINT service_blocks_key_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.service_blocks_key_points_points ADD CONSTRAINT service_blocks_key_points_points_pkey PRIMARY KEY (id);
  EXCEPTION
    WHEN duplicate_table THEN null;
    WHEN SQLSTATE '42P16' THEN null;
  END $$;

-- 6. Foreign key constraintek
DO $$ BEGIN
    ALTER TABLE ONLY public._articles_v_blocks_faq_locales ADD CONSTRAINT _articles_v_blocks_faq_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._articles_v_blocks_faq(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._articles_v_blocks_faq ADD CONSTRAINT _articles_v_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._articles_v(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._articles_v_blocks_key_points_locales ADD CONSTRAINT _articles_v_blocks_key_points_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._articles_v_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._articles_v_blocks_key_points ADD CONSTRAINT _articles_v_blocks_key_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._articles_v(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._articles_v_blocks_key_points_points_locales ADD CONSTRAINT _articles_v_blocks_key_points_points_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._articles_v_blocks_key_points_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._articles_v_blocks_key_points_points ADD CONSTRAINT _articles_v_blocks_key_points_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._articles_v_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._blog_page_v_blocks_key_points_locales ADD CONSTRAINT _blog_page_v_blocks_key_points_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_page_v_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._blog_page_v_blocks_key_points ADD CONSTRAINT _blog_page_v_blocks_key_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_page_v(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._blog_page_v_blocks_key_points_points_locales ADD CONSTRAINT _blog_page_v_blocks_key_points_points_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_page_v_blocks_key_points_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._blog_page_v_blocks_key_points_points ADD CONSTRAINT _blog_page_v_blocks_key_points_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._blog_page_v_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._pages_v_blocks_key_points ADD CONSTRAINT _pages_v_blocks_key_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._pages_v_blocks_key_points_points ADD CONSTRAINT _pages_v_blocks_key_points_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pages_v_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._pp_v_blocks_key_points_locales ADD CONSTRAINT _pp_v_blocks_key_points_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pp_v_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._pp_v_blocks_key_points ADD CONSTRAINT _pp_v_blocks_key_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pp_v(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._pp_v_blocks_key_points_points_locales ADD CONSTRAINT _pp_v_blocks_key_points_points_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pp_v_blocks_key_points_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._pp_v_blocks_key_points_points ADD CONSTRAINT _pp_v_blocks_key_points_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pp_v_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._service_v_blocks_key_points ADD CONSTRAINT _service_v_blocks_key_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_v(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public._service_v_blocks_key_points_points ADD CONSTRAINT _service_v_blocks_key_points_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._service_v_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.articles_blocks_faq_locales ADD CONSTRAINT articles_blocks_faq_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.articles_blocks_faq(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.articles_blocks_faq ADD CONSTRAINT articles_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.articles(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.articles_blocks_key_points_locales ADD CONSTRAINT articles_blocks_key_points_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.articles_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.articles_blocks_key_points ADD CONSTRAINT articles_blocks_key_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.articles(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.articles_blocks_key_points_points_locales ADD CONSTRAINT articles_blocks_key_points_points_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.articles_blocks_key_points_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.articles_blocks_key_points_points ADD CONSTRAINT articles_blocks_key_points_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.articles_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.blog_page_blocks_key_points_locales ADD CONSTRAINT blog_page_blocks_key_points_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog_page_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.blog_page_blocks_key_points ADD CONSTRAINT blog_page_blocks_key_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog_page(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.blog_page_blocks_key_points_points_locales ADD CONSTRAINT blog_page_blocks_key_points_points_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog_page_blocks_key_points_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.blog_page_blocks_key_points_points ADD CONSTRAINT blog_page_blocks_key_points_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.blog_page_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.pages_blocks_key_points ADD CONSTRAINT pages_blocks_key_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.pages_blocks_key_points_points ADD CONSTRAINT pages_blocks_key_points_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pages_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.pp_blocks_key_points_locales ADD CONSTRAINT pp_blocks_key_points_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pp_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.pp_blocks_key_points ADD CONSTRAINT pp_blocks_key_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pp(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.pp_blocks_key_points_points_locales ADD CONSTRAINT pp_blocks_key_points_points_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pp_blocks_key_points_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.pp_blocks_key_points_points ADD CONSTRAINT pp_blocks_key_points_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pp_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.service_blocks_key_points ADD CONSTRAINT service_blocks_key_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
DO $$ BEGIN
    ALTER TABLE ONLY public.service_blocks_key_points_points ADD CONSTRAINT service_blocks_key_points_points_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.service_blocks_key_points(id) ON DELETE CASCADE;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

-- 7. Indexek
CREATE UNIQUE INDEX IF NOT EXISTS _articles_v_blocks_faq_locales_locale_parent_id_unique ON public._articles_v_blocks_faq_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS _articles_v_blocks_faq_order_idx ON public._articles_v_blocks_faq USING btree (_order);
CREATE INDEX IF NOT EXISTS _articles_v_blocks_faq_parent_id_idx ON public._articles_v_blocks_faq USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _articles_v_blocks_faq_path_idx ON public._articles_v_blocks_faq USING btree (_path);
CREATE UNIQUE INDEX IF NOT EXISTS _articles_v_blocks_key_points_locales_locale_parent_id_uniqu ON public._articles_v_blocks_key_points_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS _articles_v_blocks_key_points_order_idx ON public._articles_v_blocks_key_points USING btree (_order);
CREATE INDEX IF NOT EXISTS _articles_v_blocks_key_points_parent_id_idx ON public._articles_v_blocks_key_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _articles_v_blocks_key_points_path_idx ON public._articles_v_blocks_key_points USING btree (_path);
CREATE UNIQUE INDEX IF NOT EXISTS _articles_v_blocks_key_points_points_locales_locale_parent_i ON public._articles_v_blocks_key_points_points_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS _articles_v_blocks_key_points_points_order_idx ON public._articles_v_blocks_key_points_points USING btree (_order);
CREATE INDEX IF NOT EXISTS _articles_v_blocks_key_points_points_parent_id_idx ON public._articles_v_blocks_key_points_points USING btree (_parent_id);
CREATE UNIQUE INDEX IF NOT EXISTS _blog_page_v_blocks_key_points_locales_locale_parent_id_uniq ON public._blog_page_v_blocks_key_points_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS _blog_page_v_blocks_key_points_order_idx ON public._blog_page_v_blocks_key_points USING btree (_order);
CREATE INDEX IF NOT EXISTS _blog_page_v_blocks_key_points_parent_id_idx ON public._blog_page_v_blocks_key_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _blog_page_v_blocks_key_points_path_idx ON public._blog_page_v_blocks_key_points USING btree (_path);
CREATE UNIQUE INDEX IF NOT EXISTS _blog_page_v_blocks_key_points_points_locales_locale_parent_ ON public._blog_page_v_blocks_key_points_points_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS _blog_page_v_blocks_key_points_points_order_idx ON public._blog_page_v_blocks_key_points_points USING btree (_order);
CREATE INDEX IF NOT EXISTS _blog_page_v_blocks_key_points_points_parent_id_idx ON public._blog_page_v_blocks_key_points_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _pages_v_blocks_key_points_locale_idx ON public._pages_v_blocks_key_points USING btree (_locale);
CREATE INDEX IF NOT EXISTS _pages_v_blocks_key_points_order_idx ON public._pages_v_blocks_key_points USING btree (_order);
CREATE INDEX IF NOT EXISTS _pages_v_blocks_key_points_parent_id_idx ON public._pages_v_blocks_key_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _pages_v_blocks_key_points_path_idx ON public._pages_v_blocks_key_points USING btree (_path);
CREATE INDEX IF NOT EXISTS _pages_v_blocks_key_points_points_locale_idx ON public._pages_v_blocks_key_points_points USING btree (_locale);
CREATE INDEX IF NOT EXISTS _pages_v_blocks_key_points_points_order_idx ON public._pages_v_blocks_key_points_points USING btree (_order);
CREATE INDEX IF NOT EXISTS _pages_v_blocks_key_points_points_parent_id_idx ON public._pages_v_blocks_key_points_points USING btree (_parent_id);
CREATE UNIQUE INDEX IF NOT EXISTS _pp_v_blocks_key_points_locales_locale_parent_id_unique ON public._pp_v_blocks_key_points_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS _pp_v_blocks_key_points_order_idx ON public._pp_v_blocks_key_points USING btree (_order);
CREATE INDEX IF NOT EXISTS _pp_v_blocks_key_points_parent_id_idx ON public._pp_v_blocks_key_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _pp_v_blocks_key_points_path_idx ON public._pp_v_blocks_key_points USING btree (_path);
CREATE UNIQUE INDEX IF NOT EXISTS _pp_v_blocks_key_points_points_locales_locale_parent_id_uniq ON public._pp_v_blocks_key_points_points_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS _pp_v_blocks_key_points_points_order_idx ON public._pp_v_blocks_key_points_points USING btree (_order);
CREATE INDEX IF NOT EXISTS _pp_v_blocks_key_points_points_parent_id_idx ON public._pp_v_blocks_key_points_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _service_v_blocks_key_points_locale_idx ON public._service_v_blocks_key_points USING btree (_locale);
CREATE INDEX IF NOT EXISTS _service_v_blocks_key_points_order_idx ON public._service_v_blocks_key_points USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_v_blocks_key_points_parent_id_idx ON public._service_v_blocks_key_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS _service_v_blocks_key_points_path_idx ON public._service_v_blocks_key_points USING btree (_path);
CREATE INDEX IF NOT EXISTS _service_v_blocks_key_points_points_locale_idx ON public._service_v_blocks_key_points_points USING btree (_locale);
CREATE INDEX IF NOT EXISTS _service_v_blocks_key_points_points_order_idx ON public._service_v_blocks_key_points_points USING btree (_order);
CREATE INDEX IF NOT EXISTS _service_v_blocks_key_points_points_parent_id_idx ON public._service_v_blocks_key_points_points USING btree (_parent_id);
CREATE UNIQUE INDEX IF NOT EXISTS articles_blocks_faq_locales_locale_parent_id_unique ON public.articles_blocks_faq_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS articles_blocks_faq_order_idx ON public.articles_blocks_faq USING btree (_order);
CREATE INDEX IF NOT EXISTS articles_blocks_faq_parent_id_idx ON public.articles_blocks_faq USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS articles_blocks_faq_path_idx ON public.articles_blocks_faq USING btree (_path);
CREATE UNIQUE INDEX IF NOT EXISTS articles_blocks_key_points_locales_locale_parent_id_unique ON public.articles_blocks_key_points_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS articles_blocks_key_points_order_idx ON public.articles_blocks_key_points USING btree (_order);
CREATE INDEX IF NOT EXISTS articles_blocks_key_points_parent_id_idx ON public.articles_blocks_key_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS articles_blocks_key_points_path_idx ON public.articles_blocks_key_points USING btree (_path);
CREATE UNIQUE INDEX IF NOT EXISTS articles_blocks_key_points_points_locales_locale_parent_id_u ON public.articles_blocks_key_points_points_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS articles_blocks_key_points_points_order_idx ON public.articles_blocks_key_points_points USING btree (_order);
CREATE INDEX IF NOT EXISTS articles_blocks_key_points_points_parent_id_idx ON public.articles_blocks_key_points_points USING btree (_parent_id);
CREATE UNIQUE INDEX IF NOT EXISTS blog_page_blocks_key_points_locales_locale_parent_id_unique ON public.blog_page_blocks_key_points_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS blog_page_blocks_key_points_order_idx ON public.blog_page_blocks_key_points USING btree (_order);
CREATE INDEX IF NOT EXISTS blog_page_blocks_key_points_parent_id_idx ON public.blog_page_blocks_key_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS blog_page_blocks_key_points_path_idx ON public.blog_page_blocks_key_points USING btree (_path);
CREATE UNIQUE INDEX IF NOT EXISTS blog_page_blocks_key_points_points_locales_locale_parent_id_ ON public.blog_page_blocks_key_points_points_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS blog_page_blocks_key_points_points_order_idx ON public.blog_page_blocks_key_points_points USING btree (_order);
CREATE INDEX IF NOT EXISTS blog_page_blocks_key_points_points_parent_id_idx ON public.blog_page_blocks_key_points_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS pages_blocks_key_points_locale_idx ON public.pages_blocks_key_points USING btree (_locale);
CREATE INDEX IF NOT EXISTS pages_blocks_key_points_order_idx ON public.pages_blocks_key_points USING btree (_order);
CREATE INDEX IF NOT EXISTS pages_blocks_key_points_parent_id_idx ON public.pages_blocks_key_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS pages_blocks_key_points_path_idx ON public.pages_blocks_key_points USING btree (_path);
CREATE INDEX IF NOT EXISTS pages_blocks_key_points_points_locale_idx ON public.pages_blocks_key_points_points USING btree (_locale);
CREATE INDEX IF NOT EXISTS pages_blocks_key_points_points_order_idx ON public.pages_blocks_key_points_points USING btree (_order);
CREATE INDEX IF NOT EXISTS pages_blocks_key_points_points_parent_id_idx ON public.pages_blocks_key_points_points USING btree (_parent_id);
CREATE UNIQUE INDEX IF NOT EXISTS pp_blocks_key_points_locales_locale_parent_id_unique ON public.pp_blocks_key_points_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS pp_blocks_key_points_order_idx ON public.pp_blocks_key_points USING btree (_order);
CREATE INDEX IF NOT EXISTS pp_blocks_key_points_parent_id_idx ON public.pp_blocks_key_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS pp_blocks_key_points_path_idx ON public.pp_blocks_key_points USING btree (_path);
CREATE UNIQUE INDEX IF NOT EXISTS pp_blocks_key_points_points_locales_locale_parent_id_unique ON public.pp_blocks_key_points_points_locales USING btree (_locale, _parent_id);
CREATE INDEX IF NOT EXISTS pp_blocks_key_points_points_order_idx ON public.pp_blocks_key_points_points USING btree (_order);
CREATE INDEX IF NOT EXISTS pp_blocks_key_points_points_parent_id_idx ON public.pp_blocks_key_points_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS service_blocks_key_points_locale_idx ON public.service_blocks_key_points USING btree (_locale);
CREATE INDEX IF NOT EXISTS service_blocks_key_points_order_idx ON public.service_blocks_key_points USING btree (_order);
CREATE INDEX IF NOT EXISTS service_blocks_key_points_parent_id_idx ON public.service_blocks_key_points USING btree (_parent_id);
CREATE INDEX IF NOT EXISTS service_blocks_key_points_path_idx ON public.service_blocks_key_points USING btree (_path);
CREATE INDEX IF NOT EXISTS service_blocks_key_points_points_locale_idx ON public.service_blocks_key_points_points USING btree (_locale);
CREATE INDEX IF NOT EXISTS service_blocks_key_points_points_order_idx ON public.service_blocks_key_points_points USING btree (_order);
CREATE INDEX IF NOT EXISTS service_blocks_key_points_points_parent_id_idx ON public.service_blocks_key_points_points USING btree (_parent_id);
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  -- Táblák törlése (CASCADE kezeli az FK-kat/indexeket)
  DROP TABLE IF EXISTS public.service_blocks_key_points_points CASCADE;
  DROP TABLE IF EXISTS public.service_blocks_key_points CASCADE;
  DROP TABLE IF EXISTS public.pp_blocks_key_points_points_locales CASCADE;
  DROP TABLE IF EXISTS public.pp_blocks_key_points_points CASCADE;
  DROP TABLE IF EXISTS public.pp_blocks_key_points_locales CASCADE;
  DROP TABLE IF EXISTS public.pp_blocks_key_points CASCADE;
  DROP TABLE IF EXISTS public.pages_blocks_key_points_points CASCADE;
  DROP TABLE IF EXISTS public.pages_blocks_key_points CASCADE;
  DROP TABLE IF EXISTS public.blog_page_blocks_key_points_points_locales CASCADE;
  DROP TABLE IF EXISTS public.blog_page_blocks_key_points_points CASCADE;
  DROP TABLE IF EXISTS public.blog_page_blocks_key_points_locales CASCADE;
  DROP TABLE IF EXISTS public.blog_page_blocks_key_points CASCADE;
  DROP TABLE IF EXISTS public.articles_blocks_key_points_points_locales CASCADE;
  DROP TABLE IF EXISTS public.articles_blocks_key_points_points CASCADE;
  DROP TABLE IF EXISTS public.articles_blocks_key_points_locales CASCADE;
  DROP TABLE IF EXISTS public.articles_blocks_key_points CASCADE;
  DROP TABLE IF EXISTS public.articles_blocks_faq_locales CASCADE;
  DROP TABLE IF EXISTS public.articles_blocks_faq CASCADE;
  DROP TABLE IF EXISTS public._service_v_blocks_key_points_points CASCADE;
  DROP TABLE IF EXISTS public._service_v_blocks_key_points CASCADE;
  DROP TABLE IF EXISTS public._pp_v_blocks_key_points_points_locales CASCADE;
  DROP TABLE IF EXISTS public._pp_v_blocks_key_points_points CASCADE;
  DROP TABLE IF EXISTS public._pp_v_blocks_key_points_locales CASCADE;
  DROP TABLE IF EXISTS public._pp_v_blocks_key_points CASCADE;
  DROP TABLE IF EXISTS public._pages_v_blocks_key_points_points CASCADE;
  DROP TABLE IF EXISTS public._pages_v_blocks_key_points CASCADE;
  DROP TABLE IF EXISTS public._blog_page_v_blocks_key_points_points_locales CASCADE;
  DROP TABLE IF EXISTS public._blog_page_v_blocks_key_points_points CASCADE;
  DROP TABLE IF EXISTS public._blog_page_v_blocks_key_points_locales CASCADE;
  DROP TABLE IF EXISTS public._blog_page_v_blocks_key_points CASCADE;
  DROP TABLE IF EXISTS public._articles_v_blocks_key_points_points_locales CASCADE;
  DROP TABLE IF EXISTS public._articles_v_blocks_key_points_points CASCADE;
  DROP TABLE IF EXISTS public._articles_v_blocks_key_points_locales CASCADE;
  DROP TABLE IF EXISTS public._articles_v_blocks_key_points CASCADE;
  DROP TABLE IF EXISTS public._articles_v_blocks_faq_locales CASCADE;
  DROP TABLE IF EXISTS public._articles_v_blocks_faq CASCADE;
  
-- Sequence-ek törlése
  DROP SEQUENCE IF EXISTS public.pp_blocks_key_points_points_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public.pp_blocks_key_points_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public.blog_page_blocks_key_points_points_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public.blog_page_blocks_key_points_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public.articles_blocks_key_points_points_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public.articles_blocks_key_points_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public.articles_blocks_faq_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._service_v_blocks_key_points_points_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._service_v_blocks_key_points_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._pp_v_blocks_key_points_points_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._pp_v_blocks_key_points_points_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._pp_v_blocks_key_points_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._pp_v_blocks_key_points_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._pages_v_blocks_key_points_points_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._pages_v_blocks_key_points_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._blog_page_v_blocks_key_points_points_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._blog_page_v_blocks_key_points_points_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._blog_page_v_blocks_key_points_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._blog_page_v_blocks_key_points_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._articles_v_blocks_key_points_points_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._articles_v_blocks_key_points_points_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._articles_v_blocks_key_points_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._articles_v_blocks_key_points_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._articles_v_blocks_faq_locales_id_seq CASCADE;
  DROP SEQUENCE IF EXISTS public._articles_v_blocks_faq_id_seq CASCADE;
  `)
}
