import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  colorScheme: 'dark',
});

const page = await context.newPage();

// Full dashboard
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'public/dashboard-full.png', fullPage: false });

// Scroll to see more content
await page.evaluate(() => window.scrollTo(0, 600));
await page.waitForTimeout(500);
await page.screenshot({ path: 'public/dashboard-mid.png', fullPage: false });

await page.evaluate(() => window.scrollTo(0, 1200));
await page.waitForTimeout(500);
await page.screenshot({ path: 'public/dashboard-bottom.png', fullPage: false });

// Full page screenshot for reference
await page.screenshot({ path: 'public/dashboard-fullpage.png', fullPage: true });

await browser.close();
console.log('Screenshots captured successfully!');
