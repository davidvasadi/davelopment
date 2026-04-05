'use client'
import { motion } from 'framer-motion'

const ITEMS = [
  { key: 'articles', label: 'Cikk', href: '/admin/collections/articles', color: '#3dffa0' },
  { key: 'products', label: 'Projekt', href: '/admin/collections/products', color: '#7c6af7' },
  { key: 'pages', label: 'Oldal', href: '/admin/collections/pages', color: '#f0c742' },
  { key: 'media', label: 'Média', href: '/admin/collections/media', color: '#60a5fa' },
] as const

export function ContentSummary({ articles, products, pages, media }: {
  articles: number; products: number; pages: number; media: number
}) {
  const values = { articles, products, pages, media }
  return (
    <motion.div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
    >
      {ITEMS.map(item => (
        <motion.a
          key={item.key}
          href={item.href}
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
          }}
          style={{
            display: 'flex', flexDirection: 'column', gap: '0.3rem',
            background: 'var(--theme-elevation-50)', border: '1px solid var(--theme-elevation-150)',
            borderRadius: '0.75rem', padding: '1rem 1.25rem', textDecoration: 'none', color: 'inherit',
            transition: 'background 120ms',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--theme-elevation-100)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--theme-elevation-50)')}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--theme-elevation-500)', fontFamily: 'ui-monospace,monospace', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {item.label}
          </span>
          <span style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: item.color, fontFamily: 'ui-monospace,monospace' }}>
            {values[item.key]}
          </span>
        </motion.a>
      ))}
    </motion.div>
  )
}
