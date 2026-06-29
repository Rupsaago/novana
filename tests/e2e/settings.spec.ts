import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/settings')
  await expect(page).toHaveURL(/setttings|settings/, { timeout: 10_000 })
})

test('settings page loads', async ({ page }) => {
  await expect(page.getByText(/profile/i).first()).toBeVisible({ timeout: 8_000 })
})

test('profile section is visible', async ({ page }) => {
  await expect(page.locator('#profile')).toBeVisible()
})

test('cycle section is visible', async ({ page }) => {
  await expect(page.locator('#cycle')).toBeVisible()
})

test('period start date input is visible in cycle section', async ({ page }) => {
  await expect(page.getByText(/when did your last period start/i)).toBeVisible()
  const dateInput = page.locator('input[type="date"]')
  await expect(dateInput).toBeVisible()
})

test('cycle length input is visible', async ({ page }) => {
  await expect(page.getByText(/average cycle length/i).first()).toBeVisible()
})

test('"Save cycle settings" button is visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /save cycle settings/i })).toBeVisible()
})

test('cycle date can be set', async ({ page }) => {
  const dateInput = page.locator('input[type="date"]').first()
  await dateInput.fill('2026-06-19')
  await expect(dateInput).toHaveValue('2026-06-19')
})

test('"Edit profile" button is visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /edit profile/i })).toBeVisible()
})

test('privacy section is visible', async ({ page }) => {
  await expect(page.locator('#privacy')).toBeVisible()
})

test('theme section is visible', async ({ page }) => {
  await expect(page.locator('#theme')).toBeVisible()
})

test('sign out button is visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible()
})
