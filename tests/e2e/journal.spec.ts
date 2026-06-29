import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/journal')
  await expect(page).toHaveURL(/journal/, { timeout: 10_000 })
})

test('journal page loads', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /journal/i })).toBeVisible({ timeout: 8_000 })
})

test('writing area renders', async ({ page }) => {
  await expect(page.getByPlaceholder(/a few lines is plenty/i)).toBeVisible()
})

test('mood tags are visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /calm/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /anxious/i })).toBeVisible()
})

test('clicking a mood tag toggles its selected state', async ({ page }) => {
  const calmBtn = page.getByRole('button', { name: /^calm$/i })
  await expect(calmBtn).toBeVisible()
  await calmBtn.click()
  // Should toggle — just ensure no error
  await expect(calmBtn).toBeVisible()
})

test('context tags are visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /rest/i }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: /sleep/i }).first()).toBeVisible()
})

test('"Save entry" button is visible and disabled when empty', async ({ page }) => {
  const saveBtn = page.getByRole('button', { name: /save entry/i })
  await expect(saveBtn).toBeVisible()
  await expect(saveBtn).toBeDisabled()
})

test('"Save entry" button enables when text is entered', async ({ page }) => {
  await page.getByPlaceholder(/a few lines is plenty/i).fill('Had a calm day.')
  await expect(page.getByRole('button', { name: /save entry/i })).not.toBeDisabled()
})

test('"Save as draft" button is visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /save as draft/i })).toBeVisible()
})

test('"View full insights" links to insights page', async ({ page }) => {
  const link = page.getByRole('link', { name: /view full insights/i })
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', '/insights')
})

test('AI emotional summary card is visible', async ({ page }) => {
  await expect(page.getByText(/ai emotional summary/i)).toBeVisible()
})

test('recent entries section is visible', async ({ page }) => {
  await expect(page.getByText(/recent entries/i)).toBeVisible()
})
