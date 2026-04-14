# visual-not-color-only — 색상만으로 정보 전달 금지

**Priority:** MEDIUM | **WCAG:** 1.4.1 Use of Color (Level A)

## Rule

색상은 정보를 전달하는 유일한 수단이 되어서는 안 된다. 아이콘, 텍스트, 패턴 등 색상 외 시각적 단서를 함께 사용한다.

## Examples

```tsx
// ❌ 색상만으로 오류 표시
<input style={{ borderColor: error ? 'red' : 'gray' }} />

// ✅ 색상 + 아이콘 + 텍스트
<input
  style={{ borderColor: error ? '#d32f2f' : '#767676' }}
  aria-invalid={!!error}
/>
{error && (
  <p style={{ color: '#d32f2f' }}>
    <span aria-hidden="true">⚠ </span>
    {error}
  </p>
)}

// ❌ 색상만으로 필수 필드 표시
<label style={{ color: 'red' }}>이메일</label>

// ✅ 색상 + 텍스트 기호
<label>
  이메일
  <span aria-hidden="true" style={{ color: 'red' }}> *</span>
</label>

// ❌ 링크가 색상으로만 구분
<p>
  자세한 내용은 <span style={{ color: 'blue' }}>여기</span>를 참조하세요.
</p>

// ✅ 밑줄로도 구분
<p>
  자세한 내용은 <a href="/details">여기</a>를 참조하세요.
</p>
```

## Notes

- 적용 범위: 오류 상태, 필수 필드, 상태 표시, 링크, 차트/그래프
- 색맹(적녹색맹) 사용자의 약 8% (남성 기준)
- 차트에서 데이터 구분: 색상 + 패턴 또는 레이블 직접 표시
