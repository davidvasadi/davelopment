// src/api/newsletter-campaign/controllers/newsletter-campaign.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::newsletter-campaign.newsletter-campaign',
  ({ strapi }) => ({
    /**
     * Manuális küldés endpoint: hívja a szolgáltatás sendCampaign metódusát
     */
    async send(ctx) {
      const { id } = ctx.params;

      try {
        const count = await strapi
          .service('api::newsletter-campaign.newsletter-campaign')
          .sendCampaign(id);

        return ctx.send({ message: `Kiküldve ${count} feliratkozónak.` });
      } catch (err) {
        strapi.log.error('❌ send endpoint error:', err);
        return ctx.internalServerError('Email küldési hiba');
      }
    },

    /**
     * Publish override: automatikusan küldés Publish eseménynél
     */
    async publish(ctx) {
      // 1) Alapértelmezett Publish logika
      const response = await super.publish(ctx);
      const published = response.body.data;
      const id = published.id;

      try {
        await strapi
          .service('api::newsletter-campaign.newsletter-campaign')
          .sendCampaign(id);
        strapi.log.info(`✅ Publish override: campaign ${id} sent.`);
      } catch (err) {
        strapi.log.error('❌ publish override sendCampaign error:', err);
      }

      // 2) Visszaadjuk az eredeti választ
      return response;
    },
  })
);
