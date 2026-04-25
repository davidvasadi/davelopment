import type { CollectionConfig } from 'payload'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  labels: { singular: 'Számla', plural: 'Számlák' },
  admin: {
    group: 'Üzlet',
    useAsTitle: 'invoice_number',
    defaultColumns: ['invoice_number', 'client', 'total_net', 'total', 'status', 'due_date'],
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const items: any[] = data.items || []
        let net = 0
        let gross = 0
        for (const item of items) {
          const qty = Number(item.quantity) || 0
          const price = Number(item.unit_price) || 0
          const vatStr = item.vat_rate
          const vatPct = vatStr === 'aam' || vatStr === '0' ? 0 : Number(vatStr) || 0
          const lineNet = qty * price
          net += lineNet
          gross += lineNet * (1 + vatPct / 100)
        }
        data.total_net = Math.round(net)
        data.total = Math.round(gross)
        return data
      },
    ],
  },
  fields: [
    {
      name: 'invoice_number',
      type: 'text',
      label: 'Számlaszám',
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
      name: 'type',
      type: 'select',
      label: 'Típus',
      defaultValue: 'invoice',
      options: [
        { label: 'Számla', value: 'invoice' },
        { label: 'Díjbekérő', value: 'proforma' },
        { label: 'Jóváírás', value: 'credit_note' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Státusz',
      defaultValue: 'draft',
      options: [
        { label: 'Tervezet', value: 'draft' },
        { label: 'Kiküldve', value: 'sent' },
        { label: 'Fizetve', value: 'paid' },
        { label: 'Késedelmes', value: 'overdue' },
        { label: 'Sztornózva', value: 'cancelled' },
      ],
    },
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      label: 'Kapcsolódó megbízás',
    },
    {
      name: 'subscription',
      type: 'relationship',
      relationTo: 'subscriptions',
      label: 'Kapcsolódó havidíj',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Tételek',
      fields: [
        {
          name: 'description',
          type: 'text',
          label: 'Megnevezés',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'quantity',
              type: 'number',
              label: 'Mennyiség',
              defaultValue: 1,
            },
            {
              name: 'unit_price',
              type: 'number',
              label: 'Egységár (Ft)',
              required: true,
            },
            {
              name: 'vat_rate',
              type: 'select',
              label: 'ÁFA',
              defaultValue: 'aam',
              options: [
                { label: 'AAM (mentes)', value: 'aam' },
                { label: '27%', value: '27' },
                { label: '5%', value: '5' },
                { label: '0%', value: '0' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'issue_date',
          type: 'date',
          label: 'Kiállítás dátuma',
          admin: {
            date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy. MM. dd.' },
          },
        },
        {
          name: 'due_date',
          type: 'date',
          label: 'Fizetési határidő',
          admin: {
            date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy. MM. dd.' },
          },
        },
        {
          name: 'paid_date',
          type: 'date',
          label: 'Fizetve',
          admin: {
            date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy. MM. dd.' },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'total_net',
          type: 'number',
          label: 'Nettó összeg (Ft)',
          admin: {
            readOnly: true,
            description: 'ÁFA nélkül — automatikusan számítódik',
          },
        },
        {
          name: 'total',
          type: 'number',
          label: 'Bruttó összeg (Ft)',
          admin: {
            readOnly: true,
            description: 'ÁFÁ-val — AAM esetén megegyezik a nettóval',
          },
        },
      ],
    },
    {
      name: 'nav_status',
      type: 'select',
      label: 'NAV státusz',
      defaultValue: 'pending',
      options: [
        { label: 'Nem küldve', value: 'pending' },
        { label: 'Beküldve', value: 'submitted' },
        { label: 'Elfogadva', value: 'accepted' },
        { label: 'Hiba', value: 'error' },
      ],
    },
    {
      name: 'nav_transaction_id',
      type: 'text',
      label: 'NAV tranzakció ID',
      admin: { readOnly: true },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Megjegyzés',
    },
  ],
}
