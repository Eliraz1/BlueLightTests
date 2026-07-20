import { test } from '@playwright/test';
import { testUsers } from './users.fixture';
import { login } from './login.helper';

test('בדיקת login - operator', async ({ page }) => {
  await login(page, testUsers.operator);
});

test('בדיקת login - admin', async ({ page }) => {
  await login(page, testUsers.admin);
});

test('בדיקת login - securityOfficer', async ({ page }) => {
  await login(page, testUsers.securityOfficer);
});
