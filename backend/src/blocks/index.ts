import type { Block, Field } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buttonField } from '../fields/button'

// Reusable inline button fields (for use inside arrays/groups where buttonField() can't be called directly)
const inlineButtonFields: Field[] = [
  {
    name: 'text',
    type: 'text',
    label: 'Szöveg',
  },
  {
    name: 'URL',
    type: 'text',
    label: 'URL',
  },
  {
    name: 'target',
    type: 'select',
    label: 'Megnyitás',
    options: [
      { label: 'Ugyanabban a lapon', value: '_self' },
      { label: 'Új lapon', value: '_blank' },
      { label: 'Szülő keretben', value: '_parent' },
      { label: 'Teljes ablak', value: '_top' },
    ],
    defaultValue: '_self',
  },
  {
    name: 'variant',
    type: 'select',
    label: 'Stílus',
    options: [
      { label: 'Elsődleges', value: 'primary' },
      { label: 'Körvonalazott', value: 'outline' },
      { label: 'Egyszerű', value: 'simple' },
      { label: 'Halvány', value: 'muted' },
    ],
    defaultValue: 'primary',
  },
]

// Reusable inline link fields
const inlineLinkFields: Field[] = [
  {
    name: 'text',
    type: 'text',
    label: 'Szöveg',
  },
  {
    name: 'URL',
    type: 'text',
    label: 'URL',
  },
  {
    name: 'target',
    type: 'select',
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

// Reusable form input fields
const formInputFields: Field[] = [
  {
    name: 'type',
    type: 'select',
    label: 'Típus',
    options: [
      { label: 'Szöveg', value: 'text' },
      { label: 'E-mail', value: 'email' },
      { label: 'Szövegmező', value: 'textarea' },
      { label: 'Jelölőnégyzet', value: 'checkbox' },
      { label: 'Küldés', value: 'submit' },
    ],
  },
  {
    name: 'name',
    type: 'text',
    label: 'Név',
  },
  {
    name: 'placeholder',
    type: 'text',
    label: 'Helyőrző szöveg',
  },
]

// ─── HeroBlock ───────────────────────────────────────────────────────────────

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero blokk',
    plural: 'Hero blokkok',
  },
  fields: [
    {
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
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
      name: 'description_lead',
      type: 'text',
      label: 'Bevezető leírás',
      localized: true,
    },
    {
      name: 'description_body',
      type: 'text',
      label: 'Törzs leírás',
      localized: true,
    },
    {
      name: 'description_text',
      type: 'textarea',
      label: 'Leírás szöveg',
      localized: true,
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright',
      localized: true,
    },
    {
      name: 'anchor_id',
      type: 'text',
      label: 'Horgony azonosító',
      localized: true,
      defaultValue: 'kapcsolat',
    },
    {
      name: 'CTAs',
      type: 'array',
      label: 'CTA gombok',
      localized: true,
      fields: inlineButtonFields,
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      label: 'Videó',
      localized: true,
    },
    {
      name: 'video_poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Videó borítókép',
      localized: true,
    },
    {
      name: 'services',
      type: 'array',
      label: 'Szolgáltatások',
      localized: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Cím',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Leírás',
        },
      ],
    },
    {
      name: 'person',
      type: 'group',
      label: 'Személy',
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
  ],
}

// ─── FeaturesBlock ───────────────────────────────────────────────────────────

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: {
    singular: 'Funkciók blokk',
    plural: 'Funkciók blokkok',
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
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'globe_card',
      type: 'group',
      label: 'Glóbusz kártya',
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
    {
      name: 'ray_card',
      type: 'group',
      label: 'Sugár kártya',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Főcím',
        },
        {
          name: 'items',
          type: 'array',
          label: 'Elemek',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Szöveg',
            },
          ],
        },
      ],
    },
    {
      name: 'graph_card',
      type: 'group',
      label: 'Grafikon kártya',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Főcím',
        },
        {
          name: 'top_items',
          type: 'array',
          label: 'Felső elemek',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Felirat',
            },
            {
              name: 'value',
              type: 'number',
              label: 'Érték',
            },
          ],
        },
        {
          name: 'description',
          type: 'text',
          label: 'Leírás',
        },
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

