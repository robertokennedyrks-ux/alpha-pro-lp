'use client'

import React, { useEffect, useRef } from 'react'

// "O que você vai sentir": cada ícone cresce ao entrar na tela (em pares, com 0,12s de diferença).
// As cópias do carrossel do desktop (li.cl) já nascem visíveis.
export function Sentir({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const f = ref.current
    if (!f || !('IntersectionObserver' in window)) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const lis = Array.from(f.querySelectorAll<HTMLElement>('ul > li:not(.cl)'))
    f.classList.add('anim')
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (!e.isIntersecting) continue
          const li = e.target as HTMLElement
          const ico = li.querySelector<HTMLElement>('.ico')
          if (ico) ico.style.transitionDelay = (lis.indexOf(li) % 2) * 0.12 + 's'
          li.classList.add('in')
          io.unobserve(li)
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    lis.forEach((li) => io.observe(li))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
