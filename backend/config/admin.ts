const getPreviewPathname = (uid, { locale, document }): string | null => {
  const { slug } = document;

  switch (uid) {
    case 'api::page.page': {
      if (slug === 'homepage') {
        return '/';
      }
      return `/${slug}`;
    }
    case 'api::product.product':
      return `/products/${slug}`;
    case 'api::product-page.product-page':
      return '/products';
    case 'api::article.article':
      return `/blog/${slug}`;
    case 'api::blog-page.blog-page':
      return '/blog';
    default:
      return null;
  }
};

export default ({ env }) => {
  const clientUrl = env('CLIENT_URL');
  const previewSecret = env('PREVIEW_SECRET');

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },

    // ── Custom theme — illeszkedik a marketing metrics plugin stílusához ──
    theme: {
      dark: {
        colors: {
          // Háttérszínek
          neutral0:    '#0d1117',   // card háttér
          neutral100:  '#161b22',   // belső elemek
          neutral150:  '#1c2128',
          neutral200:  '#21262d',   // border
          neutral300:  '#30363d',   // border hover
          neutral400:  '#484f58',   // faint text
          neutral500:  '#6e7681',
          neutral600:  '#8b949e',   // muted text
          neutral700:  '#c9d1d9',   // secondary text
          neutral800:  '#e6edf3',
          neutral900:  '#f0f6fc',   // primary text
          neutral1000: '#ffffff',

          // Oldal háttér
          buttonNeutral0: '#161b22',

          // Elsődleges szín (zöld — mint az accent-green)
          primary100: 'rgba(61,255,160,0.08)',
          primary200: 'rgba(61,255,160,0.15)',
          primary500: '#3dffa0',
          primary600: '#2de891',
          primary700: '#20c97a',

          // Danger (piros)
          danger100: 'rgba(248,81,73,0.08)',
          danger200: 'rgba(248,81,73,0.15)',
          danger500: '#f85149',
          danger600: '#e03d35',
          danger700: '#c92f28',

          // Warning (amber)
          warning100: 'rgba(240,199,66,0.08)',
          warning200: 'rgba(240,199,66,0.15)',
          warning500: '#f0c742',
          warning600: '#d9af2e',
          warning700: '#b8911c',

          // Success (zöld)
          success100: 'rgba(61,255,160,0.08)',
          success200: 'rgba(61,255,160,0.15)',
          success500: '#3dffa0',
          success600: '#2de891',
          success700: '#20c97a',

          // Secondary (indigo)
          secondary100: 'rgba(124,106,247,0.08)',
          secondary200: 'rgba(124,106,247,0.15)',
          secondary500: '#7c6af7',
          secondary600: '#6b58e8',
          secondary700: '#5a47d0',

          // Oldal háttér
          neutral0Gradient: 'linear-gradient(180deg, #030712 0%, #030712 100%)',
        },
        shadows: {
          filterShadow:     '0 0 0 1px rgba(240,246,252,0.04), 0 2px 8px rgba(0,0,0,0.5)',
          tableShadow:      '0 0 0 1px rgba(240,246,252,0.04)',
          popupShadow:      '0 4px 24px rgba(0,0,0,0.6)',
          drawerShadow:     '-16px 0 48px rgba(0,0,0,0.4)',
        },
      },
      light: {
        colors: {
          primary500: '#1a7f37',
          primary600: '#166b2e',
          primary700: '#125a26',
        },
      },
    },

    preview: {
      enabled: true,
      config: {
        allowedOrigins: [clientUrl],
        async handler(uid, { documentId, locale, status }) {
          const document = await strapi
            .documents(uid)
            .findOne({ documentId, locale, status });
          const pathname = getPreviewPathname(uid, { locale, document });

          if (!pathname) {
            return null;
          }

          const urlSearchParams = new URLSearchParams({
            url: `/${locale ?? 'en'}${pathname}`,
            secret: previewSecret,
            status,
          });

          return `${clientUrl}/api/preview?${urlSearchParams}`;
        },
      },
    },
  };
};
