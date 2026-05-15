const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  const fab = page.locator('button[aria-label="Open chat"]');
  const html = await fab.innerHTML();
  console.log(html);
  await browser.close();
})();
