import type { CollectionConfig } from 'payload'
import { buildContactAdminHtml, buildAutoReplyHtml } from './Newsletters'

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
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        const { payload } = req
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
