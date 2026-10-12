"""
One-off, local-only helper: builds a new 'articles' entry (hu+en) with real
Lexical rich-text content. LOCAL DB ONLY.
"""
import os
import json
import secrets
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

def esc(s):
    return s.replace("'", "''")

def build_article(spec):
    article_id = run_sql(f"""
        INSERT INTO articles (person_card_name, person_card_role, person_card_org, person_card_image_id, person_card_button_url, _status)
        VALUES ('Vasadi Dávid', 'Csapatvezető', '[davelopment]©', 33, '/arak', 'published') RETURNING id;
    """)
    print('article id =', article_id)

    for loc in ['hu', 'en']:
        l = spec['locales'][loc]
        content_json = json.dumps(spec['content'][loc], ensure_ascii=False).replace("'", "''")
        run_sql(f"""
            INSERT INTO articles_locales
              (title, slug, description, content, image_id, seo_meta_title, seo_meta_description, _locale, _parent_id, person_card_button_text)
            VALUES
              ('{esc(l['title'])}', '{esc(l['slug'])}', '{esc(l['description'])}', '{content_json}'::jsonb,
               {spec['image_id']}, '{esc(l['seo_title'])}', '{esc(l['seo_desc'])}', '{loc}', {article_id}, '{esc(l['person_card_button_text'])}');
        """)
        for cat_id in spec['category_ids']:
            run_sql(f"""
                INSERT INTO articles_rels ("order", parent_id, path, categories_id, locale)
                VALUES (1, {article_id}, 'categories', {cat_id}, '{loc}');
            """)
    print(f"DONE — article id {article_id}, slug hu='{spec['locales']['hu']['slug']}'")
    return article_id

if __name__ == '__main__':
    spec = json.load(open(sys.argv[1]))
    build_article(spec)
