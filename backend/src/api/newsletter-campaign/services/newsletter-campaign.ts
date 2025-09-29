import { factories } from '@strapi/strapi';
import fs from 'fs/promises';
import path from 'path';

export default factories.createCoreService(
  'api::newsletter-campaign.newsletter-campaign',
  ({ strapi }) => ({
    /**
     * Küldi a megadott ID-jű kampányt a megfelelő feliratkozóknak,
     * majd frissíti az isSent és sentAt mezőket.
     */
    async sendCampaign(id: number) {
      // 1. Kampány lekérése
      const campaign = await strapi.entityService.findOne(
        'api::newsletter-campaign.newsletter-campaign',
        id,
        { fields: ['subject', 'content', 'previewText', 'targetLocale'] }
      );
      if (!campaign) throw new Error('Campaign not found');

      // 2. Feliratkozók lekérése
      const subscribers = await strapi.entityService.findMany(
        'api::newsletter.newsletter',
        {
          filters: { language: campaign.targetLocale },
          fields: ['email', 'name', 'id','unsubscribeToken'],
        }
      );
      if (subscribers.length === 0) return 0;

      // 3. HTML sablon beolvasása
      const templatePath = path.resolve(
        process.cwd(),
        'email-templates/newsletter-campaign/campaign.html'
      );
      let template: string;

      try {
        template = await fs.readFile(templatePath, 'utf-8');
      } catch (err) {
        strapi.log.error(
          `❌ [sendCampaign] Nem sikerült beolvasni a sablont: ${templatePath}`
        );
        throw err;
      }

      // 4. Email küldés sablon alapján minden feliratkozónak
      for (const user of subscribers) {
        const unsubscribeUrl = `http://localhost:5173/newsletter/unsubscribe/${user.unsubscribeToken}`;

        const html = template
          .replace('{{subject}}', campaign.subject)
          .replace('{{name}}', user.name || 'Kedves Olvasó')
          .replace('{{{content}}}', campaign.content)
          .replace('{{unsubscribeUrl}}', unsubscribeUrl);

        await strapi
          .plugin('email')
          .service('email')
          .send({
            to: user.email,
            subject: campaign.subject,
            text: campaign.previewText || '',
            html,
          });
      }

      // 5. Kampány státusz frissítése
      await strapi.entityService.update(
        'api::newsletter-campaign.newsletter-campaign',
        id,
        {
          data: { isSent: true, sentAt: new Date() },
        }
      );

      return subscribers.length;
    },
  })
);
