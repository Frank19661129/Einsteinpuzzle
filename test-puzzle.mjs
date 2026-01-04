import { chromium } from 'playwright';

const url = 'http://localhost:5175/';

(async () => {
  console.log('🧩 Testing Einstein Puzzle...\n');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  console.log('📸 Step 1: Start screen');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '01-start-screen.png' });
  console.log('   ✓ Saved: 01-start-screen.png');

  console.log('\n📸 Step 2: Click "Start Puzzle"');
  await page.click('text=Start Puzzle');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '02-puzzle-board.png' });
  console.log('   ✓ Saved: 02-puzzle-board.png');

  console.log('\n📸 Step 3: Test cheat button');
  await page.click('text=Solve Puzzle');
  await page.waitForTimeout(2500); // Wait for animation + solve
  await page.screenshot({ path: '03-puzzle-solved.png' });
  console.log('   ✓ Saved: 03-puzzle-solved.png');

  console.log('\n✅ Test completed! Check the screenshots.');
  console.log('   - 01-start-screen.png');
  console.log('   - 02-puzzle-board.png');
  console.log('   - 03-puzzle-solved.png');

  await browser.close();
})();
