import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Hotfix a 20261017_164241_add_key_points_and_faq_articles migrációhoz:
// a FAQBlock "faqs" relationship mezője az Articles collection-ön az
// `articles_rels`/`_articles_v_rels` táblákban egy ÚJ oszlopot (faqs_id)
// igényel — ez a tábla már létezett (nem szerepelt az "új táblák"
// listájában), ezért kimaradt az előző migrációból, és 2026-10-17-én
// production 500-as hibát okozott (`column articles__rels.faqs_id does
// not exist`). Kézi SSH-s patch-csel azonnal javítva éles szerveren;
// ez a migráció ugyanazt a változtatást regisztrálja a payload_migrations
// nyilvántartásban, hogy friss telepítés/más környezet is helyesen kapja.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE public.articles_rels ADD COLUMN IF NOT EXISTS faqs_id integer;
    ALTER TABLE public._articles_v_rels ADD COLUMN IF NOT EXISTS faqs_id integer;

    DO $$ BEGIN
      ALTER TABLE ONLY public.articles_rels ADD CONSTRAINT articles_rels_faqs_fk FOREIGN KEY (faqs_id) REFERENCES public.faqs(id) ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE ONLY public._articles_v_rels ADD CONSTRAINT _articles_v_rels_faqs_fk FOREIGN KEY (faqs_id) REFERENCES public.faqs(id) ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS articles_rels_faqs_id_idx ON public.articles_rels USING btree (faqs_id, locale);
    CREATE INDEX IF NOT EXISTS _articles_v_rels_faqs_id_idx ON public._articles_v_rels USING btree (faqs_id, locale);
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE public.articles_rels DROP COLUMN IF EXISTS faqs_id;
    ALTER TABLE public._articles_v_rels DROP COLUMN IF EXISTS faqs_id;
  `)
}
