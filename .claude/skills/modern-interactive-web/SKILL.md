---
name: modern-interactive-web
description: 모던하고 세련된 인터랙티브 웹페이지를 단일 HTML로 구축하는 스킬. 애니메이션 배경(파티클 네트워크, 메쉬 그라디언트), ECharts 인터랙티브 차트, 다크/라이트 테마, 스크롤 진입 효과 등 프리미엄 단일 페이지 리포트 제작 요청 시 반드시 이 스킬을 사용.
---

# Modern Interactive Web

고급감 있는 인터랙티브 단일 페이지 웹 리포트를 만드는 디자인 시스템 및 구현 가이드.

## 디자인 원칙

참조 미감: **Linear, Stripe, Vercel, Arc, Framer**. 공통 속성:
- 고대비 다크 배경 + 미묘한 그라디언트 + 포인트 컬러 1~2개
- 타이포그래피 주도 (변이(Variable) 폰트 활용)
- 부드러운 모션 (ease-out, 200~400ms)
- 절제된 색상, 과도한 네온·무지개 금지

### 색 팔레트 (다크 기본)
- 배경: `#0B0F1A`
- 서피스: `#111827` / `#1F2937`
- 라인/보더: `rgba(255,255,255,0.08)`
- 텍스트 주: `#E5E7EB`, 보조: `#9CA3AF`
- 포인트 1 (Blue): `#4F8CFF`
- 포인트 2 (Mint): `#7EE8CF`
- 경고/상승: `#10B981`, 하락: `#FF6B6B`

### 라이트 모드
- 배경: `#FAFAFB`, 서피스: `#FFFFFF`
- 텍스트: `#0F172A` / `#64748B`
- 포인트 동일

### 타이포그래피
- 기본: **Pretendard Variable** (CDN: cdn.jsdelivr.net/gh/orioncactus/pretendard)
- 영숫자: Inter or Pretendard
- 크기 스케일: 12 / 14 / 16 / 20 / 28 / 40 / 56px

## 필수 구성 요소

### 1. 애니메이션 배경

**옵션 A (권장): 파티클 네트워크**
- Canvas API, 70~80개 입자
- 마우스 반경 150px 내 연결선 강조
- `requestAnimationFrame` + DPR 대응
- `prefers-reduced-motion` 감지 시 정적 SVG 대체

**옵션 B: 메쉬 그라디언트 (CSS only)**
- 여러 개의 `radial-gradient`를 absolute 배치
- `@keyframes` 로 blob 이동 애니메이션
- `filter: blur(80px)` 로 몽환적 효과
- GPU 친화 (transform, opacity만 애니메이트)

### 2. 상단 내비게이션
- Sticky, 스크롤 시 배경 blur
- 섹션 점프 (Smooth scroll)
- 테마 토글 (다크/라이트)

### 3. 히어로 섹션
- 큰 타이포그래피 (40~56px)
- 핵심 지표 4개 카드 (AUM, ETF 수, 분석 종목 수, 기준일)
- 스크롤 힌트 인디케이터

### 4. ETF 프로파일 섹션
- 3개 ETF 탭 또는 세그먼트 컨트롤
- 선택 시 차트·표 전환 (부드러운 transition)

### 5. 인터랙티브 차트
- ECharts 권장 (CDN)
- 기본 탑재: 그룹 막대, 시계열 라인, 도넛, 히트맵
- 툴팁 커스터마이징 (한국어)
- 레전드 토글 가능

### 6. 종목 카드 그리드
- CSS Grid, 반응형 (lg=4col, md=3, sm=2, xs=1)
- 호버 시 elevation + 상세 팝오버
- 증액/축소 배지 (컬러 코딩)

### 7. 스크롤 진입 효과
- IntersectionObserver 사용
- `.reveal` 클래스 요소에 fade + translateY(16px → 0)
- stagger delay (0~200ms)

### 8. 푸터
- 출처·기준일·면책 조항
- PDF 다운로드 링크

