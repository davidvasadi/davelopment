import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
// import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import { Articles } from './collections/Articles'
import { BlogPage } from './globals/BlogPage'
import { Categories } from './collections/Categories'
import { Contacts } from './collections/Contacts'
import { EmailLogs } from './collections/EmailLogs'
import { FAQs } from './collections/FAQs'
import { Logos } from './collections/Logos'
import { Media } from './collections/Media'
import { Newsletters } from './collections/Newsletters'
import { Pages } from './collections/Pages'
import { Plans } from './collections/Plans'
import { Products } from './collections/Products'
import { ProductPage } from './globals/ProductPage'
import { Redirections } from './collections/Redirections'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'

// Globals
import { Global } from './globals/Global'
import { Service } from './globals/Service'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    livePreview: {
      collections: ['pages', 'articles', 'products'],
      globals: ['global', 'service', 'blog-page', 'product-page'],
      breakpoints: [
        { label: 'Mobil',   name: 'mobile',  width: 390,  height: 844 },
        { label: 'Tablet',  name: 'tablet',  width: 768,  height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Davelopment',
    },
    avatar: {
      Component: './components/Avatar#Avatar',
    },
    components: {
      header: ['./components/Header#Header'],
      Nav: './components/Nav#Nav',
      graphics: {
        Icon: './components/graphics/Icon#Icon',
        Logo: './components/graphics/Logo#Logo',
      },
      beforeDashboard: ['./components/BeforeDashboard#default'],
      beforeLogin: ['./components/BeforeLogin#BeforeLogin'],
      views: {
        marketing: {
          Component: './components/MarketingView#MarketingView',
          path: '/marketing',
        },
        communications: {
          Component: './components/CommunicationsView#CommunicationsView',
          path: '/communications',
        },
      },
    },
  },

  collections: [
    // Rendszer (felül)
    Users,
    Redirections,
    // Tartalom
    Articles,
    Products,
    Pages,
    Media,
    Categories,
    FAQs,
    Testimonials,
    Logos,
    Plans,
    // Kommunikáció (contacts + newsletters látható, email-logs rejtett)
    Contacts,
    Newsletters,
    EmailLogs,
  ],

  globals: [
    Global,
    Service,
    BlogPage,
    ProductPage,
  ],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    push: process.env.NODE_ENV !== 'production' || process.env.PAYLOAD_DB_PUSH === 'true',
  }),

  // @ts-ignore - sharp type mismatch between versions
  sharp,

  // i18n for admin UI (hu support via @payloadcms/translations)
  i18n: {
    fallbackLanguage: 'en',
  },

  // Content localization
  localization: {
    locales: [
      {
        label: 'Magyar',
        code: 'hu',
      },
      {
        label: 'English',
        code: 'en',
      },
    ],
    defaultLocale: 'hu',
    fallback: true,
  },

  email: process.env.RESEND_API_KEY
    ? resendAdapter({
      defaultFromAddress: 'hello@davelopment.hu',
      defaultFromName: '[davelopment]®',
      apiKey: process.env.RESEND_API_KEY,
    })
    : undefined,

  cors: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:1337',
  ],

  csrf: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:1337',
  ],

  plugins: [
    // seoPlugin temporarily disabled for debugging
    // seoPlugin({...}),
  ],

  upload: {
    limits: {
      fileSize: 10000000, // 10MB
    },
  },
})
