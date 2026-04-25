import { CommunicationsWidget } from './CommunicationsWidget'
import { ContentSummary } from './ContentSummary'
import { MarketingWidget } from './MarketingWidget'
import { BusinessWidget, type MonthlyPoint } from './BusinessWidget'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function BeforeDashboard() {
  const payload = await getPayload({ config: configPromise })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()

  const [articles, products, pages, media, activeJobsDocs, activeSubs, unpaidInvoices, paidInvoices] = await Promise.all([
    payload.find({ collection: 'articles', limit: 0, depth: 0 }),
    payload.find({ collection: 'products', limit: 0, depth: 0 }),
    payload.find({ collection: 'pages', limit: 0, depth: 0 }),
    payload.find({ collection: 'media', limit: 0, depth: 0 }),
    payload.find({
      collection: 'jobs',
      where: { status: { in: ['offer', 'in_progress', 'review'] } },
      limit: 1000,
      depth: 0,
    }),
    payload.find({
      collection: 'subscriptions',
      where: { status: { equals: 'active' } },
      limit: 1000,
      depth: 0,
    }),
    payload.find({
      collection: 'invoices',
      where: { status: { in: ['sent', 'overdue'] } },
      limit: 1000,
      depth: 0,
    }),
    payload.find({
      collection: 'invoices',
      where: {
        and: [
          { status: { equals: 'paid' } },
          { paid_date: { greater_than_equal: sixMonthsAgo } },
        ],
      },
      limit: 1000,
      depth: 0,
    }),
  ])

  const activeJobs = activeJobsDocs.totalDocs
  const jobsValue = activeJobsDocs.docs.reduce((sum, j) => sum + ((j.price as number) || 0), 0)
  const mrr = activeSubs.docs.reduce((sum, s) => sum + ((s.amount as number) || 0), 0)
  const unpaidTotal = unpaidInvoices.docs.reduce((sum, i) => sum + ((i.total as number) || 0), 0)
  const paidThisMonth = paidInvoices.docs
    .filter(i => i.paid_date && new Date(i.paid_date as string) >= new Date(startOfMonth))
    .reduce((sum, i) => sum + ((i.total as number) || 0), 0)

  // Build 6-month buckets
  const monthlyMap: Record<string, number> = {}
  for (let m = 5; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthlyMap[key] = 0
  }
  for (const inv of paidInvoices.docs) {
    if (!inv.paid_date) continue
    const d = new Date(inv.paid_date as string)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (key in monthlyMap) monthlyMap[key] += ((inv.total as number) || 0)
  }
  const monthlyRevenue: MonthlyPoint[] = Object.entries(monthlyMap).map(([month, amount]) => ({ month, amount }))

  return (
    <>
      <style>{`
        .db-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .db-two-col { grid-template-columns: 1fr; }
        }
        .db-quick-link {
          font-size: 11px;
          font-weight: 600;
          font-family: ui-monospace, monospace;
          color: var(--theme-elevation-500);
          text-decoration: none;
          padding: 4px 10px;
          border: 1px solid var(--theme-elevation-200);
          border-radius: 6px;
          background: var(--theme-elevation-100);
          transition: background 120ms, color 120ms;
          white-space: nowrap;
        }
        .db-quick-link:hover {
          background: var(--theme-elevation-150);
          color: var(--theme-text);
        }
        @media (max-width: 500px) {
          .db-quick-link { display: none; }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '2rem' }}>

        {/* Tartalom — slim KPI strip */}
        <ContentSummary
          articles={articles.totalDocs}
          products={products.totalDocs}
          pages={pages.totalDocs}
          media={media.totalDocs}
        />

        {/* Üzlet — teljes szélesség, legelöl */}
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem' }}>
            <SectionLabel>Üzlet</SectionLabel>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <a href="/admin/collections/jobs/create" className="db-quick-link">+ Új megbízás</a>
              <a href="/admin/collections/invoices/create" className="db-quick-link">+ Új számla</a>
            </div>
          </div>
          <BusinessWidget
            activeJobs={activeJobs}
            jobsValue={jobsValue}
            mrr={mrr}
            unpaidTotal={unpaidTotal}
            paidThisMonth={paidThisMonth}
            monthlyRevenue={monthlyRevenue}
          />
        </section>

        <Divider />

        {/* Marketing + Kapcsolatok — egymás mellett */}
        <div className="db-two-col">
          <section>
            <SectionLabel>Marketing & SEO</SectionLabel>
            <MarketingWidget />
          </section>
          <section>
            <SectionLabel>Kapcsolatok</SectionLabel>
            <CommunicationsWidget />
          </section>
        </div>

      </div>
    </>
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
