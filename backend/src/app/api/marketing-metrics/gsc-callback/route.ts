import { NextRequest, NextResponse } from 'next/server'
import { saveToken } from '@/lib/gsc'

const REDIRECT_URI = `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/marketing-metrics/gsc-callback`

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 })

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  })
  const data: any = await res.json()
  if (data.access_token) {
    saveToken({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expiry_date: Date.now() + (data.expires_in || 3600) * 1000,
    })
    return NextResponse.redirect(new URL('/admin', req.nextUrl.origin))
  }
  return NextResponse.json({ error: 'Token exchange failed', details: data }, { status: 400 })
}
