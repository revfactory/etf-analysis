/**
 * generate_pdf.js — kosdaq-etf-team PDF builder (pdf-author)
 *
 * charts_spec 운용 규칙 6조 (team-lead 공식 합의, _workspace/99_conventions.md):
 *   1. 색·타이틀·차트타입은 98_design_tokens.json 에서만 조회. spec의 색은 무시.
 *   2. 카테고리 색: categories[i] → token.category_colors[k] 룩업.
 *   3. ETF 색: ETF1/2/3 또는 종목코드 → token.etf_series 룩업.
 *   4. 시점 레이블: snapshot_dates 룩업 강제 (m6/m3/latest → 실제 날짜).
 *   5. 캡션: 렌더 시점에 caption_template.format(source, as_of_date) 조립.
 *   6. null: 차트=null 그대로, 테이블/카드="N/A" 렌더.
 * 차기 spec 개정부터 합의 스키마 v1.0 (chart_key/series_axis/dataset{...}/unit/source/as_of_date/notes) 적용.
 */
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const htmlPath = process.argv[2] || path.resolve(__dirname, '..', '03_pdf_source.html');
  const outPath = process.argv[3] || path.resolve(__dirname, '..', '..', '..', 'report.pdf');
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.waitForFunction(() => document.fonts && document.fonts.status === 'loaded').catch(() => {});
  await page.waitForTimeout(300);
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '18mm', bottom: '20mm', left: '18mm', right: '18mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size:8pt;color:#6B7280;width:100%;padding:0 18mm;display:flex;justify-content:flex-end;"><span class="date"></span></div>',
    footerTemplate: '<div style="font-size:8pt;color:#6B7280;text-align:center;width:100%;font-family:Pretendard,sans-serif;">코스닥 ETF 포트폴리오 리포트 · <span class="pageNumber"></span> / <span class="totalPages"></span></div>'
  });
  await browser.close();
  console.log('PDF generated:', outPath);
})().catch(e => { console.error(e); process.exit(1); });
