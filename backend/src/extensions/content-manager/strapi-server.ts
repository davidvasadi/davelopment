// src/extensions/content-manager/strapi-server.js
'use strict';

module.exports = (plugin) => {
  console.log('🔌 [extension] content-manager loaded');

  const originalPublish = plugin.controllers['collection-types'].publish;

  plugin.controllers['collection-types'].publish = async (ctx) => {
    console.log('🔔 [extension] overridden publish called:', ctx.params);

    // 1) Futtasd le az eredeti publish logikát (ez beállítja ctx.body-t)
    await originalPublish(ctx);

    // 2) Innen olvasd ki a tényleges numerikus ID-t és model-t
    const model = ctx.params.model;
    const publishedData = ctx.body?.data;    // ↟ ez már ott lesz
    const id = publishedData?.id;

    if (
      model === 'api::newsletter-campaign.newsletter-campaign' &&
      id
    ) {
      try {
        await strapi
          .service('api::newsletter-campaign.newsletter-campaign')
          .sendCampaign(id);
        strapi.log.info(
          `✅ [extension] Campaign ${id} sent after UI publish`
        );
      } catch (err) {
        strapi.log.error(
          `❌ [extension] sendCampaign error:`,
          err
        );
      }
    }

    // 3) Visszaadjuk a Koa ctx.body-t, hogy a UI megkapja a publikált objektumot
    return ctx.body;
  };

  return plugin;
};
