---
name: kosdaq-etf-report
description: 코스닥 ETF 상위 펀드의 피투자사 포트폴리오 및 비중 변화 조사 후 PDF와 인터랙티브 웹 리포트를 생성하는 오케스트레이터. 코스닥 ETF 조사, 펀드 피투자사 분석, ETF 비중 변화, 투자 리포트 작성 요청 시 반드시 이 스킬을 사용. 후속 작업으로 결과 업데이트, 리포트 다시 생성, 특정 ETF만 재조사, 웹 디자인 수정, PDF 구조 보완, 이전 결과 개선 요청 시에도 이 스킬을 사용.
---

# KOSDAQ ETF Report Orchestrator

코스닥 ETF 상위 3개 펀드의 피투자사 포트폴리오와 시계열 비중 변화를 조사하여, **PDF 보고서**와 **인터랙티브 웹페이지**를 동시에 산출하는 에이전트 팀 오케스트레이터.

## 실행 모드: 에이전트 팀

5명의 전문 에이전트가 `TeamCreate`로 팀을 구성하고, `TaskCreate`로 작업을 공유하며 `SendMessage`로 직접 조율한다.

## 에이전트 구성

| 팀원 | 에이전트 타입 | 역할 | 스킬 | 출력 |
|------|-------------|------|------|------|
| etf-researcher | general-purpose | ETF/피투자사 데이터 수집 | etf-data-research | `_workspace/01_*` |
| data-analyst | general-purpose | 비중 변화 분석/인사이트 | portfolio-analysis | `_workspace/02_*` |
| pdf-author | general-purpose | PDF 보고서 작성 | pdf-report-builder | `report.pdf` |
| web-designer | general-purpose | 인터랙티브 웹 구축 | modern-interactive-web | `report.html` |
| qa-reviewer | general-purpose | 데이터·산출물 검증 | (검증 프로토콜) | `_workspace/05_qa_report.md` |

## 워크플로우

### Phase 0: 컨텍스트 확인

1. `_workspace/` 디렉토리 존재 여부 확인
2. 실행 모드 결정:
   - **미존재** → 초기 실행. Phase 1로 진행
   - **존재 + 부분 수정 요청** (예: "웹 디자인만 다시") → 해당 에이전트만 재호출, 관련 `_workspace` 파일만 덮어씀
   - **존재 + 새 입력** → 기존 `_workspace/`를 `_workspace_{YYYYMMDD_HHMMSS}/`로 보존 후 Phase 1

### Phase 1: 준비

1. 사용자 입력 분석 (ETF 순위 기준, 시점 범위 등 명시 여부 확인)
2. `_workspace/`, `_workspace/00_input/` 생성
3. 기본 설정값 저장 (`_workspace/00_input/config.json`):
   - 순위 기준: "AUM" (default)
   - 레버리지/인버스 제외 여부: true
   - 시점: 최신 / 3개월 전 / 6개월 전
   - 언어: 한국어

### Phase 2: 팀 구성

1. 팀 생성:
```
TeamCreate(
  team_name: "kosdaq-etf-team",
  members: [
    { name: "etf-researcher", agent_type: "general-purpose", model: "opus",
      prompt: "너는 etf-researcher이다. .claude/agents/etf-researcher.md 와 .claude/skills/etf-data-research/SKILL.md 를 먼저 읽고 역할·프로토콜을 따른다. _workspace/00_input/config.json 에 따라 코스닥 ETF 상위 3개와 시점별 holdings를 수집하여 _workspace/01_* 에 저장한다." },
    { name: "data-analyst", agent_type: "general-purpose", model: "opus",
      prompt: "너는 data-analyst이다. .claude/agents/data-analyst.md 와 .claude/skills/portfolio-analysis/SKILL.md 를 먼저 읽는다. etf-researcher가 _workspace/01_* 를 완료하면 그 데이터로 비중 변화를 분석하여 _workspace/02_* 를 생성한다." },
    { name: "pdf-author", agent_type: "general-purpose", model: "opus",
      prompt: "너는 pdf-author이다. .claude/agents/pdf-author.md 와 .claude/skills/pdf-report-builder/SKILL.md 를 먼저 읽는다. data-analyst가 02_* 를 완료하면 그 데이터로 report.pdf 를 생성한다. web-designer와 색상·차트 타이틀 일관성을 맞춘다." },
    { name: "web-designer", agent_type: "general-purpose", model: "opus",
      prompt: "너는 web-designer이다. .claude/agents/web-designer.md 와 .claude/skills/modern-interactive-web/SKILL.md 를 먼저 읽는다. data-analyst가 02_* 를 완료하면 단일 report.html 을 생성한다. 배경 애니메이션, 인터랙티브 차트, 다크/라이트 테마를 포함한다." },
    { name: "qa-reviewer", agent_type: "general-purpose", model: "opus",
      prompt: "너는 qa-reviewer이다. .claude/agents/qa-reviewer.md 를 먼저 읽는다. pdf-author와 web-designer의 산출물 완성 알림을 받으면 _workspace의 원천 JSON과 교차 비교하여 _workspace/05_qa_report.md 를 생성한다. 이슈 발견 시 해당 에이전트에게 SendMessage로 수정 요청한다." }
  ]
)
```

