import type { CollectionConfig } from 'payload'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  labels: { singular: 'Havidíj', plural: 'Havidíjak' },
  admin: {
    group: 'Üzlet',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'amount', 'billing_day', 'status'],
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
      label: 'Megnevezés',
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
      defaultValue: 'active',
      options: [
        { label: 'Aktív', value: 'active' },
        { label: 'Szünetel', value: 'paused' },
        { label: 'Lemondva', value: 'cancelled' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'amount',
          type: 'number',
          label: 'Összeg (Ft/hó)',
          required: true,
        },
        {
          name: 'billing_day',
          type: 'number',
          label: 'Számlázás napja (1-28)',
          min: 1,
          max: 28,
          defaultValue: 1,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'start_date',
          type: 'date',
          label: 'Kezdés dátuma',
          admin: {
            date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy. MM. dd.' },
          },
        },
        {
          name: 'end_date',
          type: 'date',
          label: 'Lejárat (ha van)',
          admin: {
            date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy. MM. dd.' },
          },
        },
      ],
    },
    {
      name: 'includes',
      type: 'textarea',
      label: 'Mit tartalmaz',
    },
    {
      name: 'last_invoiced',
      type: 'date',
      label: 'Utoljára számlázva',
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy. MM. dd.' },
        readOnly: true,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Megjegyzés',
    },
  ],
}
