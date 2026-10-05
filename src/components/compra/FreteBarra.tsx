'use client'

import { useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/icons'
import { brl } from '@/lib/texto'

import type { Loja } from './loja'

// Barra segmentada de frete grátis no carrinho. Só visual: o checkout precisa aplicar a mesma regra.
export function FreteBarra({ frete, total, aberto }: { frete: Loja['frete']; total: number; aberto: boolean }) {
  const N = frete.segmentos
  const meta = frete.meta
  const p = Math.min(1, total / meta)
  const feito = total >= meta
  const o = { falta: brl(Math.max(0, meta - total)), total: brl(total), meta: brl(meta) }
  const preencher = (t: string) => t.replace('{falta}', o.falta).replace('{total}', o.total).replace('{meta}', o.meta)

  // Enchendo, os segmentos vão da esquerda para a direita; esvaziando, ao contrário.
  const [pAntes, setPAntes] = useState(p)
  const [subindo, setSubindo] = useState(true)
  if (pAntes !== p) {
    setSubindo(p > pAntes)
    setPAntes(p)
  }

  const boxRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLElement>(null)
  const fxRef = useRef<HTMLDivElement>(null)
  const feitoAntes = useRef<boolean | null>(null)
  const pendente = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const [festa, setFesta] = useState(0)

  useEffect(() => {
    const ts = timers.current
    return () => ts.forEach(clearTimeout)
  }, [])

  // Comemoração ao bater a meta: anima a barra e solta confetes em tons de cinza (e o verde do frete).
  useEffect(() => {
    const comemorar = () => {
      pendente.current = false
      setFesta((f) => f + 1)
      timers.current.push(setTimeout(() => setFesta(0), 1400))
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const box = boxRef.current
      const pct = pctRef.current
      const fx = fxRef.current
      if (!box || !pct || !fx) return
      const r = box.getBoundingClientRect()
      const pr = pct.getBoundingClientRect()
      const ox = pr.left - r.left + pr.width / 2
      const oy = pr.top - r.top + pr.height / 2
      const cores = ['var(--color-ink)', 'var(--color-stone)', 'var(--color-line)', 'var(--color-ok)', 'var(--color-graphite)']
      for (let k = 0; k < 26; k++) {
        const d = document.createElement('i')
        const sz = 4 + Math.random() * 5
        const redondo = Math.random() < 0.35
        d.style.width = sz + 'px'
        d.style.height = (redondo ? sz : sz * 1.8) + 'px'
        d.style.background = cores[k % cores.length]
        if (redondo) d.style.borderRadius = '50%'
        fx.appendChild(d)
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5
        const dist = 50 + Math.random() * 90
        const dx = Math.cos(ang) * dist
        const dy = Math.sin(ang) * dist
        const rot = (Math.random() - 0.5) * 720
        d.animate(
          [
            { transform: `translate(${ox}px,${oy}px) rotate(0) scale(.4)`, opacity: 1 },
            { transform: `translate(${ox + dx}px,${oy + dy}px) rotate(${rot / 2}deg) scale(1)`, opacity: 1, offset: 0.55 },
            { transform: `translate(${ox + dx * 1.15}px,${oy + dy + 70}px) rotate(${rot}deg) scale(.8)`, opacity: 0 },
          ],
          { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' },
        ).onfinish = () => d.remove()
      }
    }
    const antes = feitoAntes.current
    feitoAntes.current = feito
    if (antes === false && feito && frete.comemorar) {
      if (aberto) timers.current.push(setTimeout(comemorar, N * 70 + 380))
      else pendente.current = true
    }
    if (!feito) pendente.current = false
    if (aberto && pendente.current) {
      pendente.current = false
      timers.current.push(setTimeout(comemorar, 450))
    }
  }, [feito, aberto, frete.comemorar, N])

  const P = Math.round(p * 100)
  const msg = feito
    ? frete.textoLiberado.split(/(grátis|liberado)/gi).map((t, i) => (i % 2 ? <span key={i} className="ok">{t}</span> : t))
    : preencher(frete.textoProgresso)

  return (
    <div ref={boxRef} className={`fg${feito ? ' is-done' : ''}${festa ? ' party' : ''}`}>
      <div className="fg-top">
        <span className="fg-ic" aria-hidden="true">
          <Icon name="caminhao" />
        </span>
        <p className="fg-txt">
          <span className="fg-msg" aria-live="polite">
            {msg}
          </span>
          <small className="fg-sub">{preencher(feito ? frete.subtextoLiberado : frete.subtextoProgresso)}</small>
        </p>
        <b className="fg-pct" ref={pctRef}>
          {P}%
        </b>
      </div>
      <div
        className="fg-bar"
        role="progressbar"
        aria-label="Progresso para o frete grátis"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={P}
      >
        {Array.from({ length: N }, (_, k) => (
          <span key={k} className="fg-seg" style={festa ? { animationDelay: `${k * 60}ms` } : undefined}>
            <i
              style={{
                width: `${Math.max(0, Math.min(1, p * N - k)) * 100}%`,
                transitionDelay: `${(subindo ? k : N - 1 - k) * 70}ms`,
              }}
            />
          </span>
        ))}
      </div>
      <div className="fg-fx" ref={fxRef} aria-hidden="true" />
    </div>
  )
}
