import { NextRequest, NextResponse } from 'next/server'
import { clearToken } from '@/lib/gsc'

export function POST(req: NextRequest) {
  clearToken()
  const from = req.nextUrl.searchParams.get('from')
  const dest = from === 'dashboard' ? '/dashboard/marketing' : '/admin'
  return NextResponse.redirect(new URL(dest, req.nextUrl.origin))
}
