import { test, expect } from '@playwright/test';
import {
  permissionsMatrix,
  ALL_ROLES,
  ROLE_LABELS,
  Role,
  PermissionLevel,
  VERIFIED_MODULES,
} from './permissions-matrix';

// כרגע רצים רק על מודולים שכבר אומתו מול האתר (ר' VERIFIED_MODULES).
// ברגע שממפים מודול נוסף - מוסיפים את שמו לרשימה ב-permissions-matrix.ts.
const modulesToTest = Object.entries(permissionsMatrix).filter(([name]) =>
  VERIFIED_MODULES.includes(name)
);

for (const role of ALL_ROLES) {
  test.describe(`הרשאות - ${ROLE_LABELS[role]}`, () => {
    // משתמשים במצב ההתחברות השמור מ-auth.setup.ts - אין יותר login בכל בדיקה
    test.use({ storageState: `.auth/${role}.json` });

    for (const [moduleName, config] of modulesToTest) {
      const level: PermissionLevel = config[role];

      test(`${moduleName} → ${level}`, async ({ page }) => {
        await page.goto(config.url);
        await page.waitForLoadState('load'); // חוכה עד שעמוד נטען, בלי לחכות לכל הבקשות הרקע

        if (level === 'DISABLED') {
          // מודול חסום: לוודא שאין גישה גם ב-URL ישיר (לא רק שהתפריט מסתיר)
          await expect(page).not.toHaveURL(config.url);
          return;
        }

        // המודול אמור להיות נגיש - נוודא שהתוכן הנכון נטען (לפי טקסט הכותרת)
        await expect(page.getByText(config.screenIdentifierText, { exact: true })).toBeVisible();

        // אם כפתור העריכה דורש בחירת שורה קודם (למשל checkbox בטבלה) - נבחר שורה ראשונה
        if (config.requiresRowSelection) {
          // מאפסים בחירות קודמות שנשארו מריצות עבר (הבחירה נשמרת ברמת האתר, לא רק בדפדפן)
          const selectAllCheckbox = page.getByRole('checkbox', { name: /הכל/ });
          if (await selectAllCheckbox.isChecked()) {
            await selectAllCheckbox.click();
          }
          await page.getByRole('checkbox', { name: 'בחר שורה' }).first().click();
          // ואז פותחים את תפריט הפעולות, שרק בתוכו מופיעה "עריכה"
          await page.getByRole('button', { name: 'actions' }).click();
        }

        const editControl = page.locator(config.editSelector);

        if (level === 'RO') {
          // Read Only: פעולת עריכה לא קיימת בעמוד כלל
          await expect(editControl).toHaveCount(0);
        }

        if (level === 'RW') {
          // Read/Write: פעולת עריכה קיימת ופעילה
          await expect(editControl).toBeVisible();
        }
      });
    }
  });
}
