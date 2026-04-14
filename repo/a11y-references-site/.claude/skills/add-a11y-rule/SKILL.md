# add-a11y-rule

**Name:** `add-a11y-rule`
**Description:** 접근성 패턴 rule JSON을 백엔드에 추가하고 프론트엔드 패턴 파일을 생성하는 스킬. W3C URL 입력, HTML 붙여넣기, 또는 완성된 JSON 직접 붙여넣기를 모두 지원.

---

## 실행 방법

`/add-a11y-rule` 호출 시 아래 워크플로우를 따른다.

### Step 1 — 입력 방식 확인

사용자에게 세 가지 중 하나를 선택하게 한다:

**A. W3C URL 입력**

- 패턴 이름(kebab-case ID)과 W3C ARIA APG URL을 입력받는다
- WebFetch로 해당 URL을 가져온다
- Step 2로 진행

**B. HTML 붙여넣기**

- 패턴 이름과 W3C 스펙 페이지 HTML을 붙여넣게 한다
- Step 2로 진행

**C. JSON 직접 붙여넣기**

- 완성된 rule JSON을 붙여넣게 한다
- Step 3으로 바로 진행 (추출 과정 생략)

---

### Step 2 — Rule JSON 추출

아래 스키마에 맞는 JSON을 생성한다.

```json
{
  "pattern": "패턴 표시명 (예: Button)",
  "wcagLevel": "A",
  "checklist": {
    "must": [{ "id": "kebab-case-id", "title": "짧은 제목", "description": "구체적인 요구사항" }],
    "should": [{ "id": "kebab-case-id", "title": "짧은 제목", "description": "권장사항" }],
    "avoid": [{ "id": "kebab-case-id", "title": "짧은 제목", "description": "피해야 할 패턴" }]
  },
  "codeSamples": {
    "react": { "label": "React 예제", "code": "..." },
    "html": { "label": "HTML 예제", "code": "..." }
  },
  "tests": [{ "title": "테스트 제목", "steps": ["단계1", "단계2"], "tools": ["Keyboard only"] }],
  "references": ["https://www.w3.org/WAI/ARIA/apg/patterns/..."]
}
```

규칙:

- `checklist.must`: WCAG A/AA 필수 요구사항 2~4개
- `checklist.should`: 강력 권장 사항 2~4개
- `checklist.avoid`: 흔한 안티패턴 1~3개
- 모든 `id`는 `{패턴}-{설명}` 형식의 고유 kebab-case
- `references`는 페이지에서 찾은 실제 W3C/MDN URL

추출한 JSON을 사용자에게 먼저 보여주고 확인을 받는다.

---

### Step 3 — 파일 저장

#### 3-A. 백엔드 rule 파일 저장

`packages/backend/src/rules/{pattern-id}.json`에 저장.
파일이 이미 있으면 덮어씌울지 확인한다.

#### 3-B. patterns.json 레지스트리 업데이트

`packages/backend/src/rules/patterns.json`의 `patterns` 배열에 항목을 추가하거나 업데이트한다.

```json
{
  "id": "pattern-id",
  "name": "패턴 표시명",
  "description": "한 줄 설명",
  "keywords": ["keyword1", "keyword2", "..."]
}
```

`keywords`는 `pattern-classifier.ts`가 사용자 설명에서 패턴을 감지할 때 쓰인다. 사용자가 컴포넌트를 묘사할 때 쓸 법한 단어들을 3~8개 포함한다.

#### 3-C. 프론트엔드 패턴 파일 생성 ← **필수, 누락 금지**

`packages/frontend/lib/patterns/{pattern-id}.ts` 파일을 생성하고 `lib/patterns/index.ts`에 export를 추가한다.

프론트엔드 Pattern 타입은 백엔드 rule JSON과 **구조가 다르다**. 아래 매핑 규칙을 따른다:

| 프론트엔드 필드               | 출처                                        | 변환 규칙                                                               |
| ----------------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| `slug`                        | pattern-id                                  | kebab-case 그대로                                                       |
| `name`                        | `pattern` 필드                              | 그대로                                                                  |
| `description`                 | —                                           | 한국어로 한 줄 요약 작성                                                |
| `wcagCriteria`                | `wcagLevel` + checklist                     | WCAG 기준 ID 배열 (예: `['2.1.1 Keyboard', '4.1.2 Name, Role, Value']`) |
| `tags`                        | —                                           | 패턴 특성에 맞는 태그 (예: `['form', 'interactive']`)                   |
| `baseline.checklist.must[]`   | `checklist.must[]`                          | 각 아이템에 `level: 'must'` 필드 추가                                   |
| `baseline.checklist.should[]` | `checklist.should[]`                        | 각 아이템에 `level: 'should'` 필드 추가                                 |
| `baseline.checklist.avoid[]`  | `checklist.avoid[]`                         | 각 아이템에 `level: 'avoid'` 필드 추가                                  |
| `baseline.codeSample`         | `codeSamples.react` 또는 `codeSamples.html` | 첫 번째 코드 샘플 사용, `language`/`label`/`code` 구조                  |

`designSystems` 항목은 **Step 3-E에서 `ds-code-writer` 에이전트가 작성**한다. 3-C에서는 `designSystems: {}` 빈 객체만 두거나 생략한다.

**체크리스트 아이템 description은 한국어로 작성한다.**

패턴을 추가한 후 `packages/frontend/lib/pattern-icons.tsx`의 `ICON_MAP`에도 해당 slug의 아이콘을 추가한다 (lucide-react 아이콘 사용).

#### 3-D. 타입 체크

```bash
pnpm --filter @a11y/frontend type-check
```

오류가 있으면 수정한다.

#### 3-E. designSystems 코드 샘플 + 번역 + QA → `register-design-system` 스킬

**Spec-Harvester 크롤링 데이터가 있으면 `/register-design-system`에 위임한다.**
이 스킬이 ds-code-writer → i18n-translator → frontend-qa를 순서대로 처리한다.

```
/register-design-system [ds-id] [spec-harvester-path]
예: /register-design-system baseui /Users/.../storage/raw/2026-03-26/base-ui.com
```

크롤링 데이터가 없으면 `ds-code-writer` 에이전트에 직접 위임한다.

---

### Step 4 — 완료 체크리스트

```
완료 체크리스트
─────────────────────────────────────────────────────
 □ 3-A  백엔드 rule JSON 저장
        packages/backend/src/rules/{id}.json
 □ 3-B  patterns.json 레지스트리 등록
        packages/backend/src/rules/patterns.json
 □ 3-C  프론트엔드 패턴 파일 생성
        packages/frontend/lib/patterns/{id}.ts
        packages/frontend/lib/patterns/index.ts (export 추가)
 □ ICON  아이콘 등록
        packages/frontend/lib/pattern-icons.tsx ICON_MAP
 □ 3-D  type-check 통과
 □ 3-E  designSystems + 번역 + QA
        [크롤링 있음 → /register-design-system]
        [크롤링 없음 → ds-code-writer 에이전트]
─────────────────────────────────────────────────────
```

누락 항목은 해당 스킬/에이전트에 재위임하여 처리한다.
모든 항목이 완료되면 저장된 파일 경로와 추가된 keywords를 요약해서 알려준다.
