'use client'

import React, { useEffect, useRef } from 'react'

const reduzido = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
// Curva do varrimento da frase: começa devagar, dispara no meio e desacelera no fim.
// Quíntica em vez de cúbica, para o meio ser bem mais rápido que as pontas.
const varre = (x: number) => (x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2)
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
    // Cada trecho destacado (.sel) acende quando a SUA última letra termina de aparecer,
    // e não quando a frase inteira acaba — senão a marca chegaria tarde demais.
    const marcas = Array.from(el.querySelectorAll<HTMLElement>('.sel')).map((m) => {
      let ultima = -1
      itens.forEach((it, i) => {
        if (m.contains(it.el)) ultima = i
      })
      return { el: m, ultima }
    })
    // Onda mais curta e teto de velocidade maior = letras resolvem mais rápido.
    // Antes: W 10/12, VMAX 0,4/0,28.
    const W = titulo ? 7 : 8
    const VMAX = titulo ? 0.58 : 0.44
    let Pd = 0,
      Pt = 0,
      last = 0,
      run = false,
      raf = 0

    const alvo = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const cy = r.top + r.height / 2
      // Trecho de rolagem em que o progresso vai de 0 a 1. Precisa ser largo o bastante
      // para a curva do varrimento aparecer: num trecho curto ela vira um corte seco.
      return titulo ? lim((vh * 0.95 - cy) / (vh * 0.62)) : lim((vh * 0.98 - cy) / (vh * 0.62))
    }
    const pinta = () => {
      const head = varre(lim(Pd)) * (N + W)
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
      for (const m of marcas) m.el.classList.toggle('pronta', m.ultima >= 0 && head - m.ultima >= W)
    }
    const passo = (agora: number) => {
      const dt = Math.min(0.05, (agora - last) / 1000 || 0.016)
      last = agora
      const d = Pt - Pd
      if (titulo) {
        const a = Math.min(VMAX * dt, Math.max(0.1 * dt, Math.abs(d) * Math.min(1, dt * 3.4)))
        Pd += d > 0 ? Math.min(d, a) : Math.max(d, -a)
      } else {
        const v = d * Math.min(1, dt * 2.8)
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
