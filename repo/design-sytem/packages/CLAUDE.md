# dds-desktop

DND Academy 디자인 시스템 컴포넌트 라이브러리. Vanilla Extract 기반의 타입 안전한 UI 프리미티브를 제공한다.

## 개발 커맨드

```bash
pnpm storybook          # Storybook 개발 서버 (포트 6006)
pnpm build-storybook    # Storybook 빌드
pnpm generate:component # 새 컴포넌트 스캐폴드 생성
pnpm build              # 라이브러리 빌드
pnpm check-types        # 타입 체크
pnpm lint               # ESLint
```

## 컴포넌트 구조

```
src/primitives/
└── button/
    ├── Button.tsx           # 메인 컴포넌트
    ├── style.css.ts         # Vanilla Extract 스타일
    ├── context.tsx          # Context Provider
    ├── type.ts              # 타입 정의
    ├── compound/            # 서브컴포넌트 (Button.Icon 등)
    ├── Button.stories.tsx   # Storybook 문서
    └── Button.spec.stories.tsx  # 접근성/인터랙션 테스트
```

## 컴포넌트 작성 규칙

전체 규칙은 `docs/COMPONENT_GUIDELINES.md` 참고. 핵심만 요약:

**1. ref 지원** — `forwardRefWithAs` 사용 필수

```tsx
import { forwardRefWithAs } from '../../utils/forwardRefWithAs'

export const Component = forwardRefWithAs<ElementType, ComponentProps>((props, ref) => {
  // ...
})
```

**2. Props 네이밍** — 출처 명시

```tsx
const { sizeFromProps, classNameFromProps, ...restProps } = props
const sizeFromCtx = useContext(SomeContext)
```

**3. restProps 전달** — `...restProps`로 유연성 확보

**4. className/style 동일 DOM 요소에 적용**

```tsx
<element
  className={cx(baseStyles, classNameFromProps)}
  style={styleFromProps}
  {...restProps}
/>
```

**5. 타입 export** — 컴포넌트와 Props 타입 모두 export

**6. Compound 패턴** — 서브컴포넌트는 `Object.assign`으로 조립

```tsx
export const Button = Object.assign(ButtonImpl, { Icon: ButtonIcon })
```

## 스타일링

Vanilla Extract recipes로 variant 기반 스타일 작성:

```ts
// style.css.ts
import { recipe } from '@vanilla-extract/recipes'
import { primitive, semantic } from '@dnd-lab/token'

export const buttonCss = recipe({
  base: { ... },
  variants: {
    size: { small: {...}, medium: {...} },
    variant: { primary: {...}, secondary: {...} }
  }
})
```

토큰은 `@dnd-lab/token`에서 import: `primitive.color.blue500`, `semantic.color.labelTitle` 등

## 테스트

`.spec.stories.tsx` 파일에 Storybook play 함수로 작성. 두 종류를 구분:

- `*.stories.tsx` — 문서/시각적 확인용
- `*.spec.stories.tsx` — 인터랙션/접근성 자동화 테스트

**접근성 스펙 작성 시** `/a11y-spec-writer` 스킬 사용. WCAG 기준에 따라 `spec.stories.tsx`를 자동 생성한다.

테스트 실행:

```bash
pnpm storybook          # 브라우저에서 play 함수 실행
pnpm test-storybook     # headless 실행
```

## Claude Code 스킬

이 패키지에서 유용한 스킬 두 가지가 `.claude/skills/`에 등록되어 있다.

| 스킬                | 용도                                 | 사용 시점                        |
| ------------------- | ------------------------------------ | -------------------------------- |
| `/dds-component`    | 컴포넌트 전체 생성 (구현 + spec)     | 새 컴포넌트 추가할 때            |
| `/a11y-spec-writer` | 접근성 스펙(`spec.stories.tsx`) 생성 | 기존 컴포넌트에 테스트 추가할 때 |

**`/dds-component`**: 파일 구조, 구현 규칙, index export, spec 생성까지 전체 워크플로우를 가이드한다.

**`/a11y-spec-writer`**: 컴포넌트 코드를 읽고 WCAG 기준에 맞는 `spec.stories.tsx`를 자동 생성한다. ARIA, 키보드, 폼 접근성 규칙 레퍼런스(`references/rules/`)도 포함되어 있다.

## 유틸리티

| 유틸                      | 용도                    |
| ------------------------- | ----------------------- |
| `utils/forwardRefWithAs`  | polymorphic ref 지원    |
| `utils/cx`                | className 합성          |
| `utils/createCtxProvider` | Context + Provider 생성 |
| `utils/composeHandler`    | 이벤트 핸들러 합성      |
