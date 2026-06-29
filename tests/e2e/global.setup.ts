import { test as setup, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  const email    = process.env.TEST_USER_EMAIL    ?? 'testuser@novana.app'
  const password = process.env.TEST_USER_PASSWORD ?? 'testpassword123'

  await page.goto('/auth/login')
  await page.getByPlaceholder(/email/i).fill(email)
  await page.getByPlaceholder(/password/i).fill(password)
  await page.getByRole('button', { name: /sign in/i }).click()

  // Wait for redirect to dashboard after login
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })

  // Save auth state for reuse
  const dir = path.dirname(authFile)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  await page.context().storageState({ path: authFile })
})
