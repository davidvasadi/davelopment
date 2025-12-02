// backend/config/middlewares.ts

export default [
  'strapi::logger',
  'strapi::errors',

  // --- SECURITY + CSP beállítás ---
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // KÉPEK: saját domain + data: + blob: + Strapi saját hostjai
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://davelopment.hu',
            'https://market-assets.strapi.io',
            'strapi-ai-staging.s3.us-east-1.amazonaws.com',
            'strapi-ai-production.s3.us-east-1.amazonaws.com',
          ],

          // videó / egyéb média
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'https://davelopment.hu',
          ],

          // API kapcsolatok
          'connect-src': [
            "'self'",
            'http:',
            'https:',
            'ws:',
            'wss:',
            'http://localhost:1337',
            'https://davelopment.hu',
          ],

          // ne erőltesse a http→https upgrade-et
          upgradeInsecureRequests: null,
        },
      },
    },
  },

  // --- CORS ---
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://davelopment.hu',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
    },
  },

  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',

  // a saját middleware-ed marad a végén
  'global::deepPopulate',
];
