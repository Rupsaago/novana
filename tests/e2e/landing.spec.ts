import { test, expect } from '@playwright/test'

test.use({ storageState: { cookies: [], origins: [] } })

test('landing page loads in under 4 seconds', async ({ page }) => {
  const start = Date.now()
  await page.goto('/')
  await expect(page.locator('h1').first()).toBeVisible()
  expect(Date.now() - start).toBeLessThan(4_000)
})

test('landing page has novana wordmark', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.wordmark').first()).toBeVisible()
})

test('"Get started" button links to /onboarding', async ({ page }) => {
  await page.goto('/')
  const btn = page.getByRole('link', { name: /get started/i }).first()
  await expect(btn).toHaveAttribute('href', '/onboarding')
})

test('"Sign in" button links to /auth/login', async ({ page }) => {
  await page.goto('/')
  const btn = page.getByRole('link', { name: /sign in/i }).first()
  await expect(btn).toHaveAttribute('href', '/auth/login')
})

test('"How it works" nav link scrolls to the section', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /how it works/i }).first().click()
  // The how-it-works section should be in view
  const section = page.locator('#how-it-works')
  await expect(section).toBeVisible({ timeout: 3_000 })
})

test('"Why Novana" nav link scrolls to features', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /why novana/i }).first().click()
  await expect(page.locator('#features')).toBeVisible({ timeout: 3_000 })
})

test('Manifesto nav link goes to /about', async ({ page }) => {
  await page.goto('/')
  const manifestoLink = page.getByRole('link', { name: /manifesto/i }).first()
  await expect(manifestoLink).toHaveAttribute('href', '/about')
})

test('pricing section is visible after scrolling', async ({ page }) => {
  await page.goto('/')
  await page.locator('#pricing').scrollIntoViewIfNeeded()
  await expect(page.locator('#pricing')).toBeVisible()
})

test('footer privacy link goes to /privacy', async ({ page }) => {
  await page.goto('/')
  const link = page.getByRole('link', { name: /our privacy promise/i })
  await expect(link).toHaveAttribute('href', '/privacy')
})

test('footer contact link is a mailto', async ({ page }) => {
  await page.goto('/')
  const link = page.getByRole('link', { name: /contact us/i })
  await expect(link).toHaveAttribute('href', /mailto:/)
})
