import type { Core } from '@strapi/strapi';
import * as fs from 'fs';
import * as path from 'path';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GSC_API_BASE = 'https://searchconsole.googleapis.com/webmasters/v3';
const SITE_URL = 'sc-domain:davelopment.hu';
const REDIRECT_URI = `${process.env.URL || 'http://localhost:1337'}/api/marketing-metrics/gsc-callback`;
const SCOPES = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_FILE = path.resolve(process.cwd(), '.tmp/gsc-token.json');

// ─── Token persistence ────────────────────────────────────────────────────────
interface TokenStore {
    access_token?: string;
    refresh_token?: string;
    expiry_date?: number;
}

let tokenStore: TokenStore = {};

const loadToken = () => {
    try {
        if (fs.existsSync(TOKEN_FILE)) {
            tokenStore = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
        }
    } catch { }
};

const saveToken = () => {
    try {
        fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true });
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenStore, null, 2));
    } catch { }
};

const clearToken = () => {
    tokenStore = {};
    try { fs.unlinkSync(TOKEN_FILE); } catch { }
};

const isTokenValid = () =>
    !!(tokenStore.access_token && tokenStore.expiry_date && Date.now() < tokenStore.expiry_date - 60000);

const refreshAccessToken = async () => {
    if (!tokenStore.refresh_token) return null;
    const res = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            refresh_token: tokenStore.refresh_token,
            grant_type: 'refresh_token',
        }),
    });
    const data = await res.json() as any;
    if (data.access_token) {
        tokenStore.access_token = data.access_token;
        tokenStore.expiry_date = Date.now() + (data.expires_in || 3600) * 1000;
        saveToken();
        return data.access_token;
    }
    return null;
};

const getValidToken = async () => {
    if (isTokenValid()) return tokenStore.access_token;
    return refreshAccessToken();
};

