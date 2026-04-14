# GitHub Actions — 코스닥 ETF 리포트 자동화

## daily-report.yml

매일 오전 8시(KST) 코스닥 ETF 리포트를 새로 생성한다.

### 필요 설정

**Secrets (저장소 Settings → Secrets and variables → Actions → New repository secret):**
- `ANTHROPIC_API_KEY` — Anthropic API 키. 헤드리스 Claude Code가 하네스를 실행하는 데 사용.

**Permissions (저장소 Settings → Actions → General):**
- Workflow permissions: "Read and write permissions"
- Allow GitHub Actions to create and approve pull requests: 선택 사항

### 실행 방식

- **스케줄**: `0 23 * * *` UTC = 08:00 KST (cron은 UTC 기준)
- **수동 트리거**: Actions 탭에서 "Daily ETF Report" 워크플로 → "Run workflow" 버튼. 선택적으로 커스텀 프롬프트 입력 가능
- **동시성 제어**: `concurrency.group: daily-etf-report` — 이전 실행이 아직 돌고 있으면 새 실행을 큐잉

### 파이프라인

1. 체크아웃 (full history) → Node 20 셋업
2. Claude Code CLI 글로벌 설치 (`@anthropic-ai/claude-code`)
3. Playwright 의존성 설치 (`npm ci` + `chromium`)
4. KST 기준 날짜 계산
5. 기존 `_workspace/`를 `_workspace_{timestamp}`로 백업
6. Claude Code 헤드리스 실행 — `kosdaq-etf-report` 스킬 트리거
7. 산출물(`report.pdf`, `index.html`) 존재 검증
8. 변경이 있으면 커밋·푸시 (`github-actions[bot]` 계정)
9. 아티팩트 업로드 (30일 보존)

### 커스터마이징

- **실행 시각 변경**: `cron` 값 수정. UTC 기준이므로 KST로부터 -9시간. 예: 07:00 KST = 22:00 UTC = `0 22 * * *`
- **모델 변경**: `--model` 플래그 값 수정 (`claude-sonnet-4-6` 등)
- **프롬프트 커스터마이징**: 스텝 "Run harness via Claude Code"의 기본 `USER_PROMPT` 수정

### 장애 대응

| 현상 | 원인 | 조치 |
|------|------|------|
| 산출물 검증 실패 | 하네스가 파일 생성 전 종료 | Actions 로그에서 Claude Code stdout 확인, 프롬프트 보강 |
| `npm ci` 실패 | `_workspace/pdf_build/package-lock.json` 누락 | 로컬에서 `npm install` 후 lock 파일 커밋 |
| Claude Code 인증 실패 | `ANTHROPIC_API_KEY` 미설정 또는 만료 | 저장소 secret 갱신 |
| 커밋 푸시 거부 | 브랜치 보호 규칙 | Actions에 bypass 권한 부여 또는 PR 생성 모드로 변경 |

### 수동 실행 예시

Actions 탭에서 "Run workflow"를 누르고 `prompt` 입력란에 예를 들어:

```
이번 주 편입·제외 이벤트를 중심으로 분석 섹션을 보강해서 리포트를 다시 생성해줘.
```

입력하면 해당 프롬프트로 Claude Code가 헤드리스 실행된다.
