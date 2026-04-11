# changeset

코드 변경 후 changeset 파일(`.changeset/*.md`)을 작성하는 워크플로우.

## 스텝 1: diff 분석

`main` 브랜치와 현재 브랜치의 차이를 확인한다.

```bash
git diff main...HEAD --stat          # 변경된 파일 목록
git diff main...HEAD                 # 전체 diff
git diff --stat                      # 아직 커밋하지 않은 변경도 포함
git diff                             # unstaged diff
```

staged/unstaged 변경이 있으면 커밋된 diff와 함께 분석한다.

## 스텝 2: 영향받는 패키지 자동 감지

변경된 파일 경로로 패키지를 판단한다:

| 경로 패턴                 | 패키지             |
| ------------------------- | ------------------ |
| `packages/dds-token/**`   | `@dnd-lab/token`   |
| `packages/dds-desktop/**` | `@dnd-lab/desktop` |

`tools/`, 루트 설정 파일, CI 등은 changeset 대상이 아니다. 해당 변경만 있으면 사용자에게 changeset이 불필요함을 알린다.

## 스텝 3: bump 타입 추천 및 확인

diff 내용을 기반으로 bump 타입을 추천하고 사용자에게 확인받는다.

판단 기준:

- **patch**: 버그 수정, 오타, 내부 리팩토링 (API 변경 없음)
- **minor**: 새 컴포넌트, 새 prop, 새 기능 추가 (하위 호환)
- **major**: 기존 API 제거/변경, breaking change

예시:

> `/n` → `\n` 수정은 버그 수정이므로 **patch**를 추천합니다. 맞을까요?

## 스텝 4: 설명 작성

### 작성 규칙

1. 영향받는 컴포넌트/모듈 이름을 **볼드**로 먼저 쓴다
2. 사용자 관점에서 무엇이 바뀌었는지 한 줄로 설명한다 (해요체)
3. 내부 구현 디테일(함수명, 변수명, 파일명)은 쓰지 않는다
4. 헷갈리는 부분이 있으면 사용자에게 질문한다

### 좋은 예

```md
**Txt**

개행 문자(`\n`)가 올바르게 인식되지 않던 버그를 수정해요.
```

```md
**Button**

`size` prop에 `xlarge` 옵션을 추가해요.
```

### prop/API 변경이 있을 때

prop 이름, 타입, 기본값 등이 변경되면 Before/After 도표로 정리한다.

```md
**Select**

`onSelect` prop의 콜백 시그니처를 변경해요.

|            | Before                    | After                                     |
| ---------- | ------------------------- | ----------------------------------------- |
| `onSelect` | `(value: string) => void` | `(value: string, option: Option) => void` |
```

```md
**Button**

`variant` prop의 값을 정리해요.

|           | Before                     | After                    |
| --------- | -------------------------- | ------------------------ |
| `variant` | "primary", "ghost", "link" | "solid", "ghost", "text" |
| `size`    | "sm", "md"                 | "sm", "md", "lg"         |
```

### 나쁜 예

```md
`withLineBreaks` 함수에서 `/n`을 `\n`으로 변경
```

→ 내부 함수명 노출, 사용자 관점이 아님

### 설명이 애매할 때

변경의 사용자 영향이 불분명하면 반드시 질문한다:

> 이 변경으로 사용자가 체감하는 차이가 뭘까요? (예: 특정 상황에서 줄바꿈이 안 되던 문제 등)

## 스텝 5: 파일 생성

`pnpm changeset` 대신 직접 `.changeset/` 디렉토리에 md 파일을 생성한다.

파일명은 changeset 컨벤션에 맞게 랜덤한 형용사-명사 조합을 사용한다 (예: `fuzzy-moose-taste.md`).

```md
---
'@dnd-lab/desktop': patch
---

**ComponentName**

사용자 관점 설명을 해요체로 작성해요.

변경된 부분이 있으면 Before/After 도표로 정리해요.
```

## 스텝 6: changeset 파일만 커밋

생성한 changeset 파일만 stage하고 `docs: changeset` 메시지로 커밋한다.

```bash
git add .changeset/<생성한-파일>.md
git commit -m "docs: changeset"
```

## 스텝 7: 사용자 확인

작성한 changeset 내용과 커밋 결과를 보여주고 수정이 필요한지 확인한다.
