"""
Inserts new Lexical paragraph node(s) into an existing article's HU content
at a given index, syncing both the live `articles_locales` table and the
matching `_articles_v_locales` version row. Local DB only.
Usage: python3 _insert_keyword_paragraph.py <article_id> <after_index> <nodes.json>
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

def insert(article_id, after_index, new_nodes):
    raw = run_sql(f"SELECT content FROM articles_locales WHERE _parent_id={article_id} AND _locale='hu';")
    content = json.loads(raw)
    children = content['root']['children']
    children[after_index+1:after_index+1] = new_nodes
    content_str = json.dumps(content, ensure_ascii=False).replace("'", "''")
    run_sql_raw(f"UPDATE articles_locales SET content = '{content_str}'::jsonb WHERE _parent_id={article_id} AND _locale='hu';")

    v_raw = run_sql(f"""
        SELECT vl.version_content FROM _articles_v_locales vl
        JOIN _articles_v v ON v.id = vl._parent_id
        WHERE v.parent_id={article_id} AND v.latest=true AND vl._locale='hu';
    """)
    if v_raw:
        v_content = json.loads(v_raw)
        v_children = v_content['root']['children']
        v_children[after_index+1:after_index+1] = new_nodes
        v_content_str = json.dumps(v_content, ensure_ascii=False).replace("'", "''")
        run_sql_raw(f"""
            UPDATE _articles_v_locales SET version_content = '{v_content_str}'::jsonb
            WHERE _parent_id = (SELECT id FROM _articles_v WHERE parent_id={article_id} AND latest=true)
              AND _locale='hu';
        """)
        print(f"article {article_id}: live + version content both updated ({len(new_nodes)} nodes after index {after_index})")
    else:
        print(f"article {article_id}: live content updated (no version row found to sync)")

if __name__ == '__main__':
    article_id = int(sys.argv[1])
    after_index = int(sys.argv[2])
    nodes = json.load(open(sys.argv[3]))
    insert(article_id, after_index, nodes)
