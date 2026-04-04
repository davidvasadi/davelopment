import type { GlobalConfig } from 'payload'
import { seoField } from '../fields/seo'
import { allBlocks } from '../blocks/index'

export const Service: GlobalConfig = {
  slug: 'service',
  admin: {
    group: 'Weboldal',
  },
  label: 'Szolgáltatások oldal',
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
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
    seoField(),
    {
      name: 'pages',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Oldalak',
      hasMany: true,
    },
    {
      name: 'dynamic_zone',
      type: 'blocks',
      label: 'Dinamikus zóna',
      blocks: allBlocks,
    },
    {
      name: 'cta',
      type: 'blocks',
      label: 'CTA blokkok',
      blocks: allBlocks,
    },
  ],
}
