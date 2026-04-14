# form-fieldset — 관련 필드 그룹화

**Priority:** HIGH | **WCAG:** 1.3.1 Info and Relationships (Level A)

## Rule

관련된 폼 컨트롤(라디오, 체크박스 그룹)은 `<fieldset>`과 `<legend>`로 그룹화한다.

## Examples

```tsx
// ✅ 라디오 그룹
<fieldset>
  <legend>알림 수신 방법</legend>
  <label>
    <input type="radio" name="notify" value="email" />
    이메일
  </label>
  <label>
    <input type="radio" name="notify" value="sms" />
    SMS
  </label>
</fieldset>

// ✅ 체크박스 그룹
<fieldset>
  <legend>관심 분야 (복수 선택)</legend>
  <label>
    <input type="checkbox" name="interest" value="wcag" />
    WCAG
  </label>
  <label>
    <input type="checkbox" name="interest" value="aria" />
    ARIA
  </label>
</fieldset>

// ✅ 커스텀 컴포넌트에서 role="group" 대안
<div role="group" aria-labelledby="group-label">
  <p id="group-label">알림 수신 방법</p>
  {/* 라디오 버튼들 */}
</div>
```

## Notes

- 단일 입력 필드는 fieldset 불필요 — 라디오/체크박스 그룹에만 사용
- `legend`는 fieldset의 첫 번째 자식이어야 함
- 스타일링이 어려우면 `role="group"` + `aria-labelledby` 대안 사용 가능
