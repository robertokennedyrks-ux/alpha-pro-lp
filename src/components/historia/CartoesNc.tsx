'use client'

import React, { useEffect, useRef } from 'react'

// Em telas de toque (sem hover), o card mais perto do meio da tela fica aceso (.is-on).
export function CartoesNc({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = ref.current
    if (!box || !window.matchMedia?.('(hover: none)').matches) return
    const cards = Array.from(box.children) as HTMLElement[]
    let tick = false
    let cur: HTMLElement | null = null
    const atualiza = () => {
      tick = false
      const vh = window.innerHeight
      const meio = vh / 2
      let melhor: HTMLElement | null = null
      let bd = 1e9
      for (const c of cards) {
        const r = c.getBoundingClientRect()
        if (r.bottom < 0 || r.top > vh) continue
        const d = Math.abs(r.top + r.height / 2 - meio)
        if (d < bd && d < r.height * 0.75 + 20) {
          bd = d
          melhor = c
        }
      }
      if (melhor !== cur) {
        cur?.classList.remove('is-on')
        melhor?.classList.add('is-on')
        cur = melhor
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
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
