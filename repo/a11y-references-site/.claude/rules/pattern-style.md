---
path:
  - packages/frontend/lib/patterns/*.ts
---

## 패턴 코드 샘플 작성 스타일 가이드

이 문서는 패턴 코드 샘플 작성의 Source of Truth입니다.

이 가이드는 `packages/frontend/lib/patterns/*.ts`에서 **Sandpack용 코드 샘플**을 작성할 때 적용됩니다.
특히 `baseline.codeSample.code` 및 `designSystems.*.codeSample.code` 안의 `code` 문자열(템플릿 리터럴)을 의미합니다.

핵심 목표는 다음 둘입니다.

1. 샘플을 읽는 사람이 접근성 패턴 로직을 빠르게 이해할 수 있게 하기
2. `.claude/hooks/validate-code-samples.js`가 “미리보기 검증 실패”를 내지 않게 하기

---

## Sandpack 코드 샘플 스타일 규칙 (읽기/유지보수)

## 패턴 파일의 기본 구조(기존 코드 샘플 기준)

기존 패턴 파일(`packages/frontend/lib/patterns/*.ts`)은 대체로 아래 형태를 따릅니다.

- `export const <slug>Pattern: Pattern = { ... }`
- `baseline: { checklist: { must/should/avoid }, codeSample: { language, label, code } }`
- `designSystems: { <designSystemKey>: { id, name, color, additionalChecks: [...], codeSample: { language, label, code }, notes } }`
- 위의 모든 `codeSample.code`는 Sandpack에서 실행되는 “실제 코드”이므로, 아래 스타일/검증 규칙을 그대로 적용해야 합니다.

1. 인라인 스타일 금지
   - `style={{...}}`(인라인 스타일 객체) 사용을 금지합니다.
   - 대신 `className` + `./index.css`(Sandpack 미리보기에서 제공되는 기본 스타일)를 사용하세요.

2. `./index.css`를 통한 의미론적 클래스 사용
   - 코드 샘플 최상단에 `import './index.css'`를 두고,
   - `SandpackPreview.tsx`의 `indexCss`에 있는 클래스 네이밍을 재사용합니다.
   - 예: `.app`, `.stack`, `.row`, `.center`, `.btn`, `.btn-primary`, `.btn-ghost`, `.dialog`, `.dialog-title`, `.overlay`, `.hint`, `.error`, `.sr-only` 등
   - 만약 필요한 클래스가 없다면, 우선 `SandpackPreview.tsx`의 `indexCss`에 추가한 뒤 코드 샘플에서 사용하세요.

---

## Sandpack 코드 샘플 검증 로직 (반드시 통과)

`code` 문자열은 `.claude/hooks/validate-code-samples.js`에 의해 여러 규칙으로 검사됩니다.
아래 규칙을 지키면 “⚠️ 코드 샘플 미리보기 검증 실패”를 피할 수 있습니다.

### 0. DS 미등록 import 금지 (미리보기 의존성)

코드 샘플에서 `import ... from '...'`로 가져오는 패키지 중,

- 상대경로(`.` 또는 `/`로 시작)
- shadcn 로컬 경로(`@/components/ui`로 시작)
  을 제외한 나머지가
  `SandpackPreview.tsx`의 `DS_DEPS`/`.claude/hooks/validate-code-samples.js`의 `KNOWN_DEPS`에 등록되어 있어야 합니다.

신규 디자인 시스템/라이브러리를 code sample에 추가하면 반드시 아래 2곳을 동기화하세요.

1. `packages/frontend/components/SandpackPreview.tsx` → `DS_DEPS`
2. `.claude/hooks/validate-code-samples.js` → `KNOWN_DEPS` Set

### 1. props 기반 함수 시그니처 주의 (자동 전달 미스)

코드 샘플에 아래 형태가 있으면:

- `function Something({ ... }) { ... }`

검증기는 destructuring된 `props` 항목 중 일부가 “자동 전달 가능한 이름들” 목록에 없으면 경고를 냅니다.
해결 방법:

- destructuring으로 받는 props 이름을 제한하거나
- 핸들러/상태 값은 함수 내부에서 `useState`/`const handler = ...`로 직접 선언하세요.

추가로, `onClick`/`onChange` 같은 JSX 핸들러를 destructuring으로 “넘겨받는 것” 대신
함수 내부에서 선언하는 쪽이 가장 안전합니다.

### 2. `useRef([])` / `useRef(null)` 제네릭 타입 필수

다음 패턴은 검증기에서 타입스크립트 오류 가능성으로 잡힙니다.

- `useRef([])`
- `useRef(null)`

반드시 예시처럼 제네릭을 포함하세요.

```ts
const triggerRef = useRef<HTMLButtonElement>(null)
```

### 3. JSX에서 참조하는 핸들러 변수 선언 누락 금지

예를 들어 다음과 같은 경우:

- `onClick={handleSave}`

검증기는 `handleSave`가 코드 내에서 `const/let/function`으로 선언되어 있는지 검사합니다.
핸들러를 JSX에 쓰기 전에 반드시 함수/변수를 선언하세요.

### 4. `useState` 중복 선언 금지

동일한 state 이름이 중복 선언되면 검증기가 경고합니다.
`const [x, setX] = useState(...)` 형태를 샘플 내에서 중복으로 만들지 마세요.

### 5. “bare JSX” 방지 (반드시 named function 감싸기)

코드 샘플이 JSX만 덩그러니 있는 형태(=named function이 없는 형태)면,
검증기가 undeclared 변수 사용을 감지하기 어렵습니다.

따라서 아래처럼 JSX가 렌더되는 named function을 포함하세요.

- `export default function App() { return ( ... ) }`
- `export function ...() { ... }`
- `function ...() { return ( ... ) }`

### 6. `export default function App`에서 react hook import 누락 금지

`export default function App()` 형태이고 코드 내부에서 `useState/useRef/useEffect/...`를 쓰는데,
`import { useState, ... } from 'react'`가 없다면 경고합니다.

hook 사용 전 import를 최상단에 추가하세요.

### 7. import는 코드 샘플 최상단에만

검증기는 JSX/코드 뒤에 `import`가 오는 형태를 문제로 봅니다.

- 모든 `import ...`는 `code` 문자열의 최상단(주석/빈 줄 제외)으로 이동시키세요.

---

## 빠른 템플릿 (권장)

```tsx
import './index.css'
import { useState } from 'react'

export default function App() {
  const [open, setOpen] = useState(false)

  return (
    <div className='app'>
      <button
        className='btn btn-primary'
        onClick={() => setOpen(true)}>
        Open Modal
      </button>
      {open ? <div className='dialog'>...</div> : null}
    </div>
  )
}
```