## 구현 체크리스트

- [ ] 단일 `report.html` 파일 (외부 의존성은 CDN)
- [ ] 오프라인에서도 기본 구조 렌더 (차트만 미동작)
- [ ] 다크 모드 기본, 라이트 토글
- [ ] 60fps 유지 (Chrome DevTools Performance 확인)
- [ ] 모바일 반응형 (최소 375px)
- [ ] 접근성: 키보드 탐색, `aria-label`, WCAG AA 대비
- [ ] `prefers-reduced-motion` 존중
- [ ] 콘솔 에러 없음

## 뼈대 코드 (요약)

```html
<!DOCTYPE html>
<html lang="ko" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>코스닥 ETF 포트폴리오 분석</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css">
  <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
  <style>
    :root { --bg: #0B0F1A; --surface: #111827; --text: #E5E7EB; --accent: #4F8CFF; --mint: #7EE8CF; }
    [data-theme="light"] { --bg: #FAFAFB; --surface: #FFFFFF; --text: #0F172A; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Pretendard Variable', -apple-system, sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }
    #bg-canvas { position: fixed; inset: 0; z-index: -1; }
    @media (prefers-reduced-motion: reduce) { .animate { animation: none !important; } }
  </style>
</head>
<body>
  <canvas id="bg-canvas"></canvas>
  <nav>...</nav>
  <main>
    <section class="hero">...</section>
    <section class="etf-profiles">...</section>
    <section class="charts">...</section>
    <section class="holdings-grid">...</section>
    <section class="insights">...</section>
  </main>
  <script>
    // 파티클 배경, 스크롤 observer, 차트 초기화, 테마 토글
  </script>
</body>
</html>
```

## 파티클 배경 기본 구현

```js
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const N = 75;
function resize() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.scale(devicePixelRatio, devicePixelRatio); canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px'; }
class P { constructor() { this.reset(); } reset() { this.x = Math.random()*innerWidth; this.y = Math.random()*innerHeight; this.vx = (Math.random()-0.5)*0.3; this.vy = (Math.random()-0.5)*0.3; this.r = 1+Math.random()*1.5; } step() { this.x += this.vx; this.y += this.vy; if(this.x<0||this.x>innerWidth)this.vx*=-1; if(this.y<0||this.y>innerHeight)this.vy*=-1; } }
function init() { resize(); particles = Array.from({length: N}, ()=> new P()); }
function frame() {
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for (const p of particles) p.step();
  // connection lines
  for (let i=0; i<particles.length; i++) {
    for (let j=i+1; j<particles.length; j++) {
      const dx = particles[i].x-particles[j].x, dy = particles[i].y-particles[j].y;
      const d = Math.hypot(dx,dy);
      if (d < 120) { ctx.strokeStyle = `rgba(79,140,255,${0.15*(1-d/120)})`; ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); }
    }
  }
  for (const p of particles) { ctx.fillStyle = 'rgba(126,232,207,0.6)'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }
  requestAnimationFrame(frame);
}
addEventListener('resize', init); init(); frame();
```

## ECharts 통합 팁

- 다크/라이트 테마에 맞춰 `echarts.init(el, theme)` 재호출 가능하도록 차트 인스턴스 보관
- 한국어 툴팁 포매터: `tooltip: { formatter: params => ... }`
- SVG 렌더러 (`renderer: 'svg'`) — 확대 시 선명
- responsive: `window.addEventListener('resize', () => chart.resize())`

## 성능 가드

- 파티클 개수 자동 조절: 화면 폭 < 768px → 40개로 축소
- `prefers-reduced-motion` 감지 시 파티클 정지, 정적 배경 표시
- 차트는 lazy init (IntersectionObserver로 뷰포트 진입 시)

## 한계 및 폴백

- CDN 실패 → `noscript` 안내 + 정적 표 렌더
- 구형 브라우저 → `@supports` 기반 폴백 스타일
