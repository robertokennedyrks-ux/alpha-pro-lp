'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/icons'

import { semMovimento } from './midia'

const VALORES = ['Mais controle da fome', 'Menos vontade de doce', 'A mesma nota fiscal']
const FOTOS = [
  ['Foto 1', 'O pote ALPHA ao lado do ALPHA PRO'],
  ['Foto 2', 'Mão afastando um prato de doces, sem esforço'],
  ['Foto 3', 'A nota fiscal ao lado do pote ALPHA PRO'],
]

/* "Da sua ALPHA para o PRO": texto, foto e bolinha trocam juntos a cada 2,6s; as setas reiniciam o tempo. */
export function JaUsaComparacao() {
  const [i, setI] = useState(0) // foto
  const [txt, setTxt] = useState(0) // texto e bolinha (trocam depois do fade)
  const [vis, setVis] = useState(true)
  const iRef = useRef(0)
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const fade = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const goRef = useRef<(n: number) => void>(() => {})

  const go = useCallback((n: number) => {
    const still = semMovimento()
    const k = (n + VALORES.length) % VALORES.length
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
  }, [])

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
        <p className="jc-strong">Só que mais forte.</p>
        <div className="jc-ticker">
          <span className="jc-lbl">Da sua ALPHA para o PRO:</span>
          <span className="jc-val" aria-live="polite" style={{ opacity: vis ? 1 : 0 }}>
            {VALORES[txt]}
          </span>
          <span className="jc-ctl">
            <button type="button" className="pv-arr" aria-label="Opção anterior" onClick={() => go(iRef.current - 1)}>
              <Icon name="chevron-esquerda" />
            </button>
            <span className="jc-dots" aria-hidden="true">
              {VALORES.map((_, k) => (
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
        {FOTOS.map(([t, s], k) => (
          <div key={k} className={`ph jc-slide${k === i ? ' is-on' : ''}`}>
            <span>
              <b>{t}</b>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
