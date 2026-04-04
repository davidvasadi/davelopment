import type { GlobalConfig } from 'payload'
import { seoField } from '../fields/seo'
import { allBlocks } from '../blocks/index'

export const ProductPage: GlobalConfig = {
  slug: 'product-page',
  label: 'Projektek oldal',
  admin: {
    group: 'Weboldal',
    description: 'A projektek oldal beállításai (cím, SEO, dinamikus zóna)',
  },
  access: {
    read: () => true,
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
        description: 'Válaszd ki a megjelenítendő projekteket. Ha üres, az összes featured projekt megjelenik.',
      },
    },
    seoField(),
    {
      name: 'dynamic_zone',
      type: 'blocks',
      label: 'Dinamikus zóna',
      localized: true,
      blocks: allBlocks,
    },
  ],
}
