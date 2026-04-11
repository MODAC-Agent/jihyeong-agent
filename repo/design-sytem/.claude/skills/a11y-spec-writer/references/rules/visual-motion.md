# visual-motion — 애니메이션 접근성

**Priority:** MEDIUM | **WCAG:** 2.3.3 Animation from Interactions (Level AAA), 2.2.2 (Level A)

## Rule

자동 재생 애니메이션은 3초 이내 멈추거나 제어 수단을 제공한다. `prefers-reduced-motion`으로 모션 감소 설정을 존중한다.

## Examples

```css
/* ✅ prefers-reduced-motion 미디어 쿼리 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```tsx
// ✅ React에서 모션 감소 감지
function useReducedMotion() {
  const [reduced, setReduced] = useState(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

function AnimatedComponent() {
  const reducedMotion = useReducedMotion()

  return (
    <div
      style={{
        transition: reducedMotion ? 'none' : 'transform 0.3s ease'
      }}
    />
  )
}

// ✅ Framer Motion
import { useReducedMotion } from 'framer-motion'
const shouldReduceMotion = useReducedMotion()
```

## Notes

- 전정 장애(vestibular disorder) 사용자에게 과도한 모션은 어지러움 유발
- 자동 재생 슬라이더, 카루셀 — 정지 버튼 필수
- 깜빡임: 1초에 3회 이상 금지 (발작 위험)
- 필수 피드백 애니메이션(로딩 스피너)은 `prefers-reduced-motion`에서도 유지 가능
