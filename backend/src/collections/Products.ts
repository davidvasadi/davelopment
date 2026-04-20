import type { CollectionConfig } from 'payload'
import { seoField } from '../fields/seo'
import { buttonField } from '../fields/button'
import {
  RelatedProductsBlock,
  CTABlock,
  TestimonialsBlock,
  FormNextToSectionBlock,
  NewsletterBlock,
  FAQBlock,
} from '../blocks/index'
import { generateStructuredDataHook } from '../hooks/generateStructuredData'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    group: 'Tartalom',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'featured', 'createdAt'],
    livePreview: {
      url: ({ data, locale }: any) => {
        const base = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '')
        const loc = locale?.code || 'hu'
        return `${base}/${loc}/${loc === 'hu' ? 'projektek' : 'products'}/${data?.slug}`
      },
    },
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
  hooks: {
    beforeChange: [
      ({ data, operation, req, collection }) =>
        generateStructuredDataHook({ data, operation, req, collection }),
    ],
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
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      localized: true,
      unique: true,
    },
    {
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'badge_label_center',
      type: 'text',
      label: 'Badge felirat (középső)',
      localized: true,
    },
    {
      name: 'badge_label_bottom',
      type: 'text',
      label: 'Badge felirat (alsó)',
      localized: true,
    },
    {
      name: 'price',
      type: 'number',
      label: 'Ár',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Leírás',
      localized: true,
    },
    {
      name: 'heading_center',
      type: 'textarea',
      label: 'Középső főcím',
      localized: true,
    },
    {
      name: 'description_center',
      type: 'textarea',
      label: 'Középső leírás',
      localized: true,
    },
    {
      name: 'heading_bottom',
      type: 'textarea',
      label: 'Alsó főcím',
      localized: true,
    },
    {
      name: 'description_bottom',
      type: 'textarea',
      label: 'Alsó leírás',
      localized: true,
    },
    {
      name: 'year',
      type: 'text',
      label: 'Év',
      localized: true,
    },
    {
      name: 'industry',
      type: 'text',
      label: 'Iparág',
      localized: true,
    },
    {
      name: 'scope',
      type: 'text',
      label: 'Hatókör',
      localized: true,
    },
    {
      name: 'timeline',
      type: 'text',
      label: 'Idősor',
      localized: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Kiemelt',
      defaultValue: false,
      localized: true,
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      label: 'Képek',
      hasMany: true,
      localized: true,
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'logos',
      label: 'Logó',
      hasMany: false,
    },
    {
      name: 'plans',
      type: 'relationship',
      relationTo: 'plans',
      label: 'Csomagok',
      hasMany: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Kategóriák',
      hasMany: true,
    },
    buttonField('button_center', 'Középső gomb'),
    buttonField('button_bottom', 'Alsó gomb'),
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
    seoField(),
    {
      name: 'dynamic_zone',
      type: 'blocks',
      label: 'Dinamikus zóna',
      blocks: [
        RelatedProductsBlock,
        CTABlock,
        TestimonialsBlock,
        FormNextToSectionBlock,
        NewsletterBlock,
        FAQBlock,
      ],
    },
  ],
}
