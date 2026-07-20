# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: permissions.spec.ts >> הרשאות - Security Officer (קצין ביטחון) >> Downloads → RW
- Location: tests\permissions.spec.ts:25:11

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text="delete-button-3"')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text="delete-button-3"')

```

```yaml
- img "לוגו כניסה"
- text: כניסה למערכת המקומית שם משתמש
- textbox
- text: סיסמה
- textbox
- text: כניסה גרסה 1.17.1.0
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import {
  3  |   permissionsMatrix,
  4  |   ALL_ROLES,
  5  |   ROLE_LABELS,
  6  |   Role,
  7  |   PermissionLevel,
  8  |   VERIFIED_MODULES,
  9  | } from './permissions-matrix';
  10 | import { testUsers } from './users.fixture';
  11 | import { login, logout } from './login.helper';
  12 | 
  13 | // כרגע רצים רק על מודולים שכבר אומתו מול האתר (ר' VERIFIED_MODULES).
  14 | // ברגע שממפים מודול נוסף - מוסיפים את שמו לרשימה ב-permissions-matrix.ts.
  15 | const modulesToTest = Object.entries(permissionsMatrix).filter(([name]) =>
  16 |   VERIFIED_MODULES.includes(name)
  17 | );
  18 | 
  19 | for (const role of ALL_ROLES) {
  20 |   test.describe(`הרשאות - ${ROLE_LABELS[role]}`, () => {
  21 |     // משתמשים במצב ההתחברות השמור מ-auth.setup.ts - אין יותר login בכל בדיקה
  22 |     test.use({ storageState: `.auth/${role}.json` });
  23 | 
  24 |     for (const [moduleName, config] of modulesToTest) {
  25 |       const level: PermissionLevel = config[role];
  26 | 
  27 |       test(`${moduleName} → ${level}`, async ({ page }) => {
  28 |         await page.goto(config.url);
  29 |         await page.waitForLoadState('load'); // חוכה עד שעמוד נטען, בלי לחכות לכל הבקשות הרקע
  30 | 
  31 |         if (level === 'DISABLED') {
  32 |           // מודול חסום: לוודא שאין גישה גם ב-URL ישיר (לא רק שהתפריט מסתיר)
  33 |           await expect(page).not.toHaveURL(config.url);
  34 |           return;
  35 |         }
  36 | 
  37 |         // המודול אמור להיות נגיש - נוודא שהתוכן הנכון נטען (לפי טקסט הכותרת)
  38 |         await expect(page.getByText(config.screenIdentifierText, { exact: true })).toBeVisible();
  39 | 
  40 |         // אם כפתור העריכה דורש בחירת שורה קודם (למשל checkbox בטבלה) - נבחר שורה ראשונה
  41 |         if (config.requiresRowSelection) {
  42 |           // מאפסים בחירות קודמות שנשארו מריצות עבר (הבחירה נשמרת ברמת האתר, לא רק בדפדפן)
  43 |           const selectAllCheckbox = page.getByRole('checkbox', { name: /הכל/ });
  44 |           if (await selectAllCheckbox.isChecked()) {
  45 |             await selectAllCheckbox.click();
  46 |           }
  47 |           await page.getByRole('checkbox', { name: 'בחר שורה' }).first().click();
  48 |           // ואז פותחים את תפריט הפעולות, שרק בתוכו מופיעה "עריכה"
  49 |           await page.getByRole('button', { name: 'actions' }).click();
  50 |         }
  51 | 
  52 |         const editControl = page.locator(config.editSelector);
  53 | 
  54 |         if (level === 'RO') {
  55 |           // Read Only: פעולת עריכה לא קיימת בעמוד כלל
  56 |           await expect(editControl).toHaveCount(0);
  57 |         }
  58 | 
> 59 |         if (level === 'RW') {
     |                                     ^ Error: expect(locator).toBeVisible() failed
  60 |           // Read/Write: פעולת עריכה קיימת ופעילה
  61 |           await expect(editControl).toBeVisible();
  62 |         }
  63 |       });
  64 |     }
  65 |   });
  66 | }
  67 | 
```