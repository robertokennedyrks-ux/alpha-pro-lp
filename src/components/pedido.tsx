'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Estado compartilhado do pedido: quantos potes estão escolhidos e se o carrinho está aberto.
// A oferta, o carrinho, a faixa de bônus e o header leem e mudam daqui.
type Pedido = {
  qtd: number
  setQtd: (n: number) => void
  carrinhoAberto: boolean
  abrirCarrinho: () => void
  fecharCarrinho: () => void
}

const Ctx = createContext<Pedido | null>(null)

export function PedidoProvider({ children, qtdInicial = 1 }: { children: React.ReactNode; qtdInicial?: number }) {
  const [qtd, setQtd] = useState(qtdInicial)
  const [carrinhoAberto, setAberto] = useState(false)
  const abrirCarrinho = useCallback(() => setAberto(true), [])
  const fecharCarrinho = useCallback(() => setAberto(false), [])
  const value = useMemo(
    () => ({ qtd, setQtd, carrinhoAberto, abrirCarrinho, fecharCarrinho }),
    [qtd, carrinhoAberto, abrirCarrinho, fecharCarrinho],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function usePedido() {
  const v = useContext(Ctx)
  if (!v) throw new Error('usePedido precisa estar dentro de <PedidoProvider>')
  return v
}
