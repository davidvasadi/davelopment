import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::newsletter.newsletter', {
  config: {
    unsubscribe: {
      auth: false,
    },
    
  },

});
