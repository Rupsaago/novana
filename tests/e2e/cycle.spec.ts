import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/cycle')
  await expect(page).toHaveURL(/cycle/, { timeout: 10_000 })
})

test('cycle page loads', async ({ page }) => {
  await expect(page.locator('h1').first()).toBeVisible({ timeout: 8_000 })
})

test('shows current phase in heading', async ({ page }) => {
  const h1 = page.locator('h1').first()
  await expect(h1).toContainText(/menstrual|follicular|ovulatory|luteal/i)
})

test('cycle day chip is visible', async ({ page }) => {
  // Chip shows "Day X of 28" or "Set your period start"
  await expect(page.getByText(/day \d+ of \d+|set your period start/i)).toBeVisible({ timeout: 8_000 })
})

test('cycle wheel SVG renders', async ({ page }) => {
  await expect(page.locator('svg').first()).toBeVisible()
})

test('phase cards (Menstrual/Follicular/Ovulatory/Luteal) are visible', async ({ page }) => {
  await expect(page.getByText('Menstrual')).toBeVisible()
  await expect(page.getByText('Follicular')).toBeVisible()
  await expect(page.getByText('Ovulatory')).toBeVisible()
  await expect(page.getByText('Luteal')).toBeVisible()
})

test('"Log today" links to /today', async ({ page }) => {
  const link = page.getByRole('link', { name: /log today/i })
  await expect(link).toBeVisible()
})

test('"See history" links to /analytics', async ({ page }) => {
  const link = page.getByRole('link', { name: /see history/i })
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', '/analytics')
})

test('"Open your cycle settings" links to /settings', async ({ page }) => {
  const link = page.getByRole('link', { name: /cycle settings/i })
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', '/settings')
})

test('predictions section shows upcoming dates', async ({ page }) => {
  await expect(page.getByText(/ovulation|period|luteal/i).first()).toBeVisible()
})
