---
name: a11y-spec-writer
description: dds-desktop 컴포넌트의 접근성 테스트 스펙(spec.stories.tsx)을 생성한다. 컴포넌트 파일을 보여주거나 "접근성 스펙 만들어줘", "a11y 테스트 작성해줘", "spec.stories 생성해줘", "키보드 테스트 작성", "ARIA 테스트", WAI-ARIA 패턴 관련 스펙이 필요할 때 반드시 이 스킬을 사용하라.
---

# a11y-spec-writer

dds-desktop 컴포넌트의 접근성(Accessibility) 테스트 스펙 파일을 생성한다.
출력물은 Storybook의 `play` 함수를 활용한 `*.spec.stories.tsx` 파일이다.

## 레퍼런스 구조

```
references/
├── wcag-patterns.md        # 컴포넌트 유형별 테스트 체크리스트 (메인)
└── rules/                  # ARIA/키보드/폼 등 규칙 세부 설명
    ├── aria-label.md
    ├── aria-invalid.md
    ├── keyboard-focus-trap.md
    └── ...
```

- `wcag-patterns.md` — 컴포넌트 유형별 테스트 항목 목록. **항상 여기서 시작.**
- `rules/` — 특정 규칙의 세부 구현 방법이 필요할 때 필요한 파일만 읽는다.

## 스텝 1: 레퍼런스 로드

작업 시작 전 `references/wcag-patterns.md`를 읽는다.
컴포넌트 유형 파악 후 해당 섹션의 테스트 항목을 체크리스트로 활용한다.
구체적인 구현 방법이 불확실하면 `references/rules/` 에서 해당 규칙 파일을 추가로 읽는다.

## 스텝 2: 컴포넌트 파악

컴포넌트 파일을 읽고 다음을 파악한다:

1. **컴포넌트 유형** — wcag-patterns.md의 어느 섹션에 해당하는가
2. **인터랙티브 요소** — 클릭, 포커스, 키보드 이벤트를 받는 요소
3. **복합 컴포넌트 구조** — `Compound` 서브컴포넌트 (예: `Popover.Trigger`, `Textfield.Label`)
4. **상태 관련 props** — `disabled`, `error`, `readOnly`, `required`, `defaultOpen` 등
5. **렌더링 위치** — Portal 사용 여부 (Dialog, Popover content는 `document.body`에 렌더링)

## 스텝 3: 테스트 목록 결정

wcag-patterns.md의 체크리스트에서 이 컴포넌트에 해당하는 항목을 선택한다.

- 해당 없는 항목은 생략하고 이유를 마지막에 기록한다
- Radix UI 등 라이브러리가 이미 처리하는 패턴(포커스 트랩 등)도 생략 가능하다

## 스텝 4: spec.stories.tsx 작성

### 파일 구조

```tsx
import { expect, userEvent, within } from 'storybook/test'
// fn, waitFor, useState 등 필요한 것만 추가

import { ComponentName } from './ComponentName'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Primitives/ComponentName/Tests',
  component: ComponentName,
  parameters: {
    layout: 'centered' // fullscreen은 Sidebar처럼 전체 화면 필요할 때
  },
  tags: ['autodocs']
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>
```

### 작성 규칙

**Story 네이밍**: `XxxTest` 형식 (예: `TabFocusTest`, `ErrorStateTest`)

**WCAG 주석**: 각 Story 위에 적용 기준과 의도를 한 줄로 명시한다.

```tsx
// WCAG 2.4.3 Focus Order — disabled는 Tab 순서에서 제외
export const DisabledSkipsTabOrderTest: Story = { ... }

// WCAG 3.3.1 Error Identification — aria-invalid + aria-describedby로 오류 메시지 연결
export const ErrorStateTest: Story = { ... }
```

**canvasElement vs document.body**:

- 일반 렌더링 → `within(canvasElement)`
- Portal 렌더링 (Dialog, Popover content) → `within(document.body)`

**waitFor**: 비동기 DOM 변화(Portal 마운트, 애니메이션) 있을 때 사용

**픽스처 컴포넌트**: 상태가 필요한 테스트는 별도 컴포넌트로 분리

```tsx
const ComponentFixture = () => {
  const [count, setCount] = useState(0)
  return (
    <div>
      <Component
        onClick={() => setCount((p) => p + 1)}
        data-testid='target'
      />
      <span data-testid='count'>{count}</span>
    </div>
  )
}
```

**ARIA 검증 우선순위**:

1. 동작(키보드 이벤트) → 상태 변화 확인
2. ARIA 속성 검증 (`aria-invalid`, `aria-expanded`, `aria-selected` 등)
3. `getByRole`로 의미론적 역할 확인

## 스텝 5: 출력

파일명: `ComponentName.spec.stories.tsx`
위치: 컴포넌트 파일과 같은 디렉토리에 직접 생성

작성 후 요약:

- 적용한 WCAG 기준 목록 (예: 2.1.1 Keyboard, 3.3.1 Error Identification)
- 생략한 항목과 이유
