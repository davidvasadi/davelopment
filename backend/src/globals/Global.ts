import type { GlobalConfig } from 'payload'
import { seoField } from '../fields/seo'

const navLinkFields = [
  {
    name: 'text',
    type: 'text' as const,
    label: 'Szöveg',
  },
  {
    name: 'URL',
    type: 'text' as const,
    label: 'URL',
  },
  {
    name: 'target',
    type: 'select' as const,
    label: 'Megnyitás',
    options: [
      { label: 'Ugyanabban a lapon', value: '_self' },
      { label: 'Új lapon', value: '_blank' },
      { label: 'Szülő keretben', value: '_parent' },
      { label: 'Teljes ablak', value: '_top' },
    ],
    defaultValue: '_self',
  },
]

export const Global: GlobalConfig = {
  slug: 'global',
  admin: {
    group: 'Weboldal',
  },
  access: {
    read: () => true,
  },
  fields: [
    seoField(),
    {
      name: 'navbar',
      type: 'group',
      label: 'Navigációs sáv',
      fields: [
        {
          name: 'logo',
          type: 'relationship',
          relationTo: 'logos',
          label: 'Logó',
        },
        {
          name: 'left_navbar_items',
          type: 'array',
          label: 'Bal oldali navigációs elemek',
          localized: true,
          fields: navLinkFields,
        },
        {
          name: 'right_navbar_items',
          type: 'array',
          label: 'Jobb oldali navigációs elemek',
          localized: true,
          fields: navLinkFields,
        },
        {
          name: 'policy',
          type: 'array',
          label: 'Adatvédelmi linkek',
          localized: true,
          fields: navLinkFields,
        },
        {
          name: 'copyright',
          type: 'text',
          label: 'Copyright',
        },
        {
          name: 'copyright_enabled',
          type: 'checkbox',
          label: 'Copyright megjelenítése',
        },
        {
          name: 'contact_email',
          type: 'email',
          label: 'Kapcsolati email (overlay menüben)',
        },
        {
          name: 'contact_phone',
          type: 'text',
          label: 'Kapcsolati telefon (overlay menüben)',
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Lábléc',
      fields: [
        {
          name: 'logo',
          type: 'relationship',
          relationTo: 'logos',
          label: 'Logó',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Leírás',
        },
        {
          name: 'copyright',
          type: 'text',
          label: 'Copyright',
        },
        {
          name: 'designed_developed_by',
          type: 'text',
          label: 'Tervezett és fejlesztett által',
        },
        {
          name: 'built_with',
          type: 'text',
          label: 'Készítve ezzel',
        },
        {
          name: 'navigation_title',
          type: 'text',
          label: 'Navigáció cím',
        },
        {
          name: 'social_title',
          type: 'text',
          label: 'Közösségi média cím',
        },
        {
          name: 'internal_links',
          type: 'array',
          label: 'Belső linkek',
          fields: navLinkFields,
        },
        {
          name: 'policy_links',
          type: 'array',
          label: 'Adatvédelmi linkek',
          fields: navLinkFields,
        },
        {
          name: 'social_media_links',
          type: 'array',
          label: 'Közösségi média linkek',
          fields: navLinkFields,
        },
        {
          name: 'profile',
          type: 'upload',
          relationTo: 'media',
          label: 'Profil kép',
        },
        {
          name: 'contact_email',
          type: 'email',
          label: 'Kapcsolati email cím',
        },
        {
          name: 'contact_phone',
          type: 'text',
          label: 'Kapcsolati telefonszám',
        },
      ],
    },
  ],
}
