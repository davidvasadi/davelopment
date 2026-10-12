"""
Removes the trailing "Kapcsolódó cikkek" heading + link paragraphs from an
article's HU content (both live `articles_locales` and the matching
`_articles_v_locales` version row) — redundant with the site's existing
automatic Előző/Következő article navigator. Local DB only.
Usage: python3 _remove_related_links_section.py <article_id> <from_index>
"""
import os
import json
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
        sys.exit(1)
    return result.stdout.strip()

def run_sql_raw(sql):
    result = subprocess.run(['psql', DB_URL, '-q', '-v', 'ON_ERROR_STOP=1', '-c', sql], capture_output=True, text=True)
    if result.returncode != 0:
        print('SQL ERROR:', result.stderr, file=sys.stderr)
        sys.exit(1)

def remove(article_id, from_index):
    raw = run_sql(f"SELECT content FROM articles_locales WHERE _parent_id={article_id} AND _locale='hu';")
    content = json.loads(raw)
    removed = content['root']['children'][from_index:]
    content['root']['children'] = content['root']['children'][:from_index]
    content_str = json.dumps(content, ensure_ascii=False).replace("'", "''")
    run_sql_raw(f"UPDATE articles_locales SET content = '{content_str}'::jsonb WHERE _parent_id={article_id} AND _locale='hu';")

    v_raw = run_sql(f"""
        SELECT vl.version_content FROM _articles_v_locales vl
        JOIN _articles_v v ON v.id = vl._parent_id
        WHERE v.parent_id={article_id} AND v.latest=true AND vl._locale='hu';
    """)
    if v_raw:
        v_content = json.loads(v_raw)
        v_content['root']['children'] = v_content['root']['children'][:from_index]
        v_content_str = json.dumps(v_content, ensure_ascii=False).replace("'", "''")
        run_sql_raw(f"""
            UPDATE _articles_v_locales SET version_content = '{v_content_str}'::jsonb
            WHERE _parent_id = (SELECT id FROM _articles_v WHERE parent_id={article_id} AND latest=true)
              AND _locale='hu';
        """)
        print(f"article {article_id}: removed {len(removed)} nodes from index {from_index} (live + version)")
    else:
        print(f"article {article_id}: removed {len(removed)} nodes from index {from_index} (live only, no version row)")

if __name__ == '__main__':
    remove(int(sys.argv[1]), int(sys.argv[2]))
