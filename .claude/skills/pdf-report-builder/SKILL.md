---
name: pdf-report-builder
description: HTML을 A4 인쇄 품질 PDF로 변환하는 파이프라인 스킬. 한글 폰트, 표/차트 레이아웃, 페이지 번호를 지원하며 ETF·투자 리포트·재무 리포트 등 전문 PDF 작성 요청 시 이 스킬을 사용.
---

# PDF Report Builder

HTML 기반 인쇄 품질 PDF 리포트 빌드 파이프라인.

## 기술 스택

- **렌더러:** Playwright (Chromium) 또는 Puppeteer
- **폰트:** Pretendard (우선), Noto Sans KR (대체) — @font-face로 로컬 임베드
- **차트:** ECharts SVG 모드 (PDF에서 깨지지 않음) 또는 Chart.js canvas → PNG 변환
- **레이아웃:** CSS `@page` 규칙, `page-break` 제어

## 레이아웃 표준

### 페이지
- A4 (210 × 297mm), 여백 20mm
- 푸터: 페이지 번호 + 보고서 제목
- 헤더: 보고서 날짜 (첫 페이지 제외)

### 타이포그래피
- 본문: Pretendard 10.5pt, line-height 1.55
- 헤딩 H1: 22pt Bold, H2: 16pt Semibold, H3: 12.5pt Semibold
- 캡션/각주: 8.5pt Regular, 회색

### 색 팔레트 (인쇄 친화)
- 배경: 흰색
- 주색: `#0B3D91` (딥 네이비) — 헤딩/포인트
- 보조: `#4F8CFF` (블루) — 표 헤더, 차트 시리즈 1
- 포인트: `#10B981` (에메랄드) — 상승/증액
- 경고: `#E0645B` (버건디 레드) — 하락/축소/리스크
- 회색 스케일: `#1F2937` / `#6B7280` / `#E5E7EB`

### 표
- 헤더: 연한 블루 배경(#EEF4FF) + bold
- 행: 지브라 패턴(#F9FAFB 교차)
- 숫자 우측 정렬, 음수 빨간색

### 차트
- SVG 우선 (스케일 무손실)
- 모든 차트 하단 캡션: `자료: {출처}, 기준일: {date}`

## 보고서 구조 (표준 템플릿)

1. **표지** — 제목, 부제, 작성일, 기준일, 로고(선택)
2. **Executive Summary** — 헤드라인 숫자 4~6개 + 3~5줄 요약
3. **시장 개요** — 코스닥 ETF 시장 규모, 상위 3개 비교 표
4. **ETF 프로파일 ×3** — 각 ETF 1페이지 (기본 정보 + 상위 10종목 + 전략 특징)
5. **비중 변화 분석** — 증액/축소/신규/제외 테이블, 시계열 차트
6. **공통 vs 단독 편입** — 교집합/차집합 시각화
7. **인사이트 & 리스크** — 3~5개 핵심 테이크어웨이
8. **부록** — 전체 종목 표, 용어 정의, 면책 조항, 출처 목록

## 면책 조항 (필수)

```
본 보고서는 정보 제공을 목적으로 작성되었으며, 투자 자문이나 종목 추천이 아닙니다.
수록된 데이터는 기재된 기준일의 공시 자료에 근거하며, 이후 변동될 수 있습니다.
투자 결정은 본인의 판단과 책임하에 이루어져야 합니다.
```

## 생성 절차

1. 분석 JSON을 로드하여 Jinja-like 템플릿 또는 JS 템플릿 리터럴로 HTML 생성
2. ECharts 인스턴스를 SVG 모드로 설정, DOM에 렌더
3. `await page.goto(file://html)` 후 `page.pdf({ format: 'A4', printBackground: true, margin: ... })`
4. `report.pdf` 로 저장

## 생성 스크립트 뼈대

`scripts/generate_pdf.js` (Node/Playwright):
```js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${__dirname}/report.html`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: 'report.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="font-size:8pt;color:#6B7280;text-align:center;width:100%;">코스닥 ETF 리포트 · <span class="pageNumber"></span> / <span class="totalPages"></span></div>'
  });
  await browser.close();
})();
```

## 주의사항

- 차트는 **SVG 우선** — canvas → PNG 변환 시 DPR 2 이상으로 설정
- 한글 폰트 로드 실패 시 렌더링 결과 붕괴 → `waitUntil: 'networkidle'` 필수
- 숫자는 `Intl.NumberFormat('ko-KR')`로 천단위 콤마
- 날짜는 `YYYY-MM-DD` 고정 포맷
- 페이지 하단 잘림 방지: 각 섹션에 `page-break-inside: avoid` 적절히 적용
