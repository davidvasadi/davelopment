"""
One-off, local-only helper: builds a new 'pages' collection entry (hero +
faq + cta blocks, hu+en) directly in the local Postgres DB, matching the
exact schema/relationship conventions of existing service pages (verified
against page id 224, seo-tartalommarketing). LOCAL DB ONLY — never touches
production. Not meant to be reused/generalized; delete after use.
"""
import os
import secrets
import subprocess
import sys

DB_URL = None
with open(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')) as f:
    for line in f:
        if line.startswith('DATABASE_URI='):
            DB_URL = line.strip().split('=', 1)[1]
            break

def hexid():
    return secrets.token_hex(12)

def run_sql(sql):
    result = subprocess.run(
        ['psql', DB_URL, '-q', '-t', '-A', '-v', 'ON_ERROR_STOP=1', '-c', sql],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print('SQL ERROR:', result.stderr, file=sys.stderr)
        print('SQL:', sql[:500], file=sys.stderr)
        sys.exit(1)
    # Keep only lines that look like real data (drop any stray status/notice lines).
    lines = [l for l in result.stdout.strip().splitlines() if l.strip()]
    return lines[0].strip() if lines else ''

def esc(s):
    return s.replace("'", "''")

def build_page(spec):
    # 1. pages
    page_id = run_sql("INSERT INTO pages (_status) VALUES ('published') RETURNING id;")
    print(f"page id = {page_id}")

    # 2. pages_locales (hu + en)
    for loc in ['hu', 'en']:
        l = spec['locales'][loc]
        run_sql(f"""
            INSERT INTO pages_locales (label, slug, seo_meta_title, seo_meta_description, _locale, _parent_id)
            VALUES ('{esc(l['label'])}', '{esc(l['slug'])}', '{esc(l['seo_title'])}', '{esc(l['seo_desc'])}', '{loc}', {page_id});
        """)

    order = 1

    # 3. service_hero block (+ its own stat-card CTA button)
    for loc in ['hu', 'en']:
        h = spec['hero']
        bid = hexid()
        run_sql(f"""
            INSERT INTO pages_blocks_service_hero
              (id, _order, _parent_id, _path, _locale, badge_label, heading, sub_heading, stat_label, stat_description)
            VALUES
              ('{bid}', {order}, {page_id}, 'dynamic_zone', '{loc}',
               '{esc(h['badge_label'][loc])}', '{esc(h['heading'][loc])}',
               '{esc(h['sub_heading'][loc])}', '{esc(h['stat_label'][loc])}', '{esc(h['stat_description'][loc])}');
        """)
        btn_id = hexid()
        run_sql(f"""
            INSERT INTO pages_blocks_service_hero_c_t_as (id, _order, _parent_id, _locale, text, url, target, variant)
            VALUES ('{btn_id}', 1, '{bid}', '{loc}', '{esc(h['button_text'][loc])}', '{esc(h['button_url'])}', '_self', 'primary');
        """)
    order += 1

    # 4. faq block + faqs collection entries + pages_rels links
    faq_block_index = order - 1  # 0-based index within dynamic_zone for pages_rels path
    for loc in ['hu', 'en']:
        bid = hexid()
        run_sql(f"""
            INSERT INTO pages_blocks_faq (id, _order, _parent_id, _path, _locale, heading, sub_heading)
            VALUES ('{bid}', {order}, {page_id}, 'dynamic_zone', '{loc}', 'FAQ.', '{esc(spec['faq_sub'][loc])}');
        """)
    order += 1

    rel_order = 1
    for item in spec['faqs']:
        faq_id = run_sql("INSERT INTO faqs DEFAULT VALUES RETURNING id;")
        for loc in ['hu', 'en']:
            run_sql(f"""
                INSERT INTO faqs_locales (question, answer, _locale, _parent_id)
                VALUES ('{esc(item['q'][loc])}', '{esc(item['a'][loc])}', '{loc}', {faq_id});
            """)
            run_sql(f"""
                INSERT INTO pages_rels ("order", parent_id, path, locale, faqs_id)
                VALUES ({rel_order}, {page_id}, 'dynamic_zone.{faq_block_index}.faqs', '{loc}', {faq_id});
            """)
        rel_order += 1

    # 5. cta block + button
    for loc in ['hu', 'en']:
        c = spec['cta']
        bid = hexid()
        run_sql(f"""
            INSERT INTO pages_blocks_cta (id, _order, _parent_id, _path, _locale, heading, sub_heading)
            VALUES ('{bid}', {order}, {page_id}, 'dynamic_zone', '{loc}', '{esc(c['heading'][loc])}', '{esc(c['sub_heading'][loc])}');
        """)
        btn_id = hexid()
        run_sql(f"""
            INSERT INTO pages_blocks_cta_c_t_as (id, _order, _parent_id, _locale, text, url, variant)
            VALUES ('{btn_id}', 1, '{bid}', '{loc}', '{esc(c['button_text'][loc])}', '{esc(c['button_url'])}', 'primary');
        """)
    order += 1

    # 6. services block (rich "steps" capability accordion) — OPTIONAL, inserted
    # right after service_hero (order 2), before faq/cta get bumped.
    if 'services_block' in spec:
        sv = spec['services_block']
        for loc in ['hu', 'en']:
            sbid = hexid()
            run_sql(f"""
                INSERT INTO pages_blocks_services (id, _order, _parent_id, _path, _locale, heading, sub_heading, badge_label)
                VALUES ('{sbid}', 2, {page_id}, 'dynamic_zone', '{loc}', '{esc(sv['heading'][loc])}', '{esc(sv['sub_heading'][loc])}', '{esc(sv['badge_label'][loc])}');
            """)
            for item in sv['items']:
                iid = hexid()
                run_sql(f"""
                    INSERT INTO pages_blocks_services_elements_service_item
                      (id, _order, _parent_id, _locale, title, description, icon, number, categories_title)
                    VALUES
                      ('{iid}', {item['order']}, '{sbid}', '{loc}', '{esc(item['title'][loc])}', '{esc(item['description'][loc])}',
                       '{item['icon']}', '{item['number']}', '{esc(item['categories_title'][loc])}');
                """)
                for s_ord, stat in enumerate(item.get('stats', []), start=1):
                    sid = hexid()
                    run_sql(f"""
                        INSERT INTO pages_blocks_services_elements_service_item_stats (id, _order, _parent_id, _locale, value, suffix, label)
                        VALUES ('{sid}', {s_ord}, '{iid}', '{loc}', '{esc(stat['value'])}', '{esc(stat['suffix'])}', '{esc(stat['label'][loc])}');
                    """)
                for c_ord, cat in enumerate(item.get('categories', []), start=1):
                    cid = hexid()
                    run_sql(f"""
                        INSERT INTO pages_blocks_services_elements_service_item_categories (id, _order, _parent_id, _locale, label)
                        VALUES ('{cid}', {c_ord}, '{iid}', '{loc}', '{esc(cat[loc])}');
                    """)
        # Renumber faq/cta to come after the services block (now order 2).
        run_sql(f"UPDATE pages_blocks_faq SET _order = 3 WHERE _parent_id = {page_id};")
        run_sql(f"UPDATE pages_blocks_cta SET _order = 4 WHERE _parent_id = {page_id};")

    print(f"DONE — page id {page_id}, slug hu='{spec['locales']['hu']['slug']}' en='{spec['locales']['en']['slug']}'")
    return page_id


if __name__ == '__main__':
    import json
    spec = json.load(open(sys.argv[1]))
    build_page(spec)
