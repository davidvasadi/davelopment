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
const today = () => new Date().toISOString().split('T')[0];

export default {
    register({ strapi }: { strapi: Core.Strapi }) {
        // Load persisted token on startup
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

        // ─── Per-page data (táblázathoz) ──────────────────────────────────
        router.post('/api/marketing-metrics/gsc-data', async (ctx: any) => {
            const token = await getValidToken();
            if (!token) { ctx.status = 401; ctx.body = { error: 'Not authenticated' }; return; }
            const body = ctx.request.body as any || {};
            const end = body.endDate || daysAgo(3); // GSC ~3 napos késéssel frissül
            const start = body.startDate || daysAgo(31);
            const data = await gscFetch(
                `/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
                { startDate: start, endDate: end, dimensions: ['page'], rowLimit: 500, dataState: 'final' }
            );
            if (!data) { ctx.status = 500; ctx.body = { error: 'GSC fetch failed' }; return; }
            const byPage: Record<string, any> = {};
            for (const row of data.rows || []) {
                const url = row.keys[0] as string;
                const slug = url.replace('https://davelopment.hu', '').replace('http://davelopment.hu', '') || '/'; byPage[slug] = {
                    url, clicks: row.clicks, impressions: row.impressions,
                    ctr: Math.round(row.ctr * 1000) / 10,
                    position: Math.round(row.position * 10) / 10,
                };
            }
            ctx.body = { ok: true, data: byPage, range: { start, end } };
        });

        // ─── Klikk trend (napi bontás, 28 nap) ───────────────────────────
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

        // ─── Top oldalak (klikk szerint) ──────────────────────────────────
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

        // ─── Top queries for a page ───────────────────────────────────────
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
    },

    bootstrap({ strapi }: { strapi: Core.Strapi }) { },
};