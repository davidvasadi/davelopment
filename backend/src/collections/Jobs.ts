import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Megbízás', plural: 'Megbízások' },
  admin: {
    group: 'Üzlet',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'status', 'deadline', 'price'],
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Megbízás neve',
      required: true,
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Ügyfél',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Státusz',
      defaultValue: 'offer',
      options: [
        { label: 'Ajánlat', value: 'offer' },
        { label: 'Folyamatban', value: 'in_progress' },
        { label: 'Visszajelzésre vár', value: 'review' },
        { label: 'Kész', value: 'done' },
        { label: 'Számlázva', value: 'invoiced' },
        { label: 'Lezárva', value: 'closed' },
        { label: 'Törölve', value: 'cancelled' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Ár (Ft)',
        },
        {
          name: 'deposit',
          type: 'number',
          label: 'Előleg (Ft)',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'start_date',
          type: 'date',
          label: 'Kezdés',
          admin: {
            date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy. MM. dd.' },
          },
        },
        {
          name: 'deadline',
          type: 'date',
          label: 'Határidő',
          admin: {
            date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy. MM. dd.' },
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Leírás / brief',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Belső megjegyzés',
    },
  ],
}
