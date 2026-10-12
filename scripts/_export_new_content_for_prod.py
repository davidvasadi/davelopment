"""
Generikus, séma-introspekciós exportáló: a lokális DB-ből kigyűjti és
INSERT ... ON CONFLICT (pkey) DO NOTHING SQL-ként exportálja egy adott
`pages`/`articles` sor TELJES tartalmát (maga a sor, a _locales, a
pages_rels/articles_rels sorai, MINDEN pages_blocks_*/articles_blocks_*
tábla sora ami rá hivatkozik, ezek al-táblái (pl. cta c_t_as, newsletter
form_inputs, hero tags), és ugyanez a _pages_v/_articles_v verziós tükörre
is.

Azért séma-introspekciós (nem kézzel felsorolt tábla-lista), mert Payloadnál
rengeteg blokk-tábla van, és egyet kihagyni pont azt a fajta hibát okozná,
amit ma már egyszer megtapasztaltunk (hiányzó tábla -> 500-as hiba élesben).

Az ON CONFLICT DO NOTHING miatt a kimenet biztonságosan újrafuttatható és
nem írja felül véletlenül azt, ami esetleg már odakerült.

Használat:
    python3 _export_new_content_for_prod.py > /tmp/content_sync.sql
"""
import os
import psycopg2
import psycopg2.extras

DB_URL = None
with open(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env')) as f:
    for line in f:
        if line.startswith('DATABASE_URI='):
            DB_URL = line.strip().split('=', 1)[1]
            break

conn = psycopg2.connect(DB_URL)
conn.autocommit = True
cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)


def q(sql, params=None):
    cur.execute(sql, params or [])
    return cur.fetchall()


def sql_lit(v):
    if v is None:
        return 'NULL'
    if isinstance(v, bool):
        return 'TRUE' if v else 'FALSE'
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, (dict, list)):
        import json
        return "'" + json.dumps(v).replace("'", "''") + "'::jsonb"
    s = str(v).replace("'", "''")
    return f"'{s}'"


_pk_cache = {}


def pk_column(table):
    if table not in _pk_cache:
        rows = q("""
            SELECT a.attname
            FROM pg_index i
            JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
            WHERE i.indrelid = %s::regclass AND i.indisprimary
        """, [table])
        _pk_cache[table] = rows[0]['attname'] if rows else None
    return _pk_cache[table]


def emit_insert(table, row):
    cols = list(row.keys())
    col_list = ', '.join(f'"{c}"' for c in cols)
    val_list = ', '.join(sql_lit(row[c]) for c in cols)

    # `*_locales` tables (pages_locales, articles_locales, faqs_locales, and
    # their _v mirrors) have their OWN surrogate id, which can drift between
    # environments independently of the parent — conflict on the parent's
    # own id would then miss a real duplicate. They DO have a genuine
    # natural-key unique index on (_locale, _parent_id); match on THAT
    # instead (lesson from docs/audit/2026-09-29-deploy-runbook.md point 5).
    if table.endswith('_locales') and '_locale' in cols and '_parent_id' in cols:
        update_cols = [c for c in cols if c not in ('id', '_locale', '_parent_id')]
        set_clause = ', '.join(f'"{c}" = EXCLUDED."{c}"' for c in update_cols)
        conflict = f' ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET {set_clause}' if update_cols else ' ON CONFLICT ("_locale", "_parent_id") DO NOTHING'
    else:
        pk = pk_column(table)
        conflict = f' ON CONFLICT ("{pk}") DO NOTHING' if pk else ' ON CONFLICT DO NOTHING'

    print(f'INSERT INTO "{table}" ({col_list}) VALUES ({val_list}){conflict};')


def child_tables_of(prefix):
    """All tables whose name starts with prefix + '_' (e.g. pages_blocks_)."""
    rows = q("""
        SELECT table_name FROM information_schema.tables
        WHERE table_schema='public' AND table_name LIKE %s
        ORDER BY table_name
    """, [prefix + '%'])
    return [r['table_name'] for r in rows]


_fk_cache = {}


def tables_fk_referencing(target_table, via_column='_parent_id'):
    """Tables that have a FK column (named via_column) whose foreign key
    constraint references target_table — i.e. TRUE direct children, found
    via the actual FK catalog rather than naive name-prefix matching (which
    wrongly conflates e.g. articles_blocks_cta with its own child
    articles_blocks_cta_c_t_as, whose _parent_id is a different type).
    Excludes known non-block sibling tables (_locales/_rels) which also
    legitimately FK to the parent via _parent_id but are handled separately."""
    key = (target_table, via_column)
    if key not in _fk_cache:
        rows = q("""
            SELECT tc.table_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage ccu
              ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
              AND kcu.column_name = %s
              AND ccu.table_name = %s
              AND tc.table_schema = 'public'
            ORDER BY tc.table_name
        """, [via_column, target_table])
        names = [r['table_name'] for r in rows]
        names = [n for n in names if not n.endswith('_locales') and not n.endswith('_rels')]
        _fk_cache[key] = names
    return _fk_cache[key]


def has_column(table, col):
    rows = q("""
        SELECT 1 FROM information_schema.columns
        WHERE table_name=%s AND column_name=%s
    """, [table, col])
    return bool(rows)


