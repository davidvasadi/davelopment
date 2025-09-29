const nodemailer = require('nodemailer');

module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // Ne küldjünk, ha már el lett küldve
    if (result.emailSent === true) {
      strapi.log.warn(`⚠️ Ehhez az üzenethez már lett küldve email (ID: ${result.id}), kihagyva.`);
      return;
    }

    strapi.log.info('📥 afterCreate hook triggerelt');

    // ENV változók ellenőrzése
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
      strapi.log.error('❌ Hiányzó email környezeti változók!');
      return;
    }

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // HTML sablon
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; color: #111827; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); overflow: hidden; width: calc(100% - 1px);">
      <div style="background-color: #ffffff; padding: 24px; text-align: left; margin-top: 10px;">
        <h3 style="font-weight: bold; position: relative; display: inline-block; margin: 0;">
          [davelopment]<span style="position: absolute; top: -2px; right: -10px; font-size:small; font-weight:bold;">®</span>
        </h3>
        <h1 style="display: inline-block; margin-bottom: 0;">
          Új kapcsolatfelvételi üzenet <span style="color: #7c7c7c;">érkezett a weboldalról</span>
        </h1>
      </div>

      <div style="margin: 0 auto; display: block; background-color: #f3f3f3; width: 90%; height: 2px;"></div>

      <div style="padding: 30px 32px;">
        <div style="margin-bottom: 16px;">
          <div style="font-weight: bold; color: #616161; margin-bottom: 4px;">Feladó neve:</div>
          <div style="background-color: #f9fafb; padding: 12px; border-radius: 8px;">${result.name}</div>
        </div>

        <div style="margin-bottom: 16px;">
          <div style="font-weight: bold; color: #616161; margin-bottom: 4px;">Email cím:</div>
          <div style="background-color: #f9fafb; padding: 12px; border-radius: 8px;">${result.email}</div>
        </div>

        <div>
          <div style="font-weight: bold; color: #616161; margin-bottom: 4px;">Üzenet:</div>
          <div style="border-left: 4px solid #000; background-color: #f9fafb; padding: 16px; border-radius: 8px; font-style: italic;">
            „${result.message}”
          </div>
        </div>
      </div>

      <div style="margin: 0 auto; display: block; background-color: #f3f3f3; width: 90%; height: 2px;"></div>

      <div style="padding: 20px 24px; text-align: center; font-size: 12px; color: #9ca3af;">
        Ez az email automatikusan generálódott a <span style="font-weight:bold">[davelopment]®</span> kapcsolatfelvételi űrlapján keresztül.
      </div>
    </div>
  </div>
`;


    const mailOptions = {
      from: `"davelopment®" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: 'Új kapcsolatfelvételi üzenet',
      html: htmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      strapi.log.info('✅ Email sikeresen elküldve!');

      // 📌 Állítsuk be, hogy az email már el lett küldve
      await strapi.entityService.update('api::contact-section.contact-section', result.id, {
        data: {
          emailSent: true,
        },
      });

    } catch (err) {
      strapi.log.error('❌ Email küldési hiba:', err);
    }
  },
};
