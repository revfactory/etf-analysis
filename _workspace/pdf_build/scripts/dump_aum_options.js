const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const htmlPath = path.resolve(__dirname, '..', '..', '03_pdf_source.html');
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__CHARTS_READY__ === true, null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);
  const dump = await page.evaluate(() => {
    const el = document.getElementById('chart-aum');
    const inst = echarts.getInstanceByDom(el);
    if (!inst) return { error: 'no-instance' };
    const opt = inst.getOption();
    const m = inst.getModel();
    const xComp = m.getComponent('xAxis', 0);
    const scale = xComp.axis.scale;
    return {
      xAxis_option: opt.xAxis,
      scale_extent: scale.getExtent(),
      scale_ticks: scale.getTicks().map(t => t.value),
      ticks_formatted: scale.getTicks().map(t => t.value),
    };
  });
  fs.writeFileSync(path.resolve(__dirname, '..', '..', 'dump_options.json'), JSON.stringify(dump, null, 2));
  console.log(JSON.stringify(dump, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
