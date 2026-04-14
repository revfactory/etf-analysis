const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const htmlPath = path.resolve(__dirname, '..', '..', '03_pdf_source.html');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__CHARTS_READY__ === true, null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);
  const txts = await page.evaluate(() => {
    const el = document.getElementById('chart-aum');
    return Array.from(el.querySelectorAll('text')).map(t => t.textContent);
  });
  console.log(JSON.stringify(txts));
  await browser.close();
})();
