'use client'

import { usePedido } from '@/components/pedido'

import { type Loja, fotoDe, potes } from './loja'

// Foto grande do card da oferta: troca junto com a quantidade escolhida.
// Sem foto na quantidade, usa a do produto; sem nenhuma, o espaço reservado do protótipo.
export function FotoOferta({ loja }: { loja: Loja }) {
  const { qtd } = usePedido()
  const foto = fotoDe(loja, qtd)

  if (!foto) {
    return (
      <div className="ph min-h-[300px] items-center justify-center rounded-none lg:min-h-full">
        <span>
          <b>Foto do produto</b>Pote do {loja.nome} em fundo claro
        </span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={foto.url}
      alt={foto.alt || `${loja.nome} · ${potes(qtd)}`}
      width={foto.w}
      height={foto.h}
      className="h-full min-h-[300px] w-full object-cover"
    />
  )
}
