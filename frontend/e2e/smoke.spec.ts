import { test, expect } from '@playwright/test'

const TEST_EMAIL = 'e2e-test@davelopment.hu'

// Add 'en' when English content is ready in Payload
const LOCALES = ['hu']

// ─── Oldalak betöltése ────────────────────────────────────────

for (const locale of LOCALES) {
  test(`[${locale}] főoldal betölt`, async ({ page }) => {
    await page.goto(`/${locale}`)
    await expect(page).toHaveTitle(/davelopment/i)
  })

  test(`[${locale}] blog lista betölt`, async ({ page }) => {
    await page.goto(`/${locale}/blog`)
    await expect(page).toHaveTitle(/davelopment/i)
  })

  test(`[${locale}] szolgáltatások betölt`, async ({ page }) => {
    const path = locale === 'hu' ? 'szolgaltatasok' : 'services'
    await page.goto(`/${locale}/${path}`)
    await expect(page).toHaveTitle(/davelopment/i)
  })

  test(`[${locale}] projektek betölt`, async ({ page }) => {
    const path = locale === 'hu' ? 'projektek' : 'products'
    await page.goto(`/${locale}/${path}`)
    await expect(page).toHaveTitle(/davelopment/i)
  })

  test(`[${locale}] 404 oldal működik`, async ({ page }) => {
    const response = await page.goto(`/${locale}/ez-az-oldal-nem-letezik`)
    expect(response?.status()).toBe(404)
  })
}

// ─── JSON-LD SEO ──────────────────────────────────────────────

test('[hu] főoldalon van JSON-LD', async ({ page }) => {
  await page.goto('/hu')
  const jsonLd = page.locator('script[type="application/ld+json"]')
  await expect(jsonLd.first()).toBeAttached()
})

test('[hu] blog listán van JSON-LD', async ({ page }) => {
  await page.goto('/hu/blog')
  const jsonLd = page.locator('script[type="application/ld+json"]')
  await expect(jsonLd.first()).toBeAttached()
})

test('[hu] szolgáltatásokon van JSON-LD', async ({ page }) => {
  await page.goto('/hu/szolgaltatasok')
  const jsonLd = page.locator('script[type="application/ld+json"]')
  await expect(jsonLd.first()).toBeAttached()
})

test('[hu] projekteken van JSON-LD', async ({ page }) => {
  await page.goto('/hu/projektek')
  const jsonLd = page.locator('script[type="application/ld+json"]')
  await expect(jsonLd.first()).toBeAttached()
})

// ─── Hírlevél form UI ─────────────────────────────────────────

test('hírlevél form: email mező látható és beküldhető', async ({ page }) => {
  await page.goto('/hu')
  const emailInput = page.locator('input[type="email"]').first()
  await expect(emailInput).toBeVisible()
  await emailInput.fill(TEST_EMAIL)
  await page.locator('button[type="submit"]').first().click()
  // Siker vagy validációs üzenet jelenik meg (nem 500)
  await expect(
    page.locator('text=/sikeres|feliratkozás|success|confirmed/i').first()
  ).toBeVisible({ timeout: 8000 })
})

// ─── Kapcsolat form UI (dinamikus oldal keresés) ──────────────

test('kapcsolat form: megtalálható és beküldhető', async ({ page, request }) => {
  // Lekérdezzük az összes oldalt Payload-ból
  const res = await request.get('/api/pages?limit=50&locale=hu&depth=2')
  const json = await res.json()
  const pages = json.docs ?? []

  // Megkeressük az első oldalt ahol van form-next-to-section blokk
  const pageWithForm = pages.find((p: any) =>
    (p.dynamic_zone ?? []).some((block: any) =>
      block.blockType === 'form-section'
    )
  )

  if (!pageWithForm) {
    test.skip(true, 'Nincs form-next-to-section blokk egyik oldalon sem')
    return
  }

  await page.goto(`/hu/${pageWithForm.slug}`)
  const emailInput = page.locator('input[type="email"]').first()
  await expect(emailInput).toBeVisible()
  const nameInput = page.locator('input[type="text"]').first()
  await nameInput.fill('E2E Teszt')
  await emailInput.fill(TEST_EMAIL)
  const textarea = page.locator('textarea').first()
  if (await textarea.isVisible()) {
    await textarea.fill('Automatikus e2e teszt üzenet.')
  }
  await page.locator('button[type="submit"]').first().click()
  await expect(
    page.locator('text=/köszön|elküldve|megkaptam|success|thank/i').first()
  ).toBeVisible({ timeout: 8000 })
})

// ─── Visual card ──────────────────────────────────────────────

test('visual card oldal betölt', async ({ page }) => {
  await page.goto('/hu/visual-card')
  await expect(page.getByText('Mentés a névjegykártyába')).toBeVisible()
})

test('vCard endpoint text/vcard content-type-ot ad', async ({ request }) => {
  const response = await request.get('/visual-card')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/vcard')
})

// ─── Backend (Payload) ───────────────────────────────────────

test('Payload health endpoint él', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.status()).toBe(200)
})

test('Payload articles API adatot ad vissza', async ({ request }) => {
  const response = await request.get('/api/articles?limit=1')
  expect(response.status()).toBe(200)
  const json = await response.json()
  expect(json).toHaveProperty('docs')
})

test('Payload pages API adatot ad vissza', async ({ request }) => {
  const response = await request.get('/api/pages?limit=1')
  expect(response.status()).toBe(200)
  const json = await response.json()
  expect(json).toHaveProperty('docs')
})

// ─── Form API-ok ──────────────────────────────────────────────

test('hírlevél API elfogad POST-ot', async ({ request }) => {
  const response = await request.post('/api/newsletters', {
    data: { email: TEST_EMAIL },
  })
  expect(response.status()).toBeLessThan(500)
})

test('kapcsolatfelvétel API elfogad POST-ot', async ({ request }) => {
  const response = await request.post('/api/contacts', {
    data: {
      name: 'E2E Test',
      email: TEST_EMAIL,
      message: 'Automatikus e2e teszt üzenet',
    },
  })
  expect(response.status()).toBeLessThan(500)
})
