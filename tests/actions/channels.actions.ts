import { Page, expect } from '@playwright/test';

export interface ChannelFields {
  name: string;
  url: string;
  multicastIp: string;
  multicastPort: string;
  ipAddress: string;
  site: string;
  room: string;
  role: string;
}

/**
 * יוצר ערוץ חדש דרך מודול Channels. מניח שכבר נמצאים בעמוד /Channels
 * (למשל אחרי goToModule(page, 'Channels')).
 */
export async function createChannel(page: Page, fields: ChannelFields) {
  const actionsButton = page.locator('button[aria-label="actions"]');
  await expect(actionsButton).toBeVisible({ timeout: 15000 });
  await actionsButton.click();

  // פריט התפריט "יצירת ערוץ" הוא div טקסט (MuiBox) בלי role/aria-label - מזהים לפי הטקסט
  const addButton = page.getByText('יצירת ערוץ', { exact: true });
  await expect(addButton.first()).toBeVisible({ timeout: 15000 });
  await addButton.first().click();

  const channelDialog = page.locator('#newMarkerWindow');
  await expect(channelDialog).toBeVisible({ timeout: 15000 });

  const dialogInputs = channelDialog.locator('input[type="text"]');
  await dialogInputs.nth(0).fill(fields.name);
  await dialogInputs.nth(1).fill(fields.url);
  await dialogInputs.nth(2).fill(fields.multicastIp);
  await dialogInputs.nth(3).fill(fields.multicastPort);
  await dialogInputs.nth(4).fill(fields.ipAddress);
  await dialogInputs.nth(5).fill(fields.site);
  await dialogInputs.nth(6).fill(fields.room);
  await dialogInputs.nth(7).fill(fields.role);

  // Wait for any MUI popover/backdrop that might intercept pointer events to disappear
  await page.locator('.MuiPopover-root .MuiBackdrop-root').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});

  await channelDialog.locator('#confirm-creation').click();
}
