import { test, expect } from '@playwright/test'

// These tests don't need auth
test.use({ storageState: { cookies: [], origins: [] } })

test('circle coming-soon page has waitlist form', async ({ page }) => {
  await page.goto('/circle')
  await expect(page.getByPlaceholder(/your@email/i)).toBeVisible({ timeout: 8_000 })
})

test('resources coming-soon page has waitlist form', async ({ page }) => {
  await page.goto('/resources')
  await expect(page.getByPlaceholder(/your@email/i)).toBeVisible({ timeout: 8_000 })
})

test('connect coming-soon page has waitlist form', async ({ page }) => {
  await page.goto('/connect')
  await expect(page.getByPlaceholder(/your@email/i)).toBeVisible({ timeout: 8_000 })
})

test('invalid email shows browser validation', async ({ page }) => {
  await page.goto('/circle')
  const input = page.getByPlaceholder(/your@email/i)
  await input.fill('notanemail')
  await page.getByRole('button', { name: /join waitlist/i }).click()
  // Browser native email validation prevents submission
  const validationMsg = await input.evaluate((el: HTMLInputElement) => el.validationMessage)
  expect(validationMsg).toBeTruthy()
})

test('valid email submission attempt updates button state', async ({ page }) => {
  await page.goto('/circle')
  await page.getByPlaceholder(/your@email/i).fill('test@example.com')
  await page.getByRole('button', { name: /join waitlist/i }).click()
  // Button should show loading or success state
  await expect(page.getByRole('button').filter({ hasText: /joining|you're on the list|already/i }))
    .toBeVisible({ timeout: 10_000 })
})

test('landing page footer has waitlist form', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(/early access/i)).toBeVisible()
})
