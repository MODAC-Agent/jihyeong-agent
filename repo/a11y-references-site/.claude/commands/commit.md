# Auto-Generate Commit Message

현재 staged 변경사항을 분석하여 conventional commit 형식의 커밋 메시지를 자동 생성하고 커밋합니다.

## Usage

```bash
/commit
```

## Implementation Steps

1. **Check staged files**

   ```bash
   git diff --staged --name-only
   ```

   **Scope 결정 규칙:**
   - `packages/shared/` → `shared`
   - `packages/backend/` → `backend`
   - `packages/frontend/` → `frontend`
   - `tools/eslint-config/` or `tools/typescript-config/` → `tools`
   - Root 파일만 변경 → `chore:` (scope 없음)
   - 워크스페이스 + root 파일 혼합 → 워크스페이스 scope 사용
   - 여러 워크스페이스 → `feat(backend,frontend):`

2. **Analyze changes**

   ```bash
   git diff --staged --stat
   git diff --staged
   ```

3. **Generate & execute commit**

   ```bash
   git commit -m "$(cat <<'EOF'
   feat(backend): ...

   - ...
   EOF
   )"
   ```

4. **Show result**

   ```bash
   git log -1 --oneline
   ```

## Commit Type Detection

- **feat**: 새 파일, 새 기능
- **fix**: 버그 수정
- **refactor**: 코드 구조 변경
- **style**: 포맷팅만 변경
- **perf**: 성능 최적화
- **test**: 테스트 추가/수정
- **docs**: README, 문서
- **chore**: 설정 파일, package.json, 빌드 스크립트
