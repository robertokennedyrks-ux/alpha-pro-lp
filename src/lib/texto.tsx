import React from 'react'

// Texto do painel com **negrito**. Devolve os pedaços já com <strong>.
export function Rico({ texto, forte }: { texto?: string | null; forte?: string }) {
  if (!texto) return null
  const partes = texto.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {partes.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={forte}>
            {p}
          </strong>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  )
}

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/ /g, ' ')
