import type { CollectionConfig } from 'payload'

export const Redirections: CollectionConfig = {
  slug: 'redirections',
  admin: {
    group: 'Rendszer',
    useAsTitle: 'source',
    defaultColumns: ['source', 'destination', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'source',
      type: 'text',
      label: 'Forrás URL',
      required: true,
    },
    {
      name: 'destination',
      type: 'text',
      label: 'Cél URL',
      required: true,
    },
  ],
}
