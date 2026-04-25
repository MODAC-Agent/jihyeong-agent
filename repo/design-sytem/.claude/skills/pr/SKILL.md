---
name: pr
description: dnd-design-system 모노레포에서 현재 브랜치 변경사항을 분석해 GitHub Pull Request 를 자동 생성한다. "PR 만들어줘", "PR 생성", "풀 리퀘스트 작성", "pull request 만들어", "main 으로 PR 올려줘" 같은 요청이나 작업 완료 후 PR 이 필요할 때 반드시 이 스킬을 사용하라. .github/PULL_REQUEST_TEMPLATE.md 의 섹션 구조(📝 변경사항 / 🔗 관련 링크)를 정확히 따르며 conventional commit 형식의 한국어 제목을 생성한다. AI 코드 리뷰까지 자동으로 받고 싶다면 pr-with-review 스킬을 사용하라.
---

# pr

현재 브랜치를 분석해 GitHub PR 을 자동 생성한다. 제목은 conventional commit 형식, 본문은 `.github/PULL_REQUEST_TEMPLATE.md` 의 섹션 구조를 그대로 따른다.

## 스텝 1: PR 템플릿 읽기 (필수)

```bash
cat .github/PULL_REQUEST_TEMPLATE.md
```

이 템플릿이 PR 본문 구조를 정한다. 섹션 제목·이모지·주석(`<!-- -->`) 모두 그대로 보존한다.

## 스텝 2: 브랜치 변경 분석

```bash
git diff main...HEAD --stat
git diff main...HEAD --name-only
git log main..HEAD --oneline
```

워크스페이스 감지 규칙은 `commit` 스킬과 동일하다 (`packages/token` → `token`, `packages/desktop` → `desktop`, `tools/*` → `tools`).

## 스텝 3: 제목 생성

`<type>(<scope>): <한국어 설명>`. type / scope 규칙은 `commit` 스킬과 동일.

좋은 예:

- `feat(token,desktop): 토큰 시스템 재설계 및 CSS 자동 주입`
- `fix(desktop): Toast 닫기 애니메이션 끊김 수정`
- `refactor(desktop): lucide-react 를 peerDependencies 로 이동`
- `chore: release packages`

## 스텝 4: 본문 생성

`.github/PULL_REQUEST_TEMPLATE.md` 의 구조를 정확히 따른다.

```md
## 📝 변경사항

### 주요 변경 내용

- <git diff·commit log 기반 실제 변경 요약 1>
- <변경 요약 2>

## 🔗 관련 링크

-

<!-- ### 테스트 결과 -->

<!-- ### 의존성 변경 -->
```

규칙:

- `## 📝 변경사항` / `### 주요 변경 내용` / `## 🔗 관련 링크` 섹션 제목 정확히 일치
- 주석 처리된 추가 섹션(`<!-- ### ... -->`)은 삭제하지 말고 그대로 유지
- 사용자 관점에서 무엇이 달라지는지를 적는다 — 내부 함수명·파일명 노출 금지

## 스텝 5: 푸시 후 PR 생성

리모트에 푸시되어 있지 않으면 먼저 푸시한다.

```bash
git push -u origin "$(git branch --show-current)"
```

`gh` 로 PR 생성. 본문은 HEREDOC 으로 전달.

```bash
gh pr create \
  --assignee @me \
  --title "<제목>" \
  --body "$(cat <<'EOF'
## 📝 변경사항

### 주요 변경 내용

- ...

## 🔗 관련 링크

-

<!-- ### 테스트 결과 -->

<!-- ### 의존성 변경 -->
EOF
)"
```

## 스텝 6: 결과 확인

생성된 PR URL 을 사용자에게 보여주고 후속 안내:

- 리뷰어 지정
- 관련 이슈 링크
- 라벨 / 마일스톤

## 에러 처리

- `gh` 미설치 → `brew install gh && gh auth login` 안내
- `main` 과 차이 없음 → "변경사항을 커밋한 후 다시 시도해주세요"
- 푸시 거부 → 원인을 사용자에게 물어보고 수동 처리

## Related

- AI 인라인 코드 리뷰까지 같이 받으려면 `pr-with-review` 스킬을 사용한다.
- PR 직전에 changeset 본문이 필요하면 `changeset` 스킬을 먼저 실행한다.
