'use client'

import React, { useEffect, useRef } from 'react'

const reduzido = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const lim = (x: number) => Math.max(0, Math.min(1, x))

type Props = {
  // fecho: frase de fechamento da dor (só letras).
  // titulo: título do destaque (letras, pílula girando e o título encolhendo de 2x para 1x).
  modo: 'fecho' | 'titulo'
  as?: 'p' | 'h2'
  className?: string
  'aria-label'?: string
  children: React.ReactNode
}

// Revela as letras (.tw-c, geradas por <Letras>) uma a uma conforme o bloco sobe na tela,
// com desfoque saindo, igual ao protótipo. A velocidade é limitada para não "pular" a frase.
export function Revelar({ modo, as: Tag = 'p', className, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || reduzido()) return
    const titulo = modo === 'titulo'
    const itens = Array.from(el.querySelectorAll<HTMLElement>(titulo ? '.tw-c, .cap' : '.tw-c')).map((e) => ({
      el: e,
      cap: e.classList.contains('cap'),
    }))
    const N = itens.length
    const W = titulo ? 10 : 12
    const VMAX = titulo ? 0.4 : 0.28
    let Pd = 0,
      Pt = 0,
      last = 0,
      run = false,
      raf = 0

    const alvo = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const cy = r.top + r.height / 2
      return titulo ? lim((vh * 0.95 - cy) / (vh * 0.42)) : lim((vh * 0.98 - cy) / (vh * 0.36))
    }
    const pinta = () => {
      const head = Pd * (N + W)
      for (let i = 0; i < N; i++) {
        const { el: s, cap } = itens[i]
        if (cap) {
          const u = eio(lim((head - i + 2) / (W + 4)))
          s.style.opacity = Math.min(1, u * 1.6).toFixed(3)
          s.style.transform = u >= 1 ? 'none' : `rotate(${((1 - u) * -360).toFixed(1)}deg) scale(${u.toFixed(3)})`
          continue
        }
        const t = eio(lim((head - i) / W))
        s.style.opacity = t.toFixed(3)
        s.style.filter = t >= 1 ? 'none' : `blur(${((1 - t) * 12).toFixed(2)}px)`
      }
      if (titulo) {
        const g = eio(Math.min(1, Pd))
        el.style.transform = g >= 1 ? 'none' : `scale(${(2 - g).toFixed(3)})`
      }
    }
    const passo = (agora: number) => {
      const dt = Math.min(0.05, (agora - last) / 1000 || 0.016)
      last = agora
      const d = Pt - Pd
      if (titulo) {
        const a = Math.min(VMAX * dt, Math.max(0.1 * dt, Math.abs(d) * Math.min(1, dt * 2.4)))
        Pd += d > 0 ? Math.min(d, a) : Math.max(d, -a)
      } else {
        const v = d * Math.min(1, dt * 1.8)
        const cap = VMAX * dt
        Pd += Math.max(-cap, Math.min(cap, v))
        if (Math.abs(Pt - Pd) < 0.0008) Pd = Pt
      }
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
    window.addEventListener('scroll', pede, { passive: true })
    window.addEventListener('resize', pede)
    Pt = Pd = alvo()
    pinta()
    return () => {
      window.removeEventListener('scroll', pede)
      window.removeEventListener('resize', pede)
      cancelAnimationFrame(raf)
    }
  }, [modo])

  return (
    <Tag ref={ref as React.Ref<never>} className={className} {...rest}>
      {children}
    </Tag>
  )
}