// ─── TestimonialsBlock ────────────────────────────────────────────────────────

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Vélemények blokk',
    plural: 'Vélemények blokkok',
  },
  fields: [
    {
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
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
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      label: 'Vélemények',
      hasMany: true,
    },
    {
      name: 'stat_rating',
      type: 'number',
      label: 'Értékelés',
      localized: true,
    },
    {
      name: 'stat_rating_max',
      type: 'number',
      label: 'Maximális értékelés',
      localized: true,
    },
    {
      name: 'stat_description',
      type: 'text',
      label: 'Stat leírás',
      localized: true,
    },
    {
      name: 'stat_description_bold',
      type: 'text',
      label: 'Stat leírás (félkövér)',
      localized: true,
    },
    {
      name: 'stat_trust_label',
      type: 'text',
      label: 'Bizalom felirat',
      localized: true,
    },
    {
      name: 'stat_cta_text',
      type: 'text',
      label: 'Stat CTA szöveg',
      localized: true,
    },
    {
      name: 'stat_cta_url',
      type: 'text',
      label: 'Stat CTA URL',
      localized: true,
    },
    {
      name: 'stat_brand',
      type: 'text',
      label: 'Márka',
      localized: true,
    },
  ],
}

// ─── FAQBlock ─────────────────────────────────────────────────────────────────

export const FAQBlock: Block = {
  slug: 'faq',
  labels: {
    singular: 'GYIK blokk',
    plural: 'GYIK blokkok',
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
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      label: 'GYIK elemek',
      hasMany: true,
    },
  ],
}

// ─── CTABlock ─────────────────────────────────────────────────────────────────

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'CTA blokk',
    plural: 'CTA blokkok',
  },
  fields: [
    {
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Főcím',
      localized: true,
    },
    {
      name: 'heading_highlight',
      type: 'text',
      label: 'Kiemelt főcím',
      localized: true,
    },
    {
      name: 'sub_heading',
      type: 'text',
      label: 'Alcím',
      localized: true,
    },
    {
      name: 'CTAs',
      type: 'array',
      label: 'CTA gombok',
      localized: true,
      fields: inlineButtonFields,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Kép',
      hasMany: true,
      localized: true,
    },
  ],
}

// ─── PricingBlock ─────────────────────────────────────────────────────────────

export const PricingBlock: Block = {
  slug: 'pricing',
  labels: {
    singular: 'Árazás blokk',
    plural: 'Árazás blokkok',
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
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'currency',
      type: 'text',
      label: 'Pénznem',
      localized: true,
    },
    {
      name: 'project_label',
      type: 'text',
      label: 'Projekt felirat',
      localized: true,
    },
    {
      name: 'monthly_label',
      type: 'text',
      label: 'Havi felirat',
      localized: true,
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
      type: 'number',
      label: 'Addon ár',
      localized: true,
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
      name: 'question',
      type: 'text',
      label: 'Kérdés',
      localized: true,
    },
    {
      name: 'profile_label',
      type: 'text',
      label: 'Profil felirat',
      localized: true,
    },
    {
      name: 'profile_description',
      type: 'text',
      label: 'Profil leírás',
      localized: true,
    },
    {
      name: 'profile_job',
      type: 'text',
      label: 'Profil munkakör',
      localized: true,
    },
    {
      name: 'profile_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Profil kép',
      localized: true,
    },
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      label: 'Háttér',
      localized: true,
    },
    {
      name: 'plans',
      type: 'relationship',
      relationTo: 'plans',
      label: 'Csomagok',
      hasMany: true,
    },
  ],
}

// ─── HowItWorksBlock ──────────────────────────────────────────────────────────

export const HowItWorksBlock: Block = {
  slug: 'how-it-works',
  labels: {
    singular: 'Hogyan működik blokk',
    plural: 'Hogyan működik blokkok',
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
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'Video',
      type: 'upload',
      relationTo: 'media',
      label: 'Videó',
      localized: true,
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Lépések',
      localized: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Cím',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Leírás',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Kép',
        },
      ],
    },
  ],
}

// ─── ServicesBlock ────────────────────────────────────────────────────────────

export const ServicesBlock: Block = {
  slug: 'services',
  labels: {
    singular: 'Szolgáltatások blokk',
    plural: 'Szolgáltatások blokkok',
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
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'cta_title',
      type: 'text',
      label: 'CTA cím',
      localized: true,
    },
    {
      name: 'cta_anchor',
      type: 'text',
      label: 'CTA horgony',
      localized: true,
    },
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      label: 'Háttér',
      localized: true,
    },
    {
      name: 'elements_service_item',
      type: 'array',
      label: 'Szolgáltatás elemek',
      localized: true,
      fields: [
        {
          name: 'number',
          type: 'text',
          label: 'Sorszám',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Cím',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Leírás',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Ikon',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          label: 'Képek',
        },
        {
          name: 'categories',
          type: 'array',
          label: 'Kategóriák',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Felirat',
            },
          ],
        },
        {
          name: 'categories_title',
          type: 'text',
          label: 'Kategóriák cím',
        },
        {
          name: 'category_count',
          type: 'text',
          label: 'Kategória szám',
        },
      ],
    },
  ],
}

