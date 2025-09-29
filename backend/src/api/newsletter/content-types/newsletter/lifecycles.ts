import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

export default {
  async beforeCreate(event) {
    applyDefaults(event);
  },

  async beforeUpdate(event) {
    applyDefaults(event);
  },

  async afterCreate(event) {
  const { result } = event;

  // Ne fuss újra, ha már confirmed
  if (!result.email || result.confirmed) return;

  strapi.log.info('📬 afterCreate elindult');

  const unsubscribeToken = uuidv4();

  // Frissítés csak egyszer történjen meg
  await strapi.entityService.update('api::newsletter.newsletter', result.id, {
    data: {
      unsubscribeToken,
      confirmed: true,
    },
  });

  // Email küldése
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
// max-width: 600px; margin: 40px auto; background: rgba(255, 255, 255, 0.85); border-radius: 18px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); backdrop-filter: blur(8px); overflow: hidden;
//background: #f9fafb;
const htmlContent = `
  <div style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background: rgba(255,255,255,0.9);">
    <div style="">

      <!-- Header -->
      <div style="padding: 24px 32px 16px 32px; background: rgba(255,255,255,0.9);">
        <h2 style="margin: 0; font-size: 24px; font-weight: bold; color: #111827;">
          [davelopment]<sup style="font-size: small; font-weight: bold;">®</sup>
        </h2>
      </div>

      <!-- Divider -->
      <div style="height: 2px; width: 90%; margin: 0 auto; background: #e5e7eb;"></div>

      <!-- Main content -->
      <div style="padding: 32px;">
        <h1 style="font-size: 22px; font-weight: 600; margin-top: 0; color: #111827;">🎉 Sikeres feliratkozás!</h1>

        <p style="font-size: 16px; color: #374151; margin-top: 12px;">
          Kedves <strong>${result.name || 'Felhasználó'}</strong>, köszönjük, hogy csatlakoztál a <strong>[davelopment]®</strong> hírleveléhez!
        </p>

        <div style="margin-top: 24px; background: linear-gradient(145deg, rgba(255,255,255,0.8), rgba(243,244,246,0.8)); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: 20px; border-radius: 12px;">
          <p style="margin: 0; color: #4b5563;">Ez azt jelenti, hogy elsőként értesülsz majd:</p>
          <ul style="list-style-type: none; padding-left: 20px; margin-top: 12px; color: #374151;">
            <li style="margin-bottom: 8px;">— friss hírekről és sztorikról a fejlesztéseink mögül</li>
            <li style="margin-bottom: 8px;">— exkluzív ajánlatokról, limitált akciókról</li>
            <li style="margin-bottom: 8px;">— olyan tartalomról, amit tényleg érdemes elolvasni</li>
          </ul>
        </div>

        <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
          Ígérjük, nem fogjuk teleszemetelni a postafiókod. Csak hasznos és értékes dolgokat kapsz tőlünk, időnként.
        </p>
      </div>

      <!-- Divider -->
      <div style="height: 2px; width: 90%; margin: 0 auto; background: #e5e7eb;"></div>

      <!-- Footer -->
      <div style="padding: 20px 32px; text-align: center; font-size: 12px; color: #9ca3af;">
        Ez az email automatikusan generálódott a <strong>[davelopment]®</strong> hírlevél feliratkozása során.
        <p style="font-size: 10px; color: #6b7280; margin-top: 10px;">
          Ha meggondolod magad, <a href="http://localhost:5173/newsletter/unsubscribe/${unsubscribeToken}" style="color: #dc2626; text-decoration: none;">itt leiratkozhatsz</a>.
        </p>
      </div>

    </div>
  </div>
`;




  try {
    await transporter.sendMail({
      from: `"davelopment®" <${process.env.EMAIL_USER}>`,
      to: result.email,
      subject: 'Köszönjük a feliratkozást!',
      html: htmlContent,
    });

    strapi.log.info(`✅ Köszönő email elküldve: ${result.email}`);
  } catch (error) {
    strapi.log.error(`❌ Email küldési hiba: ${error.message}`);
  }
}

};

// 🔁 Alapértékek beállítása új vagy frissített rekordnál
function applyDefaults(event) {
  const data = event.params?.data;

  if (!data) {
    console.warn("⚠️ Nincs adat az event.params.data-ban");
    return;
  }

  if (data.gdprAccepted === undefined) {
    data.gdprAccepted = true;
  }

  if (!data.unsubscribeToken || data.unsubscribeToken === 'placeholder') {
    data.unsubscribeToken = uuidv4();
  }

  if (!data.subscribedAt) {
    data.subscribedAt = new Date();
  }

  if (data.email) {
    data.email = data.email.toLowerCase().trim();
  }

  if (data.name) {
    data.name = data.name.trim();
  }

  if (data.unsubscribed === undefined) {
    data.unsubscribed = false;
  }

  if (data.confirmed === undefined) {
    data.confirmed = false;
  }
}

