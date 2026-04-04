import * as fs from 'fs'
import * as path from 'path'

export const GSC_SITE = process.env.GSC_SITE_URL || 'sc-domain:davelopment.hu'
const GSC_API = 'https://searchconsole.googleapis.com/webmasters/v3'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const TOKEN_FILE = path.resolve(process.cwd(), '.tmp/gsc-token.json')

export interface TokenStore {
  access_token?: string
  refresh_token?: string
  expiry_date?: number
}

export function loadToken(): TokenStore {
  try {
    if (fs.existsSync(TOKEN_FILE)) return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'))
  } catch { }
  return {}
}

export function saveToken(store: TokenStore) {
  try {
    fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true })
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(store, null, 2))
  } catch { }
}

export function clearToken() {
  try { fs.unlinkSync(TOKEN_FILE) } catch { }
}

export function isValid(store: TokenStore): boolean {
  return !!(store.access_token && store.expiry_date && Date.now() < store.expiry_date - 60_000)
}

export async function refreshToken(store: TokenStore): Promise<string | null> {
  if (!store.refresh_token) return null
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: store.refresh_token,
      grant_type: 'refresh_token',
    }),
  })
  const data: any = await res.json()
  if (data.access_token) {
    store.access_token = data.access_token
    store.expiry_date = Date.now() + (data.expires_in || 3600) * 1000
    saveToken(store)
    return data.access_token
  }
  return null
}

export async function getValidToken(): Promise<string | null> {
  const store = loadToken()
  if (isValid(store)) return store.access_token!
  return refreshToken(store)
}

export async function gscFetch(endpoint: string, body?: object): Promise<any> {
  const token = await getValidToken()
  if (!token) return null
  const res = await fetch(`${GSC_API}${endpoint}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  return res.json()
}

export function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export function delta(curr: number, prev: number): number {
  if (prev === 0) return 0
  return Math.round(((curr - prev) / prev) * 100)
}
