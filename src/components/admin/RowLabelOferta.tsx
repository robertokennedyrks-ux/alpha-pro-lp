'use client'

import { useRowLabel } from '@payloadcms/ui'

type Opcao = { potes?: number; preco?: number }

// Mostra "2 potes · R$ 434,00" no título de cada opção, em vez de "Opção 02".
export function RowLabelOferta() {
  const { data, rowNumber } = useRowLabel<Opcao>()
  if (!data?.potes) return <span>Opção {(rowNumber ?? 0) + 1}</span>
  const preco = typeof data.preco === 'number' ? data.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''
  return (
    <span>
      {data.potes} {data.potes === 1 ? 'pote' : 'potes'}
      {preco ? ` · ${preco}` : ''}
    </span>
  )
}
