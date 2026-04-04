import type { Field } from 'payload'

export const buttonField = (name = 'button', label = 'Gomb'): Field => ({
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
  ],
})
