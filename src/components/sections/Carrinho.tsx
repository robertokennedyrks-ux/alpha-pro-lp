import { CarrinhoPainel } from '@/components/compra/CarrinhoPainel'
import { FaixaBonus } from '@/components/compra/FaixaBonus'
import { montarLoja } from '@/components/compra/loja'
import type { Dados } from '@/lib/dados'

// Carrinho (folha/painel), faixa fixa de bônus e barra de frete grátis.
export function Carrinho({ d }: { d: Dados }) {
  const loja = montarLoja(d)
  return (
    <>
      <FaixaBonus loja={loja} />
      <CarrinhoPainel loja={loja} />
    </>
  )
}
