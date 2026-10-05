'use client'

import React, { useEffect, useRef } from 'react'

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Balões em volta da foto: saem do pé do bloco (centro, embaixo) e vão para o lugar
// conforme o bloco chega ao meio da tela; com todos no lugar, ficam flutuando.
export function Baloes({ children, ...rest }: React.ComponentProps<'ul'>) {
  const ref = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const ul = ref.current
    const bx = ul?.parentElement
    if (!ul || !bx || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const lis = Array.from(ul.children) as HTMLElement[]
    const origem = () => {
      const b = bx.getBoundingClientRect()
      for (const li of lis) {
        const cx = li.offsetLeft + li.offsetWidth / 2
        const cy = li.offsetTop + li.offsetHeight / 2
        li.style.setProperty('--dx', (b.width / 2 - cx).toFixed(1) + 'px')
        li.style.setProperty('--dy', (b.height - 20 - cy).toFixed(1) + 'px')
      }
    }
    let Pd = 0,
      Pt = 0,
      last = 0,
      run = false,
      raf = 0
    const alvo = () => {
      const r = bx.getBoundingClientRect()
      const vh = window.innerHeight
      const cy = r.top + r.height / 2
      return Math.max(0, Math.min(1, (vh * 0.85 - cy) / (vh * 0.35)))
    }
    const pinta = () => {
      let todos = true
      lis.forEach((li, i) => {
        let t = Math.max(0, Math.min(1, (Pd - i * 0.15) / 0.55))
        if (t > 0.995) t = 1
        else todos = false
        li.style.setProperty('--e', ease(t).toFixed(3))
      })
      ul.classList.toggle('float', todos)
    }
    const passo = (agora: number) => {
      const dt = Math.min(0.05, (agora - last) / 1000 || 0.016)
      last = agora
      const d = Pt - Pd
      const a = Math.min(0.45 * dt, Math.max(0.1 * dt, Math.abs(d) * Math.min(1, dt * 2.4)))
      Pd += d > 0 ? Math.min(d, a) : Math.max(d, -a)
      pinta()
      if (Pd !== Pt) raf = requestAnimationFrame(passo)
      else run = false
    }
    const pede = () => {
      Pt = alvo()
      if (!run && Pt !== Pd) {
        run = true
        last = performance.now()
        raf = requestAnimationFrame(passo)
      }
    }
    const redimensiona = () => {
      origem()
      pede()
    }
    ul.classList.add('anim')
    origem()
    Pt = Pd = alvo()
    pinta()
    window.addEventListener('scroll', pede, { passive: true })
    window.addEventListener('resize', redimensiona)
    return () => {
      window.removeEventListener('scroll', pede)
      window.removeEventListener('resize', redimensiona)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <ul ref={ref} {...rest}>
      {children}
    </ul>
  )
}
