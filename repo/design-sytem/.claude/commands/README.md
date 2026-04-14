# Claude Code 커맨드 사용법

## 사용 가능한 커맨드

| 커맨드            | 설명                               |
| ----------------- | ---------------------------------- |
| `/commit`         | 커밋 메시지 자동 생성 및 커밋      |
| `/pr`             | PR 자동 생성                       |
| `/pr-with-review` | PR 자동 생성 + AI 인라인 코드 리뷰 |

---

## 기본 워크플로우

```bash
git checkout -b feat/my-feature

# 코드 작성 후
git add .
/commit

# PR 생성 (리뷰 없이)
/pr

# PR 생성 + AI 코드 리뷰
/pr-with-review
```

---

## 커맨드 상세

### `/commit`

Staged 변경사항을 분석해 conventional commit 형식으로 자동 커밋.

```bash
git add .
/commit
# → feat(token): 디자인 토큰 시스템 구축
```

### `/pr`

현재 브랜치를 분석해 GitHub PR 자동 생성. `.github/PULL_REQUEST_TEMPLATE.md` 기반으로 본문 작성.

### `/pr-with-review`

`/pr`과 동일하게 PR을 생성하고, 완료 후 AI가 자동으로 인라인 코드 리뷰를 달아줌. 리뷰는 `DND-frontend` 봇 계정으로 P1/P2/P3 심각도와 함께 해당 줄에 직접 달림.

---

## Scope 자동 감지

```
packages/dds-token/   → token
packages/dds-desktop/ → desktop
services/admin-web/   → admin-web
services/passboard/   → passboard
```
