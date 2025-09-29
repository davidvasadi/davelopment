// config/plugins.ts

export default ({ env }) => ({
  // ————————————————
  // 1. Nyelvi (i18n) beállítások
  // ————————————————
  i18n: {
    enabled: true,
    config: {
      locales: ['hu', 'en'],
      defaultLocale: 'hu',
    },
  },

  // ————————————————
  // 2. Email beállítás Nodemailer-rel
  // ————————————————
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('EMAIL_USER'),
          pass: env('EMAIL_PASS'),
        },
        secure: env.bool('SMTP_SECURE', false), // true for 465, false for other ports
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', env('EMAIL_USER')),
        defaultReplyTo: env('EMAIL_REPLY_TO', env('EMAIL_USER')),
      },
    },
  },
});
