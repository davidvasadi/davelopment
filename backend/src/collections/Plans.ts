import type { CollectionConfig } from 'payload'
import { buttonField } from '../fields/button'

export const Plans: CollectionConfig = {
  slug: 'plans',
  admin: {
    group: 'Tartalom',
    useAsTitle: 'name',
    defaultColumns: ['name', 'plan_type', 'price', 'currency', 'featured', 'createdAt'],
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
      name: 'name',
      type: 'text',
      label: 'Név',
      required: true,
      localized: true,
    },
    {
      name: 'plan_type',
      type: 'select',
      label: 'Csomag típus',
      localized: true,
      options: [
        { label: 'Starter', value: 'starter' },
        { label: 'Pro', value: 'pro' },
        { label: 'Studio', value: 'studio' },
        { label: 'Project', value: 'project' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
    },
    {
      name: 'price',
      type: 'text',
      label: 'Ár',
      localized: true,
      admin: {
        description: 'Szám (pl. 24900) vagy szöveg (pl. "Egyedi árajánlat") is megadható.',
      },
    },
    {
      name: 'currency',
      type: 'text',
      label: 'Pénznem',
      localized: true,
    },
    {
      name: 'currency_project_label',
      type: 'text',
      label: 'Projekt pénznem felirat',
      localized: true,
    },
    {
      name: 'sub_text',
      type: 'text',
      label: 'Al-szöveg',
      localized: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Kiemelt',
      defaultValue: false,
      localized: true,
    },
    buttonField('CTA', 'CTA gomb', { localizeUrl: true }),
    {
      name: 'perks',
      type: 'array',
      label: 'Előnyök',
      localized: true,
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Szöveg',
        },
      ],
    },
    {
      name: 'additional_perks',
      type: 'array',
      label: 'Extra előnyök',
      localized: true,
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Szöveg',
        },
      ],
    },
    {
      name: 'addon_title',
      type: 'text',
      label: 'Addon cím',
      localized: true,
    },
    {
      name: 'addon_description',
      type: 'textarea',
      label: 'Addon leírás',
      localized: true,
    },
    {
      name: 'addon_price',
      type: 'text',
      label: 'Addon ár',
      localized: true,
      admin: {
        description: 'Szám (pl. 9900) vagy szöveg (pl. "Egyedi árazással") is megadható.',
      },
    },
    {
      name: 'recommended_for',
      type: 'textarea',
      label: 'Kiknek ajánlott',
      localized: true,
      admin: {
        description: 'Rövid válasz arra, hogy ez a csomag kinek való — ez jelenik meg a pricing blokk "Kiknek ajánlott?" kérdése alatt, csomagonként eltérő szöveggel.',
      },
    },
    {
      name: 'time_label',
      type: 'text',
      label: 'Idő felirat',
      localized: true,
    },
    {
      name: 'time_value',
      type: 'text',
      label: 'Idő érték',
      localized: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'Termék',
      hasMany: false,
    },
  ],
}
