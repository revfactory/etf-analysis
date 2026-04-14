# charts_spec 운용 규칙 (팀 공식 합의 v1.0)

공지일: 2026-04-14
채택 주체: kosdaq-etf-team (pdf-author·web-designer 합의안 → team-lead 승인)
적용 범위: 코스닥 ETF 포트폴리오 리포트 파이프라인 (PDF + 인터랙티브 웹)
적용 시점: 현 배포본 호환 · 차기 charts_spec 개정부터 스키마 준수

---

## 배경

PDF와 HTML 리포트가 동일한 분석 데이터를 참조하지만 각자 팔레트·타이틀·포맷을 재정의하면서 드리프트가 발생할 위험이 있다. 차트 스펙이 "보관할 것"과 "보관하지 말 것"을 분리하여 렌더러 양측이 같은 소스를 바라보도록 구조적으로 강제한다.

## 운용 규칙 6조

1. **색·타이틀·차트타입은 `_workspace/98_design_tokens.json` 에서만 조회.** spec에 색이 박혀 있어도 렌더러는 무시하고 토큰을 단일 소스로 사용.
2. **카테고리 색**: `categories[i]` → `token.category_colors[k]` 룩업.
3. **ETF 색**: 데이터 row/column key의 `ETF1/ETF2/ETF3` 또는 종목코드(`229200`, `232080`, `270810`) → `token.etf_series` 룩업.
4. **시점 레이블**: `snapshot_dates` 룩업 강제 (`m6/m3/latest` → 실제 날짜 문자열).
5. **캡션**: 렌더 시점에 `caption_template.format(source, as_of_date)` 조립.
6. **null 처리**: 차트에서는 null 그대로 전달, 테이블/카드에서는 `"N/A"` 렌더.

## 합의 스키마 v1.0 (차기 spec 개정부터)

```json
{
  "chart_key": "timeseries_weights",
  "series_axis": "snapshot | etf | category",
  "dataset": {
    "rows": [],
    "columns": [],        // series_axis=snapshot 시 snapshot_dates 키
    "categories": [],     // series_axis=category 시에만
    "values": [[]]
  },
  "unit": "%",
  "source": "출처 문자열",
  "as_of_date": "YYYY-MM-DD",
  "notes": []
}
```

## 현재 배포본과의 호환성

- `02_charts_spec.json` v1.0.0 이미 PDF·HTML 양측에 반영 완료
- 키명·팔레트·타이틀·타입은 이미 토큰 기준으로 정렬되어 있음 — 실용상 문제 없음
- 운용 규칙 6조는 현재 spec에도 소급 적용 가능(렌더러가 spec 색상 필드를 무시)

## 재사용 대상

- 코스닥 ETF 리포트 후속 라운드
- 유사 구조의 타 지수 ETF 리포트 파생 시

## 확장 키 처리 (2026-04-14 추가)

`kpi_hero`, `etf_profiles`, `inout_distribution.classification_pie` 등 기본 {rows, columns, categories, values} 구조로 정규화하기 어려운 확장 키는 `chart_key`를 고유명으로 유지하되 `series_axis` 로 렌더 분기. dataset 필드는 해당 차트가 필요로 하는 형태를 허용.
