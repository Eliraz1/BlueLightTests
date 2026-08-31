import { Page, expect } from '@playwright/test';
import { permissionsMatrix } from '../permissions-matrix';

/**
 * מנווט ישירות למודול לפי שם (מפתח ב-permissionsMatrix), בלי לחכות ל-networkidle.
 * מוודא שהמסך הנכון נטען לפי screenIdentifierText.
 */
export async function goToModule(page: Page, moduleName: keyof typeof permissionsMatrix) {
  const module = permissionsMatrix[moduleName];
  if (!module) {
    throw new Error(`מודול לא מוכר: ${String(moduleName)}`);
  }

  await page.goto(module.url);
  await page.waitForURL(new RegExp(`${module.url}(\\b|$)`), { timeout: 15000 });

  if (module.screenIdentifierText && module.screenIdentifierText !== 'TODO') {
    await expect(page.getByText(module.screenIdentifierText, { exact: true })).toBeVisible({ timeout: 15000 });
  }
}
