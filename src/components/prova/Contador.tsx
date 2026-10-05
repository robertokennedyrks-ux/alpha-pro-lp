'use client'

import { useEffect, useRef, useState } from 'react'

import { semMovimento } from './midia'

// Número do painel: mostra o valor final até entrar na tela; aí conta de 0 até ele (1,6s, ease-out).
export function Contador({ valor, sufixo = '' }: { valor: number; sufixo?: string }) {
  const ref = useRef<HTMLElement>(null)
  const [n, setN] = useState(valor)

  useEffect(() => {
    const b = ref.current
    if (!b || !('IntersectionObserver' in window) || semMovimento()) return
    b.style.display = 'inline-block'
    b.style.minWidth = `${b.getBoundingClientRect().width}px`
    let raf = 0
    const io = new IntersectionObserver(
      (es) => {
        if (!es.some((e) => e.isIntersecting)) return
        io.disconnect()
        setN(0)
        let t0: number | null = null
        const step = (ts: number) => {
          if (t0 === null) t0 = ts
          const t = Math.max(0, Math.min(1, (ts - t0) / 1600))
          setN(Math.round(valor * (1 - Math.pow(1 - t, 3))))
          if (t < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    io.observe(b)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [valor])

  return (
    <b ref={ref}>
      {n}
      {sufixo}
    </b>
  )
}
