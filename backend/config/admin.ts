// export default ({ env }) => ({
//   auth: {
//     secret: env('ADMIN_JWT_SECRET'),
//   },
//   apiToken: {
//     salt: env('API_TOKEN_SALT'),
//   },
//   transfer: {
//     token: {
//       salt: env('TRANSFER_TOKEN_SALT'),
//     },
//   },
//   secrets: {
//     encryptionKey: env('ENCRYPTION_KEY'),
//   },
//   flags: {
//     nps: env.bool('FLAG_NPS', true),
//     promoteEE: env.bool('FLAG_PROMOTE_EE', true),
//   },
// });


// config/admin.ts
export default ({ env }) => ({
  // Az admin nyilvános útvonala Nginx mögött
  url: '/admin',
  serveAdminPanel: env.bool('SERVE_ADMIN', true),

  // Strapi AI UI kapcsoló (UI megjelenik; a tényleges funkciók Strapi csomagtól függenek)
  ai: {
    enabled: env.bool('ADMIN_AI_ENABLED', true),
  },

  // Admin auth + cookie beállítások
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    // (opcionális) session policy – maradhat az alapértelmezett is
    sessions: {
      accessTokenLifespan: 1800,        // 30 perc
      maxRefreshTokenLifespan: 2592000, // 30 nap
      idleRefreshTokenLifespan: 604800, // 7 nap
      maxSessionLifespan: 604800,       // 7 nap
      idleSessionLifespan: 3600,        // 1 óra
    },
    cookie: {
      // domain: env('ADMIN_COOKIE_DOMAIN', 'davelopment.hu'), // csak ha szükséges
      path: '/admin',
      sameSite: 'lax',
      // secure: true  // PROD-ban úgyis secure lesz, ha a Strapi "https"-nek látja (proxy+X-Forwarded-Proto)
    },
  },

  // Tokenek / titkok – ezek NÁLAD már megvannak az .env-ben
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: { salt: env('TRANSFER_TOKEN_SALT') },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },

  // Ne tegyél ide host/port-ot – az a config/server.ts-ben van helyesen beállítva!
});
