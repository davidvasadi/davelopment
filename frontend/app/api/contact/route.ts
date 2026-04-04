// app/api/contact/route.ts
import { NextResponse } from 'next/server';

const PAYLOAD_URL = (
  process.env.NEXT_PUBLIC_PAYLOAD_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:1337'
).replace(/\/+$/, '');

export async function POST(req: Request) {
  try {
    const { name, email, message, page, language } = await req.json();

    const res = await fetch(`${PAYLOAD_URL}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message, page, language }),
      cache: 'no-store',
    });

    const contentType = res.headers.get('content-type') || '';
    const result = contentType.includes('application/json') ? await res.json() : await res.text();

    if (!res.ok) {
      console.error('Payload contact error:', { status: res.status, result });
      return NextResponse.json(
        { error: 'API_ERROR', status: res.status, details: result },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'UNKNOWN_ERROR', details: String(error) },
      { status: 500 },
    );
  }
}
