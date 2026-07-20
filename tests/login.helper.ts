import { Page, expect } from '@playwright/test';
import { TestUser } from './users.fixture';

export async function login(page: Page, user: TestUser) {
  await page.goto('/login');
  await page.locator('#login-field').fill(user.username);
  await page.locator('#password-field').fill(user.password);
  await page.locator('#password-field').press('Enter');

  // ולידציה שההתחברות הצליחה
  await expect(page).not.toHaveURL(/login/, { timeout: 15000 });
}

export async function logout(page: Page) {
  await page.locator('#logout-button').click();
  await expect(page).toHaveURL(/login/, { timeout: 10000 });
}
