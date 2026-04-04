import { CommunicationsWidget } from './CommunicationsWidget'
import { ContentSummary } from './ContentSummary'
import { MarketingWidget } from './MarketingWidget'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function BeforeDashboard() {
  const payload = await getPayload({ config: configPromise })
  const [articles, products, pages, media] = await Promise.all([
    payload.find({ collection: 'articles', limit: 0, depth: 0 }),
    payload.find({ collection: 'products', limit: 0, depth: 0 }),
    payload.find({ collection: 'pages', limit: 0, depth: 0 }),
    payload.find({ collection: 'media', limit: 0, depth: 0 }),
  ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      {/* Content summary — server rendered */}
      <section>
        <SectionLabel>Tartalom</SectionLabel>
        <ContentSummary
          articles={articles.totalDocs}
          products={products.totalDocs}
          pages={pages.totalDocs}
          media={media.totalDocs}
        />
      </section>

      <Divider />

      {/* Marketing — client, fetches GSC */}
      <section>
        <SectionLabel>Marketing & SEO</SectionLabel>
        <MarketingWidget />
      </section>

      <Divider />

      {/* Communications — client, fetches API */}
      <section>
        <SectionLabel>Kapcsolatok</SectionLabel>
        <CommunicationsWidget />
      </section>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <h2 style={{ margin: 0, fontSize: 26, lineHeight: '32px', fontWeight: 500, fontFamily: 'var(--font-body)', color: 'var(--theme-text)' }}>{children}</h2>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--theme-elevation-150)' }} />
}

// React import needed for JSX in server component
import React from 'react'
