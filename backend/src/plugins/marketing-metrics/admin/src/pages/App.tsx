import { useState, useEffect } from 'react';

interface PageAudit {
  id: number;
  documentId: string;
  type: string;
  label: string;
  slug: string;
  issues: string[];
  score: number;
  editUrl: string;
}

const scoreColor = (score: number) => {
  if (score >= 80) return '#4fe3c2';
  if (score >= 50) return '#f5a624';
  return '#ff4444';
};

const SOURCES = [
  { key: 'pages', label: 'Pages', endpoint: '/api/pages?pagination%5BpageSize%5D=100&populate=seo', titleField: 'slug', single: false, uid: 'api::page.page' },
  { key: 'articles', label: 'Articles', endpoint: '/api/articles?pagination%5BpageSize%5D=100&populate=seo', titleField: 'title', single: false, uid: 'api::article.article' },
  { key: 'products', label: 'Products', endpoint: '/api/products?pagination%5BpageSize%5D=100&populate=seo', titleField: 'title', single: false, uid: 'api::product.product' },
  { key: 'blog-page', label: 'Blog page', endpoint: '/api/blog-page?populate=seo', titleField: 'heading', single: true, uid: 'api::blog-page.blog-page' },
  { key: 'global', label: 'Global', endpoint: '/api/global?populate=seo', titleField: '_fixed_Global settings', single: true, uid: 'api::global.global' },
];

const getEditUrl = (uid: string, single: boolean, documentId: string) => {
  if (single) return `/admin/content-manager/single-types/${uid}`;
  return `/admin/content-manager/collection-types/${uid}/${documentId}`;
};

const auditItem = (item: any, titleField: string, typeLabel: string, uid: string, single: boolean): PageAudit => {
  const issues: string[] = [];
  if (!item.seo?.metaTitle) issues.push('Hiányzó meta title');
  if (!item.seo?.metaDescription) issues.push('Hiányzó meta description');
  if (!item.seo?.keywords) issues.push('Hiányzó keywords');
  const isSingle = titleField.startsWith('_fixed_');
  if (!isSingle && !item.slug) issues.push('Hiányzó slug');
  const total = isSingle ? 3 : 4;
  const score = Math.max(0, Math.round(((total - issues.length) / total) * 100));
  const label = isSingle
    ? titleField.replace('_fixed_', '')
    : (item[titleField] || item.slug || `#${item.id}`);
  return { id: item.id, documentId: item.documentId, type: typeLabel, label, slug: item.slug || '-', issues, score, editUrl: getEditUrl(uid, single, item.documentId) };
};

const ScoreBar = ({ score }: { score: number }) => {
  const color = scoreColor(score);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '100px', height: '6px', borderRadius: '3px', background: '#444', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '3px', minWidth: '6px' }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 600, color, minWidth: '36px' }}>{score}%</span>
    </div>
  );
};

const EditButton = ({ url }: { url: string }) => (
  <button
    onClick={() => window.location.href = url}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '5px 10px', borderRadius: '6px', fontSize: '12px',
      fontWeight: 500, cursor: 'pointer',
      background: 'transparent', color: 'var(--muted)',
      border: '1px solid var(--sep)', transition: 'all 150ms ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'var(--hover)';
      e.currentTarget.style.color = 'var(--text)';
      e.currentTarget.style.borderColor = 'var(--border)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = 'var(--muted)';
      e.currentTarget.style.borderColor = 'var(--sep)';
    }}
  >
    Szerkesztés
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  </button>
);

