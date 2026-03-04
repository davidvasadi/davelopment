import React, { useState, useEffect } from 'react';

const PLUGIN_ID = 'communications';
const POLL_INTERVAL = 30_000; // 30 mp

// ─── Badge store (singleton, minden komponens ugyanazt olvassa) ───────────────
let _newLeads = 0;
let _newSubs = 0;
const _listeners: Set<() => void> = new Set();

function notifyAll() { _listeners.forEach(fn => fn()); }

function useBadgeStore() {
  const [, rerender] = useState(0);
  useEffect(() => {
    const fn = () => rerender(n => n + 1);
    _listeners.add(fn);
    return () => { _listeners.delete(fn); };
  }, []);
  return { newLeads: _newLeads, newSubs: _newSubs };
}

async function pollStats() {
  try {
    const res = await fetch('/api/communications/stats');
    const data = await res.json();
    if (data.ok) {
      _newLeads = data.newLeads ?? 0;
      _newSubs  = data.newSubs  ?? 0;
      notifyAll();
    }
  } catch {}
}

// Indítjuk a pollert azonnal
pollStats();
setInterval(pollStats, POLL_INTERVAL);

// ─── Mail ikon badge-dzsel (sidebar menu link ikon) ───────────────────────────
const MailIconWithBadge = () => {
  const { newLeads } = useBadgeStore();
  const total = newLeads;

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
      {total > 0 && (
        <span style={{
          position: 'absolute', top: '-5px', right: '-7px',
          background: '#f85149', color: '#fff',
          borderRadius: '20px', fontSize: '9px', fontWeight: 700,
          minWidth: '14px', height: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 3px', lineHeight: 1,
          fontFamily: 'Geist Mono, monospace',
          boxShadow: '0 0 0 2px var(--bg-page, #fafafa)',
        }}>
          {total > 99 ? '99+' : total}
        </span>
      )}
    </span>
  );
};

// ─── Notification Bell (sidebar injection) ───────────────────────────────────
const NotificationBell = () => {
  const { newLeads, newSubs } = useBadgeStore();
  const [open, setOpen] = useState(false);
  const total = newLeads + newSubs;

  // Kattintás kívülre → bezárás
  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    setTimeout(() => window.addEventListener('click', handler), 0);
    return () => window.removeEventListener('click', handler);
  }, [open]);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
      title="Értesítések"
    >
      {/* Bell SVG */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: total > 0 ? '#f0c742' : 'currentColor' }}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>

      {/* Badge */}
      {total > 0 && (
        <span style={{
          position: 'absolute', top: '-5px', right: '-7px',
          background: '#f0c742', color: '#000',
          borderRadius: '20px', fontSize: '9px', fontWeight: 700,
          minWidth: '14px', height: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 3px', lineHeight: 1,
          fontFamily: 'Geist Mono, monospace',
          boxShadow: '0 0 0 2px var(--bg-page, #030712)',
        }}>
          {total > 99 ? '99+' : total}
        </span>
      )}

      {/* Dropdown */}
      {open && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', top: '28px', left: '50%', transform: 'translateX(-50%)',
            background: 'var(--bg-card, #0d1117)',
            border: '0.5px solid var(--border, #21262d)',
            borderRadius: '12px', width: '220px', zIndex: 9999,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border, #21262d)', fontSize: '11px', fontWeight: 600, color: 'var(--text-faint, #484f58)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Értesítések
          </div>

          {total === 0 ? (
            <div style={{ padding: '16px 14px', fontSize: '12px', color: 'var(--text-faint, #484f58)', textAlign: 'center' }}>
              Nincs új értesítés
            </div>
          ) : (
            <>
              {newLeads > 0 && (
                <a href="/admin/plugins/communications" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderBottom: '1px solid var(--border, #21262d)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-inner, #161b22)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <span style={{ fontSize: '16px' }}>📬</span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary, #f0f6fc)' }}>
                        {newLeads} új érdeklődő
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-faint, #484f58)' }}>
                        Feldolgozásra vár
                      </div>
                    </div>
                    <span style={{
                      marginLeft: 'auto', background: '#f85149', color: '#fff',
                      borderRadius: '20px', fontSize: '10px', fontWeight: 700,
                      minWidth: '18px', height: '18px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                      fontFamily: 'Geist Mono, monospace',
                    }}>
                      {newLeads}
                    </span>
                  </div>
                </a>
              )}
              {newSubs > 0 && (
                <a href="/admin/plugins/communications" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-inner, #161b22)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <span style={{ fontSize: '16px' }}>✉️</span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary, #f0f6fc)' }}>
                        {newSubs} új feliratkozó
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-faint, #484f58)' }}>
                        Megerősítésre vár
                      </div>
                    </div>
                    <span style={{
                      marginLeft: 'auto', background: '#f0c742', color: '#000',
                      borderRadius: '20px', fontSize: '10px', fontWeight: 700,
                      minWidth: '18px', height: '18px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                      fontFamily: 'Geist Mono, monospace',
                    }}>
                      {newSubs}
                    </span>
                  </div>
                </a>
              )}
            </>
          )}
        </div>
      )}
    </span>
  );
};

// ─── Plugin registration ──────────────────────────────────────────────────────
export default {
  register(app: any) {
    // Sidebar mail ikon badge-dzsel
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: MailIconWithBadge,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: 'Communications',
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
  },

  bootstrap(_app: any) {},
};
