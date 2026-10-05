'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { type FotoCms, FotoOuEspaco } from '@/components/Foto'
import { Icon } from '@/components/icons'

import { semMovimento } from './midia'

// Descrição de cada espaço de foto enquanto não há foto no painel (texto do protótipo).
const FOTOS = [
  ['Foto 1', 'O pote ALPHA ao lado do ALPHA PRO'],
  ['Foto 2', 'Mão afastando um prato de doces, sem esforço'],
  ['Foto 3', 'A nota fiscal ao lado do pote ALPHA PRO'],
]

/* "Da sua ALPHA para o PRO": texto, foto e bolinha trocam juntos a cada 2,6s; as setas reiniciam o tempo. */
type Item = { texto: string; foto?: FotoCms }

export function JaUsaComparacao({ forte, rotulo, itens }: { forte: string; rotulo: string; itens: Item[] }) {
  const n = itens.length
  const [i, setI] = useState(0) // foto
  const [txt, setTxt] = useState(0) // texto e bolinha (trocam depois do fade)
  const [vis, setVis] = useState(true)
  const iRef = useRef(0)
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const fade = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const goRef = useRef<(n: number) => void>(() => {})

  const go = useCallback((num: number) => {
    const still = semMovimento()
    const k = ((num % n) + n) % n
    iRef.current = k
    setI(k)
    setVis(false)
    clearTimeout(fade.current)
    fade.current = setTimeout(
      () => {
        setTxt(k)
        setVis(true)
      },
      still ? 0 : 250,
    )
    clearInterval(timer.current)
    if (!still) timer.current = setInterval(() => goRef.current(iRef.current + 1), 2600)
  }, [n])

  useEffect(() => {
    goRef.current = go
    if (!semMovimento()) timer.current = setInterval(() => goRef.current(iRef.current + 1), 2600)
    return () => {
      clearInterval(timer.current)
      clearTimeout(fade.current)
    }
  }, [go])

  return (
    <div className="jc-grid">
      <div className="jc-left">
        <Icon name="pote" className="jc-ico" />
        <p className="jc-strong">{forte}</p>
        <div className="jc-ticker">
          <span className="jc-lbl">{rotulo}</span>
          <span className="jc-val" aria-live="polite" style={{ opacity: vis ? 1 : 0 }}>
            {itens[txt]?.texto}
          </span>
          <span className="jc-ctl">
            <button type="button" className="pv-arr" aria-label="Opção anterior" onClick={() => go(iRef.current - 1)}>
              <Icon name="chevron-esquerda" />
            </button>
            <span className="jc-dots" aria-hidden="true">
              {itens.map((_, k) => (
                <i key={k} className={k === txt ? 'on' : undefined} />
              ))}
            </span>
            <button type="button" className="pv-arr" aria-label="Próxima opção" onClick={() => go(iRef.current + 1)}>
              <Icon name="chevron-direita" />
            </button>
          </span>
        </div>
      </div>
      <div className="jc-ph">
        {itens.map((item, k) => (
          <FotoOuEspaco
            key={k}
            foto={item.foto}
            titulo={FOTOS[k]?.[0] ?? `Foto ${k + 1}`}
            texto={FOTOS[k]?.[1] ?? item.texto}
            sizes="(min-width:1024px) 50vw, 100vw"
            className={`jc-slide${k === i ? ' is-on' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
