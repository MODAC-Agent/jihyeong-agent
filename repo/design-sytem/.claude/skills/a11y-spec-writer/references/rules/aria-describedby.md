# aria-describedby — 추가 설명 연결

**Priority:** CRITICAL | **WCAG:** 1.3.1 Info and Relationships (Level A)

## Rule

레이블 외에 추가 설명(힌트, 오류, 도움말)이 있을 때 `aria-describedby`로 연결한다.

## Examples

```tsx
// ✅ 힌트 텍스트 연결
<div>
  <label htmlFor="password">비밀번호</label>
  <input
    id="password"
    type="password"
    aria-describedby="password-hint"
  />
  <p id="password-hint">8자 이상, 특수문자 포함</p>
</div>

// ✅ 오류 + 힌트 동시 연결 (스페이스로 여러 ID)
<input
  aria-describedby="password-hint password-error"
  aria-invalid={!!error}
/>
```

## Notes

- `aria-labelledby` — 요소의 이름 (label 역할)
- `aria-describedby` — 요소의 설명 (description 역할), 읽는 순서는 label 다음
- 여러 ID 연결 시 스페이스로 구분, 읽는 순서대로 나열
