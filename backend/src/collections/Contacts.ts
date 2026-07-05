import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { buildContactAdminHtml, buildAutoReplyHtml } from './Newsletters'

// Business direction options — keep in sync with the frontend contact form select.
const PROJECT_TYPES: { value: string; hu: string }[] = [
  { value: 'website', hu: 'Weboldal' },
  { value: 'design',  hu: 'UX/UI Design' },
  { value: 'seo',     hu: 'SEO' },
  { value: 'ads',     hu: 'Google Ads / Marketing' },
  { value: 'system',  hu: 'Egyedi rendszer / SaaS' },
  { value: 'other',   hu: 'Egyéb / még nem tudom' },
]
const BUDGETS: { value: string; hu: string }[] = [
  { value: 'lt500',     hu: '< 500 000 Ft' },
  { value: '500-1500',  hu: '500e – 1,5M Ft' },
  { value: '1500-5000', hu: '1,5M – 5M Ft' },
  { value: 'gt5000',    hu: '5M Ft felett' },
  { value: 'unknown',   hu: 'Még nem tudom' },
]
const TIMELINES: { value: string; hu: string }[] = [
  { value: 'urgent',    hu: 'Sürgős' },
  { value: '1month',    hu: '1 hónapon belül' },
  { value: '1-3months', hu: '1–3 hónap' },
  { value: 'exploring', hu: 'Csak tájékozódom' },
]
const SOURCES: { value: string; hu: string }[] = [
  { value: 'google',    hu: 'Google' },
  { value: 'instagram', hu: 'Instagram' },
  { value: 'referral',  hu: 'Ajánlás' },
  { value: 'other',     hu: 'Egyéb' },
]
const labelFrom = (opts: { value: string; hu: string }[], value?: string | null) =>
  opts.find((o) => o.value === value)?.hu || ''
const projectTypeLabel = (value?: string | null) => labelFrom(PROJECT_TYPES, value)

