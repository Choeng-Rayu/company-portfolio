import { useState, useEffect, useRef } from 'react'

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function useAnimatedCounter(
  target: number,
  duration: number = 2000,
  startOnView: boolean = true
): { value: number; ref: React.RefObject<HTMLDivElement | null> } {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!startOnView) {
      hasStarted.current = true
      animate()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted.current) {
            hasStarted.current = true
            animate()
          }
        })
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()

    function animate() {
      const startTime = performance.now()

      function tick(now: number) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = easeOutExpo(progress)
        setValue(Math.floor(eased * target))

        if (progress < 1) {
          requestAnimationFrame(tick)
        } else {
          setValue(target)
        }
      }

      requestAnimationFrame(tick)
    }
  }, [target, duration, startOnView])

  return { value, ref }
}
