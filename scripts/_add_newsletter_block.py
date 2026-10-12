"""
Appends the newsletter block (same copy as the main weboldal-keszites page,
only `source` differs per page) to a service page's dynamic_zone — live +
version tables, both locales. Local DB only.
Usage: python3 _add_newsletter_block.py <page_id> <order> <source_slug>
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

def run_sql(sql):
    result = subprocess.run(['psql', DB_URL, '-q', '-t', '-A', '-v', 'ON_ERROR_STOP=1', '-c', sql], capture_output=True, text=True)
    if result.returncode != 0:
        print('SQL ERROR:', result.stderr, file=sys.stderr)
        print('SQL:', sql[:800], file=sys.stderr)
        sys.exit(1)
    lines = [l for l in result.stdout.strip().splitlines() if l.strip()]
    return lines[0].strip() if lines else ''

def esc(s):
    return str(s).replace("'", "''")

CONTENT = {
    'hu': dict(
        title='Hírlevél',
        heading_left='Akár új weboldalt szeretnél, akár erősebb márkát vagy mérhetőbb eredményeket,',
        heading_right='itt vagyunk,hogy segítsünk.',
        description='Iratkozz fel a hírlevélre, és értesülj elsőként a friss webes és digitális trendekről.',
        profile_name='Vasadi Dávid',
        profile_role='Csapatvezető',
        inputs=[('text', 'name', 'Név*'), ('email', 'email', 'Email')],
    ),
    'en': dict(
        title='Newsletter',
        heading_left="Whether you want a new website, a stronger brand, or more measurable results,",
        heading_right="we're here to help.",
        description='Subscribe to our newsletter and be the first to know about the latest web and digital trends.',
        profile_name='Vasadi Dávid',
        profile_role='Team Lead',
        inputs=[('text', 'name', 'Name*'), ('email', 'email', 'Email')],
    ),
}
PROFILE_IMAGE_ID = 33

def add_newsletter(page_id, order, source_slug):
    v_parent_id = run_sql(f"SELECT id FROM _pages_v WHERE parent_id={page_id} AND latest=true;")

    for loc in ['hu', 'en']:
        c = CONTENT[loc]
        block_id = secrets.token_hex(12)
        run_sql(f"""
            INSERT INTO pages_blocks_newsletter
              (_order, _parent_id, _path, _locale, id, title, heading_left, heading_right, description, source, profile_name, profile_role, profile_image_id)
            VALUES
              ({order}, {page_id}, 'dynamic_zone', '{loc}', '{block_id}',
               '{esc(c["title"])}', '{esc(c["heading_left"])}', '{esc(c["heading_right"])}',
               '{esc(c["description"])}', '{esc(source_slug)}', '{esc(c["profile_name"])}', '{esc(c["profile_role"])}', {PROFILE_IMAGE_ID});
        """)
        for i, (itype, iname, iplaceholder) in enumerate(c['inputs'], start=1):
            input_id = secrets.token_hex(12)
            run_sql(f"""
                INSERT INTO pages_blocks_newsletter_form_inputs (id, _order, _parent_id, _locale, type, name, placeholder)
                VALUES ('{input_id}', {i}, '{block_id}', '{loc}', '{itype}', '{iname}', '{esc(iplaceholder)}');
            """)

        if v_parent_id:
            v_pk = run_sql(f"""
                INSERT INTO _pages_v_blocks_newsletter
                  (_order, _parent_id, _path, _locale, title, heading_left, heading_right, description, source, profile_name, profile_role, profile_image_id, _uuid)
                VALUES
                  ({order}, {v_parent_id}, 'version.dynamic_zone', '{loc}',
                   '{esc(c["title"])}', '{esc(c["heading_left"])}', '{esc(c["heading_right"])}',
                   '{esc(c["description"])}', '{esc(source_slug)}', '{esc(c["profile_name"])}', '{esc(c["profile_role"])}', {PROFILE_IMAGE_ID}, '{block_id}')
                RETURNING id;
            """)
            for i, (itype, iname, iplaceholder) in enumerate(c['inputs'], start=1):
                run_sql(f"""
                    INSERT INTO _pages_v_blocks_newsletter_form_inputs (_order, _parent_id, _locale, type, name, placeholder)
                    VALUES ({i}, {v_pk}, '{loc}', '{itype}', '{iname}', '{esc(iplaceholder)}');
                """)

    synced = ' (+ admin version synced)' if v_parent_id else ' (no version row found)'
    print(f"page {page_id}: newsletter block added @ order {order}{synced}")

if __name__ == '__main__':
    add_newsletter(int(sys.argv[1]), int(sys.argv[2]), sys.argv[3])
