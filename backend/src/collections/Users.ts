import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    group: 'Rendszer',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user && req.user?.role !== 'editor',
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user && req.user?.role !== 'editor',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Név',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Szerepkör',
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Szerkesztő', value: 'editor' },
      ],
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Profilkép',
    },
    {
      name: 'notificationsLastSeenAt',
      type: 'date',
      admin: { hidden: true },
    },
  ],
}
