import type { Field } from 'payload'

export const seoField = (): Field => ({
  name: 'seo',
  type: 'group',
  label: 'SEO',
  localized: true,
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta cím',
      maxLength: 60,
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta leírás',
      minLength: 50,
    },
    {
      name: 'metaImage',
      type: 'upload',
      relationTo: 'media',
      label: 'OG kép',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
    {
      name: 'keywords',
      type: 'text',
      label: 'Kulcsszavak (vesszővel elválasztva)',
    },
    {
      name: 'metaRobots',
      type: 'text',
      label: 'Meta robots',
    },
    {
      name: 'structuredDataPreview',
      type: 'ui',
      admin: {
        components: {
          Field: './components/StructuredDataPreview#StructuredDataPreview',
        },
      },
    },
    {
      name: 'structuredData',
      type: 'json',
      label: 'Strukturált adat — kézi felülírás (opcionális)',
      admin: {
        description:
          'Alapból hagyd üresen — a strukturált adat automatikusan generálódik a tartalomból (lásd fent az élő előnézetet). Csak akkor tölts ide teljes @graph JSON-t, ha kézzel felül akarod írni.',
      },
    },
    {
      name: 'metaViewport',
      type: 'text',
      label: 'Meta viewport',
    },
    {
      name: 'canonicalURL',
      type: 'text',
      label: 'Kanonikus URL',
    },
    {
      name: 'noindex',
      type: 'checkbox',
      label: 'Noindex — Google ne indexelje ezt az oldalt',
      defaultValue: false,
      admin: {
        description: 'Bekapcsolva: noindex, nofollow. Pl. adatkezelési tájékoztató, felhasználási feltételek.',
      },
    },
  ],
})
