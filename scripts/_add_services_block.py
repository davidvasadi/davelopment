"""
Adds a 'services' (rich capability-accordion) block to an EXISTING page,
right after its service_hero (order 2), bumping faq/cta orders. Local DB
only. Usage: python3 _add_services_block.py <page_id> <spec.json>
"""
import os
import secrets
import subprocess
import sys
import json

DB_URL = None
with open(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')) as f:
    for line in f:
        if line.startswith('DATABASE_URI='):
            DB_URL = line.strip().split('=', 1)[1]
            break

def hexid():
    return secrets.token_hex(12)

def run_sql(sql):
    result = subprocess.run(['psql', DB_URL, '-q', '-t', '-A', '-v', 'ON_ERROR_STOP=1', '-c', sql], capture_output=True, text=True)
    if result.returncode != 0:
        print('SQL ERROR:', result.stderr, file=sys.stderr)
        print('SQL:', sql[:500], file=sys.stderr)
        sys.exit(1)
    lines = [l for l in result.stdout.strip().splitlines() if l.strip()]
    return lines[0].strip() if lines else ''

def esc(s):
    return s.replace("'", "''")

def add_services_block(page_id, sv):
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
    run_sql(f"UPDATE pages_blocks_faq SET _order = 3 WHERE _parent_id = {page_id};")
    run_sql(f"UPDATE pages_blocks_cta SET _order = 4 WHERE _parent_id = {page_id};")
    print(f"services block added to page {page_id}")

if __name__ == '__main__':
    page_id = int(sys.argv[1])
    sv = json.load(open(sys.argv[2]))
    add_services_block(page_id, sv)
