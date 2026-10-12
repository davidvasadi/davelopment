"""
Adds a CTA dynamic_zone block to an article (hu+en), matching the schema/
pattern already used by the other 18 published articles. Local DB only.
Usage: python3 _add_article_cta.py <spec.json>

spec.json shape:
{
  "article_id": 57,
  "url": "/karbantartas",
  "locales": {
    "hu": {"badge_label":"...", "heading":"...", "heading_highlight":"...", "sub_heading":"...", "cta_text":"..."},
    "en": {...}
  }
}
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

def add_cta(spec):
    article_id = spec['article_id']
    block_id = secrets.token_hex(12)
    url = spec['url']

    # 1. live table
    run_sql(f"""
        INSERT INTO articles_blocks_cta (_order, _parent_id, _path, id)
        VALUES (1, {article_id}, 'dynamic_zone', '{block_id}');
    """)

    for loc in ['hu', 'en']:
        l = spec['locales'][loc]
        run_sql(f"""
            INSERT INTO articles_blocks_cta_locales
              (badge_label, heading, heading_highlight, sub_heading, _locale, _parent_id)
            VALUES
              ('{esc(l['badge_label'])}', '{esc(l['heading'])}', '{esc(l['heading_highlight'])}',
               '{esc(l['sub_heading'])}', '{loc}', '{block_id}');
        """)
        cta_row_id = secrets.token_hex(12)
        run_sql(f"""
            INSERT INTO articles_blocks_cta_c_t_as
              (id, _order, _parent_id, _locale, text, url, target, variant)
            VALUES
              ('{cta_row_id}', 1, '{block_id}', '{loc}', '{esc(l['cta_text'])}', '{esc(url)}', '_self', 'primary');
        """)

    # 2. matching _articles_v_blocks_cta (keep admin in sync)
    v_parent_id = run_sql(f"SELECT id FROM _articles_v WHERE parent_id={article_id} AND latest=true;")
    if v_parent_id:
        v_block_pk = run_sql(f"""
            INSERT INTO _articles_v_blocks_cta (_order, _parent_id, _path, _uuid, block_name)
            VALUES (1, {v_parent_id}, 'version.dynamic_zone', '{block_id}', NULL)
            RETURNING id;
        """)
        for loc in ['hu', 'en']:
            l = spec['locales'][loc]
            run_sql(f"""
                INSERT INTO _articles_v_blocks_cta_locales
                  (badge_label, heading, heading_highlight, sub_heading, _locale, _parent_id)
                VALUES
                  ('{esc(l['badge_label'])}', '{esc(l['heading'])}', '{esc(l['heading_highlight'])}',
                   '{esc(l['sub_heading'])}', '{loc}', {v_block_pk});
            """)
            run_sql(f"""
                INSERT INTO _articles_v_blocks_cta_c_t_as
                  (_order, _parent_id, _locale, text, url, target, variant)
                VALUES
                  (1, {v_block_pk}, '{loc}', '{esc(l['cta_text'])}', '{esc(url)}', '_self', 'primary');
            """)
        print(f"article {article_id}: CTA block {block_id} added -> {url} (+ version row synced)")
    else:
        print(f"article {article_id}: CTA block {block_id} added -> {url} (no version row found to sync)")

if __name__ == '__main__':
    spec = json.load(open(sys.argv[1]))
    add_cta(spec)
