import type { Core } from '@strapi/strapi';

const NOTIFY_TO = process.env.NOTIFY_EMAIL || 'hello.davelopment@gmail.com';
const FRONTEND_URL = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? (process.env.URL || 'https://davelopment.hu') : 'http://localhost:3000');

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    const router = (strapi.server as any).router;

    // ─── Stats ────────────────────────────────────────────────────────────────

    router.get('/api/communications/stats', async (ctx: any) => {
      const [newLeads, totalLeads, activeSubs, totalSubs, newSubs, huSubs, enSubs] = await Promise.all([
        strapi.entityService.count('api::contact.contact', { filters: { state: 'new' } }),
        strapi.entityService.count('api::contact.contact', {}),
        strapi.entityService.count('api::newsletter.newsletter', { filters: { unsubscribed: false, confirmed: true } }),
        strapi.entityService.count('api::newsletter.newsletter', {}),
        (() => {
          const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return strapi.entityService.count('api::newsletter.newsletter', {
            filters: { unsubscribed: false, createdAt: { $gt: since.toISOString() } }
          });
        })(),
        strapi.entityService.count('api::newsletter.newsletter', { filters: { unsubscribed: false, confirmed: true, language: 'hu' } }),
        strapi.entityService.count('api::newsletter.newsletter', { filters: { unsubscribed: false, confirmed: true, language: 'en' } }),
      ]);

      // Havi email szám a kampányokból
      const knex = (strapi.db as any).connection;
      let monthSent = 0;
      try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const hasIsTest = await knex.schema.hasColumn('comm_campaigns_log', 'is_test');
        let q = knex('comm_campaigns_log').where('sent_at', '>=', monthStart);
        if (hasIsTest) q = q.where('is_test', false);
        const result = await q.sum('sent_count as total').first();
        monthSent = Number(result?.total) || 0;
      } catch {}

      ctx.body = { ok: true, newLeads, totalLeads, activeSubs, totalSubs, newSubs, huSubs, enSubs, monthSent };
    });

    // ─── Leads (Contact) ──────────────────────────────────────────────────────

    router.get('/api/communications/leads', async (ctx: any) => {
      const { page = 1, pageSize = 20, state } = ctx.query;
      const filters: any = {};
      if (state && state !== 'all') filters.state = state;

      const [data, total] = await Promise.all([
        strapi.entityService.findMany('api::contact.contact', {
          filters,
          sort: { createdAt: 'desc' },
          start: (Number(page) - 1) * Number(pageSize),
          limit: Number(pageSize),
        }),
        strapi.entityService.count('api::contact.contact', { filters }),
      ]);

      ctx.body = { ok: true, data, total, page: Number(page), pageSize: Number(pageSize) };
    });

    router.patch('/api/communications/leads/:id', async (ctx: any) => {
      const { id } = ctx.params;
      const { state } = ctx.request.body as any;

      if (!state) {
        ctx.status = 400;
        ctx.body = { ok: false, error: 'state is required' };
        return;
      }

      const updated = await (strapi.entityService as any).update('api::contact.contact', id, {
        data: { state },
      });
      ctx.body = { ok: true, data: updated };
    });

    router.delete('/api/communications/leads/:id', async (ctx: any) => {
      const { id } = ctx.params;
      await strapi.entityService.delete('api::contact.contact', id);
      ctx.body = { ok: true };
    });

    router.delete('/api/communications/leads/all', async (ctx: any) => {
      const all = await strapi.entityService.findMany('api::contact.contact', { limit: 10000 }) as any[];
      await Promise.all(all.map((l: any) => strapi.entityService.delete('api::contact.contact', l.id)));
      ctx.body = { ok: true, deleted: all.length };
    });

    // ─── Newsletter subscribers ───────────────────────────────────────────────

    router.get('/api/communications/subscribers', async (ctx: any) => {
      const { language } = ctx.query;
      const filters: any = {};
      if (language && language !== 'all') filters.language = language;

      const [data, total] = await Promise.all([
        strapi.entityService.findMany('api::newsletter.newsletter', {
          filters,
          sort: { createdAt: 'desc' },
          limit: 1000,
        }),
        strapi.entityService.count('api::newsletter.newsletter', { filters }),
      ]);

      ctx.body = { ok: true, data, total };
    });

    router.patch('/api/communications/subscribers/:id', async (ctx: any) => {
      const { id } = ctx.params;
      const { name, language, confirmed } = ctx.request.body as any;

      const results = await strapi.entityService.findMany('api::newsletter.newsletter', {
        filters: isNaN(Number(id)) ? { documentId: id } : { id: Number(id) },
        limit: 1,
      }) as any[];

      if (!results?.length) { ctx.status = 404; ctx.body = { ok: false, error: 'Nem található' }; return; }

      const updated = await (strapi.entityService as any).update('api::newsletter.newsletter', results[0].id, {
        data: {
          ...(name !== undefined && { name }),
          ...(language !== undefined && { language }),
          ...(confirmed !== undefined && { confirmed }),
        },
      });
      ctx.body = { ok: true, data: updated };
    });

    router.delete('/api/communications/subscribers/all', async (ctx: any) => {
      const all = await strapi.entityService.findMany('api::newsletter.newsletter', { limit: 10000 }) as any[];
      await Promise.all(all.map((s: any) => strapi.entityService.delete('api::newsletter.newsletter', s.id)));
      ctx.body = { ok: true, deleted: all.length };
    });

    // ─── Unsubscribe ──────────────────────────────────────────────────────────

    router.post('/api/communications/unsubscribe', async (ctx: any) => {
      const { id } = ctx.request.body as any;
      if (!id) { ctx.status = 400; ctx.body = { ok: false, error: 'id szükséges' }; return; }

      const results = await strapi.entityService.findMany('api::newsletter.newsletter', {
        filters: isNaN(Number(id)) ? { documentId: id } : { id: Number(id) },
        limit: 1,
      }) as any[];

      if (!results?.length) { ctx.status = 404; ctx.body = { ok: false, error: 'Nem található' }; return; }

      const record = results[0];
      if (record.unsubscribed) { ctx.body = { ok: true, alreadyUnsubscribed: true }; return; }

      await (strapi.entityService as any).update('api::newsletter.newsletter', record.id, {
        data: { unsubscribed: true },
      });

      ctx.body = { ok: true, alreadyUnsubscribed: false };
    });

    // ─── Send campaign ────────────────────────────────────────────────────────

    router.post('/api/communications/send-campaign', async (ctx: any) => {
      const { subject, htmlContent, html, language, testEmail } = ctx.request.body as any;
      const finalHtml = htmlContent || html;

      if (!subject || !finalHtml) {
        ctx.status = 400;
        ctx.body = { ok: false, error: 'subject és html szükséges' };
        return;
      }

      const resendApiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@davelopment.hu';

      if (!resendApiKey) {
        ctx.status = 500;
        ctx.body = { ok: false, error: 'RESEND_API_KEY nincs beállítva' };
        return;
      }

      // ── Teszt mód ────────────────────────────────────────────────────────────
      if (testEmail) {
        const testHtml = finalHtml.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, `${FRONTEND_URL}/hu/unsubscribe?id=test`);
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: `Davelopment <${fromEmail}>`,
            to: [testEmail],
            subject: `[TEST] ${subject}`,
            html: testHtml,
          }),
        });
        const result = await res.json() as any;
        if (res.ok) {
          try {
            const knex2 = (strapi.db as any).connection;
            const hasTCol = await knex2.schema.hasColumn('comm_campaigns_log', 'is_test');
            const testRow: any = { subject: `[TEST] ${subject}`, language: 'test', sent_count: 1, body_preview: '', sent_at: new Date() };
            if (hasTCol) testRow.is_test = true;
            await knex2('comm_campaigns_log').insert(testRow);
          } catch {}
        }
        ctx.body = { ok: res.ok, result, sent: 1, mode: 'test' };
        return;
      }

      // ── Éles küldés ──────────────────────────────────────────────────────────
      const filters: any = { unsubscribed: false, confirmed: true };
      if (language && language !== 'all') filters.language = language;

      const subscribers = await strapi.entityService.findMany('api::newsletter.newsletter', {
        filters, limit: 1000,
      }) as any[];

      if (subscribers.length === 0) {
        ctx.body = { ok: false, error: 'Nincs aktív feliratkozó', sent: 0 };
        return;
      }

      let sent = 0;
      let failed = 0;
      const batchSize = 50;

      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);
        try {
          const res = await fetch('https://api.resend.com/emails/batch', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(
              batch.map((sub: any) => {
                const locale = sub.language === 'en' ? 'en' : 'hu';
                const documentId = sub.documentId || sub.id;
                const unsubUrl = `${FRONTEND_URL}/${locale}/unsubscribe?id=${documentId}`;
                const personalHtml = finalHtml.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubUrl);
                return {
                  from: `Davelopment <${fromEmail}>`,
                  to: [sub.email],
                  subject,
                  html: personalHtml,
                };
              })
            ),
          });
          if (res.ok) sent += batch.length;
          else failed += batch.length;
        } catch {
          failed += batch.length;
        }
      }

      ctx.body = { ok: true, sent, failed, total: subscribers.length };
    });

    // ─── Kampány előzmények (SQLite) ──────────────────────────────────────────

    router.get('/api/communications/campaigns', async (ctx: any) => {
      try {
        const knex = (strapi.db as any).connection;
        const rows = await knex('comm_campaigns_log')
          .orderBy('sent_at', 'desc')
          .limit(100);
        ctx.body = {
          ok: true,
          data: rows.map((r: any) => ({
            id: r.id,
            subject: r.subject,
            language: r.language,
            sentCount: r.sent_count,
            bodyPreview: r.body_preview,
            fullHtml: r.full_html || '',
            sentAt: r.sent_at,
            isTest: !!r.is_test,
          })),
        };
      } catch (err: any) {
        ctx.status = 500;
        ctx.body = { ok: false, error: err.message };
      }
    });

    // Újraküldés – csak azoknak akik a kampány eredeti küldése UTÁN iratkoztak fel
    router.post('/api/communications/resend-campaign', async (ctx: any) => {
      const { campaignId, testEmail } = ctx.request.body as any;
      if (!campaignId) { ctx.status = 400; ctx.body = { ok: false, error: 'campaignId szükséges' }; return; }

      const knex = (strapi.db as any).connection;
      const campaign = await knex('comm_campaigns_log').where('id', campaignId).first();
      if (!campaign) { ctx.status = 404; ctx.body = { ok: false, error: 'Kampány nem található' }; return; }
      if (!campaign.full_html) { ctx.status = 400; ctx.body = { ok: false, error: 'A kampány HTML tartalma nem elérhető (régi kampány)' }; return; }

      const resendApiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@davelopment.hu';
      if (!resendApiKey) { ctx.status = 500; ctx.body = { ok: false, error: 'RESEND_API_KEY nincs beállítva' }; return; }

      // Teszt mód
      if (testEmail) {
        const testHtml = campaign.full_html.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, `${FRONTEND_URL}/hu/unsubscribe?id=test`);
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: `Davelopment <${fromEmail}>`, to: [testEmail], subject: `[TEST] ${campaign.subject}`, html: testHtml }),
        });
        const result = await res.json() as any;
        ctx.body = { ok: res.ok, result, sent: 1, mode: 'test' };
        return;
      }

      // Csak azok akik a kampány eredeti küldése UTÁN iratkoztak fel
      const sentAt = new Date(campaign.sent_at);
      const filters: any = {
        unsubscribed: false,
        confirmed: true,
        createdAt: { $gt: sentAt.toISOString() },
      };
      if (campaign.language && campaign.language !== 'all' && campaign.language !== 'test') {
        filters.language = campaign.language;
      }

      const newSubscribers = await strapi.entityService.findMany('api::newsletter.newsletter', {
        filters, limit: 1000,
      }) as any[];

      if (newSubscribers.length === 0) {
        ctx.body = { ok: true, sent: 0, message: 'Nincs új feliratkozó a kampány küldése óta' };
        return;
      }

      let sent = 0; let failed = 0;
      for (let i = 0; i < newSubscribers.length; i += 50) {
        const batch = newSubscribers.slice(i, i + 50);
        try {
          const res = await fetch('https://api.resend.com/emails/batch', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(batch.map((sub: any) => {
              const locale = sub.language === 'en' ? 'en' : 'hu';
              const unsubUrl = `${FRONTEND_URL}/${locale}/unsubscribe?id=${sub.documentId || sub.id}`;
              return {
                from: `Davelopment <${fromEmail}>`,
                to: [sub.email],
                subject: campaign.subject,
                html: campaign.full_html.replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubUrl),
              };
            })),
          });
          if (res.ok) sent += batch.length; else failed += batch.length;
        } catch { failed += batch.length; }
      }

      ctx.body = { ok: true, sent, failed, total: newSubscribers.length };
    });

    router.post('/api/communications/campaigns', async (ctx: any) => {
      try {
        const { subject, language, sentCount, bodyPreview, sentAt, fullHtml } = ctx.request.body as any;
        const knex = (strapi.db as any).connection;
        const hasTestCol = await knex.schema.hasColumn('comm_campaigns_log', 'is_test');
        const hasHtmlCol = await knex.schema.hasColumn('comm_campaigns_log', 'full_html');
        const row: any = {
          subject: subject || '',
          language: language || 'all',
          sent_count: sentCount || 0,
          body_preview: bodyPreview ? String(bodyPreview).slice(0, 500) : '',
          sent_at: sentAt ? new Date(sentAt) : new Date(),
        };
        if (hasTestCol) row.is_test = false;
        if (hasHtmlCol && fullHtml) row.full_html = fullHtml;
        await knex('comm_campaigns_log').insert(row);
        ctx.body = { ok: true };
      } catch (err: any) {
        ctx.status = 500;
        ctx.body = { ok: false, error: err.message };
      }
    });

    // ─── Notify on new lead ───────────────────────────────────────────────────

    router.post('/api/communications/notify-lead', async (ctx: any) => {
      const { name, email, message, page } = ctx.request.body as any;
      const resendApiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@davelopment.hu';

      if (!resendApiKey) {
        ctx.status = 500;
        ctx.body = { ok: false, error: 'RESEND_API_KEY nincs beállítva' };
        return;
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `Davelopment <${fromEmail}>`,
          to: [NOTIFY_TO],
          reply_to: email,
          subject: `📬 Új érdeklődő: ${name}`,
          html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:32px 16px;background:#f5f5f5;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:460px;">

        <tr><td style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">

            <tr><td style="padding:18px 24px 16px;border-bottom:1px solid #f3f4f6;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:13px;font-weight:700;color:#111;font-family:'Courier New',Courier,monospace;">[davelopment]®</td>
                  <td align="right">
                    <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:rgba(240,199,66,0.1);border:1px solid rgba(240,199,66,0.3);color:#b45309;font-family:'Courier New',Courier,monospace;">új érdeklődő</span>
                  </td>
                </tr>
              </table>
            </td></tr>

            <tr><td style="padding:24px 24px 8px;">
              <p style="font-size:13px;color:#6b7280;margin:0 0 16px;">Új üzenet érkezett a weboldalon keresztül.</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #f3f4f6;border-radius:10px;overflow:hidden;">
                <tr style="background:#fafafa;"><td style="padding:10px 14px;color:#9ca3af;font-size:12px;width:70px;border-bottom:1px solid #f3f4f6;font-family:'Courier New',Courier,monospace;">név</td><td style="padding:10px 14px;font-size:13px;font-weight:600;color:#111;border-bottom:1px solid #f3f4f6;">${name}</td></tr>
                <tr style="background:#fafafa;"><td style="padding:10px 14px;color:#9ca3af;font-size:12px;border-bottom:1px solid #f3f4f6;font-family:'Courier New',Courier,monospace;">email</td><td style="padding:10px 14px;font-size:13px;border-bottom:1px solid #f3f4f6;"><a href="mailto:${email}" style="color:#6d5df4;text-decoration:none;">${email}</a></td></tr>
                ${page ? `<tr style="background:#fafafa;"><td style="padding:10px 14px;color:#9ca3af;font-size:12px;border-bottom:1px solid #f3f4f6;font-family:'Courier New',Courier,monospace;">oldal</td><td style="padding:10px 14px;font-size:12px;color:#6b7280;border-bottom:1px solid #f3f4f6;">${page}</td></tr>` : ''}
                <tr style="background:#fafafa;"><td style="padding:10px 14px;color:#9ca3af;font-size:12px;vertical-align:top;font-family:'Courier New',Courier,monospace;">üzenet</td><td style="padding:10px 14px;font-size:13px;color:#374151;line-height:1.6;">${message || '–'}</td></tr>
              </table>
            </td></tr>

            <tr><td style="padding:20px 24px 24px;">
              <a href="https://davelopment.hu/admin/plugins/communications" style="display:inline-block;padding:10px 20px;background:#111;color:#fff;border-radius:9px;text-decoration:none;font-size:13px;font-weight:600;">Megnyitás az adminban →</a>
              <p style="font-size:11px;color:#9ca3af;margin:14px 0 0;font-family:'Courier New',Courier,monospace;">Válaszolva egyenesen <strong style="color:#6b7280;">${email}</strong>-nek írsz.</p>
            </td></tr>

          </table>
        </td></tr>

        <tr><td style="padding:14px 4px 0;text-align:center;">
          <p style="font-size:11px;color:#9ca3af;margin:0;font-family:'Courier New',Courier,monospace;">davelopment.hu · hello@davelopment.hu</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
        }),
      });

      const result = await res.json() as any;
      ctx.body = { ok: res.ok, result };
    });

    // ─── Test email ───────────────────────────────────────────────────────────

    router.post('/api/communications/test-email', async (ctx: any) => {
      const { to } = ctx.request.body as any;
      const resendApiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@davelopment.hu';

      if (!resendApiKey) {
        ctx.status = 500;
        ctx.body = { ok: false, error: 'RESEND_API_KEY nincs beállítva' };
        return;
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `Davelopment <${fromEmail}>`,
          to: [to || NOTIFY_TO],
          subject: '✅ Test email – Communications plugin',
          html: `<div style="font-family:sans-serif;padding:24px;max-width:400px;"><h2 style="color:#1a7f37;">✅ Email küldés működik!</h2><p style="color:#444;">Ez egy teszt email a Communications pluginból.</p><p style="color:#999;font-size:12px;">Küldve: ${new Date().toLocaleString('hu-HU')}</p></div>`,
        }),
      });

      const result = await res.json() as any;
      ctx.body = { ok: res.ok, result };
    });
  },

  // ─── Bootstrap – SQLite tábla init ───────────────────────────────────────

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const knex = (strapi.db as any).connection;
    const exists = await knex.schema.hasTable('comm_campaigns_log');
    if (!exists) {
      await knex.schema.createTable('comm_campaigns_log', (table: any) => {
        table.increments('id').primary();
        table.string('subject', 500).notNullable();
        table.string('language', 10).defaultTo('all');
        table.integer('sent_count').defaultTo(0);
        table.text('body_preview');
        table.boolean('is_test').defaultTo(false);
        table.text('full_html');
        table.timestamp('sent_at').defaultTo(knex.fn.now());
      });
      console.log('[Communications] comm_campaigns_log tábla létrehozva');
    } else {
      // Meglévő tábla: hiányzó oszlopok hozzáadása
      const hasIsTest = await knex.schema.hasColumn('comm_campaigns_log', 'is_test');
      if (!hasIsTest) {
        await knex.schema.alterTable('comm_campaigns_log', (table: any) => { table.boolean('is_test').defaultTo(false); });
        console.log('[Communications] comm_campaigns_log: is_test oszlop hozzáadva');
      }
      const hasFullHtml = await knex.schema.hasColumn('comm_campaigns_log', 'full_html');
      if (!hasFullHtml) {
        await knex.schema.alterTable('comm_campaigns_log', (table: any) => { table.text('full_html'); });
        console.log('[Communications] comm_campaigns_log: full_html oszlop hozzáadva');
      }
    }
  },
};
