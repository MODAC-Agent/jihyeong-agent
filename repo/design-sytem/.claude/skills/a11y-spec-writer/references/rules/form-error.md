# form-error — 오류 메시지 접근 가능하게 전달

**Priority:** HIGH | **WCAG:** 3.3.1 Error Identification (Level A), 3.3.3 Error Suggestion (Level AA)

## Rule

폼 오류는 텍스트로 명시하고, 해당 필드와 프로그래매틱하게 연결하며, 색상 외 다른 방법으로도 구분한다.

## Examples

```tsx
function FormField({ id, label, error, value, onChange }: Props) {
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p
          id={errorId}
          role='alert'
          aria-live='assertive'>
          {/* 아이콘 + 텍스트로 색상 외 구분 */}
          <span aria-hidden='true'>⚠ </span>
          {error}
        </p>
      )}
    </div>
  )
}

// ✅ 제출 실패 시 첫 번째 오류로 포커스
function handleSubmit() {
  const errors = validate(values)
  if (Object.keys(errors).length > 0) {
    const firstErrorId = Object.keys(errors)[0]
    document.getElementById(firstErrorId)?.focus()
  }
}
```

## Notes

- 오류 메시지는 입력 필드 근처(바로 아래)에 배치
- "빨간색" 같은 색상 표현만 사용 금지 — "이메일 형식이 올바르지 않습니다" 처럼 텍스트로
- 제출 후 오류 발생 시 페이지 상단 요약도 제공 권장
