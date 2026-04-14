# 코스닥 ETF 분석 리포트 프로젝트

## 하네스: KOSDAQ ETF Portfolio Report

**목표:** 코스닥 ETF 상위 3개 펀드의 피투자사 구성과 시계열 비중 변화를 조사하여, 모던한 인터랙티브 웹페이지와 인쇄 품질 PDF 리포트를 동시에 생성한다.

**트리거:** 코스닥 ETF 조사·분석·리포트 생성 요청 시 `kosdaq-etf-report` 스킬을 사용하라. 후속 요청(특정 ETF만 재조사, 웹 디자인 수정, PDF 구조 보완, 데이터 업데이트, 이전 결과 개선 등)에서도 동일 스킬이 부분 재실행을 처리한다.

**산출물:**
- `report.pdf` — A4 인쇄용 한국어 투자 리포트
- `report.html` — 단일 파일 인터랙티브 웹 리포트 (애니메이션 배경 + 차트 인터랙션)
- `_workspace/` — 원천 수집 JSON, 분석 산출물, QA 보고서 보존

**변경 이력:**

| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-04-14 | 초기 구성 (5 agents + 5 skills + orchestrator) | 전체 | 사용자 요청: 코스닥 ETF 상위 3개 피투자사/비중 변화 분석 및 PDF+인터랙티브 웹 리포트 생성 |
| 2026-04-14 | 맥락 채널 추가: 언론 보도·커뮤니티 반응 수집. 역할 5번 신설, 작업 원칙에 인용 보존/요약 금지/대표성 경고 추가. 출력에 `01_press_*.md`, `01_community_*.md` 추가. data-analyst에게 가설 제시용임을 명시하는 안내 프로토콜 추가. frontmatter description 갱신. | agents/etf-researcher.md | 1on1 — 포트폴리오 수치 변화에 맥락(뉴스·투자자 반응)을 붙여 분석팀의 해석을 돕기 위함 |
| 2026-04-14 | 매일 08:00 KST 자동 갱신 GitHub Action 추가 (`.github/workflows/daily-report.yml`). 스케줄·수동 트리거 지원, Claude Code 헤드리스로 `kosdaq-etf-report` 스킬 실행, 결과 자동 커밋·푸시. 필요 secret: `ANTHROPIC_API_KEY`. | `.github/workflows/` | 사용자 요청: 매일 아침 8시 최신 포트폴리오·비중으로 리포트 재생성 자동화 |
