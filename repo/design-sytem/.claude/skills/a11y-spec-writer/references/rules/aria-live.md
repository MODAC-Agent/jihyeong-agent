# aria-live — 동적 콘텐츠 변경 알림

**Priority:** CRITICAL | **WCAG:** 4.1.3 Status Messages (Level AA)

## Rule

사용자 액션 없이 DOM이 변경될 때(로딩 완료, 오류 발생, 알림 등) aria-live 영역으로 스크린리더에 알린다.

## Values

| 값          | 언제 사용                                       |
| ----------- | ----------------------------------------------- |
| `assertive` | 즉각 중단하고 읽어야 하는 오류, 경고            |
| `polite`    | 현재 작업 완료 후 읽어도 되는 상태, 성공 메시지 |
| `off`       | 기본값, 알림 없음                               |

## Examples

```tsx
// ✅ 폼 오류 알림 (assertive)
<div role="alert" aria-live="assertive" aria-atomic="true">
  {error && <p>{error}</p>}
</div>

// ✅ 로딩 상태 알림 (polite)
<div aria-live="polite" aria-atomic="true">
  {isLoading ? '분석 중...' : '분석 완료'}
</div>

// ✅ React에서 시각적으로 숨긴 live region
function LiveRegion({ message }: { message: string }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}
```

## Notes

- live region은 페이지 로드 시부터 DOM에 존재해야 함 — 나중에 추가하면 인식 못하는 경우 있음
- `aria-atomic="true"` — 변경된 부분만이 아닌 전체 영역을 읽음
- `role="alert"`는 `aria-live="assertive" aria-atomic="true"` 단축형
- `role="status"`는 `aria-live="polite" aria-atomic="true"` 단축형
