import type { GlobalConfig } from 'payload'
import { seoField } from '../fields/seo'
import { allBlocks } from '../blocks/index'
import { generateStructuredDataHook } from '../hooks/generateStructuredData'

export const BlogPage: GlobalConfig = {
  slug: 'blog-page',
  label: 'Blog oldal',
  admin: {
    group: 'Weboldal',
    description: 'A blog oldal beállításai (cím, SEO, dinamikus zóna)',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  hooks: {
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
      name: 'sub_heading_2',
      type: 'text',
      label: 'Alcím 2',
      localized: true,
    },
    {
      name: 'featured_articles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      label: 'Kiemelt cikkek',
      admin: {
        description: 'Válaszd ki a megjelenítendő cikkeket és húzd a kívánt sorrendbe. Ha üres, az összes cikk megjelenik.',
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
