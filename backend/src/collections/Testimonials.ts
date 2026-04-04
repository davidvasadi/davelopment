import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    group: 'Tartalom',
    useAsTitle: 'text',
    defaultColumns: ['text', 'rating', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }: any) => !!req.user,
    update: ({ req }: any) => !!req.user,
    delete: ({ req }: any) => !!req.user && req.user?.role !== 'editor',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      label: 'Szöveg',
      required: true,
      localized: true,
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Értékelés',
      min: 1,
      max: 5,
      localized: true,
    },
    {
      name: 'user',
      type: 'group',
      label: 'Felhasználó',
      localized: true,
      fields: [
        {
          name: 'firstname',
          type: 'text',
          label: 'Keresztnév',
        },
        {
          name: 'lastname',
          type: 'text',
          label: 'Vezetéknév',
        },
        {
          name: 'job',
          type: 'text',
          label: 'Munkakör',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Profilkép',
          filterOptions: {
            mimeType: { contains: 'image' },
          },
        },
      ],
    },
  ],
}
