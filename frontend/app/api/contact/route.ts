// app/api/contact/route.ts
import { NextResponse } from 'next/server';

const STRAPI_URL =
  process.env.STRAPI_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  'http://localhost:1337';

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function POST(req: Request) {
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.error('Contact API: missing STRAPI_URL or STRAPI_API_TOKEN', {
      STRAPI_URL,
      hasToken: !!STRAPI_TOKEN,
    });
    return NextResponse.json(
      { error: 'SERVER_MISCONFIG', message: 'Missing STRAPI envs' },
      { status: 500 },
    );
  }

  try {
    const { name, email, message, page, language } = await req.json();

    const strapiRes = await fetch(`${STRAPI_URL}/api/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          name,
          email,
          message,
          page,
          language,
          // state-et NEM muszáj küldeni, lifecycle beállítja
        },
      }),
      cache: 'no-store',
    });

    const contentType = strapiRes.headers.get('content-type') || '';
    let payload: any = null;

    if (contentType.includes('application/json')) {
      payload = await strapiRes.json();
    } else {
      payload = await strapiRes.text();
    }

    if (!strapiRes.ok) {
      console.error('Strapi contact error:', {
        status: strapiRes.status,
        payload,
      });

      return NextResponse.json(
        {
          error: 'STRAPI_ERROR',
          status: strapiRes.status,
          details: payload,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, data: payload }, { status: 201 });
  } catch (error) {
    console.error('Contact API fatal error:', error);
    return NextResponse.json(
      { error: 'UNKNOWN_ERROR', details: String(error) },
      { status: 500 },
    );
  }
}
