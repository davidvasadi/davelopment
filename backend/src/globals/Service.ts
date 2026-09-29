import type { GlobalConfig } from 'payload'
import { seoField } from '../fields/seo'
import { allBlocks } from '../blocks/index'
import { generateStructuredDataHook } from '../hooks/generateStructuredData'

export const Service: GlobalConfig = {
  slug: 'service',
  admin: {
    group: 'Weboldal',
    livePreview: {
      url: ({ locale }: any) => {
        const base = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '')
        const loc = locale?.code || 'hu'
        return `${base}/${loc}/${loc === 'hu' ? 'szolgaltatasok' : 'services'}`
      },
    },
  },
  label: 'Szolgáltatások oldal',
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
      label: 'Dinamikus zóna (a szolgáltatás-rács ELŐTT jelenik meg)',
      localized: true,
      admin: { initCollapsed: true },
      blocks: allBlocks,
    },
    {
      name: 'cta',
      type: 'blocks',
      label: 'Alsó dinamikus zóna (a szolgáltatás-rács UTÁN jelenik meg)',
      localized: true,
      admin: {
        initCollapsed: true,
        description: 'Ide kerülnek a szolgáltatás-lista (kártyás rács) alatt megjelenő blokkok, pl. GYIK, CTA, Referenciák — a mező neve "cta", de bármilyen blokk-típus használható benne.',
      },
      blocks: allBlocks,
    },
  ],
}
