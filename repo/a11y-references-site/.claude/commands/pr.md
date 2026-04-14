# Create Pull Request

현재 브랜치의 변경사항을 분석하여 PR을 자동 생성합니다.

## Usage

```bash
/pr
```

## Implementation Steps

1. **Analyze commits since main**

   ```bash
   git log main...HEAD --oneline
   git diff main...HEAD --stat
   ```

2. **Determine scope** (commit.md 와 동일한 규칙 적용)

3. **Push branch**

   ```bash
   git push -u origin HEAD
   ```

4. **Create PR**

   ```bash
   gh pr create --title "<type>(<scope>): <subject>" --body "$(cat <<'EOF'
   ## Summary
   - ...

   ## Changes
   - ...

   ## Test Plan
   - [ ] type-check 통과
   - [ ] lint 통과
   - [ ] 로컬 동작 확인
   EOF
   )"
   ```

5. **Show PR URL**

## PR Title Format

```
feat(backend): Claude API 연동 구현
fix(frontend): 접근성 체크리스트 렌더링 오류 수정
chore(tools): ESLint 설정 업데이트
```