def export_tree_from(parent_table, parent_id, only_child_tables=None):
    """Recursively walks the REAL foreign-key tree (via the FK catalog, not
    name-prefix guessing): finds every table whose _parent_id FK references
    parent_table, exports its rows for this parent_id, then recurses into
    each of those rows using ITS OWN table+pk as the new parent — this
    naturally reaches every nesting level (block -> c_t_as / tags /
    form_inputs) regardless of how deep it goes, and never confuses a
    sub-table's _parent_id (varchar, references the block row) with the
    page/article's own integer pk."""
    children = tables_fk_referencing(parent_table, '_parent_id')
    if only_child_tables is not None:
        children = [c for c in children if c in only_child_tables]
    for t in children:
        rows = q(f'SELECT * FROM "{t}" WHERE _parent_id = %s', [parent_id])
        for row in rows:
            emit_insert(t, row)
            pk = pk_column(t)
            if pk and row.get(pk) is not None:
                export_tree_from(t, row[pk])


def export_simple_doc(collection, doc_id):
    """Main row + its _locales table only (no blocks/versions) — used for
    referenced docs like `faqs` that a page/article points to via *_rels."""
    print(f'\n-- ===== {collection} id={doc_id} (referenced) =====')
    for row in q(f'SELECT * FROM "{collection}" WHERE id = %s', [doc_id]):
        emit_insert(collection, row)
    loc_table = f'{collection}_locales'
    if loc_table in {t for t in child_tables_of(collection)}:
        for row in q(f'SELECT * FROM "{loc_table}" WHERE _parent_id = %s', [doc_id]):
            emit_insert(loc_table, row)


def export_collection_doc(collection, doc_id):
    """Full export for one `pages` or `articles` row: main row, _locales,
    _rels (as parent), all *_blocks_* trees, and the _<collection>_v mirror
    (+ its own locales/blocks/rels) for the SAME doc."""
    print(f'\n-- ===== {collection} id={doc_id} =====')

    main_rows = q(f'SELECT * FROM "{collection}" WHERE id = %s', [doc_id])
    for row in main_rows:
        emit_insert(collection, row)

    loc_table = f'{collection}_locales'
    for row in q(f'SELECT * FROM "{loc_table}" WHERE _parent_id = %s', [doc_id]):
        emit_insert(loc_table, row)

    rels_table = f'{collection}_rels'
    if has_column(rels_table, 'parent_id'):
        rel_rows = q(f'SELECT * FROM "{rels_table}" WHERE parent_id = %s', [doc_id])
        for row in rel_rows:
            emit_insert(rels_table, row)
        if has_column(rels_table, 'faqs_id'):
            for faq_id in {r['faqs_id'] for r in rel_rows if r.get('faqs_id') is not None}:
                export_simple_doc('faqs', faq_id)

    export_tree_from(collection, doc_id)

    # version mirror
    v_collection = f'_{collection}_v'
    v_rows = q(f'SELECT * FROM "{v_collection}" WHERE parent_id = %s', [doc_id])
    for vrow in v_rows:
        emit_insert(v_collection, vrow)
        vid = vrow['id']

        vloc_table = f'{v_collection}_locales'
        for row in q(f'SELECT * FROM "{vloc_table}" WHERE _parent_id = %s', [vid]):
            emit_insert(vloc_table, row)

        vrels_table = f'{v_collection}_rels'
        if has_column(vrels_table, 'parent_id'):
            for row in q(f'SELECT * FROM "{vrels_table}" WHERE parent_id = %s', [vid]):
                emit_insert(vrels_table, row)

        export_tree_from(v_collection, vid)


def export_new_blocks_on_existing_page(page_id, block_types):
    """For a page that ALREADY exists on prod, export only specific NEW
    block trees (by exact table name) added to it this session — not the
    whole page row (that already exists there)."""
    print(f'\n-- ===== existing page {page_id}: new blocks ({", ".join(block_types)}) =====')
    live_tables = {f'pages_blocks_{bt}' for bt in block_types}
    export_tree_from('pages', page_id, only_child_tables=live_tables)

    v_rows = q('SELECT id FROM "_pages_v" WHERE parent_id = %s', [page_id])
    for vrow in v_rows:
        vid = vrow['id']
        v_tables = {f'_pages_v_blocks_{bt}' for bt in block_types}
        export_tree_from('_pages_v', vid, only_child_tables=v_tables)


print('-- Generálva: _export_new_content_for_prod.py — ON CONFLICT DO NOTHING, biztonságosan újrafuttatható')
print('BEGIN;')

# Új cikkek
for aid in [57, 58, 59, 60]:
    export_collection_doc('articles', aid)

# Új oldalak
for pid in [235, 236, 237, 238]:
    export_collection_doc('pages', pid)

# Meglévő oldalak új blokkjai
for pid in [216, 218, 219, 224, 234]:
    export_new_blocks_on_existing_page(pid, ['google_review_story', 'google_review_hero'])

for pid in [216, 218, 219, 224]:  # 234 (weboldal-keszites) már van neki hírlevél élesben
    export_new_blocks_on_existing_page(pid, ['newsletter'])

print('COMMIT;')
