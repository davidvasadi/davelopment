import type { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    group: 'Tartalom',
    useAsTitle: 'question',
    defaultColumns: ['question', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }: any) => !!req.user,
    update: ({ req }: any) => !!req.user,
    delete: ({ req }: any) => !!req.user && req.user?.role !== 'editor',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      label: 'Kérdés',
      required: true,
      localized: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      label: 'Válasz',
      required: true,
      localized: true,
    },
  ],
}
