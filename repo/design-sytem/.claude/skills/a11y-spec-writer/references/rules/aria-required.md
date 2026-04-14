# aria-required — 필수 입력 필드 표시

**Priority:** CRITICAL | **WCAG:** 3.3.2 Labels or Instructions (Level A)

## Rule

필수 입력 필드임을 `aria-required`로 명시한다. 시각적 표시(\*)와 함께 사용한다.

## Examples

```tsx
// ✅
<div>
  <label htmlFor="email">
    이메일
    <span aria-hidden="true"> *</span>
  </label>
  <input
    id="email"
    type="email"
    aria-required="true"
    required
  />
</div>

// ✅ HTML required와 함께 사용 (브라우저 기본 유효성 검사 활성화)
<input required aria-required="true" />
```

## Notes

- HTML `required`와 `aria-required="true"` 함께 사용 권장
- `*` 같은 시각적 표시는 `aria-hidden="true"` 추가 — 스크린리더가 "별표 필수" 대신 "필수"만 읽도록
- 페이지 상단에 "\* 표시는 필수 항목입니다" 안내 텍스트 제공
