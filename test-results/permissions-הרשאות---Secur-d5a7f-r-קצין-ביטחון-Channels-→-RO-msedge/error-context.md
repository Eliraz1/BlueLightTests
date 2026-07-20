# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: permissions.spec.ts >> הרשאות - Security Officer (קצין ביטחון) >> Channels → RO
- Location: tests\permissions.spec.ts:25:11

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('ערוצים', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('ערוצים', { exact: true })

```

```yaml
- heading "504 Gateway Time-out" [level=1]
- separator
- text: nginx
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
  10 | 
  11 | // כרגע רצים רק על מודולים שכבר אומתו מול האתר (ר' VERIFIED_MODULES).
  12 | // ברגע שממפים מודול נוסף - מוסיפים את שמו לרשימה ב-permissions-matrix.ts.
  13 | const modulesToTest = Object.entries(permissionsMatrix).filter(([name]) =>
  14 |   VERIFIED_MODULES.includes(name)
  15 | );
  16 | 
  17 | for (const role of ALL_ROLES) {
  18 |   test.describe(`הרשאות - ${ROLE_LABELS[role]}`, () => {
  19 |     // משתמשים במצב ההתחברות השמור מ-auth.setup.ts - אין יותר login בכל בדיקה
  20 |     test.use({ storageState: `.auth/${role}.json` });
  21 | 
  22 |     for (const [moduleName, config] of modulesToTest) {
  23 |       const level: PermissionLevel = config[role];
  24 | 
  25 |       test(`${moduleName} → ${level}`, async ({ page }) => {
  26 |         await page.goto(config.url);
  27 |         await page.waitForLoadState('load'); // חוכה עד שעמוד נטען, בלי לחכות לכל הבקשות הרקע
  28 | 
  29 |         if (level === 'DISABLED') {
  30 |           // מודול חסום: לוודא שאין גישה גם ב-URL ישיר (לא רק שהתפריט מסתיר)
  31 |           await expect(page).not.toHaveURL(config.url);
  32 |           return;
  33 |         }
  34 | 
  35 |         // המודול אמור להיות נגיש - נוודא שהתוכן הנכון נטען (לפי טקסט הכותרת)
> 36 |         await expect(page.getByText(config.screenIdentifierText, { exact: true })).toBeVisible();
     |                                                                                    ^ Error: expect(locator).toBeVisible() failed
  37 | 
  38 |         // אם כפתור העריכה דורש בחירת שורה קודם (למשל checkbox בטבלה) - נבחר שורה ראשונה
  39 |         if (config.requiresRowSelection) {
  40 |           // מאפסים בחירות קודמות שנשארו מריצות עבר (הבחירה נשמרת ברמת האתר, לא רק בדפדפן)
  41 |           const selectAllCheckbox = page.getByRole('checkbox', { name: /הכל/ });
  42 |           if (await selectAllCheckbox.isChecked()) {
  43 |             await selectAllCheckbox.click();
  44 |           }
  45 |           await page.getByRole('checkbox', { name: 'בחר שורה' }).first().click();
  46 |           // ואז פותחים את תפריט הפעולות, שרק בתוכו מופיעה "עריכה"
  47 |           await page.getByRole('button', { name: 'actions' }).click();
  48 |         }
  49 | 
  50 |         const editControl = page.locator(config.editSelector);
  51 | 
  52 |         if (level === 'RO') {
  53 |           // Read Only: פעולת עריכה לא קיימת בעמוד כלל
  54 |           await expect(editControl).toHaveCount(0);
  55 |         }
  56 | 
  57 |         if (level === 'RW') {
  58 |           // Read/Write: פעולת עריכה קיימת ופעילה
  59 |           await expect(editControl).toBeVisible();
  60 |         }
  61 |       });
  62 |     }
  63 |   });
  64 | }
  65 | 
```