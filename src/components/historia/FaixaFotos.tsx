'use client'

import React, { useEffect, useRef, useState } from 'react'

// Faixa de fotos em loop sem emenda: o conjunto se repete até passar da largura da tela,
// a faixa tem esse bloco duas vezes e a animação anda -50%. A velocidade fica fixa
// (um conjunto a cada 40s), quantas cópias a tela pedir.
export type FotoFaixa = { altura: number; titulo: string; texto: string }

export function FaixaFotos({ itens }: { itens: FotoFaixa[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [reps, setReps] = useState(1)

  useEffect(() => {
    const tr = ref.current
    if (!tr) return
    let feito = 0
    let t: ReturnType<typeof setTimeout>
    const monta = (forcar = false) => {
      const w = window.innerWidth
      if (!forcar && feito && w <= feito) return
      const filhos = tr.children.length
      if (!filhos) return
      // largura de um conjunto = largura total / número de conjuntos na tela
      const um = tr.scrollWidth / (filhos / itens.length)
      if (!um) return
      setReps(Math.max(1, Math.ceil((w + um) / um)))
      feito = w
    }
    monta()
    const redimensiona = () => {
      clearTimeout(t)
      t = setTimeout(() => monta(), 200)
    }
    window.addEventListener('resize', redimensiona)
    document.fonts?.ready.then(() => monta(true))
    return () => {
      window.removeEventListener('resize', redimensiona)
      clearTimeout(t)
    }
  }, [itens.length])

  const copias = []
  for (let r = 0; r < reps * 2; r++) {
    for (let i = 0; i < itens.length; i++) {
      const f = itens[i]
      copias.push(
        <div
          key={`${r}-${i}`}
          aria-hidden={r > 0 || undefined}
          className="ph w-[170px] flex-none rounded-card! min-h-0! md:w-[200px] lg:w-[230px] [&>span]:max-w-none! [&>span]:text-[11.5px]!"
          style={{ height: f.altura }}
        >
          <span>
            <b>{f.titulo}</b>
            {f.texto}
          </span>
        </div>,
      )
    }
  }

  return (
    <div
      ref={ref}
      className="hl-track flex w-max items-center *:mr-3"
      style={{ animationDuration: `${40 * reps}s` }}
    >
      {copias}
    </div>
  )
}
