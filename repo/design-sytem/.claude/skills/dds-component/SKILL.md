---
name: dds-component
description: dds-desktop 디자인 시스템에 새 컴포넌트를 추가한다. "컴포넌트 만들어줘", "새 컴포넌트 추가", "dds-desktop에 추가", "프리미티브 만들어줘" 같은 요청이나 dds-desktop 패키지에서 컴포넌트 파일을 새로 생성할 때 반드시 이 스킬을 사용하라. 컴포넌트 구현 후 a11y-spec-writer 스킬로 접근성 스펙까지 자동 생성한다.
---

# dds-component

dds-desktop 패키지에 새 컴포넌트를 추가하는 전체 워크플로우.
구현 완료 후 `a11y-spec-writer` 스킬로 접근성 스펙을 자동 생성한다.

## 스텝 1: 요구사항 파악

컴포넌트 이름과 다음을 확인한다:

- 어떤 HTML 요소 기반인가 (button, div, input 등)
- variant/size 같은 스타일 변형이 있는가
- 서브컴포넌트가 필요한가 (Icon, Label 등 compound 패턴)
- 상태 props가 있는가 (disabled, error, selected 등)

## 스텝 2: 파일 생성

`src/primitives/{componentName}/` 디렉토리에 다음 파일을 생성한다:

```
{ComponentName}/
├── {ComponentName}.tsx       # 메인 컴포넌트
├── style.css.ts              # Vanilla Extract 스타일
├── context.tsx               # Context Provider (상태 공유가 필요한 경우)
├── type.ts                   # 타입 정의
├── index.tsx                 # re-export
├── compound/                 # 서브컴포넌트 (필요한 경우)
│   ├── {SubComponent}.tsx
│   └── index.tsx
└── {ComponentName}.stories.tsx  # Storybook 문서
```

## 스텝 3: 컴포넌트 구현 규칙

### 메인 컴포넌트 (`{ComponentName}.tsx`)

```tsx
import { forwardRefWithAs } from '../../utils/forwardRefWithAs'
import { cx } from '../../utils/cx'
import { ComponentNameContextProvider } from './context'
import { componentCss } from './style.css'
import { ComponentNameProps } from './type'

export interface ComponentNameProps extends HTMLAttributes<HTMLElement> {
  // props 정의
}

const ComponentNameImpl = forwardRefWithAs<'div', ComponentNameProps>((props, ref) => {
  const { classNameFromProps, ...restProps } = props

  return (
    <ComponentNameContextProvider>
      <div
        ref={ref}
        className={cx(componentCss(), classNameFromProps)}
        {...restProps}
      />
    </ComponentNameContextProvider>
  )
})

ComponentNameImpl.displayName = 'ComponentName'

export const ComponentName = Object.assign(ComponentNameImpl, {
  // SubComponent: SubComponent (compound 패턴)
})
```

**필수 규칙**:

- `forwardRefWithAs`로 ref 지원 (polymorphic이 필요 없어도 적용)
- Props 출처를 변수명에 명시: `classNameFromProps`, `sizeFromCtx`
- `...restProps` 전달 필수
- `className`과 `style`은 동일한 DOM 요소에 적용
- 컴포넌트와 Props 타입 모두 export
- Arrow function 사용

### 스타일 (`style.css.ts`)

```ts
import { recipe } from '@vanilla-extract/recipes'
import { primitive, semantic } from '@dnd-lab/token'

export const componentCss = recipe({
  base: {
    // 기본 스타일
  },
  variants: {
    size: {
      small: {},
      medium: {}
    },
    variant: {
      primary: {},
      secondary: {}
    }
  },
  defaultVariants: {
    size: 'medium'
  }
})
```

토큰은 반드시 `@dnd-lab/token`에서 import: `primitive.color.*`, `semantic.color.*`

### Context (`context.tsx`)

서브컴포넌트에 상태를 전달해야 할 때만 생성:

```tsx
import { createCtxProvider } from '../../utils/createCtxProvider'

interface ComponentNameContext {
  variant: string
  disabled: boolean
}

export const [ComponentNameContextProvider, useComponentNameContext] = createCtxProvider<ComponentNameContext>('ComponentName')
```

### index.tsx

```tsx
export { ComponentName } from './ComponentName'
export type { ComponentNameProps } from './ComponentName'
```

### Storybook (`{ComponentName}.stories.tsx`)

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ComponentName } from './ComponentName'

const meta = {
  title: 'Primitives/ComponentName',
  component: ComponentName,
  parameters: { layout: 'centered' },
  tags: ['autodocs']
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => <div style={{ display: 'flex', gap: 8 }}>{/* variant별 예시 */}</div>
}
```

## 스텝 4: src/primitives/index.tsx에 export 추가

```tsx
export * from './{componentName}'
```

## 스텝 5: 접근성 스펙 생성

컴포넌트 구현이 완료되면 **반드시** `a11y-spec-writer` 스킬을 호출하여
`{ComponentName}.spec.stories.tsx`를 생성한다.

```
a11y-spec-writer 스킬 호출 → WCAG 패턴 분석 → spec.stories.tsx 생성
```

## 스텝 6: 완료 체크리스트

- [ ] `forwardRefWithAs`로 ref 지원
- [ ] Props 출처 명시 (`FromProps`, `FromCtx`)
- [ ] `...restProps` 전달
- [ ] `className`, `style` 동일 DOM 요소
- [ ] 컴포넌트 + Props 타입 export
- [ ] `src/primitives/index.tsx`에 export 추가
- [ ] `.stories.tsx` 생성
- [ ] `.spec.stories.tsx` 생성 (a11y-spec-writer 스킬)
