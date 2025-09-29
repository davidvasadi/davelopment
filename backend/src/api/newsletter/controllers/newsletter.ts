import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
  async unsubscribe(ctx) {
    const { token } = ctx.params;
    console.log('👉 unsubscribe controller elindult', ctx.params);

    if (!token) {
      return ctx.badRequest('Token hiányzik.');
    }

    const [subscriber] = await strapi.entityService.findMany('api::newsletter.newsletter', {
      filters: { unsubscribeToken: token },
      limit: 1,
    });

    if (!subscriber) {
      return ctx.notFound('Érvénytelen token.');
    }

    if (subscriber.unsubscribed) {
      return ctx.send({ message: 'Már korábban leiratkoztál.' });
    }

    await strapi.entityService.update('api::newsletter.newsletter', subscriber.id, {
      data: {
        unsubscribed: true,
        unsubscribedAt: new Date(),
      },
    });
    //Leiratkozás email nélkül
    return ctx.send({ message: 'Sikeresen leiratkoztál a hírlevélről.' });
  },
}));
