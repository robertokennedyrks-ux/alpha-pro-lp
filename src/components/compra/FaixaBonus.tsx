'use client'

import { useState } from 'react'

import { Icon } from '@/components/icons'
import { usePedido } from '@/components/pedido'

import { type Loja, liberados } from './loja'

// Faixa fixa "Você ganhou N brindes": aparece quando a quantidade libera bônus e abre o carrinho.
export function FaixaBonus({ loja }: { loja: Loja }) {
  const { qtd, abrirCarrinho, carrinhoAberto } = usePedido()
  const g = liberados(loja, qtd).length
  const on = g > 0
  // Ao subir a quantidade, o ícone do presente dá um pulo.
  const [qAntes, setQAntes] = useState(qtd)
  const [pop, setPop] = useState(0)
  if (qAntes !== qtd) {
    setQAntes(qtd)
    if (qtd > qAntes && on) setPop((p) => p + 1)
  }
  if (!loja.bonusOn || !loja.bonus.length) return null

  return (
    <div className={`gs-host${carrinhoAberto ? ' is-hide' : ''}`}>
      <button
        type="button"
        className={`gift-strip${on ? ' is-on' : ''}${pop ? ' pop' : ''}`}
        id="gift-strip"
        aria-haspopup="dialog"
        aria-controls="gift-sheet"
        aria-hidden={on ? undefined : true}
        tabIndex={on ? undefined : -1}
        onClick={abrirCarrinho}
      >
        <span className="gs-ico" key={pop}>
          <Icon name="presente" />
        </span>
        <span className="gs-txt">
          Você ganhou <b>{g === 1 ? '1 brinde' : `${g} brindes`}</b>
        </span>
        <span className="gs-dots" aria-hidden="true">
          {loja.bonus.map((_, k) => (
            <i key={k} className={k < g ? 'on' : undefined} />
          ))}
        </span>
        <span className="gs-cta">
          <Icon name="chevron-cima" />
        </span>
      </button>
    </div>
  )
}