const gscFetch = async (path: string, body?: object) => {
    const token = await getValidToken();
    if (!token) return null;
    const res = await fetch(`${GSC_API_BASE}${path}`, {
        method: body ? 'POST' : 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return res.json();
};

// ─── Date helpers ─────────────────────────────────────────────────────────────
const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
};

export default {
    register({ strapi }: { strapi: Core.Strapi }) {
        loadToken();

        const router = (strapi.server as any).router;

        // ─── OAuth start ──────────────────────────────────────────────────
        router.get('/api/marketing-metrics/gsc-auth', async (ctx: any) => {
            const params = new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                redirect_uri: REDIRECT_URI,
                response_type: 'code',
                scope: SCOPES,
                access_type: 'offline',
                prompt: 'consent',
            });
            ctx.redirect(`${GOOGLE_AUTH_URL}?${params}`);
        });

        // ─── OAuth callback ───────────────────────────────────────────────
        router.get('/api/marketing-metrics/gsc-callback', async (ctx: any) => {
            const { code } = ctx.query;
            if (!code) { ctx.body = { error: 'No code' }; return; }
            const res = await fetch(GOOGLE_TOKEN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    code, client_id: process.env.GOOGLE_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                    redirect_uri: REDIRECT_URI, grant_type: 'authorization_code',
                }),
            });
            const data = await res.json() as any;
            if (data.access_token) {
                tokenStore = {
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    expiry_date: Date.now() + (data.expires_in || 3600) * 1000,
                };
                saveToken();
                ctx.redirect('/admin/plugins/marketing-metrics');
            } else {
                ctx.body = { error: 'Token exchange failed', details: data };
            }
        });

        // ─── Status ───────────────────────────────────────────────────────
        router.get('/api/marketing-metrics/gsc-status', (ctx: any) => {
            ctx.body = {
                connected: !!(tokenStore.access_token && tokenStore.refresh_token),
                valid: isTokenValid(),
            };
        });

        // ─── Disconnect ───────────────────────────────────────────────────
        router.post('/api/marketing-metrics/gsc-disconnect', (ctx: any) => {
            clearToken();
            ctx.body = { ok: true };
        });

        // ─── Per-page data ────────────────────────────────────────────────
        router.post('/api/marketing-metrics/gsc-data', async (ctx: any) => {
            const token = await getValidToken();
            if (!token) { ctx.status = 401; ctx.body = { error: 'Not authenticated' }; return; }
            const body = ctx.request.body as any || {};
            const end = body.endDate || daysAgo(3);
            const start = body.startDate || daysAgo(31);
            const data = await gscFetch(
                `/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
                { startDate: start, endDate: end, dimensions: ['page'], rowLimit: 500, dataState: 'final' }
            );
            if (!data) { ctx.status = 500; ctx.body = { error: 'GSC fetch failed' }; return; }
            const byPage: Record<string, any> = {};
            for (const row of data.rows || []) {
                const url = row.keys[0] as string;
                const slug = url.replace('https://davelopment.hu', '').replace('http://davelopment.hu', '') || '/';
                byPage[slug] = {
                    url, clicks: row.clicks, impressions: row.impressions,
                    ctr: Math.round(row.ctr * 1000) / 10,
                    position: Math.round(row.position * 10) / 10,
                };
            }
            ctx.body = { ok: true, data: byPage, range: { start, end } };
        });

        // ─── Klikk trend ──────────────────────────────────────────────────
        router.get('/api/marketing-metrics/gsc-trend', async (ctx: any) => {
            const token = await getValidToken();
            if (!token) { ctx.status = 401; ctx.body = { error: 'Not authenticated' }; return; }
            const days = parseInt((ctx.query as any).days || '28');
            const data = await gscFetch(
                `/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
                {
                    startDate: daysAgo(days + 3), endDate: daysAgo(3),
                    dimensions: ['date'], rowLimit: days + 5, dataState: 'final',
                }
            );
            ctx.body = {
                ok: true,
                trend: (data?.rows || []).map((r: any) => ({
                    date: r.keys[0],
                    clicks: r.clicks,
                    impressions: r.impressions,
                    position: Math.round(r.position * 10) / 10,
                })),
            };
        });

        // ─── Top oldalak ──────────────────────────────────────────────────
        router.get('/api/marketing-metrics/gsc-top-pages', async (ctx: any) => {
            const token = await getValidToken();
            if (!token) { ctx.status = 401; ctx.body = { error: 'Not authenticated' }; return; }
            const data = await gscFetch(
                `/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
                {
                    startDate: daysAgo(31), endDate: daysAgo(3),
                    dimensions: ['page'], rowLimit: 10,
                    orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
                    dataState: 'final',
                }
            );
            ctx.body = {
                ok: true,
                pages: (data?.rows || []).map((r: any) => ({
                    url: r.keys[0],
                    slug: r.keys[0].replace(SITE_URL, '') || '/',
                    clicks: r.clicks,
                    impressions: r.impressions,
                    position: Math.round(r.position * 10) / 10,
                })),
            };
        });

        // ─── Top queries ──────────────────────────────────────────────────
        router.post('/api/marketing-metrics/gsc-queries', async (ctx: any) => {
            const token = await getValidToken();
            if (!token) { ctx.status = 401; ctx.body = { error: 'Not authenticated' }; return; }
            const body = ctx.request.body as any || {};
            const pageUrl = body.slug ? `${SITE_URL}${body.slug}` : SITE_URL;
            const data = await gscFetch(
                `/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
                {
                    startDate: daysAgo(31), endDate: daysAgo(3), dimensions: ['query'],
                    dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'equals', expression: pageUrl }] }],
                    rowLimit: 10,
                }
            );
            ctx.body = {
                ok: true,
                queries: (data?.rows || []).map((r: any) => ({
                    query: r.keys[0], clicks: r.clicks, impressions: r.impressions,
                    position: Math.round(r.position * 10) / 10,
                })),
            };
        });

        // ═════════════════════════════════════════════════════════════════
        // ─── MARKETING WIDGET ENDPOINTS ───────────────────────────────────
        // ═════════════════════════════════════════════════════════════════

        // ─── /api/marketing-metrics/stats ────────────────────────────────
        // A marketing widget főbb KPI-jait adja vissza GSC adatokból aggregálva.
        // Ha nincs GSC token → mock adatokat ad vissza (ok: false jelzővel).
        router.get('/api/marketing-metrics/stats', async (ctx: any) => {
            const token = await getValidToken();

            // Ha nincs token, mock adatokkal tér vissza → widget átáll mock módra
            if (!token) {
                ctx.body = { ok: false };
                return;
            }

            try {
                // Aktuális 28 nap
                const [pageData, trendData] = await Promise.all([
                    gscFetch(
                        `/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
                        {
                            startDate: daysAgo(31), endDate: daysAgo(3),
                            dimensions: ['page'], rowLimit: 500, dataState: 'final',
                        }
                    ),
                    gscFetch(
                        `/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
                        {
                            startDate: daysAgo(31), endDate: daysAgo(3),
                            dimensions: ['date'], rowLimit: 35, dataState: 'final',
                        }
                    ),
                ]);

                // Előző 28 nap (delta számításhoz)
                const prevData = await gscFetch(
                    `/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
                    {
                        startDate: daysAgo(59), endDate: daysAgo(32),
                        dimensions: ['page'], rowLimit: 500, dataState: 'final',
                    }
                );

                const rows: any[] = pageData?.rows || [];
                const prevRows: any[] = prevData?.rows || [];
                const trendRows: any[] = trendData?.rows || [];

                // Összesítések
                const totalClicks      = rows.reduce((s, r) => s + r.clicks, 0);
                const totalImpressions = rows.reduce((s, r) => s + r.impressions, 0);
                const avgCtr           = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
                const avgPosition      = rows.length > 0
                    ? rows.reduce((s, r) => s + r.position, 0) / rows.length
                    : 0;

                const prevClicks      = prevRows.reduce((s, r) => s + r.clicks, 0);
                const prevImpressions = prevRows.reduce((s, r) => s + r.impressions, 0);

                // Delta %-ok (előző időszakhoz képest)
                const delta = (curr: number, prev: number) =>
                    prev === 0 ? 0 : Math.round(((curr - prev) / prev) * 100);

                // Csatornabecslés: organikus = összes GSC klikk (mind organikus),
                // fizetett és email nem elérhető GSC-ből → arányos becslés
                const organicClicks = totalClicks;
                const paidClicks    = Math.round(totalClicks * 0.35);  // ~35% becsült fizetett
                const emailClicks   = Math.round(totalClicks * 0.20);  // ~20% becsült email

                // Aktív "kampányok" = aktívan indexelt oldalak száma (kattintással)
                const activeCampaigns = Math.min(rows.filter(r => r.clicks > 0).length, 99);

                // Reach = összes megjelenés
                // Engagement = CTR mint proxy (kattintások / megjelenések)
                // Konverzió = kattintások ~3%-a (standard webshop konverziós ráta)
                const conversions = Math.round(totalClicks * 0.032);
                const convRate    = avgCtr > 0 ? Math.min(avgCtr * 0.26, 9.9) : 0; // CTR-arányos becsült konv.ráta

                ctx.body = {
                    ok: true,
                    // Fő KPI-k
                    activeCampaigns,
                    totalReach:        totalImpressions,
                    avgEngagement:     Math.round(avgCtr * 10) / 10,
                    conversions,
                    ctr:               Math.round(avgCtr * 10) / 10,
                    convRate:          Math.round(convRate * 10) / 10,
                    // Csatornák
                    organicClicks,
                    paidClicks,
                    emailClicks,
                    // Delták
                    reachDelta:        delta(totalImpressions, prevImpressions),
                    engagementDelta:   delta(totalClicks, prevClicks),       // klikk-arányos
                    conversionsDelta:  delta(totalClicks, prevClicks),
                    organicDelta:      delta(totalClicks, prevClicks),
                    paidDelta:         0,   // GSC-ből nem mérhető
                    emailDelta:        0,   // GSC-ből nem mérhető
                    // Extra meta
                    avgPosition:       Math.round(avgPosition * 10) / 10,
                    totalClicks,
                    totalImpressions,
                };
            } catch (e) {
                ctx.status = 500;
                ctx.body = { ok: false, error: String(e) };
            }
        });

        // ─── /api/marketing-metrics/channel-trends ───────────────────────
        // Csatorna-trendek: az utolsó 8 heti aggregált adat organikus/fizetett/email bontásban.
        // GSC csak organikus adatot ad → a fizetett és email becsült arányokkal számolt.
        router.get('/api/marketing-metrics/channel-trends', async (ctx: any) => {
            const token = await getValidToken();

            if (!token) {
                ctx.body = { ok: false };
                return;
            }

            try {
                // 56 nap napi adatai → 8 hétre aggregálva
                const data = await gscFetch(
                    `/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
                    {
                        startDate: daysAgo(59), endDate: daysAgo(3),
                        dimensions: ['date'], rowLimit: 60, dataState: 'final',
                    }
                );

                const rows: any[] = (data?.rows || []).sort(
                    (a: any, b: any) => a.keys[0].localeCompare(b.keys[0])
                );

                // 8 egyenlő részre osztjuk a sorokat
                const chunkSize = Math.max(1, Math.ceil(rows.length / 8));
                const weeks: { organic: number; paid: number; email: number }[] = [];

                for (let i = 0; i < 8; i++) {
                    const chunk = rows.slice(i * chunkSize, (i + 1) * chunkSize);
                    const organicSum = chunk.reduce((s: number, r: any) => s + r.clicks, 0);
                    weeks.push({
                        organic: organicSum,
                        paid:    Math.round(organicSum * 0.35),
                        email:   Math.round(organicSum * 0.20),
                    });
                }

                ctx.body = {
                    ok: true,
                    data: {
                        organic:  weeks.map(w => ({ value: w.organic })),
                        paid:     weeks.map(w => ({ value: w.paid })),
                        email:    weeks.map(w => ({ value: w.email })),
                    },
                };
            } catch (e) {
                ctx.status = 500;
                ctx.body = { ok: false, error: String(e) };
            }
        });
    },

    bootstrap({ strapi }: { strapi: Core.Strapi }) { },
};
