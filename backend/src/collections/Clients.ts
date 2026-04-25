import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: 'Ügyfél', plural: 'Ügyfelek' },
  admin: {
    group: 'Üzlet',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'type', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Név / Cégnév',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefon',
        },
      ],
    },
    {
      name: 'type',
      type: 'select',
      label: 'Típus',
      defaultValue: 'individual',
      options: [
        { label: 'Magánszemély', value: 'individual' },
        { label: 'Egyéni vállalkozó', value: 'sole_trader' },
        { label: 'Cég (Kft., Bt., stb.)', value: 'company' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Státusz',
      defaultValue: 'active',
      options: [
        { label: 'Aktív', value: 'active' },
        { label: 'Inaktív', value: 'inactive' },
        { label: 'Érdeklődő', value: 'lead' },
      ],
    },
    {
      name: 'billing',
      type: 'group',
      label: 'Számlázási adatok',
      fields: [
        {
          name: 'company_name',
          type: 'text',
          label: 'Számlázási név',
        },
        {
          name: 'tax_number',
          type: 'text',
          label: 'Adószám',
        },
        {
          name: 'address',
          type: 'text',
          label: 'Cím',
        },
        {
          name: 'city',
          type: 'text',
          label: 'Város',
        },
        {
          name: 'zip',
          type: 'text',
          label: 'Irányítószám',
        },
        {
          name: 'country',
          type: 'text',
          label: 'Ország',
          defaultValue: 'Magyarország',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Megjegyzés',
    },
    {
      name: 'source',
      type: 'select',
      label: 'Honnan jött',
      options: [
        { label: 'Ajánlás', value: 'referral' },
        { label: 'Weboldal', value: 'website' },
        { label: 'Közösségi média', value: 'social' },
        { label: 'Hideg megkeresés', value: 'outbound' },
        { label: 'Egyéb', value: 'other' },
      ],
    },
  ],
}
