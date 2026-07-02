import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { buildContactAdminHtml, buildAutoReplyHtml } from './Newsletters'

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
            html: buildContactAdminHtml(doc.name || '', doc.email, doc.message || '', doc.page || '', adminUrl),
          })
        } catch (err) {
          payload.logger.error({ err }, 'Contacts: admin notification email failed')
        }

        // ── 2. Auto-reply a küldőnek ───────────────────────────────────────────
        try {
          await payload.sendEmail({
            to: doc.email,
            subject: isHu
              ? 'Köszönöm az üzeneted – [davelopment]®'
              : 'Thanks for reaching out – [davelopment]®',
            html: buildAutoReplyHtml(doc.name || '', isHu),
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
