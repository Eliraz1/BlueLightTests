import { test as setup } from '@playwright/test';
import { testUsers } from './users.fixture';
import { login } from './login.helper';
import { ALL_ROLES } from './permissions-matrix';

// עבור כל תפקיד, מתחברים פעם אחת ושומרים את מצב ההתחברות (cookies/session) לקובץ.
// בדיקות אחרות ישתמשו בקובץ הזה במקום להתחבר מחדש בכל פעם.
for (const role of ALL_ROLES) {
  setup(`authenticate as ${role}`, async ({ page }) => {
    await login(page, testUsers[role]);
    await page.context().storageState({ path: `.auth/${role}.json` });
  });
}
