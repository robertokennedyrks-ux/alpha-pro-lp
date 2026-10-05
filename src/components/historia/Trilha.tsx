'use client'

import React, { useEffect, useRef } from 'react'

// Linha do tempo da dor: conforme cada item passa de 70% da altura da tela,
// o número aparece, depois o card, e a linha tracejada até o próximo vai se desenhando.
export function Trilha({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const tl = ref.current
    if (!tl || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const itens = Array.from(tl.children) as HTMLElement[]
    tl.classList.add('anim')
    const gap = parseFloat(getComputedStyle(tl).rowGap) || 14
    let tick = false
    const atualiza = () => {
      tick = false
      const ancora = window.innerHeight * 0.7
      for (const li of itens) {
        const r = li.getBoundingClientRect()
        const p = (ancora - r.top) / (r.height + gap)
        li.classList.toggle('on-n', p > 0)
        li.classList.toggle('on-c', p > 0.12)
        li.style.setProperty('--l', Math.max(0, Math.min(1, (p - 0.3) / 0.7)).toFixed(3))
      }
    }
    const pede = () => {
      if (!tick) {
        tick = true
        requestAnimationFrame(atualiza)
      }
    }
    window.addEventListener('scroll', pede, { passive: true })
    window.addEventListener('resize', pede)
    atualiza()
    return () => {
      window.removeEventListener('scroll', pede)
      window.removeEventListener('resize', pede)
    }
  }, [])

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  )
}
