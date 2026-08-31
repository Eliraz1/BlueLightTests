import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { login } from './login.helper';
import { goToModule } from './actions/navigation.actions';
import { createChannel, ChannelFields } from './actions/channels.actions';
import type { TestUser } from './users.fixture';

const CHANNEL_TEST_USER: TestUser = {
  username: process.env.TEST_CHANNEL_USER ?? 's7001',
  password: process.env.TEST_CHANNEL_PASS ?? 'P@ssw0rd',
};

const CHANNEL_FIELDS: ChannelFields = {
  name: process.env.CHANNEL_NAME ?? 'Auto Channel S7001',
  url: process.env.CHANNEL_URL ?? '100',
  multicastIp: process.env.CHANNEL_MULTICAST_IP ?? '239.0.0.1',
  multicastPort: process.env.CHANNEL_MULTICAST_PORT ?? '50000',
  ipAddress: process.env.CHANNEL_IP_ADDRESS ?? '192.168.10.5',
  site: process.env.CHANNEL_SITE ?? 'TLV',
  room: process.env.CHANNEL_ROOM ?? 'חדר 1',
  role: process.env.CHANNEL_ROLE ?? 'Operator',
};

test.describe('ערוצים - יצירת ערוץ חדש', () => {
  test('כניסה כ-s7001 ויצירת ערוץ חדש', async ({ page }) => {
    await page.goto('/login');
    await login(page, CHANNEL_TEST_USER);

    await goToModule(page, 'Channels');
    await createChannel(page, CHANNEL_FIELDS);

    // הטבלה מחולקת לעמודים (9 בעמוד) - הערוץ החדש עלול להיות בעמוד אחר.
    // מסננים לפי השם דרך תיבת החיפוש ואז מאמתים את השורה.
    await page.getByRole('textbox', { name: 'חיפוש...' }).fill(CHANNEL_FIELDS.name);
    await expect(
      page.getByRole('cell', { name: CHANNEL_FIELDS.name })
    ).toBeVisible({ timeout: 15000 });
  });
});
