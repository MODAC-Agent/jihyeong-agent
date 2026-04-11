# CLAUDE.md

pnpm 9 + Turborepo 모노레포. DND Academy 디자인 시스템 (`@dds/*`). Node 22.21.1 (mise).

## 셋업

```bash
mise trust .mise.toml
mise install   # node 22.21.1, pnpm 9.15.9, lefthook 2.0.4
pnpm install
```

`pnpm-lock.yaml` 이 변경된 커밋을 pull/checkout 할 경우 lefthook (`post-merge` / `post-checkout`) 이 자동으로 `pnpm install` 을 실행한다.

## 루트 커맨드

```bash
pnpm dev              # 전체 dev 서버
pnpm build            # 전체 빌드
pnpm lint             # 전체 lint
pnpm format           # Prettier
pnpm check-types      # 타입 체크
pnpm build:packages   # packages/** 만 빌드
pnpm build:tools      # tools/** 만 빌드
pnpm clean            # 캐시 제거
```

## 워크스페이스

| 경로                      | 패키지                       | 설명                   |
| ------------------------- | ---------------------------- | ---------------------- |
| `packages/dds-token`      | `@dnd-lab/token`             | 디자인 토큰            |
| `packages/dds-desktop`    | `@dnd-lab/desktop`           | UI 컴포넌트 라이브러리 |
| `tools/eslint-config`     | `@dnd-lab/eslint-config`     | 공유 ESLint 설정       |
| `tools/typescript-config` | `@dnd-lab/typescript-config` | 공유 TypeScript 설정   |

각 패키지의 상세 내용은 해당 디렉토리의 `CLAUDE.md` 참고.

## 빌드 순서

`dds-token` → `dds-desktop` (Turborepo 가 강제)

## 특수 설정

**Git Hooks (Lefthook)**:

- pre-commit: lint, format, type-check (변경 파일만)
- pre-push: lint, format, type-check, build (전체)
- post-merge / post-checkout: `pnpm-lock.yaml` 이 바뀌었으면 자동 `pnpm install`

**버전 고정** (root `package.json` `pnpm.overrides`):

- `vite: 7.1.5`, `vitest: 4.0.18`, `react: ^19.2.0`

## 컨벤션

- **커밋**: Conventional Commits (`feat:`, `fix:`, `chore:`)
- **ESLint import 순서**: builtin → external → internal → parent/sibling, 그룹 간 빈 줄
