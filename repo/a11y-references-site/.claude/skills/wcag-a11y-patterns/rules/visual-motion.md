# visual-motion — Animation accessibility

**Priority:** MEDIUM | **WCAG:** 2.3.3 Animation from Interactions (Level AAA), 2.2.2 (Level A)

## Rule

Auto-playing animations must stop within 3 seconds or provide user controls. Respect the `prefers-reduced-motion` setting.

## Examples

```css
/* ✅ prefers-reduced-motion media query */
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
// ✅ Detect reduced motion in React
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

- Excessive motion can cause dizziness for users with vestibular disorders
- Auto-playing sliders and carousels must have a pause button
- Flashing: no more than 3 flashes per second (seizure risk)
- Essential feedback animations (loading spinners) may be kept even under `prefers-reduced-motion`
