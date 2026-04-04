export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'var(--theme-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--theme-bg)">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
      <span style={{
        fontSize: 16,
        fontWeight: 700,
        color: 'var(--theme-text)',
        letterSpacing: '-0.02em',
      }}>[davelopment]®</span>
    </div>
  )
}
