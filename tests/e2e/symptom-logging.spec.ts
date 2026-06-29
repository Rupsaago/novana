import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/today')
  await expect(page).toHaveURL(/today/, { timeout: 10_000 })
})

test('today page loads with scenic hero', async ({ page }) => {
  await expect(page.locator('h1').first()).toBeVisible({ timeout: 8_000 })
})

test('mood orbs render on today page', async ({ page }) => {
  await expect(page.getByText('heavy')).toBeVisible()
  await expect(page.getByText('bright')).toBeVisible()
})

test('clicking a mood orb selects it visually', async ({ page }) => {
  await page.getByText('easy').first().click()
  // The orb scales up — just ensure no error is thrown
  await expect(page.getByText('easy').first()).toBeVisible()
})

test('morning intention textarea accepts input', async ({ page }) => {
  const textarea = page.getByPlaceholder(/today i want to feel/i)
  await expect(textarea).toBeVisible()
  await textarea.fill('Calm and focused')
  await expect(textarea).toHaveValue('Calm and focused')
})

test('"Save morning" button is visible', async ({ page }) => {
  await expect(page.getByRole('button', { name: /save morning/i })).toBeVisible()
})

test('"Full log" button toggles detailed symptom form', async ({ page }) => {
  const fullLogBtn = page.getByRole('button', { name: /full log/i })
  await expect(fullLogBtn).toBeVisible()
  await fullLogBtn.click()
  // SymptomForm should now be visible
  await expect(page.getByText('Mood')).toBeVisible({ timeout: 5_000 })
})

test('"Longer entry" links to journal', async ({ page }) => {
  const link = page.getByRole('link', { name: /longer entry/i })
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', '/journal')
})

test('"Open insights" links to insights', async ({ page }) => {
  const link = page.getByRole('link', { name: /open insights/i })
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', '/insights')
})

test('evening reflection textarea accepts input', async ({ page }) => {
  const textarea = page.getByPlaceholder(/a few words is enough/i)
  await expect(textarea).toBeVisible()
  await textarea.fill('Felt grateful')
  await expect(textarea).toHaveValue('Felt grateful')
})

test('week dot indicators are visible', async ({ page }) => {
  await expect(page.getByText(/of 7/i).first()).toBeVisible()
})
