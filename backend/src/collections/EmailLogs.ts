import type { CollectionConfig } from 'payload'

export const EmailLogs: CollectionConfig = {
  slug: 'email-logs',
  admin: {
    hidden: true,
    useAsTitle: 'subject',
    defaultColumns: ['type', 'to', 'subject', 'ref_collection', 'createdAt'],
    description: 'Automatikusan küldött emailek naplója (kvóta figyeléshez)',
  },
  access: {
    // all operations: Payload default (requires auth)
    update: () => false,  // logs are immutable
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Típus',
      required: true,
      options: [
        { label: 'Kampány', value: 'campaign' },
        { label: 'Kapcsolatfelvétel — admin értesítő', value: 'contact-notification' },
        { label: 'Kapcsolatfelvétel — auto-reply', value: 'contact-autoreply' },
        { label: 'Hírlevél — üdvözlő', value: 'newsletter-welcome' },
        { label: 'Egyéb', value: 'other' },
      ],
    },
    {
      name: 'to',
      type: 'email',
      label: 'Címzett',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Tárgy',
    },
    {
      name: 'ref_collection',
      type: 'text',
      label: 'Forrás collection',
    },
    {
      name: 'ref_id',
      type: 'text',
      label: 'Forrás rekord ID',
    },
  ],
}
