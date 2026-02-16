import { chromium } from 'playwright';
import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3001/...');
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Extra wait to ensure everything is loaded
  
  const screenshot1 = await page.screenshot({ fullPage: true });
  await writeFile(join(__dirname, 'screenshot-home.png'), screenshot1);
  console.log('Screenshot saved: screenshot-home.png');

  console.log('Navigating to http://localhost:3001/vips...');
  await page.goto('http://localhost:3001/vips', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Extra wait to ensure everything is loaded
  
  const screenshot2 = await page.screenshot({ fullPage: true });
  await writeFile(join(__dirname, 'screenshot-vips.png'), screenshot2);
  console.log('Screenshot saved: screenshot-vips.png');

  await browser.close();
  console.log('Done!');
}

takeScreenshots().catch(console.error);