// ── Spam protection (in-memory, per backend process) ──────────────────────────
const RATE_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_MAX = 4                     // max submissions per IP per window
const rateHits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (rateHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  rateHits.set(ip, recent)
  if (rateHits.size > 5000) {
    for (const [k, v] of rateHits) if (v.every((t) => now - t >= RATE_WINDOW_MS)) rateHits.delete(k)
  }
  return recent.length > RATE_MAX
}

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    group: 'Kommunikáció',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'state', 'language', 'createdAt'],
  },
  access: {
    create: () => true,  // public contact form
    // read, update, delete: Payload default (requires auth)
  },
  versions: {
    drafts: false,
  },
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        if (operation !== 'create' || !data) return data

        // Let the e2e test through (it is cleaned up in afterChange, no email sent)
        if (typeof data.email === 'string' && data.email.includes('e2e-test@')) return data

        // 1) Rate limit by client IP (flood protection)
        const ip =
          req?.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() ||
          req?.headers?.get?.('x-real-ip') ||
          'unknown'
        if (isRateLimited(ip)) {
          throw new APIError('Túl sok beküldés. Kérlek próbáld később.', 429)
        }

        // 2) Link-spam heuristic — bots love stuffing URLs into the message
        const msg = String(data.message ?? '')
        const linkCount = (msg.match(/https?:\/\//gi) || []).length
        if (linkCount >= 4) {
          throw new APIError('Az üzenet elutasítva.', 422)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        const { payload } = req

        // E2E teszt cleanup — azonnal töröljük, nem küldünk emailt
        if (doc.email?.includes('e2e-test@')) {
          try {
            await payload.delete({ collection: 'contacts', id: doc.id, overrideAccess: true })
          } catch (_) {}
          return
        }

        const isHu = (doc.language || 'hu').startsWith('hu')
        const adminEmail = process.env.ADMIN_EMAIL || 'hello@davelopment.hu'

        const adminUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:1337'}/admin/collections/contacts/${doc.id}`

        // ── 1. Admin értesítő ──────────────────────────────────────────────────
        try {
          await payload.sendEmail({
            to: adminEmail,
            subject: `[davelopment]® Új üzenet: ${doc.name || doc.email}`,
            html: buildContactAdminHtml({
            name: doc.name || '',
            email: doc.email,
            message: doc.message || '',
            page: doc.page || '',
            adminUrl,
            projectType: projectTypeLabel(doc.projectType),
            budget: labelFrom(BUDGETS, doc.budget),
            timeline: labelFrom(TIMELINES, doc.timeline),
            source: labelFrom(SOURCES, doc.source),
          }),
          })
        } catch (err) {
          payload.logger.error({ err }, 'Contacts: admin notification email failed')
        }

        // ── 2. Auto-reply a küldőnek (CMS-ből fetch-elt projektek + szolgáltatások) ─
        try {
          const SITE = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://davelopment.hu').replace(/\/+$/, '')
          const locale = isHu ? 'hu' : 'en'
          const abs = (u: any) => !u ? '' : (String(u).startsWith('http') ? String(u) : SITE + String(u))
          const clip = (s: any, n: number) => !s ? '' : (String(s).length > n ? String(s).slice(0, n).trim() + '…' : String(s))

          let projects: any[] = []
          try {
            const pr = await payload.find({ collection: 'products', where: { featured: { equals: true } }, limit: 2, depth: 2, locale: locale as any, overrideAccess: true })
            const projSeg = isHu ? 'projektek' : 'products'
            projects = (pr.docs || []).slice(0, 2).map((p: any) => {
              const imgs = p.images || [], cats = p.categories || []
              const cat = (i: number) => (cats[i] && (cats[i].name || cats[i])) || ''
              return {
                title: p.name,
                url: `${SITE}/${locale}/${projSeg}/${p.slug}`,
                image: abs((imgs[0] && imgs[0].url) || (p.seo && p.seo.metaImage && p.seo.metaImage.url)),
                image2: abs((imgs[2] && imgs[2].url) || (imgs[1] && imgs[1].url) || (imgs[0] && imgs[0].url)),
                category: cat(0), category2: cat(1) || cat(0),
                desc: clip(p.description, 58),
              }
            })
          } catch (err) { payload.logger.error({ err }, 'auto-reply: products fetch failed') }

          let services: any[] = []
          try {
            const sg: any = await payload.findGlobal({ slug: 'service' as any, depth: 2, locale: locale as any, overrideAccess: true })
            const svcSeg = isHu ? 'szolgaltatasok' : 'services'
            services = (sg.pages || []).map((it: any) => {
              const pg = it.page && typeof it.page === 'object' ? it.page : it
              const seo = pg.seo || {}
              const mi = seo.metaImage
              return { title: (seo.metaTitle || pg.title || '').split('|')[0].trim(), url: `${SITE}/${locale}/${svcSeg}/${pg.slug}`, image: abs(mi && (mi.url || mi)) }
            })
          } catch (err) { payload.logger.error({ err }, 'auto-reply: services fetch failed') }

          const newsletterUrl = `${SITE}/${locale}/newsletter?email=${encodeURIComponent(doc.email)}&src=autoreply-discount`

          await payload.sendEmail({
            to: doc.email,
            subject: isHu
              ? 'Köszönjük az üzeneted – [davelopment]®'
              : 'Thanks for reaching out – [davelopment]®',
            html: buildAutoReplyHtml({ name: doc.name || '', isHu, projects, services, newsletterUrl }),
          })
        } catch (err) {
          payload.logger.error({ err }, 'Contacts: auto-reply email failed')
        }

        // ── 3. Email log ───────────────────────────────────────────────────────
        try {
          await payload.create({
            collection: 'email-logs',
            overrideAccess: true,
            data: {
              type: 'contact-notification',
              to: adminEmail,
              subject: `Új üzenet: ${doc.name || doc.email}`,
              ref_collection: 'contacts',
              ref_id: String(doc.id),
            },
          })
        } catch (_) {}

        // ── 4. Lead létrehozása Clients-ben (ha még nem létezik) ───────────────
        try {
          const existing = await payload.find({
            collection: 'clients',
            where: { email: { equals: doc.email } },
            limit: 1,
            overrideAccess: true,
          })
          if (existing.totalDocs === 0) {
            await payload.create({
              collection: 'clients',
              overrideAccess: true,
              data: {
                name: doc.name || doc.email,
                email: doc.email,
                status: 'lead',
                source: 'website',
                notes: doc.message || '',
              },
            })
          }
        } catch (err) {
          payload.logger.error({ err }, 'Contacts: failed to create lead in clients')
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Név',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Üzenet',
    },
    {
      name: 'projectType',
      type: 'select',
      label: 'Irány',
      options: PROJECT_TYPES.map((p) => ({ label: p.hu, value: p.value })),
    },
    {
      name: 'budget',
      type: 'select',
      label: 'Költségkeret',
      options: BUDGETS.map((p) => ({ label: p.hu, value: p.value })),
    },
    {
      name: 'timeline',
      type: 'select',
      label: 'Határidő',
      options: TIMELINES.map((p) => ({ label: p.hu, value: p.value })),
    },
    {
      name: 'source',
      type: 'select',
      label: 'Honnan talált ránk',
      options: SOURCES.map((p) => ({ label: p.hu, value: p.value })),
    },
    {
      name: 'page',
      type: 'text',
      label: 'Oldal (honnan jött)',
    },
    {
      name: 'language',
      type: 'text',
      label: 'Nyelv',
    },
    {
      name: 'state',
      type: 'select',
      label: 'Státusz',
      defaultValue: 'new',
      options: [
        { label: 'Új', value: 'new' },
        { label: 'Folyamatban', value: 'in_progress' },
        { label: 'Kész', value: 'done' },
      ],
    },
  ],
}
