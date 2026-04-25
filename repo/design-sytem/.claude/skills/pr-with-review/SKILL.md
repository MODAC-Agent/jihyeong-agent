---
name: pr-with-review
description: dnd-design-system 모노레포에서 PR 을 생성하면서 AI 인라인 코드 리뷰까지 자동으로 받는다. "PR 만들고 리뷰", "AI 리뷰 받으면서 PR", "PR with review", "리뷰 포함 PR 생성", "코드 리뷰 같이 올려줘" 같은 요청이나 PR 생성 시 자동 코드 리뷰가 필요할 때 반드시 이 스킬을 사용하라. pr 스킬과 동일한 절차를 따르되 `gh pr create` 명령 끝에 `# ai-review` 주석을 붙여 pr-review 훅을 트리거한다. 리뷰 코멘트가 등록되면 사용자에게 반영 여부를 묻고, 수락 시 코드를 수정하고 각 코멘트에 답글을 단다.
---

# pr-with-review

`pr` 스킬과 동일하지만, `gh pr create` 명령 끝에 `# ai-review` 주석을 붙여 자동 인라인 코드 리뷰까지 함께 받는다.

`# ai-review` 는 shell 주석이라 명령 실행에는 영향이 없다. 이 레포의 `.claude/settings.json` 에 등록된 PostToolUse:Bash 훅(`.claude/hooks/pr-review.js`)이 이 마커를 감지해 작동한다.

## 스텝 1~5: `pr` 스킬과 동일

`pr` 스킬의 모든 절차(템플릿 읽기 → diff 분석 → 제목/본문 생성 → 푸시)를 그대로 따른다. 마지막 `gh pr create` 만 다음과 같이 바꾼다.

```bash
gh pr create \
  --assignee @me \
  --title "<제목>" \
  --body "$(cat <<'EOF'
<...pr 스킬 스텝 4 의 본문...>
EOF
)" # ai-review
```

## 스텝 6: 리뷰 결과 확인

`gh pr create` 직후 리뷰 결과 파일을 확인한다.

```bash
cat /tmp/pr-review-pending.json 2>/dev/null
```

파일이 존재하면 **`AskUserQuestion`** 으로 다음 행동을 묻는다.

- `question`: "리뷰 코멘트가 등록됐어요. 어떻게 할까요?"
- `header`: "리뷰 반영"
- `multiSelect`: false
- `options`:
  - `코드를 수정하고 각 코멘트에 답글 달기 (Recommended)`
  - `URL 만 받고 직접 처리`

"수정 + 답글" 선택 시:

1. `comments` 배열의 각 항목에서 파일·라인을 읽고 코드 수정
2. 각 코멘트에 수정 완료 답글 (`gh api .../replies`)
3. 완료 후 `/tmp/pr-review-pending.json` 삭제
