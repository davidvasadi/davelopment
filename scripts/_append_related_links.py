"""
Appends extra Lexical nodes (a "Kapcsolódó cikkek" section) to an existing
article's HU content, in both the live `articles_locales` table and the
matching `_articles_v_locales` version row (so admin + frontend stay in
sync). Local DB only.
Usage: python3 _append_related_links.py <article_id> <append_nodes.json>
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
        print('SQL:', sql[:500], file=sys.stderr)
        sys.exit(1)
    return result.stdout.strip()

def run_sql_raw(sql):
    result = subprocess.run(['psql', DB_URL, '-q', '-v', 'ON_ERROR_STOP=1', '-c', sql], capture_output=True, text=True)
    if result.returncode != 0:
        print('SQL ERROR:', result.stderr, file=sys.stderr)
        sys.exit(1)

def main(article_id, append_nodes):
    # 1. live table
    raw = run_sql(f"SELECT content FROM articles_locales WHERE _parent_id={article_id} AND _locale='hu';")
    content = json.loads(raw)
    content['root']['children'].extend(append_nodes)
    content_str = json.dumps(content, ensure_ascii=False).replace("'", "''")
    run_sql_raw(f"UPDATE articles_locales SET content = '{content_str}'::jsonb WHERE _parent_id={article_id} AND _locale='hu';")

    # 2. matching _articles_v_locales (keep admin in sync)
    v_raw = run_sql(f"""
        SELECT vl.version_content FROM _articles_v_locales vl
        JOIN _articles_v v ON v.id = vl._parent_id
        WHERE v.parent_id={article_id} AND v.latest=true AND vl._locale='hu';
    """)
    if v_raw:
        v_content = json.loads(v_raw)
        v_content['root']['children'].extend(append_nodes)
        v_content_str = json.dumps(v_content, ensure_ascii=False).replace("'", "''")
        run_sql_raw(f"""
            UPDATE _articles_v_locales SET version_content = '{v_content_str}'::jsonb
            WHERE _parent_id = (SELECT id FROM _articles_v WHERE parent_id={article_id} AND latest=true)
              AND _locale='hu';
        """)
        print(f"article {article_id}: live + version content both updated")
    else:
        print(f"article {article_id}: live content updated (no version row found to sync)")

if __name__ == '__main__':
    article_id = int(sys.argv[1])
    nodes = json.load(open(sys.argv[2]))
    main(article_id, nodes)
