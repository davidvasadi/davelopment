export function Icon() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 4px',
    }}>
      <span style={{
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--theme-text)',
        letterSpacing: '-0.02em',
        whiteSpace: 'nowrap',
      }}>[d]®</span>
    </div>
  )
}
