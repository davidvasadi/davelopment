import type { GlobalConfig } from 'payload'
import { seoField } from '../fields/seo'
import { allBlocks } from '../blocks/index'
import { generateStructuredDataHook } from '../hooks/generateStructuredData'

export const ProductPage: GlobalConfig = {
  slug: 'product-page',
  dbName: 'pp',
  label: 'Projektek oldal',
  admin: {
    group: 'Weboldal',
    description: 'A projektek oldal beállításai (cím, SEO, dinamikus zóna)',
    livePreview: {
      url: ({ locale }: any) => {
        const base = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '')
        const loc = locale?.code || 'hu'
        return `${base}/${loc}/${loc === 'hu' ? 'projektek' : 'products'}`
      },
    },
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        const d = data as any
        if (Array.isArray(d?.dynamic_zone)) {
          d.dynamic_zone = d.dynamic_zone.filter(
            (b: any) => b?.id !== '69c849a8fff6d4d8206b7d0f',
          )
        }
        return d
      },
    ],
    beforeChange: [
      ({ data, req, global }) =>
        generateStructuredDataHook({ data, req, global }),
    ],
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Főcím',
      localized: true,
    },
    {
      name: 'sub_heading',
      type: 'text',
      label: 'Alcím',
      localized: true,
    },
    {
      name: 'featured_products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Kiemelt projektek',
      admin: {
        description: 'Válaszd ki a megjelenítendő projekteket és húzd a kívánt sorrendbe. Ha üres, az összes featured projekt megjelenik.',
      },
    },
    seoField(),
    {
      name: 'dynamic_zone',
      type: 'blocks',
      label: 'Dinamikus zóna',
      blocks: allBlocks,
    },
  ],
}
