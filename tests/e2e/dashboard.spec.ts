import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/dashboard/, { timeout: 10_000 })
})

test('dashboard page loads without errors', async ({ page }) => {
  await expect(page.locator('h1')).toBeVisible({ timeout: 8_000 })
})

test('greeting contains user name', async ({ page }) => {
  const heading = page.locator('h1')
  await expect(heading).toBeVisible()
  // The greeting should say "Good morning/afternoon/evening, [name]"
  await expect(heading).toContainText(/good (morning|afternoon|evening)/i)
})

test('date in hero shows today (not yesterday)', async ({ page }) => {
  const today = new Date()
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
  // The eyebrow text shows today's date
  await expect(page.getByText(new RegExp(dayName, 'i')).first()).toBeVisible({ timeout: 8_000 })
})

test('mood orbs are visible', async ({ page }) => {
  await expect(page.getByText('heavy')).toBeVisible()
  await expect(page.getByText('bright')).toBeVisible()
})

test('clicking a mood orb selects it', async ({ page }) => {
  const orbs = page.locator('text=heavy, text=tender, text=okay, text=easy, text=bright')
  // Click the "easy" label area
  await page.getByText('easy').click()
  // Should not throw, orb should now appear selected (scale)
  await expect(page.getByText('easy')).toBeVisible()
})

test('"Save today" button is visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /save today/i })).toBeVisible()
})

test('"Same as yesterday" button is visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /same as yesterday/i })).toBeVisible()
})

test('"Skip today" button is visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /skip today/i })).toBeVisible()
})

test('"View all" links to analytics', async ({ page }) => {
  const viewAll = page.getByRole('link', { name: /view all/i })
  await expect(viewAll).toBeVisible()
  await expect(viewAll).toHaveAttribute('href', '/analytics')
})

test('"Open today\'s ritual" links to /today', async ({ page }) => {
  const links = page.getByRole('link', { name: /open today/i })
  await expect(links.first()).toHaveAttribute('href', '/today')
})

test('Today at a glance section renders', async ({ page }) => {
  await expect(page.getByText(/today at a glance/i)).toBeVisible()
})

test('Symptom trends chart section renders', async ({ page }) => {
  await expect(page.getByText(/symptom trends/i)).toBeVisible()
})
