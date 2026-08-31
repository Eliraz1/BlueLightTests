const { chromium } = require('playwright');
const dotenv = require('dotenv');

dotenv.config();

const TEST_CHANNEL_USER = process.env.TEST_CHANNEL_USER || 's7001';
const TEST_CHANNEL_PASS = process.env.TEST_CHANNEL_PASS || 'P@ssw0rd';
const CHANNEL_NAME = process.env.CHANNEL_NAME || 'Auto Channel S7001';
const CHANNEL_URL = process.env.CHANNEL_URL || '100';
const CHANNEL_MULTICAST_IP = process.env.CHANNEL_MULTICAST_IP || '239.0.0.1';
const CHANNEL_MULTICAST_PORT = process.env.CHANNEL_MULTICAST_PORT || '50000';
const CHANNEL_IP_ADDRESS = process.env.CHANNEL_IP_ADDRESS || '192.168.10.5';
const CHANNEL_SITE = process.env.CHANNEL_SITE || 'TLV';
const CHANNEL_ROOM = process.env.CHANNEL_ROOM || 'חדר 1';
const CHANNEL_ROLE = process.env.CHANNEL_ROLE || 'Operator';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Opening login page...');
  await page.goto('https://bl-200.commx.loc/login');

  await page.locator('#login-field').fill(TEST_CHANNEL_USER);
  await page.locator('#password-field').fill(TEST_CHANNEL_PASS);
  await page.locator('#password-field').press('Enter');

  await page.waitForURL(/^(?!.*\/login)/, { timeout: 15000 });
  console.log('Logged in as', TEST_CHANNEL_USER);

  await page.goto('https://bl-200.commx.loc/Channels');
  await page.waitForURL(/\/Channels(\b|$)/, { timeout: 15000 });

  const actionsButton = page.locator('button[aria-label="actions"]');
  await actionsButton.waitFor({ state: 'visible', timeout: 15000 });
  await actionsButton.click();

  const addButton = page.locator(
    'button[aria-label="יצירת ערוץ"], button:has-text("יצירת ערוץ"), [role="button"]:has-text("יצירת ערוץ"), .MuiBox-root.css-5xwp5p:has-text("יצירת ערוץ")'
  );
  await addButton.first().waitFor({ state: 'visible', timeout: 15000 });
  await addButton.first().click();

  const channelDialog = page.locator('#newMarkerWindow');
  await channelDialog.waitFor({ state: 'visible', timeout: 15000 });

  const dialogInputs = channelDialog.locator('input[type="text"]');
  await dialogInputs.nth(0).fill(CHANNEL_NAME);
  await dialogInputs.nth(1).fill(CHANNEL_URL);
  await dialogInputs.nth(2).fill(CHANNEL_MULTICAST_IP);
  await dialogInputs.nth(3).fill(CHANNEL_MULTICAST_PORT);
  await dialogInputs.nth(4).fill(CHANNEL_IP_ADDRESS);
  await dialogInputs.nth(5).fill(CHANNEL_SITE);
  await dialogInputs.nth(6).fill(CHANNEL_ROOM);
  await dialogInputs.nth(7).fill(CHANNEL_ROLE);

  await channelDialog.locator('#confirm-creation').click();
  console.log('Clicked save. Waiting for channel creation to complete...');

  await page.waitForSelector(`text=${CHANNEL_NAME}`, { timeout: 15000 });
  console.log('Channel created:', CHANNEL_NAME);

  await browser.close();
})();
