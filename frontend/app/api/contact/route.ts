import { NextResponse } from 'next/server';

// Contact form proxy with spam protection:
//  - honeypot field (bots fill hidden inputs)
//  - in-memory per-IP rate limit (persistent PM2 process → survives across requests)
//  - basic server-side validation
// Valid submissions are forwarded to the Payload `contacts` collection.

const PAYLOAD_URL = (process.env.NEXT_PUBLIC_PAYLOAD_URL ?? 'http://localhost:1337').replace(/\/+$/, '');

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // opportunistic cleanup
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  // Honeypot — if this hidden field has any value, silently pretend success.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const message = String(body.message ?? '').trim();
  if (!name || !message || !isEmail(email)) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 422 });
  }

  try {
    const res = await fetch(`${PAYLOAD_URL}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        message,
        page: typeof body.page === 'string' ? body.page : '/',
        language: typeof body.language === 'string' ? body.language : 'hu',
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Network error' }, { status: 502 });
  }
}
