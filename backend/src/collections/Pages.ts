import type { CollectionConfig } from 'payload'
import { seoField } from '../fields/seo'
import { allBlocks } from '../blocks/index'
import { generateStructuredDataHook } from '../hooks/generateStructuredData'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Tartalom',
    useAsTitle: 'label',
    defaultColumns: ['label', 'slug', 'createdAt'],
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
      async ({ data, operation, req }: any) => {
        // On create, if slug already exists (e.g. duplicate), append a short suffix
        if (operation === 'create' && data.slug) {
          const existing = await req.payload.find({
            collection: 'pages',
            where: { slug: { equals: data.slug } },
            limit: 1,
            depth: 0,
          });
          if (existing.docs.length > 0) {
            data.slug = `${data.slug}-${Date.now().toString(36)}`;
          }
        }
        return data;
      },
      ({ data, operation, req, collection }) =>
        generateStructuredDataHook({ data, operation, req, collection }),
    ],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Felirat',
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
      admin: {
        position: 'sidebar',
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
