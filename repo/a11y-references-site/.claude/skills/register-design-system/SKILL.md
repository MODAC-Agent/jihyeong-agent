# register-design-system

**Name:** `register-design-system`
**Description:** Spec-Harvester로 크롤한 디자인 시스템 문서를 읽어 프론트엔드 패턴 파일에 코드 샘플을 자동 작성하는 스킬. ds-code-writer, i18n-translator, frontend-qa 에이전트를 순서대로 호출하는 오케스트레이터.

---

## 실행 방법

`/register-design-system [ds-id] [spec-harvester-path]` 형태로 호출하거나,
인자 없이 호출 시 Step 1에서 대화형으로 입력받는다.

---

### Step 1 — 입력 수집

사용자에게 다음을 입력받는다 (인자로 제공된 경우 생략):

| 항목                   | 예시                                            |
| ---------------------- | ----------------------------------------------- |
| DS ID (kebab-case)     | `baseui`                                        |
| DS 표시명              | `Base UI`                                       |
| 브랜드 컬러 HEX        | `#18181b`                                       |
| npm 패키지명           | `@base-ui/react`                                |
| npm 버전               | `1.0.0`                                         |
| Spec-Harvester MD 경로 | `/Users/.../storage/raw/2026-03-26/base-ui.com` |

---

### Step 2 — ds-code-writer 에이전트 호출

**핵심 작업 전체를 `ds-code-writer` 에이전트에 위임한다.**

```
Agent: ds-code-writer
작업: 신규 DS 추가
  - DS ID: {ds-id}
  - 표시명: {name}
  - 컬러: {color}
  - npm 패키지: {package}@{version}
  - MD 경로: {spec-harvester-path}

처리 대상:
  1. types.ts — DesignSystemId, DS_META, DS_ORDER 업데이트
  2. SandpackPreview.tsx — DS_DEPS 등록
  3. validate-code-samples.js — KNOWN_DEPS 등록
  4. 각 패턴 파일 designSystems에 코드 샘플 추가
     (MD 파일 읽어 실제 API 기반으로 작성)
```

에이전트 완료 후 처리된 패턴 목록을 확인한다.

---

### Step 3 — i18n-translator 에이전트 호출

**번역을 `i18n-translator` 에이전트에 위임한다.**

```
Agent: i18n-translator
작업: ds-code-writer가 방금 추가한 {ds-id} 디자인 시스템의
      additionalChecks와 notes를
      translations.en.ts 각 패턴 designSystems 섹션에 영문으로 추가해줘.
```

---

### Step 4 — 타입 체크

```bash
pnpm --filter @a11y/frontend type-check
```

오류가 있으면 수정 후 진행한다.

---

### Step 5 — frontend-qa 에이전트 호출

**코드 품질 검사를 `frontend-qa` 에이전트에 위임한다.**

```
Agent: frontend-qa
작업: ds-code-writer가 방금 수정한 패턴 파일들
      (packages/frontend/lib/patterns/*.ts) QA 해줘.
      특히 {ds-id} designSystems 항목의 코드 샘플에서
      import 누락, 미선언 변수, export default function App 포맷 여부 확인.
```

---

### Step 6 — 완료 체크리스트

```
완료 체크리스트
─────────────────────────────────────────────────────
 □ types.ts    DesignSystemId, DS_META, DS_ORDER
               [→ ds-code-writer]
 □ Sandpack    SandpackPreview.tsx DS_DEPS
               [→ ds-code-writer]
 □ Hook        validate-code-samples.js KNOWN_DEPS
               [→ ds-code-writer]
 □ Patterns    패턴 파일 {n}개 designSystems.{ds-id}
               [→ ds-code-writer]
 □ i18n        translations.en.ts 영문 번역
               [→ i18n-translator]
 □ TYPE        type-check 통과
 □ QA          코드 품질 검사
               [→ frontend-qa]
─────────────────────────────────────────────────────
```

누락 항목은 해당 에이전트에 재위임하여 처리한다.
처리된 패턴 목록과 건너뛴 패턴(크롤 파일 없음)을 요약 출력한다.
