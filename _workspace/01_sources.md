# 출처 및 접근 일자 매핑

**수집 기준일:** 2026-04-14
**수집자:** etf-researcher
**스킬:** etf-data-research

## 한계 명시 (상단 필수)

- 일부 운용사는 전체 종목 리스트를 월 1회만 공시 → 일간 변화는 추적 불가
- 2025-10 및 2026-01 시점의 개별 종목 비중은 **운용사 과거 월간 구성종목 PDF 직접 접근 실패**로 다수 항목 N/A 처리
- 코스닥150 지수 추종 ETF 3종(KODEX/TIGER/RISE)은 구성 종목이 지수와 연동되므로 "종목 리스트"는 동일하나, CU 단위·리밸런싱 시점 차이로 비중(%)은 소수점 단위 편차 발생
- 맥락 채널(언론·커뮤니티)은 가설 제시용이며, 인과 증명이 아님

## 출처 표

| 데이터 항목 | URL | 접근 일자 | 소스 등급 |
|---|---|---|---|
| KODEX 코스닥150 AUM·보수율·상장일 (2026-04-13) | https://www.funetf.co.kr/product/etf/view/KR7229200001 | 2026-04-14 | A (운용사 연동 데이터) |
| KODEX 코스닥150 공식 PDP | https://www.samsungfund.com/etf/product/view.do?id=2ETF54 | 2026-04-14 | A (운용사) |
| KODEX 코스닥150 상위 구성종목 (알테오젠 10.49% 등) | https://richinfohub.com/kosdaq-etf-recommendations/ | 2026-04-14 | B (언론/블로그, 2026년 초 기준) |
| TIGER 코스닥150 AUM·보수율·상장일 (2026-04-13) | https://www.funetf.co.kr/product/etf/view/KR7232080002 | 2026-04-14 | A |
| TIGER 코스닥150 공식 PDP | https://investments.miraeasset.com/tigeretf/ko/product/search/detail/index.do?ksdFund=KR7232080002 | 2026-04-14 | A (PDF 파싱 실패, 메타데이터만) |
| RISE 코스닥150 AUM·보수율·상장일·상위 10종목 비중 | https://www.riseetf.co.kr/prod/finderDetail/4459 | 2026-04-14 | A (운용사 공식) |
| 2025-12-12 코스닥150 정기변경 편입/편출 16+16종목 | https://v.daum.net/v/20251118175226574 | 2026-04-14 | A (한국거래소 공시 근거 기사) |
| 코스닥150 내 알테오젠 지수 비중 (11% 수준) | https://www.imaeil.com/page/view/2026010710175258978 | 2026-04-14 | B |
| 알테오젠 코스피 이전 임시주총 의결 | https://www.segye.com/newsView/20251208516080 | 2026-04-14 | A |
| KoAct/TIME 코스닥액티브 상장 (2026-03-10) | https://www.mt.co.kr/stock/2026/03/09/2026030914551937485 | 2026-04-14 | A |
| ETF 시장 AUM 운용사별 1Q 현황 | https://dealsite.co.kr/articles/159510 | 2026-04-14 | A |
| 2025-07-31 KODEX 코스닥150 월간보고서 (PDF) | https://m.samsungfund.com/sheet/20250805/2ETF54_20250731.pdf | 2026-04-14 | A (이미지 PDF로 텍스트 파싱 실패) |
| 코스닥150 시가총액 상위 종목 구조 설명 | https://www.sedaily.com/NewsView/2H1WNRJM6U | 2026-04-14 | B |
| 2026-02 코스닥 ETF 순매수 흐름 | https://www.mt.co.kr/stock/2026/02/22/2026022015082631431 | 2026-04-14 | B |
| 2026-02 삼성증권 ETP Weekly Insight | https://samsungpop.com/common.do?cmd=down&contentType=application%2Fpdf&fileName=3020%2F2026020212581738K_02_02.pdf | 2026-04-14 | A (운용사 리서치) |
| 2025-11 주간 코스닥 순매수 상위 (알테오젠·에코프로) | https://www.fntimes.com/html/view.php?ud=202511082125012621179ad43907_18 | 2026-04-14 | B |

## 수집 방법 요약

1. 웹 검색으로 코스닥 ETF AUM 순위 확인 → KODEX/TIGER/RISE 3종 선정
2. 각 ETF 공식 PDP 및 FunETF 연동 데이터로 메타데이터 수집
3. RISE는 공식 PDP에서 상위 10종목 비중 전수 수집 성공
4. KODEX 상위 비중은 2026-Q1 언론·블로그 인용치 사용 (운용사 공시 PDF는 이미지 포맷으로 파싱 실패)
5. TIGER는 메타데이터만 확보, 구성종목 비중은 지수 연동 추정 구간으로 처리 (N/A)
6. 시점별(2025-10, 2026-01) 과거 비중은 대부분 N/A — 운용사 월간보고서 과거 아카이브 URL 접근 실패
7. 2025-12 정기변경 편입·편출 종목 전수 수집 성공 (한국거래소 공시)
