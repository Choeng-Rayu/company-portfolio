const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`Browser Console: ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`Browser Error: ${err}`));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  const fab = page.locator('button[aria-label="Open chat"]');
  if (await fab.count() > 0) {
    const box = await fab.boundingBox();
    console.log(`FAB bounds:`, box);
    await fab.screenshot({ path: '/home/rayu/company_portfolio/app/fab.png' });
    await page.screenshot({ path: '/home/rayu/company_portfolio/app/full.png' });
  } else {
    console.log("FAB not found");
  }
  
  await browser.close();
})();
