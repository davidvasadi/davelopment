"""
Appends new FAQ items to an EXISTING faq block on a page (new faqs
collection entries + pages_rels links at the correct dynamic_zone index).
Local DB only. Usage: python3 _add_faq_items.py <page_id> <faq_block_index_0based> <spec.json>
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

def add_faq_items(page_id, block_index, items, start_order):
    v_parent_id = run_sql(f"SELECT id FROM _pages_v WHERE parent_id={page_id} AND latest=true;")
    v_rel_order = None
    if v_parent_id:
        maxo = run_sql(f"SELECT COALESCE(MAX(\"order\"), 0) FROM _pages_v_rels WHERE parent_id={v_parent_id};")
        v_rel_order = int(maxo) + 1 if maxo else 1

    rel_order = start_order
    for item in items:
        faq_id = run_sql("INSERT INTO faqs DEFAULT VALUES RETURNING id;")
        for loc in ['hu', 'en']:
            run_sql(f"""
                INSERT INTO faqs_locales (question, answer, _locale, _parent_id)
                VALUES ('{esc(item['q'][loc])}', '{esc(item['a'][loc])}', '{loc}', {faq_id});
            """)
            run_sql(f"""
                INSERT INTO pages_rels ("order", parent_id, path, locale, faqs_id)
                VALUES ({rel_order}, {page_id}, 'dynamic_zone.{block_index}.faqs', '{loc}', {faq_id});
            """)
            if v_parent_id:
                run_sql(f"""
                    INSERT INTO _pages_v_rels ("order", parent_id, path, locale, faqs_id)
                    VALUES ({v_rel_order}, {v_parent_id}, 'version.dynamic_zone.{block_index}.faqs', '{loc}', {faq_id});
                """)
                v_rel_order += 1
        rel_order += 1
    synced = ' (+ admin version synced)' if v_parent_id else ' (no version row found to sync)'
    print(f"{len(items)} FAQ items added to page {page_id}{synced}")

if __name__ == '__main__':
    page_id = int(sys.argv[1])
    block_index = int(sys.argv[2])
    spec = json.load(open(sys.argv[3]))
    start_order = int(sys.argv[4]) if len(sys.argv) > 4 else 100
    add_faq_items(page_id, block_index, spec, start_order)
