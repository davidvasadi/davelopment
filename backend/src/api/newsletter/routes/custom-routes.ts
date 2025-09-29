/**
 * Egyedi route a hírlevél leiratkozáshoz
 */

export default [
  {
    method: 'GET',
    path: '/newsletter/unsubscribe/:token',
    handler: 'api::newsletter.newsletter.unsubscribe',
    config: {
      auth: false, // Publikus route
    },
  },
];
