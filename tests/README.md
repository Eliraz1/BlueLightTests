# קבצי בדיקות אוטומציה - הרשאות ולוגין

## מצב נוכחי (עדכני לאחרון שהריצה עברה בהצלחה)
- ✅ Login/Logout - יציב ומאומת על כל 3 המשתמשים
- ✅ מודול Channels - מלא ומאומת (RO/RW על כל התפקידים)
- ✅ מודול Dashboard - מלא ומאומת
- ⏳ מודול Recordings - screenIdentifierText תוקן, editSelector עדיין TODO
- ⏳ 12 מודולים נוספים - עדיין עם TODO ב-permissions-matrix.ts

## הקבצים
| קובץ | תפקיד |
|---|---|
| `permissions-matrix.ts` | מקור האמת - טבלת ההרשאות + URL/סלקטורים לכל מודול |
| `users.fixture.ts` | פרטי משתמשי הבדיקה (נטענים מ-.env, לא כתובים בקוד) |
| `login.helper.ts` | פונקציות login/logout |
| `auth.setup.ts` | מתחבר פעם אחת לכל תפקיד, שומר session ל-`.auth/*.json` |
| `permissions.spec.ts` | הבדיקה המרכזית - עוברת על כל מודול מאומת × כל תפקיד |
| `login-sanity.spec.ts` | בדיקת login בודדת ומהירה, לסניטי צ'ק |

## הרצה
```
npx playwright test permissions
```
(ה-setup רץ אוטומטית קודם, בזכות ההגדרה ב-playwright.config.ts)

## דברים שחייבים להיות מוגדרים גם מחוץ לתיקייה הזו
1. **קובץ `.env` בשורש הפרויקט** (ליד `playwright.config.ts`, לא כאן) - עם:
   ```
   TEST_OPERATOR_USER=...
   TEST_OPERATOR_PASS=...
   TEST_ADMIN_USER=...
   TEST_ADMIN_PASS=...
   TEST_SECURITY_USER=...
   TEST_SECURITY_PASS=...
   TEST_CHANNEL_USER=s7001
   TEST_CHANNEL_PASS=P@ssw0rd
   CHANNEL_NAME=Auto Channel S7001
   CHANNEL_URL=http://example.com/stream
   CHANNEL_MULTICAST_IP=239.0.0.1
   CHANNEL_MULTICAST_PORT=5000
   CHANNEL_IP_ADDRESS=192.168.10.5
   CHANNEL_SITE=TLV
   CHANNEL_ROOM=חדר 1
   CHANNEL_ROLE=Operator
   ```
   **לא להעלות את `.env` ל-git!** להוסיף `.env` ל-`.gitignore`.

2. **תיקיית `.auth/`** - נוצרת אוטומטית ע"י auth.setup.ts, מכילה sessions פעילים.
   **גם היא לא אמורה לעלות ל-git** - להוסיף `.auth/` ל-`.gitignore`.

3. **`playwright.config.ts`** - צריך projects כך:
   ```typescript
   projects: [
     {
       name: 'setup',
       testMatch: /auth\.setup\.ts/,
       use: { ...devices['Desktop Edge'], channel: 'msedge' },
     },
     {
       name: 'msedge',
       use: { ...devices['Desktop Edge'], channel: 'msedge' },
       dependencies: ['setup'],
     },
   ],
   ```
   וגם `baseURL: 'https://bl-100.commx.loc'` ו-`ignoreHTTPSErrors: true` בתוך ה-`use` המשותף.

## המשך העבודה - איך למפות מודול חדש
1. נווטו למודול ידנית, העתיקו URL
2. מצאו טקסט ייחודי לזיהוי המסך (כותרת עמוד)
3. בדקו אם כפתור עריכה דורש בחירת שורה קודם
4. עשו Inspect על כפתור העריכה, מצאו id/aria-label/טקסט יציב
5. הוסיפו שורה חדשה ב-`permissionsMatrix`, והוסיפו את שם המודול ל-`VERIFIED_MODULES`
