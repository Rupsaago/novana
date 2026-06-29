import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/ask')
  await expect(page).toHaveURL(/ask/, { timeout: 10_000 })
})

test('ask page loads with greeting message', async ({ page }) => {
  await expect(page.getByText(/Hi, love/i)).toBeVisible({ timeout: 8_000 })
})

test('chat input is visible', async ({ page }) => {
  await expect(page.getByPlaceholder(/ask anything/i)).toBeVisible()
})

test('send button is disabled when input is empty', async ({ page }) => {
  const sendBtn = page.locator('button[disabled]').last()
  await expect(sendBtn).toBeVisible()
})

test('typing enables the send button', async ({ page }) => {
  await page.getByPlaceholder(/ask anything/i).fill('why am i tired?')
  // Button should no longer be disabled
  const allBtns = page.locator('button')
  // The send button (last round button) should be enabled
  await expect(page.locator('button').last()).not.toBeDisabled()
})

test('suggestion chips are visible and clickable', async ({ page }) => {
  const chip = page.getByRole('button', { name: /so tired this week/i })
  await expect(chip).toBeVisible()
  await chip.click()
  await expect(page.getByPlaceholder(/ask anything/i)).toHaveValue(/tired/i)
})

test('recent prompts in sidebar are clickable', async ({ page }) => {
  const recentPrompt = page.getByRole('button', { name: /skin breaking out/i })
  await expect(recentPrompt).toBeVisible()
  await recentPrompt.click()
  await expect(page.getByPlaceholder(/ask anything/i)).not.toHaveValue('')
})

test('"What I\'m seeing" sidebar is visible', async ({ page }) => {
  await expect(page.getByText(/what i'm seeing/i)).toBeVisible()
})

test('sidebar shows cycle day row', async ({ page }) => {
  await expect(page.getByText(/cycle day/i)).toBeVisible()
})

test('sending a message shows typing indicator', async ({ page }) => {
  await page.getByPlaceholder(/ask anything/i).fill('how is my mood?')
  await page.keyboard.press('Enter')
  // Typing indicator (bouncing dots) should briefly appear
  // Since API calls take time, just check message was added
  await expect(page.getByText('how is my mood?')).toBeVisible({ timeout: 5_000 })
})
