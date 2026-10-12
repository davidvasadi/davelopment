"""
Adds a 'pricing' block (reusing the SAME 4 plan docs already used on the
real /hu/arak page — Mikró 43, Rajt 41, Növekedés 42, Partner 45, never
duplicated) to an existing page, right before its cta block. Bumps cta's
order by 1. Local DB only. Usage: python3 _add_pricing_block.py <page_id>
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
    result = subprocess.run(['psql', DB_URL, '-q', '-t', '-A', '-v', 'ON_ERROR_STOP=1', '-c', sql], capture_output=True, text=True)
    if result.returncode != 0:
        print('SQL ERROR:', result.stderr, file=sys.stderr)
        print('SQL:', sql[:500], file=sys.stderr)
        sys.exit(1)
    lines = [l for l in result.stdout.strip().splitlines() if l.strip()]
    return lines[0].strip() if lines else ''

def esc(s):
    return s.replace("'", "''")

PLAN_IDS = [43, 41, 42, 45]  # Mikró, Rajt, Növekedés, Partner — same real plans as /hu/arak

COPY = {
    'hu': {
        'heading': 'Árak.',
        'badge_label': 'Egyszerű árak',
        'question': 'Több forgalmat és megkeresést szeretnél?',
        'profile_label': 'Vasadi Dávid',
        'profile_job': 'Kapcsolattartó',
    },
    'en': {
        'heading': 'Pricing.',
        'badge_label': 'Simple pricing',
        'question': 'Want more traffic and more inquiries?',
        'profile_label': 'Dávid Vasadi',
        'profile_job': 'Point of contact',
    },
}

def add_pricing_block(page_id, cta_order):
    pricing_order = cta_order  # pricing takes the CTA's old slot, CTA moves after
    for loc in ['hu', 'en']:
        c = COPY[loc]
        pbid = hexid()
        run_sql(f"""
            INSERT INTO pages_blocks_pricing
              (id, _order, _parent_id, _path, _locale, heading, badge_label, question, profile_label, profile_job)
            VALUES
              ('{pbid}', {pricing_order}, {page_id}, 'dynamic_zone', '{loc}',
               '{esc(c['heading'])}', '{esc(c['badge_label'])}', '{esc(c['question'])}', '{esc(c['profile_label'])}', '{esc(c['profile_job'])}');
        """)
        block_index = pricing_order - 1  # 0-based index for pages_rels path
        for order, plan_id in enumerate(PLAN_IDS, start=1):
            run_sql(f"""
                INSERT INTO pages_rels ("order", parent_id, path, locale, plans_id)
                VALUES ({order}, {page_id}, 'dynamic_zone.{block_index}.plans', '{loc}', {plan_id});
            """)
    run_sql(f"UPDATE pages_blocks_cta SET _order = {cta_order + 1} WHERE _parent_id = {page_id};")
    print(f"pricing block added to page {page_id} at order {pricing_order}")

if __name__ == '__main__':
    page_id = int(sys.argv[1])
    cta_order = int(sys.argv[2])
    add_pricing_block(page_id, cta_order)
