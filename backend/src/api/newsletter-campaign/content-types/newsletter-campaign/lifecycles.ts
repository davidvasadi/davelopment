export default {
  async afterUpdate(event) {
    const { result, params } = event;

    console.log('🟢 [newsletter-campaign.lifecycle] afterUpdate:', {
      id: result.id,
      dataSent: params.data,
      publishedAt: result.publishedAt,
      isSent: result.isSent,
    });

    // Ha a frissítésben benne volt a publishedAt, és még nincs elküldve
    if (
      params.data?.publishedAt &&
      result.publishedAt &&
      !result.isSent
    ) {
      console.log('🟢 Publishing detected, sending campaign');
      try {
        const count = await strapi
          .service('api::newsletter-campaign.newsletter-campaign')
          .sendCampaign(result.id);
        strapi.log.info(`✅ afterUpdate sent to ${count} subscribers.`);
      } catch (err) {
        strapi.log.error('❌ afterUpdate sendCampaign error:', err);
      }
    }
  },
};
