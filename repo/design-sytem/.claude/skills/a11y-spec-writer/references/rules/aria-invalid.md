# aria-invalid — 유효성 오류 상태 전달

**Priority:** CRITICAL | **WCAG:** 3.3.1 Error Identification (Level A)

## Rule

폼 유효성 검사 실패 시 `aria-invalid`로 오류 상태를 전달하고, `aria-describedby`로 오류 메시지와 연결한다.

## Examples

```tsx
function FormField({ id, label, error, ...props }: Props) {
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p
          id={errorId}
          role='alert'>
          {error}
        </p>
      )}
    </div>
  )
}
```

## Notes

- `aria-invalid="true"` — 오류 있음 / `aria-invalid="false"` 또는 속성 제거 — 정상
- 오류 메시지는 시각적으로도 표시해야 함 (색상만으로 전달 금지)
- 제출 실패 시 첫 번째 오류 필드로 포커스 이동 권장
