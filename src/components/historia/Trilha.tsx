'use client'

import React, { useEffect, useRef } from 'react'

// Tempo para o valor mostrado alcançar o alvo (~99%). Quanto maior, mais a animação
// "escorre" atrás da rolagem. A rolagem em si não é tocada: segue na velocidade do sistema.
const ATRASO = 0.32

// Linha do tempo da dor: conforme cada item passa de 70% da altura da tela,
// o número aparece, depois o card, e a linha tracejada até o próximo vai se desenhando.
// O card recém-revelado fica "quente" (borda vermelha e brilho) e só esfria quando o
// próximo chega ao meio da tela — ou seja, quem manda é a rolagem, não um cronômetro.
//
// O progresso de cada item não vem cru da rolagem: ele persegue o alvo quadro a quadro,
// como já faziam os balões e o texto revelado. É isso que tira a sensação de corte seco.
export function Trilha({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const tl = ref.current
    if (!tl || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const itens = Array.from(tl.children) as HTMLElement[]
    tl.classList.add('anim')
    const gap = parseFloat(getComputedStyle(tl).rowGap) || 14

    // p[i] = progresso mostrado; alvos[i] = para onde ele está indo.
    const p = itens.map(() => 0)
    const alvos = itens.map(() => 0)
    let primeiro = true
    let ultimo = 0
    let rodando = false
    let raf = 0

    const medir = () => {
      const ancora = window.innerHeight * 0.7
      itens.forEach((li, i) => {
        const r = li.getBoundingClientRect()
        // Limitado: fora da tela o valor não interessa e números grandes só atrapalhariam
        // a perseguição quando o item voltasse.
        alvos[i] = Math.max(-0.5, Math.min(1.5, (ancora - r.top) / (r.height + gap)))
      })
    }

    const pintar = () => {
      const centro = window.innerHeight / 2
      const noCentro = (el: HTMLElement) => {
        const r = el.getBoundingClientRect()
        return r.top + r.height / 2 <= centro
      }
      // Candidato a aceso: já revelado e com o próximo ainda longe do meio da tela.
      // O último item não tem próximo, então usa a si mesmo e esfria ao passar do meio.
      let aceso = -1
      itens.forEach((li, i) => {
        const revelado = p[i] > 0.12
        li.classList.toggle('on-n', p[i] > 0)
        li.classList.toggle('on-c', revelado)
        li.style.setProperty('--l', Math.max(0, Math.min(1, (p[i] - 0.3) / 0.7)).toFixed(3))
        if (revelado && !noCentro(itens[i + 1] ?? li)) aceso = i
      })
      // Só um aceso por vez: o mais recente ganha e apaga o anterior.
      itens.forEach((li, i) => li.classList.toggle('quente', i === aceso))
    }

    const passo = (agora: number) => {
      const dt = Math.min(0.05, (agora - ultimo) / 1000 || 0.016)
      ultimo = agora
      // Suavização exponencial compensada pela taxa de quadros: o mesmo movimento
      // a 60Hz e a 144Hz.
      const k = 1 - Math.pow(0.01, dt / ATRASO)
      let andando = false
      for (let i = 0; i < p.length; i++) {
        const d = alvos[i] - p[i]
        if (Math.abs(d) < 0.0008) {
          p[i] = alvos[i]
        } else {
          p[i] += d * k
          andando = true
        }
      }
      pintar()
      if (andando) raf = requestAnimationFrame(passo)
      else rodando = false
    }

    const pede = () => {
      medir()
      if (primeiro) {
        // Na primeira medida não há de onde escorregar: o que já está na tela
        // aparece no lugar, sem correr do zero.
        primeiro = false
        for (let i = 0; i < p.length; i++) p[i] = alvos[i]
        pintar()
        return
      }
      if (!rodando) {
        rodando = true
        ultimo = performance.now()
        raf = requestAnimationFrame(passo)
      }
    }

    window.addEventListener('scroll', pede, { passive: true })
    window.addEventListener('resize', pede)
    pede()
    return () => {
      window.removeEventListener('scroll', pede)
      window.removeEventListener('resize', pede)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  )
}
