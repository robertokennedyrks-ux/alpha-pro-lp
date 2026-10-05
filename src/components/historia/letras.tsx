import React from 'react'

// Quebra um texto em palavras (.tw-w, sem quebra de linha no meio) e letras (.tw-c),
// como o JS do protótipo faz antes de revelar o texto pela rolagem.
// Os espaços continuam como texto comum, para a linha quebrar só entre palavras.
export function Letras({ texto, ocultar = false }: { texto: string; ocultar?: boolean }) {
  return (
    <>
      {texto.split(/(\s+)/).map((tok, i) => {
        if (!tok) return null
        if (/^\s+$/.test(tok)) return <React.Fragment key={i}>{tok}</React.Fragment>
        return (
          <span key={i} className="tw-w" aria-hidden={ocultar || undefined}>
            {Array.from(tok).map((c, j) => (
              <span key={j} className="tw-c">
                {c}
              </span>
            ))}
          </span>
        )
      })}
    </>
  )
}
