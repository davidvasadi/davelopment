import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoField } from '../fields/seo'
import { buttonField } from '../fields/button'
import { CTABlock, RelatedArticlesBlock } from '../blocks/index'
import { generateStructuredDataHook } from '../hooks/generateStructuredData'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    group: 'Tartalom',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'categories', 'createdAt'],
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
      name: 'title',
      type: 'text',
      label: 'Cím',
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
    {
      name: 'description',
      type: 'textarea',
      label: 'Leírás',
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Tartalom',
      editor: lexicalEditor(),
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Kép',
      localized: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Kategóriák',
      hasMany: true,
    },
    seoField(),
    {
      name: 'dynamic_zone',
      type: 'blocks',
      label: 'Dinamikus zóna',
      blocks: [CTABlock, RelatedArticlesBlock],
    },
    {
      name: 'person_card',
      type: 'group',
      label: 'Személy kártya',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Név',
        },
        {
          name: 'role',
          type: 'text',
          label: 'Szerepkör',
        },
        {
          name: 'org',
          type: 'text',
          label: 'Szervezet',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Kép',
        },
        buttonField('button', 'Gomb'),
      ],
    },
    {
      name: 'social_media_card',
      type: 'group',
      label: 'Közösségi média kártya',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Főcím',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Leírás',
        },
      ],
    },
  ],
}
