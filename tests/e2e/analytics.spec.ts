import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/analytics')
  await expect(page).toHaveURL(/analytics/, { timeout: 10_000 })
})

test('analytics page loads with heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /analytics/i })).toBeVisible({ timeout: 8_000 })
})

test('date range tabs are visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /7 days/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /30 days/i })).toBeVisible()
})

test('clicking 30 days tab keeps page on analytics', async ({ page }) => {
  await page.getByRole('button', { name: /30 days/i }).click()
  await expect(page).toHaveURL(/analytics/)
})

test('chart section renders', async ({ page }) => {
  // Recharts renders an SVG
  await page.waitForTimeout(2000) // wait for data load
  const svg = page.locator('svg').first()
  await expect(svg).toBeVisible({ timeout: 8_000 })
})

test('phase averages cards are present', async ({ page }) => {
  await expect(page.getByText(/menstrual/i).first()).toBeVisible()
  await expect(page.getByText(/follicular/i).first()).toBeVisible()
})
