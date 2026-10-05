'use client'

import { useRef } from 'react'

import { semMovimento } from './midia'

type Item = { id: number | string; pergunta: string; resposta: string; aberta?: boolean | null }
type Det = HTMLDetailsElement & { _a?: Animation | null }

const DUR = 340
const EASE = 'cubic-bezier(.4,0,.2,1)'

/* Perguntas frequentes: só uma aberta por vez, abrindo e fechando com animação de altura. */
export function Perguntas({ itens }: { itens: Item[] }) {
  const refs = useRef<(Det | null)[]>([])
  const corpo = (d: Det) => d.querySelector('p') as HTMLElement

  const fechar = (d: Det) => {
    const b = corpo(d)
    d._a?.cancel()
    if (semMovimento()) {
      d.open = false
      return
    }
    const h = b.offsetHeight
    b.style.overflow = 'hidden'
    d._a = b.animate(
      [
        { height: h + 'px', paddingBottom: getComputedStyle(b).paddingBottom, opacity: 1 },
        { height: '0px', paddingBottom: '0px', opacity: 0 },
      ],
      { duration: DUR, easing: EASE },
    )
    d.classList.add('closing')
    d._a.onfinish = () => {
      d.open = false
      d.classList.remove('closing')
      b.style.overflow = ''
      d._a = null
    }
  }
  const abrir = (d: Det) => {
    const b = corpo(d)
    d._a?.cancel()
    d.open = true
    if (semMovimento()) return
    const pb = getComputedStyle(b).paddingBottom,
      h = b.offsetHeight
    b.style.overflow = 'hidden'
    d._a = b.animate(
      [
        { height: '0px', paddingBottom: '0px', opacity: 0 },
        { height: h + 'px', paddingBottom: pb, opacity: 1 },
      ],
      { duration: DUR, easing: EASE },
    )
    d._a.onfinish = () => {
      b.style.overflow = ''
      d._a = null
    }
  }
  const clicar = (k: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    const d = refs.current[k]
    if (!d) return
    if (d.open && !d.classList.contains('closing')) {
      fechar(d)
      return
    }
    d.classList.remove('closing')
    refs.current.forEach((o) => {
      if (o && o !== d && o.open && !o.classList.contains('closing')) fechar(o)
    })
    abrir(d)
  }

  return (
    <div className="faq">
      {itens.map((q, k) => (
        <details
          key={q.id}
          open={!!q.aberta}
          ref={(el) => {
            refs.current[k] = el as Det | null
          }}
        >
          <summary onClick={clicar(k)}>{q.pergunta}</summary>
          <p>{q.resposta}</p>
        </details>
      ))}
    </div>
  )
}