// ─── BrandsBlock ──────────────────────────────────────────────────────────────

export const BrandsBlock: Block = {
  slug: 'brands',
  labels: {
    singular: 'Márkák blokk',
    plural: 'Márkák blokkok',
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
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'logos',
      type: 'relationship',
      relationTo: 'logos',
      label: 'Logók',
      hasMany: true,
    },
  ],
}

// ─── BlogBlock ────────────────────────────────────────────────────────────────

export const BlogBlock: Block = {
  slug: 'blog',
  labels: {
    singular: 'Blog blokk',
    plural: 'Blog blokkok',
  },
  fields: [
    {
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'heading_left',
      type: 'text',
      label: 'Bal oldali főcím',
      localized: true,
    },
    {
      name: 'heading_right',
      type: 'text',
      label: 'Jobb oldali főcím',
      localized: true,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Leírás',
      editor: lexicalEditor(),
      localized: true,
    },
    {
      name: 'highlight_heading',
      type: 'text',
      label: 'Kiemelt főcím',
      localized: true,
    },
    {
      name: 'highlight_subheading',
      type: 'text',
      label: 'Kiemelt alcím',
      localized: true,
    },
    {
      name: 'highlight_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Kiemelt kép',
      localized: true,
    },
    buttonField('button', 'Gomb'),
    {
      name: 'articles',
      type: 'relationship',
      relationTo: 'articles',
      label: 'Cikkek',
      hasMany: true,
    },
  ],
}

// ─── NewsletterBlock ──────────────────────────────────────────────────────────

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  labels: {
    singular: 'Hírlevél blokk',
    plural: 'Hírlevél blokkok',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Cím',
      localized: true,
    },
    {
      name: 'heading_left',
      type: 'text',
      label: 'Bal oldali főcím',
      localized: true,
    },
    {
      name: 'heading_right',
      type: 'text',
      label: 'Jobb oldali főcím',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Leírás',
      localized: true,
    },
    {
      name: 'source',
      type: 'text',
      label: 'Forrás',
      localized: true,
    },
    {
      name: 'profile_name',
      type: 'text',
      label: 'Profil név',
      localized: true,
    },
    {
      name: 'profile_role',
      type: 'text',
      label: 'Profil szerepkör',
      localized: true,
    },
    {
      name: 'profile_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Profil kép',
      localized: true,
    },
    {
      name: 'form',
      type: 'group',
      label: 'Űrlap',
      fields: [
        {
          name: 'inputs',
          type: 'array',
          label: 'Mezők',
          fields: formInputFields,
        },
      ],
    },
  ],
}

// ─── LaunchesBlock ────────────────────────────────────────────────────────────

export const LaunchesBlock: Block = {
  slug: 'launches',
  labels: {
    singular: 'Indítások blokk',
    plural: 'Indítások blokkok',
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
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'launches',
      type: 'array',
      label: 'Indítások',
      localized: true,
      fields: [
        {
          name: 'mission_number',
          type: 'text',
          label: 'Misszió szám',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Cím',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Leírás',
          admin: {
            rows: 10,
          },
        },
      ],
    },
  ],
}

// ─── ProductsBlock ────────────────────────────────────────────────────────────

export const ProductsBlock: Block = {
  slug: 'products',
  labels: {
    singular: 'Termékek blokk',
    plural: 'Termékek blokkok',
  },
  fields: [
    {
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
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
      name: 'projects',
      type: 'array',
      label: 'Projektek',
      localized: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          label: 'Termék',
        },
        {
          name: 'badge_label',
          type: 'text',
          label: 'Badge felirat',
        },
        {
          name: 'result_line',
          type: 'text',
          label: 'Eredmény sor',
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Címkék',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Szöveg',
            },
          ],
        },
        {
          name: 'is_featured',
          type: 'checkbox',
          label: 'Kiemelt',
        },
      ],
    },
  ],
}

// ─── RelatedArticlesBlock ─────────────────────────────────────────────────────

export const RelatedArticlesBlock: Block = {
  slug: 'related-articles',
  labels: {
    singular: 'Kapcsolódó cikkek blokk',
    plural: 'Kapcsolódó cikkek blokkok',
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
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'articles',
      type: 'relationship',
      relationTo: 'articles',
      label: 'Cikkek',
      hasMany: true,
    },
  ],
}

