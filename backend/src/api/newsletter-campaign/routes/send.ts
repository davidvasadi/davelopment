// 1. routes/send.ts
// Ez az útvonal definiálja a manuális küldést: POST /api/newsletter-campaign/:id/send
export default {
  routes: [
    {
      method: 'POST', // HTTP metódus
      path: '/newsletter-campaign/:id/send', // :id paraméter a kampányazonosítóhoz
      handler: 'api::newsletter-campaign.newsletter-campaign.send', // hívandó kontroller-metódus
      config: {
        scope: ['admin'],     // csak admin API tokennel // teszteléskor kikapcsolt autentikáció (éles környezetben true vagy policy)
      },
       policies: [
          'api::newsletter-campaign.is-newsletter-admin',
        ],
    },
  ],
};