---
name: changeset
description: dnd-design-system 모노레포에서 changeset 파일(.changeset/*.md)을 작성한다. "changeset 만들어줘", "changeset 작성해줘", "변경사항 정리해줘", "버전업 노트 작성", "릴리즈 노트 초안", "패키지 변경 정리" 같은 요청이나 packages/token, packages/desktop 변경 후 CHANGELOG/슬랙 공지용 본문이 필요할 때 반드시 이 스킬을 사용하라. 변경 유형(🎨 토큰 / ✨ 새 컴포넌트 / 🔧 API 변경 / 🐛 버그 수정) 카탈로그에 맞춰 사용자 관점·해요체 본문을 작성한다.
---

# changeset

`.changeset/*.md` 파일을 작성하는 워크플로우. 작성된 본문은 그대로 CHANGELOG 와 GitHub Release 노트로 노출되고 팀 공지의 1차 초안이 되므로, 디자이너 등 비개발자가 읽어도 자연스러운 톤을 유지한다.

> **사용자 확인은 항상 `AskUserQuestion` 도구를 사용한다.** 자유 텍스트 질문 대신 옵션을 제시하면 비개발자도 빠르게 응답할 수 있고, 본문이 더 정확하게 다듬어진다. 자유 입력이 필요한 경우 도구가 자동으로 제공하는 "Other" 폴백을 활용한다.

## 스텝 1: diff 분석

base 브랜치(기본 `main`)와 현재 브랜치의 차이를 본다. 아직 커밋하지 않은 변경이 있으면 함께 본다.

```bash
git diff <base>...HEAD --stat   # 브랜치 전체 변경 (default base = main)
git diff --stat                 # staged/unstaged 까지 포함
```

## 스텝 2: 영향받는 패키지 자동 감지

변경된 파일 경로로 패키지를 판단한다.

| 경로 패턴             | 패키지             |
| --------------------- | ------------------ |
| `packages/token/**`   | `@dnd-lab/token`   |
| `packages/desktop/**` | `@dnd-lab/desktop` |

`tools/`, 루트 설정, CI 변경만 있다면 changeset 대상이 아니다. 이때는 changeset 이 불필요함을 사용자에게 알린다.

## 스텝 3: bump 타입 추천 및 확인

diff 내용을 기반으로 타입을 추천하고, **`AskUserQuestion`** 으로 확정한다.

| 타입      | 기준                                                       |
| --------- | ---------------------------------------------------------- |
| **patch** | 버그 수정, 오타, 내부 리팩토링 (사용자 노출 API 변경 없음) |
| **minor** | 새 컴포넌트, 새 prop, 새 기능 추가 (하위 호환)             |
| **major** | 기존 API 제거·변경, breaking change                        |

질문 형식:

- `question`: "이번 changeset 의 bump 타입은 어떤 게 맞을까요?"
- `header`: "bump 타입"
- `multiSelect`: false
- `options`:
  - `patch — 버그 수정·내부 리팩토링`
  - `minor — 새 컴포넌트·새 prop 추가 (하위 호환)`
  - `major — 기존 API 제거·변경 (Breaking)`

diff 분석 결과 가장 가능성이 높은 옵션을 첫 번째에 두고 라벨 끝에 `(Recommended)` 표기.

## 스텝 4: 변경 유형 판별 후 본문 작성

4-1 공통 원칙을 지키며 4-2 에서 유형을 판별하고 4-3 의 미니 템플릿으로 본문을 채운다.

### 4-1. 공통 작성 원칙

- 첫 줄은 영향받는 컴포넌트·패키지 이름을 **볼드** 로 (`**Button**` 또는 `**@dnd-lab/token**`)
- 한 줄 요약은 사용자 관점·해요체 — 무엇이 달라지는지만 적는다
- 내부 함수명·파일명·변수명은 본문에 노출하지 않는다
- 토큰명·prop명·코드는 백틱으로 감싼다
- 팀 채널에 그대로 붙여넣어도 어색하지 않은 문장으로 다듬는다

### 4-2. 변경 유형 판별

diff 시그널로 후보 유형을 좁힌 뒤, **`AskUserQuestion`** 으로 확정한다. 복합 변경에 대비해 `multiSelect: true` 로 묻는다.

| diff 시그널                                          | 유형           |
| ---------------------------------------------------- | -------------- |
| `packages/token/**` 의 토큰 값/키 변경               | 🎨 토큰 변경   |
| `packages/desktop/src/<NewComponent>/` 신규 디렉토리 | ✨ 새 컴포넌트 |
| 기존 컴포넌트의 props·variant·타입 시그니처 변경     | 🔧 API 변경    |
| 동작·조건문·이벤트·파싱 로직 수정                    | 🐛 버그 수정   |

질문 형식:

- `question`: "이번 변경에 해당하는 유형은 무엇인가요? (복수 선택 가능)"
- `header`: "변경 유형"
- `multiSelect`: true
- `options`:
  - `🎨 토큰 변경 — 토큰 값/키가 바뀌었어요`
  - `✨ 새 컴포넌트 — 새 컴포넌트가 추가됐어요`
  - `🔧 API 변경 — props/variant/타입을 바꿨어요`
  - `🐛 버그 수정 — 동작이 잘못되던 걸 고쳤어요`

diff 시그널과 일치하는 후보를 첫 번째 위치에 두고 라벨 끝에 `(Recommended)` 표기.

복수 선택되면 한 changeset 안에 카드 두 개를 이어 쓴다.

### 4-3. 유형별 미니 템플릿

각 카드의 자리표시자(`<...>`)만 실제 값으로 바꿔 본문에 그대로 넣는다.

#### 🎨 토큰 변경 — `@dnd-lab/token`

**스켈레톤**

```md
**@dnd-lab/token**

<한 줄 요약·해요체>

| 토큰                         | Before    | After     |
| ---------------------------- | --------- | --------- |
| `color.semantic.primary.500` | `#3B82F6` | `#2563EB` |

영향: <Button, Badge 등 한 줄로>
```

**좋은 예**

```md
**@dnd-lab/token**

`color.semantic.primary.500` 의 명도를 한 단계 낮춰요. 더 명확한 인터랙션 피드백을 주려고요.

| 토큰                         | Before    | After     |
| ---------------------------- | --------- | --------- |
| `color.semantic.primary.500` | `#3B82F6` | `#2563EB` |

영향: Button, Link, Badge 의 기본 색상이 살짝 진해져요.
```

#### ✨ 새 컴포넌트 — `@dnd-lab/desktop`

**스켈레톤**

```md
**<ComponentName>**

<용도 한 줄>

- 주요 props: `<prop1>`, `<prop2>`
- Storybook: `Components/<ComponentName>`
```

**좋은 예**

```md
**Toast**

화면 하단에 일시적으로 노출되는 알림 메시지 컴포넌트를 추가했어요.

- 주요 props: `variant`, `duration`, `onClose`
- Storybook: `Components/Toast`
```

#### 🔧 API 변경 — `@dnd-lab/desktop`

diff 만으로 Breaking 여부가 모호하면 **`AskUserQuestion`** 으로 확인한다.

- `question`: "이 변경이 기존 사용자 코드를 깨뜨릴 수 있나요?"
- `header`: "Breaking 여부"
- `multiSelect`: false
- `options`:
  - `예 — Breaking. major 로 올리고 ⚠️ 마커 + 마이그레이션 코드 추가`
  - `아니오 — 하위 호환. minor 유지`

Breaking 으로 확정되면 컴포넌트명 옆에 `⚠️ Breaking` 마커를 붙이고 Before/After 코드 블록을 덧붙인다.

**스켈레톤**

```md
**<ComponentName>**

<한 줄 요약·해요체 + 변경 사유>

|              | Before  | After   |
| ------------ | ------- | ------- |
| `<propName>` | `<...>` | `<...>` |

마이그레이션: <대체 props/값 한 줄>
```

**좋은 예 (minor, 추가)**

```md
**Button**

`size` prop 에 `xlarge` 옵션을 추가해요.

|        | Before         | After                      |
| ------ | -------------- | -------------------------- |
| `size` | `"sm"`, `"md"` | `"sm"`, `"md"`, `"xlarge"` |
```

**좋은 예 (major, Breaking)**

````md
**Button** ⚠️ Breaking

`variant` prop 의 값을 더 명확하게 정리해요.

|           | Before                           | After                          |
| --------- | -------------------------------- | ------------------------------ |
| `variant` | `"primary"`, `"ghost"`, `"link"` | `"solid"`, `"ghost"`, `"text"` |

마이그레이션: `variant="primary"` → `variant="solid"`, `variant="link"` → `variant="text"` 로 교체해주세요.

```tsx
// Before
<Button variant="primary" />

// After
<Button variant="solid" />
```
````

#### 🐛 버그 수정 — `@dnd-lab/desktop` 또는 `@dnd-lab/token`

**스켈레톤**

```md
**<ComponentName>**

<증상 한 줄·사용자가 무엇을 겪었는가>

영향: <어떤 상황에서 발생했는지>
```

**좋은 예**

```md
**Txt**

개행 문자(`\n`) 가 올바르게 인식되지 않던 문제를 고쳤어요.

영향: 줄바꿈이 포함된 텍스트가 한 줄로 표시되던 상황.
```

### 4-4. 나쁜 예

```md
`withLineBreaks` 함수에서 `/n` 을 `\n` 으로 변경
```

→ 내부 함수명이 노출되고 사용자 관점이 빠졌다. 4-3 카드를 따라 다시 적는다.

### 4-5. 설명이 애매할 때

변경이 사용자에게 어떤 차이를 만드는지 불분명하면 추측하지 말고 **`AskUserQuestion`** 으로 묻는다. diff 에서 추정 가능한 후보를 옵션으로 제시하고, 자유 입력은 도구가 자동 제공하는 "Other" 폴백을 활용한다.

질문 형식:

- `question`: "이 변경으로 사용자가 체감하는 차이는 무엇인가요?"
- `header`: "사용자 영향"
- `multiSelect`: false
- `options`: diff 에서 짐작 가능한 후보 2~3개. 예시:
  - `특정 상황에서 줄바꿈이 안 되던 문제 해결`
  - `빈 값 처리 시 에러가 나던 문제 해결`

## 스텝 5: 파일 생성

`pnpm changeset` 대신 `.changeset/` 에 md 파일을 직접 만든다. 파일명은 changeset 컨벤션의 랜덤 형용사-명사 조합 (예: `fuzzy-moose-taste.md`).

스텝 4 에서 만든 카드 본문을 frontmatter 아래에 그대로 넣는다. 복합 변경이면 카드 두 개를 빈 줄로 구분해 이어 쓰되 한 파일로 둔다.

```md
---
'@dnd-lab/desktop': patch
---

<스텝 4 의 카드 본문>
```

## 스텝 6: changeset 파일만 커밋

생성한 changeset 파일만 stage 하고 `docs: changeset` 메시지로 커밋한다.

```bash
git add .changeset/<생성한-파일>.md
git commit -m "docs: changeset"
```

## 스텝 7: 사용자 확인

작성한 changeset 본문과 커밋 결과를 보여준 뒤, **`AskUserQuestion`** 으로 다음 행동을 묻는다.

질문 형식:

- `question`: "이 changeset 으로 진행할까요?"
- `header`: "최종 확인"
- `multiSelect`: false
- `options`:
  - `좋아요, 그대로 두기`
  - `한 줄 요약 문장만 다시 다듬기`
  - `다른 변경 유형 카드로 바꾸기`

세부적인 수정 요청은 "Other" 자유 입력으로 받는다.
