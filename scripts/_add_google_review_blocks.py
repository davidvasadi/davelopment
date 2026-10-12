"""
Appends a google-review-story + google-review-hero block pair to the end of
a page's dynamic_zone (live `pages` table + matching `_pages_v` version row
for admin visibility). Local DB only.
Usage: python3 _add_google_review_blocks.py <page_id> <spec.json>
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
    if s is None:
        return None
    return str(s).replace("'", "''")

def sqlval(v):
    return 'NULL' if v is None else f"'{esc(v)}'"

def add_blocks(page_id, spec):
    # dynamic_zone block _order starts at 1 per page; find current max across all block tables
    order_rows = run_sql(f"""
        SELECT COALESCE(MAX(o), 0) FROM (
          SELECT MAX(_order) o FROM pages_blocks_service_hero WHERE _parent_id={page_id}
          UNION ALL SELECT MAX(_order) FROM pages_blocks_services WHERE _parent_id={page_id}
          UNION ALL SELECT MAX(_order) FROM pages_blocks_faq WHERE _parent_id={page_id}
          UNION ALL SELECT MAX(_order) FROM pages_blocks_pricing WHERE _parent_id={page_id}
          UNION ALL SELECT MAX(_order) FROM pages_blocks_cta WHERE _parent_id={page_id}
          UNION ALL SELECT MAX(_order) FROM pages_blocks_related_services WHERE _parent_id={page_id}
          UNION ALL SELECT MAX(_order) FROM pages_blocks_newsletter WHERE _parent_id={page_id}
          UNION ALL SELECT MAX(_order) FROM pages_blocks_why_choose_us WHERE _parent_id={page_id}
        ) x;
    """)
    next_order = int(order_rows) + 1 if order_rows else 1
    story_order = next_order
    hero_order = next_order + 1
    story_idx = story_order - 1  # dynamic_zone path index is 0-based
    hero_idx = hero_order - 1

    v_parent_id = run_sql(f"SELECT id FROM _pages_v WHERE parent_id={page_id} AND latest=true;")

    # ── STORY block ── (minden locale saját egyedi block-id-t kap — ezt a
    # táblát Payload NEM _locales companion táblával oldja meg, hanem
    # soronként, locale-onként külön hex id-val, lásd pages_blocks_service_hero.)
    for loc in ['hu', 'en']:
        l = spec['story']['locales'][loc]
        block_id = secrets.token_hex(12)
        run_sql(f"""
            INSERT INTO pages_blocks_google_review_story
              (_order, _parent_id, _path, _locale, id, card1_heading, card1_cta_text, card1_cta_url, card2_media_id, card2_caption)
            VALUES
              ({story_order}, {page_id}, 'dynamic_zone', '{loc}', '{block_id}',
               {sqlval(l['card1_heading'])}, {sqlval(l['card1_cta_text'])}, {sqlval(spec['story']['card1_cta_url'])},
               {spec['story']['card2_media_id']}, {sqlval(l['card2_caption'])});
        """)
        if v_parent_id:
            run_sql(f"""
                INSERT INTO _pages_v_blocks_google_review_story
                  (_order, _parent_id, _path, _locale, card1_heading, card1_cta_text, card1_cta_url, card2_media_id, card2_caption, _uuid)
                VALUES
                  ({story_order}, {v_parent_id}, 'version.dynamic_zone', '{loc}',
                   {sqlval(l['card1_heading'])}, {sqlval(l['card1_cta_text'])}, {sqlval(spec['story']['card1_cta_url'])},
                   {spec['story']['card2_media_id']}, {sqlval(l['card2_caption'])}, '{block_id}');
            """)

    # ── HERO block ──
    for loc in ['hu', 'en']:
        l = spec['hero']['locales'][loc]
        block_id = secrets.token_hex(12)
        run_sql(f"""
            INSERT INTO pages_blocks_google_review_hero
              (_order, _parent_id, _path, _locale, id, image_id, eyebrow, heading, description)
            VALUES
              ({hero_order}, {page_id}, 'dynamic_zone', '{loc}', '{block_id}',
               {spec['hero']['image_id']}, {sqlval(l['eyebrow'])}, {sqlval(l['heading'])}, {sqlval(l['description'])});
        """)
        for i, tag in enumerate(l['tags'], start=1):
            tag_id = secrets.token_hex(12)
            run_sql(f"""
                INSERT INTO pages_blocks_google_review_hero_tags (id, _order, _parent_id, _locale, label)
                VALUES ('{tag_id}', {i}, '{block_id}', '{loc}', {sqlval(tag)});
            """)
        if v_parent_id:
            v_hero_pk = run_sql(f"""
                INSERT INTO _pages_v_blocks_google_review_hero
                  (_order, _parent_id, _path, _locale, image_id, eyebrow, heading, description, _uuid)
                VALUES
                  ({hero_order}, {v_parent_id}, 'version.dynamic_zone', '{loc}',
                   {spec['hero']['image_id']}, {sqlval(l['eyebrow'])}, {sqlval(l['heading'])}, {sqlval(l['description'])}, '{block_id}')
                RETURNING id;
            """)
            for i, tag in enumerate(l['tags'], start=1):
                run_sql(f"""
                    INSERT INTO _pages_v_blocks_google_review_hero_tags (_order, _parent_id, _locale, label)
                    VALUES ({i}, {v_hero_pk}, '{loc}', {sqlval(tag)});
                """)

    synced = ' (+ admin version synced)' if v_parent_id else ' (no version row found to sync)'
    print(f"page {page_id}: story block @ idx {story_idx} (order {story_order}), hero block @ idx {hero_idx} (order {hero_order}){synced}")

if __name__ == '__main__':
    page_id = int(sys.argv[1])
    spec = json.load(open(sys.argv[2]))
    add_blocks(page_id, spec)