2. 작업 등록:
```
TaskCreate(tasks: [
  { title: "ETF Top3 선정 및 메타데이터", assignee: "etf-researcher", description: "KRX/운용사 공시로 AUM Top3 선정, 01_etf_top3.json 생성" },
  { title: "각 ETF holdings 시점별 수집", assignee: "etf-researcher", description: "3개 시점 holdings 데이터를 01_holdings_{code}.json 으로 생성" },
  { title: "출처 목록 정리", assignee: "etf-researcher", description: "01_sources.md 생성" },
  { title: "비중 변화 분류 및 집중도 계산", assignee: "data-analyst", depends_on: ["ETF Top3 선정 및 메타데이터", "각 ETF holdings 시점별 수집"], description: "02_analysis.json 생성" },
  { title: "인사이트 3~5개 도출", assignee: "data-analyst", description: "02_insights.md 생성" },
  { title: "차트 스펙 생성", assignee: "data-analyst", description: "02_charts_spec.json (PDF·웹 공용)" },
  { title: "PDF 보고서 작성", assignee: "pdf-author", depends_on: ["비중 변화 분류 및 집중도 계산","차트 스펙 생성"], description: "report.pdf 생성 (8~10페이지)" },
  { title: "인터랙티브 웹 구축", assignee: "web-designer", depends_on: ["비중 변화 분류 및 집중도 계산","차트 스펙 생성"], description: "report.html 단일 파일, 애니메이션 배경 + 인터랙션" },
  { title: "경계면 교차 검증", assignee: "qa-reviewer", depends_on: ["PDF 보고서 작성","인터랙티브 웹 구축"], description: "05_qa_report.md 생성" }
])
```

### Phase 3: 수집 및 분석

**실행 방식:** 팀원 자체 조율

- etf-researcher가 먼저 실행 → 완료 시 SendMessage로 data-analyst에게 알림
- data-analyst가 분석 완료 → pdf-author와 web-designer에게 동시 알림
- pdf-author ↔ web-designer: SendMessage로 색상·차트 타이틀 공유 (데이터 일관성)
- 리더는 TaskGet으로 진행 상황 주기적 확인

### Phase 4: 산출물 생성

- pdf-author와 web-designer가 병렬로 산출물 생성
- 각 에이전트는 완료 시 qa-reviewer에게 알림

### Phase 5: 검증

- qa-reviewer가 `_workspace/05_qa_report.md` 작성
- PASS 항목과 FAIL 항목을 명시
- 이슈 발견 시 해당 에이전트에게 SendMessage로 수정 요청, 1회 재검증
- 3건 이상 불일치 시 리더에게 상향 보고

### Phase 6: 정리

1. qa-reviewer의 최종 승인 확인
2. 팀 정리 (TeamDelete)
3. `_workspace/` 보존 (중간 산출물 유지)
4. 사용자에게 최종 결과 보고:
   - `report.pdf` 경로 (페이지 수, 섹션 요약)
   - `report.html` 경로 (주요 인터랙션 요약)
   - qa_report 주요 발견사항
   - 남은 제약·한계
5. 피드백 요청 (개선 희망 사항 있는지 확인)

## 데이터 흐름

```
리더 → TeamCreate ─┬─ etf-researcher ─→ 01_*.json
                  │                      ↓ SendMessage
                  ├─ data-analyst  ─────→ 02_*.json
                  │                    ↓            ↓
                  ├─ pdf-author ───────→ report.pdf
                  ├─ web-designer ─────→ report.html
                  │                        ↓   ↓
                  └─ qa-reviewer ←─────── (교차 비교)
                                            ↓
                                      05_qa_report.md
                                            ↓
                                    리더 최종 보고
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| etf-researcher 데이터 접근 실패 | 대체 소스 1회 시도, 실패 시 해당 항목 N/A로 진행, 보고서에 명시 |
| data-analyst 수치 이상 감지 | etf-researcher에게 원천 확인 요청, 30초 대기 후 회신 없으면 현재 데이터로 진행 |
| pdf-author 변환 실패 | HTML 원본 보존, 리더에 보고, 웹페이지만이라도 완성 |
| web-designer CDN 로드 실패 | 정적 폴백 렌더, 사유 푸터에 명시 |
| qa-reviewer 불일치 발견 | 2건 이하 → 해당 에이전트 수정. 3건 이상 → 리더 상향 보고 |
| 팀원 과반 정지 | 사용자에게 상황 보고, 진행 여부 확인 |

## 후속 작업 지원

- **부분 재실행 키워드:** "웹만 다시", "PDF 구조 바꿔", "인사이트 보완", "ETF 하나 바꿔"
- 감지 시 해당 에이전트만 재호출, 관련 `_workspace` 파일만 갱신
- 완전 새 실행: 이전 `_workspace/`를 타임스탬프 폴더로 보존

## 테스트 시나리오

### 정상 흐름
1. 사용자가 "코스닥 ETF 상위 3개 조사" 요청
2. Phase 1에서 기본 설정 생성 (AUM 기준, 3개 시점)
3. Phase 2-3에서 팀 구성, etf-researcher가 데이터 수집 → data-analyst 분석
4. Phase 4에서 pdf-author와 web-designer가 병렬 생성
5. Phase 5에서 qa-reviewer가 검증 → PASS
6. 예상 결과: `report.pdf` (8~10p), `report.html` (단일 파일)

### 에러 흐름
1. Phase 3에서 etf-researcher가 특정 ETF 공시 접근 불가
2. 대체 소스 시도, 실패 시 "해당 ETF 일부 데이터 N/A" 로 진행
3. data-analyst가 N/A 처리하여 분석 범위 축소
4. 산출물에 "데이터 한계" 박스 추가
5. qa-reviewer는 해당 섹션 검증 항목을 SKIP으로 표기
