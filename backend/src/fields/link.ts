import type { Field } from 'payload'

export const linkField = (name = 'link', label = 'Link'): Field => ({
  name,
  type: 'group',
  label,
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
})
