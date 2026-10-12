"""
Updates the content (image + eyebrow/heading/description + tags) of an
existing google-review-hero block instance on a page, for both locales,
live + version tables. Local DB only.
Usage: python3 _update_hero_content.py <page_id> <spec.json>
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
    return [l for l in result.stdout.strip().splitlines() if l.strip()]

def esc(s):
    return str(s).replace("'", "''")

def update(page_id, spec):
    image_id = spec['image_id']
    v_parent_id = (run_sql(f"SELECT id FROM _pages_v WHERE parent_id={page_id} AND latest=true;") or [None])[0]

    for loc in ['hu', 'en']:
        l = spec['locales'][loc]
        block_id = (run_sql(f"SELECT id FROM pages_blocks_google_review_hero WHERE _parent_id={page_id} AND _locale='{loc}';") or [None])[0]
        if not block_id:
            print(f"page {page_id} [{loc}]: no existing google-review-hero block found, skipping"); continue

        run_sql(f"""
            UPDATE pages_blocks_google_review_hero
            SET image_id={image_id}, eyebrow='{esc(l['eyebrow'])}', heading='{esc(l['heading'])}', description='{esc(l['description'])}'
            WHERE id='{block_id}';
        """)
        run_sql(f"DELETE FROM pages_blocks_google_review_hero_tags WHERE _parent_id='{block_id}';")
        for i, tag in enumerate(l['tags'], start=1):
            tag_id = secrets.token_hex(12)
            run_sql(f"""
                INSERT INTO pages_blocks_google_review_hero_tags (id, _order, _parent_id, _locale, label)
                VALUES ('{tag_id}', {i}, '{block_id}', '{loc}', '{esc(tag)}');
            """)

        if v_parent_id:
            v_pk = (run_sql(f"SELECT id FROM _pages_v_blocks_google_review_hero WHERE _parent_id={v_parent_id} AND _locale='{loc}';") or [None])[0]
            if v_pk:
                run_sql(f"""
                    UPDATE _pages_v_blocks_google_review_hero
                    SET image_id={image_id}, eyebrow='{esc(l['eyebrow'])}', heading='{esc(l['heading'])}', description='{esc(l['description'])}'
                    WHERE id={v_pk};
                """)
                run_sql(f"DELETE FROM _pages_v_blocks_google_review_hero_tags WHERE _parent_id={v_pk};")
                for i, tag in enumerate(l['tags'], start=1):
                    run_sql(f"""
                        INSERT INTO _pages_v_blocks_google_review_hero_tags (_order, _parent_id, _locale, label)
                        VALUES ({i}, {v_pk}, '{loc}', '{esc(tag)}');
                    """)

    print(f"page {page_id}: hero block content updated (image {image_id})")

if __name__ == '__main__':
    page_id = int(sys.argv[1])
    spec = json.load(open(sys.argv[2]))
    update(page_id, spec)
