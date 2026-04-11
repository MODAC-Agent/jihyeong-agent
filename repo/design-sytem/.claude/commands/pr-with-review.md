# PR with AI Review

`/pr`와 동일하게 실행하되, `gh pr create` 명령 끝에 반드시 `# ai-review`를 붙인다.

```bash
gh pr create \
  --assignee @me \
  --title "..." \
  --body "..." # ai-review
```

`# ai-review`는 shell 주석이라 실행에 영향 없고, pr-review 훅이 이를 감지해 자동으로 AI 인라인 코드 리뷰를 달아준다.

나머지 모든 단계는 `/pr` 커맨드와 동일하다.

## PR 생성 후 처리

`gh pr create` 직후 반드시 아래 명령을 실행해 리뷰 결과를 확인한다:

```bash
cat /tmp/pr-review-pending.json 2>/dev/null
```

파일이 존재하면 사용자에게 다음을 질문한다:

> 리뷰가 등록됐습니다. 리뷰 내용을 코드에 반영하고 각 코멘트에 답글을 달까요?

사용자가 수락하면:

1. `comments` 배열의 각 항목을 읽고 해당 파일/라인의 코드를 수정한다.
2. 각 코멘트에 수정 완료 답글을 단다 (`gh api .../replies`).
3. 완료 후 `/tmp/pr-review-pending.json`을 삭제한다.
