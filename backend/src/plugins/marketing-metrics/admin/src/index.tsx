import React from 'react';

const PLUGIN_ID = 'marketing-metrics';

const PluginIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/>
      <path d="m19 9-5 5-4-4-3 3"/>
    </svg>
  );
};

const SeoWidget = () => {
  const [stats, setStats] = React.useState({ total: 0, ok: 0, bad: 0, avg: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const sources = [
      '/api/pages?pagination%5BpageSize%5D=100&populate=seo',
      '/api/articles?pagination%5BpageSize%5D=100&populate=seo',
      '/api/products?pagination%5BpageSize%5D=100&populate=seo',
    ];

    Promise.all(sources.map(url => fetch(url).then(r => r.json()).catch(() => ({ data: [] }))))
      .then(results => {
        const all = results.flatMap(r => r.data || []);
        const scores = all.map(item => {
          let issues = 0;
          if (!item.seo?.metaTitle) issues++;
          if (!item.seo?.metaDescription) issues++;
          if (!item.seo?.keywords) issues++;
          if (!item.slug) issues++;
          return Math.max(0, Math.round(((4 - issues) / 4) * 100));
        });
        const ok = scores.filter(s => s === 100).length;
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        setStats({ total: all.length, ok, bad: all.length - ok, avg });
        setLoading(false);
      });
  }, []);

  const scoreColor = (s: number) => s >= 80 ? '#4fe3c2' : s >= 50 ? '#f5a624' : '#ff4444';

  return (
    <div style={{ padding: '20px', fontFamily: 'inherit', color: 'var(--text)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px' }}>SEO Állapot</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
            {loading ? 'Betöltés...' : `${stats.total} oldal auditálva`}
          </div>
        </div>
        <a href="/admin/plugins/marketing-metrics" style={{
          fontSize: '12px', color: 'var(--muted)', textDecoration: 'none',
          padding: '4px 10px', border: '1px solid var(--sep)', borderRadius: '6px',
        }}>
          Részletek →
        </a>
      </div>

      {!loading && (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'Rendben', value: stats.ok, color: '#4fe3c2' },
              { label: 'Problémás', value: stats.bad, color: '#ff4444' },
              { label: 'Átlag', value: `${stats.avg}%`, color: scoreColor(stats.avg) },
            ].map(c => (
              <div key={c.label} style={{
                flex: 1, background: 'var(--bg)', border: '1px solid var(--sep)',
                borderRadius: '10px', padding: '10px 12px',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: c.color }}>{c.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{c.label}</div>
              </div>
            ))}
          </div>

          <div style={{ height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${stats.avg}%`,
              background: scoreColor(stats.avg),
              borderRadius: '3px',
              minWidth: '6px',
            }} />
          </div>
        </>
      )}
    </div>
  );
};

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'Marketing Metrics',
      },
      Component: async () => {
        const { App } = await import('./pages/App');
        return App;
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      isReady: true,
      name: PLUGIN_ID,
    });

    // Dashboard widget
    if (app.registerWidget) {
      app.registerWidget({
        id: `${PLUGIN_ID}-seo-summary`,
        pluginId: PLUGIN_ID,
        name: { id: `${PLUGIN_ID}.widget.seo`, defaultMessage: 'SEO Állapot' },
        component: async () => ({ default: SeoWidget }),
      });
    }
  },
  bootstrap() {},
};