// ─── RelatedProductsBlock ─────────────────────────────────────────────────────

export const RelatedProductsBlock: Block = {
  slug: 'related-products',
  labels: {
    singular: 'Kapcsolódó termékek blokk',
    plural: 'Kapcsolódó termékek blokkok',
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
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      label: 'Termékek',
      hasMany: true,
    },
  ],
}

// ─── WhyChooseUsBlock ─────────────────────────────────────────────────────────

export const WhyChooseUsBlock: Block = {
  slug: 'why-choose-us',
  labels: {
    singular: 'Miért válassz minket blokk',
    plural: 'Miért válassz minket blokkok',
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
      name: 'badge_label',
      type: 'text',
      label: 'Badge felirat',
      localized: true,
    },
    {
      name: 'hero_card',
      type: 'group',
      label: 'Bal kártya (háttér + gomb)',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Cím (hover overlay)',
          localized: true,
        },
        {
          name: 'background',
          type: 'upload',
          relationTo: 'media',
          label: 'Háttér kép / videó',
        },
        buttonField('cta', 'CTA gomb'),
      ],
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Stat kártyák',
      localized: true,
      fields: [
        {
          name: 'number',
          type: 'text',
          label: 'Szám / számláló (pl. 120+)',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Cím',
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

// ─── FormNextToSectionBlock ───────────────────────────────────────────────────

export const FormNextToSectionBlock: Block = {
  slug: 'form-section',
  labels: {
    singular: 'Űrlap szakasz mellett blokk',
    plural: 'Űrlap szakasz mellett blokkok',
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
      name: 'copyright',
      type: 'text',
      label: 'Copyright',
      localized: true,
    },
    {
      name: 'policy_prefix',
      type: 'text',
      label: 'Adatvédelmi előtag',
      localized: true,
    },
    {
      name: 'policy_and_word',
      type: 'text',
      label: 'Adatvédelmi és szó',
      localized: true,
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      label: 'Videó',
      localized: true,
    },
    {
      name: 'form',
      type: 'group',
      label: 'Űrlap',
      fields: [
        {
          name: 'inputs',
          type: 'array',
          label: 'Mezők',
          fields: formInputFields,
        },
      ],
    },
    {
      name: 'section',
      type: 'group',
      label: 'Szakasz',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Főcím',
        },
        {
          name: 'sub_heading',
          type: 'text',
          label: 'Alcím',
        },
        {
          name: 'users',
          type: 'array',
          label: 'Felhasználók',
          fields: [
            {
              name: 'firstname',
              type: 'text',
              label: 'Keresztnév',
            },
            {
              name: 'lastname',
              type: 'text',
              label: 'Vezetéknév',
            },
            {
              name: 'job',
              type: 'text',
              label: 'Munkakör',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Kép',
            },
          ],
        },
      ],
    },
    {
      name: 'person',
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
      name: 'benefits',
      type: 'array',
      label: 'Előnyök',
      localized: true,
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Ikon',
          options: [
            { label: 'Forgatás', value: 'rotate' },
            { label: 'Lépés', value: 'step' },
            { label: 'Pipa', value: 'check' },
            { label: 'Óra', value: 'clock' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Cím',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Leírás',
        },
      ],
    },
    {
      name: 'policy_links',
      type: 'array',
      label: 'Adatvédelmi linkek',
      fields: inlineLinkFields,
    },
    {
      name: 'social_links',
      type: 'array',
      label: 'Közösségi média ikon linkek',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Kép',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Linkek',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Szöveg',
            },
            {
              name: 'URL',
              type: 'text',
              label: 'URL',
            },
            {
              name: 'target',
              type: 'select',
              label: 'Megnyitás',
              options: [
                { label: 'Ugyanabban a lapon', value: '_self' },
                { label: 'Új lapon', value: '_blank' },
                { label: 'Szülő keretben', value: '_parent' },
                { label: 'Teljes ablak', value: '_top' },
              ],
              defaultValue: '_self',
            },
          ],
        },
      ],
    },
  ],
}

// ─── All blocks array ─────────────────────────────────────────────────────────

export const allBlocks: Block[] = [
  HeroBlock,
  FeaturesBlock,
  TestimonialsBlock,
  FAQBlock,
  CTABlock,
  PricingBlock,
  HowItWorksBlock,
  ServicesBlock,
  BrandsBlock,
  BlogBlock,
  NewsletterBlock,
  LaunchesBlock,
  ProductsBlock,
  RelatedArticlesBlock,
  RelatedProductsBlock,
  WhyChooseUsBlock,
  FormNextToSectionBlock,
]
