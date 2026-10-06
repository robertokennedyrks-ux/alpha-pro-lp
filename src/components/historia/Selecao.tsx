'use client'

import React, { useEffect, useRef } from 'react'

// Destaque em forma de seleção de texto para trechos que não passam pelo <Revelar>.
// Acende quando entra na tela e apaga ao sair, para o efeito se repetir na volta.
export function Selecao({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('pronta')
      return
    }
    const io = new IntersectionObserver((es) => el.classList.toggle('pronta', es[0].isIntersecting), {
      rootMargin: '0px 0px -22% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <span ref={ref} className="sel-linha">
      {children}
    </span>
  )
}
