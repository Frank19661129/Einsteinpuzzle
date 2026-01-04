import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:5173/';
const outputPath = process.argv[3] || 'screenshot-puzzle.png';

(async () => {
  console.log(`📸 Taking screenshot of: ${url}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Larger viewport for puzzle
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for puzzle to load
  await page.waitForTimeout(2000);

  await page.screenshot({ path: outputPath, fullPage: false });

  console.log(`✅ Screenshot saved to: ${outputPath}`);

  await browser.close();
})();