const App = () => {
  const [items, setItems] = useState<PageAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    Promise.all(
      SOURCES.map(src =>
        fetch(src.endpoint)
          .then(r => r.json())
          .then(data => {
            if (src.single) {
              const item = data.data;
              if (!item) return [];
              return [auditItem(item, src.titleField, src.label, src.uid, true)];
            }
            return (data.data || []).map((item: any) => auditItem(item, src.titleField, src.label, src.uid, false));
          })
          .catch(() => [])
      )
    ).then(results => {
      setItems(results.flat());
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);
  const ok = items.filter(p => p.score === 100).length;
  const bad = items.filter(p => p.issues.length > 0).length;
  const avgScore = items.length ? Math.round(items.reduce((a, b) => a + b.score, 0) / items.length) : 0;
  const pad = isMobile ? '16px' : '32px';

  return (
    <div style={{ padding: pad, color: 'var(--text)', fontFamily: 'inherit' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 700, letterSpacing: '-.4px', margin: 0 }}>SEO Audit</h1>
        <p style={{ color: 'var(--muted)', marginTop: '5px', fontSize: '13px' }}>Összes content type SEO állapota</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: isMobile ? '8px' : '12px', marginBottom: '24px' }}>
        {[
          { label: 'Összes', value: items.length, color: 'var(--text)' },
          { label: 'Rendben', value: ok, color: '#4fe3c2' },
          { label: 'Problémás', value: bad, color: '#ff4444' },
          { label: 'Átlag score', value: `${avgScore}%`, color: scoreColor(avgScore) },
        ].map(card => (
          <div key={card.label} style={{
            background: 'var(--card)', border: '1px solid var(--sep)',
            borderRadius: '14px', padding: isMobile ? '12px' : '20px 24px', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: isMobile ? '20px' : '28px', fontWeight: 700, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['all', ...SOURCES.map(s => s.label)].map(tab => (
          <button key={tab} onClick={() => setFilter(tab)} style={{
            padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
            background: filter === tab ? 'var(--primary-bg)' : 'var(--card)',
            color: filter === tab ? 'var(--primary-fg)' : 'var(--muted)',
            border: filter === tab ? '1px solid var(--border)' : '1px solid var(--sep)',
            transition: 'all 150ms ease',
          }}>
            {tab === 'all' ? 'Összes' : tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '32px', color: 'var(--muted)', fontSize: '13px' }}>Betöltés...</div>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(item => (
            <div key={`${item.type}-${item.id}`} style={{
              background: 'var(--card)', border: '1px solid var(--sep)',
              borderRadius: '14px', padding: '16px', boxShadow: 'var(--shadow)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ flex: 1, marginRight: '12px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '2px', display: 'block' }}>{item.type}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{item.label}</span>
                  {item.slug !== '-' && (
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>/{item.slug}</div>
                  )}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: scoreColor(item.score), whiteSpace: 'nowrap' }}>{item.score}%</span>
              </div>

              <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: '#444', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: `${item.score}%`, height: '100%', background: scoreColor(item.score), borderRadius: '3px', minWidth: '6px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  {item.issues.length === 0 ? (
                    <span style={{ fontSize: '12px', color: '#4fe3c2' }}>✓ Rendben</span>
                  ) : item.issues.map((issue, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#ff4444' }}>⚠ {issue}</div>
                  ))}
                </div>
                <EditButton url={item.editUrl} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: 'var(--card)', border: '1px solid var(--sep)', borderRadius: '14px', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Típus', 'Tartalom', 'Problémák', 'SEO Score', ''].map(h => (
                  <th key={h} style={{
                    padding: '12px 20px', textAlign: 'left', fontSize: '11px',
                    fontWeight: 500, letterSpacing: '0.5px', color: 'var(--muted)',
                    borderBottom: '1px solid var(--sep)', background: 'transparent',
                  }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr
                  key={`${item.type}-${item.id}`}
                  style={{ borderBottom: '1px solid var(--sep)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 20px', fontSize: '12px', color: 'var(--muted)' }}>{item.type}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 500, color: 'var(--text)', maxWidth: '300px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</div>
                    {item.slug !== '-' && (
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>/{item.slug}</div>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: '13px' }}>
                    {item.issues.length === 0 ? (
                      <span style={{ color: '#4fe3c2' }}>✓ Rendben</span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {item.issues.map((issue, i) => (
                          <span key={i} style={{ color: '#ff4444', fontSize: '12px' }}>⚠ {issue}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <ScoreBar score={item.score} />
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <EditButton url={item.editUrl} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export { App };