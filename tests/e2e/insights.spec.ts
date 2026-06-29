import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/insights')
  await expect(page).toHaveURL(/insights/, { timeout: 10_000 })
})

test('insights page loads with heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /ai insights/i })).toBeVisible({ timeout: 8_000 })
})

test('"Analyze my patterns" button is visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /analyze my patterns/i })).toBeVisible()
})

test('clicking analyze shows loading state', async ({ page }) => {
  await page.getByRole('button', { name: /analyze my patterns/i }).click()
  // Should show loading text while the API call is in progress
  await expect(page.getByText(/analysing/i)).toBeVisible({ timeout: 3_000 })
})

test('static insight cards are visible before analysis', async ({ page }) => {
  await expect(page.getByText(/this week/i).first()).toBeVisible()
})

test('"Regenerate" button on journal summary is visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /regenerate/i })).toBeVisible()
})

test('journal summary section is present', async ({ page }) => {
  await expect(page.getByText(/weekly journal summary/i)).toBeVisible()
})

test('shows "how your symptoms move together" section', async ({ page }) => {
  await expect(page.getByText(/how your symptoms move together/i)).toBeVisible()
})
