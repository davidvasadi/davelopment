import type { CollectionConfig } from 'payload'

export const Logos: CollectionConfig = {
  slug: 'logos',
  admin: {
    group: 'Tartalom',
    useAsTitle: 'company',
    defaultColumns: ['company', 'image', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }: any) => !!req.user,
    update: ({ req }: any) => !!req.user,
    delete: ({ req }: any) => !!req.user && req.user?.role !== 'editor',
  },
  fields: [
    {
      name: 'company',
      type: 'text',
      label: 'Cég neve',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
  ],
}
