import { NextResponse } from 'next/server'
import { loadToken, isValid, getValidToken } from '@/lib/gsc'

export async function GET() {
  const store = loadToken()
  const token = await getValidToken()
  return NextResponse.json({ connected: !!token, valid: isValid(store) })
}
