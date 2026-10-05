'use client'

import { useEffect, useRef, useState } from 'react'

// Faixa de anúncios em loop sem emenda: o conjunto se repete até passar da largura da tela,
// a faixa tem duas metades iguais e a animação anda -50%. A velocidade fica igual à do
// protótipo (um conjunto a cada 26s), qualquer que seja o número de cópias.
const SEGUNDOS_POR_CONJUNTO = 26

export function Faixa({ textos }: { textos: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [reps, setReps] = useState(1)

  useEffect(() => {
    const tr = trackRef.current
    if (!tr || !textos.length) return
    let built = 0
    const build = (forcar = false) => {
      const w = window.innerWidth
      if (!forcar && built && w <= built) return
      let one = 0
      const kids = tr.children
      for (let i = 0; i < textos.length && i < kids.length; i++) {
        const el = kids[i] as HTMLElement
        one += el.offsetWidth + parseFloat(getComputedStyle(el).marginRight || '0')
      }
      if (!one) return
      setReps(Math.max(1, Math.ceil((w + one) / one)))
      built = w
    }
    build()
    let t: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => build(), 200)
    }
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(() => build(true))
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [textos.length])

  const copias = Array.from({ length: reps * 2 }, (_, r) => r)
  return (
    <div className="ann-track" ref={trackRef} style={{ animationDuration: `${SEGUNDOS_POR_CONJUNTO * reps}s` }}>
      {copias.map((r) =>
        textos.map((t, i) => (
          <span key={`${r}-${i}`} aria-hidden={r > 0 ? true : undefined}>
            {t}
          </span>
        )),
      )}
    </div>
  )
}
