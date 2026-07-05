import type { CollectionConfig } from 'payload'
import { optimizeMediaHook, mediaBeforeChange, sanitizeUploadFilename, optimizeExistingMedia } from '../hooks/optimizeMedia'

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  upload: {
    adminThumbnail: ({ doc }: any) => doc.poster_url ?? doc.url,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
    ],
  },
  admin: {
    group: 'Tartalom',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'filesize_human', 'quality_status', 'mimeType', 'createdAt'],
  },
  hooks: {
    beforeOperation: [sanitizeUploadFilename],
    beforeChange: [mediaBeforeChange],
    afterChange: [optimizeMediaHook],
  },
  endpoints: [
    {
      path: '/optimize-all',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { docs, totalDocs } = await req.payload.find({
          collection: 'media',
          limit: 0,
          depth: 0,
          overrideAccess: true,
        })

        req.payload.logger.info(`[optimizeMedia] bulk optimization elindítva: ${totalDocs} fájl`)

        // Fire and forget — ne blokkoljuk a választ
        ;(async () => {
          for (const doc of docs) {
            try {
              await optimizeExistingMedia(doc, req.payload)
            } catch (err) {
              req.payload.logger.error(`[optimizeMedia] hiba (${doc.filename}): ${err}`)
            }
          }
          req.payload.logger.info(`[optimizeMedia] bulk optimization kész`)
        })()

        return Response.json({ message: `Optimization elindítva ${totalDocs} fájlra.`, total: totalDocs })
      },
    },
  ],
  access: {
    read: () => true,
    create: ({ req }: any) => !!req.user,
    update: ({ req }: any) => !!req.user,
    delete: ({ req }: any) => !!req.user && req.user?.role !== 'editor',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt szöveg',
      localized: true,
      admin: {
        description: 'Ha üresen hagyod, automatikusan kitöltődik a fájlnévből.',
      },
    },
    {
      name: 'filesize_human',
      type: 'text',
      label: 'Méret',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        afterRead: [({ siblingData }: any) => {
          const b = siblingData?.filesize ?? 0
          if (b === 0)              return '—'
          if (b < 1024)             return `${b} B`
          if (b < 1024 * 1024)      return `${(b / 1024).toFixed(1)} KB`
          return `${(b / (1024 * 1024)).toFixed(1)} MB`
        }],
      },
    },
    {
      name: 'quality_status',
      type: 'text',
      label: 'Minőség státusz',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Google PageSpeed és SEO ellenőrzés.',
      },
      hooks: {
        afterRead: [({ value, siblingData }: any) => {
          // Ha már van tárolt érték (új feltöltés után), azt mutatja
          if (value) return value
          // Meglévő rekordoknál dinamikusan számolja
          const issues: string[] = []
          const b    = siblingData?.filesize ?? 0
          const mime = siblingData?.mimeType ?? ''
          const alt  = siblingData?.alt
          if (!alt) issues.push('⚠ Alt tag hiányzik')
          if (mime.startsWith('image/')) {
            if (b > 300 * 1024)       issues.push('✗ Kép > 300KB — Google PageSpeed hiba')
            else if (b > 100 * 1024)  issues.push('⚠ Kép > 100KB — Google flageli')
          } else if (mime.startsWith('video/')) {
            if (b > 10 * 1024 * 1024)      issues.push('✗ Videó > 10MB')
            else if (b > 5 * 1024 * 1024)  issues.push('⚠ Videó > 5MB')
          }
          return issues.length === 0 ? '✓ OK' : issues.join('  |  ')
        }],
      },
    },
    {
      name: 'poster_url',
      type: 'text',
      label: 'Videó borítókép URL',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Automatikusan generálva videó feltöltésekor.',
        condition: (data: any) => data?.mimeType?.startsWith('video/'),
      },
    },
  ],
}
