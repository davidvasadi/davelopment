"""
Payload keeps a separate _articles_v (version/draft history) table that its
admin UI reads from — a raw INSERT into the live `articles` table (as our
build scripts did) never creates a matching version row, so the article
works on the live site but is invisible in /admin. This copies an existing
`articles` row + its locales + category rels into a new, single
`latest=true, published` _articles_v row, exactly matching Payload's own
shape. Local DB only. Usage: python3 _sync_article_version.py <article_id>
"""
import os
import subprocess
import sys

DB_URL = None
with open(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')) as f:
    for line in f:
        if line.startswith('DATABASE_URI='):
            DB_URL = line.strip().split('=', 1)[1]
            break

def run_sql(sql):
    result = subprocess.run(['psql', DB_URL, '-q', '-t', '-A', '-v', 'ON_ERROR_STOP=1', '-c', sql], capture_output=True, text=True)
    if result.returncode != 0:
        print('SQL ERROR:', result.stderr, file=sys.stderr)
        print('SQL:', sql[:800], file=sys.stderr)
        sys.exit(1)
    lines = [l for l in result.stdout.strip().splitlines() if l.strip()]
    return lines[0].strip() if lines else ''

def sync(article_id):
    v_id = run_sql(f"""
        INSERT INTO _articles_v
          (parent_id, version_person_card_name, version_person_card_role, version_person_card_org,
           version_person_card_image_id, version_person_card_button_url, version_person_card_button_target,
           version_person_card_button_variant, version_updated_at, version_created_at, version__status,
           snapshot, latest)
        SELECT
          id, person_card_name, person_card_role, person_card_org,
          person_card_image_id, person_card_button_url, person_card_button_target::text::enum__articles_v_version_person_card_button_target,
          person_card_button_variant::text::enum__articles_v_version_person_card_button_variant, updated_at, created_at, _status::text::enum__articles_v_version_status,
          false, true
        FROM articles WHERE id = {article_id}
        RETURNING id;
    """)
    print('version id =', v_id)

    run_sql(f"""
        INSERT INTO _articles_v_locales
          (version_title, version_slug, version_description, version_content, version_image_id,
           version_seo_meta_title, version_seo_meta_description, version_seo_noindex,
           version_person_card_button_text, _locale, _parent_id)
        SELECT
          title, slug, description, content, image_id,
          seo_meta_title, seo_meta_description, seo_noindex,
          person_card_button_text, _locale, {v_id}
        FROM articles_locales WHERE _parent_id = {article_id};
    """)

    run_sql(f"""
        INSERT INTO _articles_v_rels ("order", parent_id, path, categories_id, locale)
        SELECT "order", {v_id}, path, categories_id, locale
        FROM articles_rels WHERE parent_id = {article_id};
    """)

    print(f"synced article {article_id} -> version {v_id}")

if __name__ == '__main__':
    sync(int(sys.argv[1]))
