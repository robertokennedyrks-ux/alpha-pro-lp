'use client'

import { useState, useSyncExternalStore } from 'react'

const CHAVE = 'alpha-cookies'

const assinar = (cb: () => void) => {
  window.addEventListener('storage', cb)
  window.addEventListener(CHAVE, cb)
  return () => {
    window.removeEventListener('storage', cb)
    window.removeEventListener(CHAVE, cb)
  }
}
const jaAceito = () => {
  try {
    return !!localStorage.getItem(CHAVE)
  } catch {
    return false
  }
}

// Aviso de cookies: aparece até a pessoa aceitar; o aceite fica salvo no navegador.
export function Cookies({
  texto,
  botao,
  politica,
}: {
  texto: string
  botao: string
  politica: { titulo: string; href: string } | null
}) {
  // no servidor conta como aceito (não pisca); no navegador lê o localStorage
  const aceito = useSyncExternalStore(assinar, jaAceito, () => true)
  const [fechado, setFechado] = useState(false)
  const visivel = !aceito && !fechado

  const aceitar = () => {
    setFechado(true)
    try {
      localStorage.setItem(CHAVE, 'ok')
    } catch {}
    window.dispatchEvent(new Event(CHAVE))
  }

  return (
    <div
      className="ck fixed right-2 bottom-2 left-2 z-60 flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-3.5 text-sm leading-[1.4] text-ink shadow-[0_18px_50px_rgba(18,18,18,.16)] lg:right-auto lg:max-w-[440px]"
      id="ck"
      data-aviso-cookies
      role="region"
      aria-label="Aviso de cookies"
      hidden={!visivel}
    >
      <p className="m-0 flex-1">
        {texto}
        {politica && (
          <>
            {' '}
            <a
              className="font-bold text-ink underline decoration-[1.5px] underline-offset-2"
              href={politica.href}
            >
              {politica.titulo}
            </a>
            .
          </>
        )}
      </p>
      <button
        type="button"
        id="ck-ok"
        className="h-11 flex-none cursor-pointer rounded-md border-0 bg-ink px-[18px] text-sm leading-none font-semibold text-white"
        onClick={aceitar}
      >
        {botao}
      </button>
    </div>
  )
}
