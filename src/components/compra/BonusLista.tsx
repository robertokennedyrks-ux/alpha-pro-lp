'use client'

import { useState } from 'react'

import { Icon } from '@/components/icons'
import { usePedido } from '@/components/pedido'
import { brl } from '@/lib/texto'

import type { Loja } from './loja'

// Cards dos bônus: Liberado/Bloqueado conforme a quantidade escolhida; o "+" escolhe a oferta que libera o bônus.
export function BonusLista({ loja }: { loja: Loja }) {
  const { qtd, setQtd } = usePedido()
  // Bônus que acabaram de liberar pulam uma vez (não na primeira pintura).
  const [antes, setAntes] = useState(qtd)
  const [novos, setNovos] = useState<number[]>([])
  if (antes !== qtd) {
    setAntes(qtd)
    setNovos(loja.bonus.map((b, i) => (qtd >= b.min && antes < b.min ? i : -1)).filter((i) => i >= 0))
  }

  return (
    <ol className="bn-list mt-7 flex list-none flex-col gap-3 p-0 lg:mt-0 lg:[grid-area:list]" id="bn-list">
      {loja.bonus.map((b, i) => {
        const on = qtd >= b.min
        return (
          <li
            key={i}
            className={`bn-card${on ? ' is-on' : ''}${novos.includes(i) ? ' is-new' : ''}`}
            data-min={b.min}
            onAnimationEnd={() => setNovos((v) => v.filter((k) => k !== i))}
          >
            <div className="flex justify-center">
              <span className="bn-ico">
                <Icon name={b.icone ?? 'presente'} />
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[13px] leading-[1.2] font-semibold tracking-[.06em] text-stone uppercase">
                  Bônus {i + 1} · com {b.min} {b.min === 1 ? 'pote' : 'potes'}
                </span>
                <span className="bn-st">
                  <span className="bn-ok">
                    <Icon name="check-pequeno" />
                    Liberado
                  </span>
                  <span className="bn-lk">
                    <Icon name="cadeado" />
                    Bloqueado
                  </span>
                </span>
              </div>
              <h3 className="bn-title">{b.titulo}</h3>
              {b.descricao ? <p className="text-[15px] leading-[1.45] text-graphite">{b.descricao}</p> : null}
              <p className="mt-1 flex items-center gap-2">
                {b.valor ? <s className="text-[13.5px] leading-none font-medium text-stone">{brl(b.valor)}</s> : null}
                <span className="ct-free">Grátis</span>
                <button
                  type="button"
                  className="bn-add"
                  aria-label={`Selecionar a oferta de ${b.min} ${b.min === 1 ? 'pote' : 'potes'} e liberar este bônus`}
                  onClick={() => {
                    if (qtd >= b.min) return
                    const alvo = loja.opcoes.find((o) => o.potes >= b.min)
                    if (alvo) setQtd(alvo.potes)
                  }}
                >
                  <Icon name="mais-botao" className="ic-add" />
                  <Icon name="check-pequeno" className="ic-ok" />
                </button>
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
