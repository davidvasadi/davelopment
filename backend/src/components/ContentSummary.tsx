'use client'

const CSS = `
  .cs-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--theme-elevation-150);
    border: 1px solid var(--theme-elevation-150);
    border-radius: 12px;
    overflow: hidden;
  }
  @media (max-width: 600px) {
    .cs-strip { grid-template-columns: repeat(2, 1fr); }
  }
  .cs-item {
    background: var(--theme-elevation-50);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    text-decoration: none;
    color: inherit;
    transition: background 120ms;
  }
  .cs-item:hover { background: var(--theme-elevation-100); }
  .cs-label {
    font-size: 9.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--theme-elevation-500);
    font-family: ui-monospace, monospace;
    margin-bottom: 3px;
  }
  .cs-val {
    font-size: 1.65rem;
    font-weight: 700;
    line-height: 1;
    font-family: ui-monospace, monospace;
    letter-spacing: -0.04em;
  }
`

const ITEMS = [
  {
    key: 'articles' as const,
    label: 'Cikk',
    href: '/admin/collections/articles',
    color: 'var(--bw-green, #3dffa0)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    key: 'products' as const,
    label: 'Projekt',
    href: '/admin/collections/products',
    color: 'var(--bw-purple, #7c6af7)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    key: 'pages' as const,
    label: 'Oldal',
    href: '/admin/collections/pages',
    color: 'var(--bw-yellow, #f0c742)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
    ),
  },
  {
    key: 'media' as const,
    label: 'Média',
    href: '/admin/collections/media',
    color: 'var(--bw-blue, #60a5fa)',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
  },
]

export function ContentSummary({ articles, products, pages, media }: {
  articles: number; products: number; pages: number; media: number
}) {
  const values = { articles, products, pages, media }
  return (
    <>
      <style>{CSS}</style>
      <div className="cs-strip">
        {ITEMS.map(item => (
          <a key={item.key} href={item.href} className="cs-item">
            <span style={{ color: item.color, flexShrink: 0 }}>{item.icon}</span>
            <div>
              <div className="cs-label">{item.label}</div>
              <div className="cs-val" style={{ color: item.color }}>{values[item.key]}</div>
            </div>
          </a>
        ))}
      </div>
    </>
  )
}
