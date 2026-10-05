'use client'

import React, { useEffect, useState } from 'react'

import { Icon } from '@/components/icons'

// Sanfona do rodapé: no PC fica aberta (e não fecha); no celular/tablet começa fechada.
export function GrupoRodape({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width:1024px)')
    const set = () => setAberto(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  return (
    <details className="ft-grp group" open={aberto} onToggle={(e) => setAberto(e.currentTarget.open)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-sm py-3.5 text-[19px] leading-[1.2] font-semibold tracking-[-.01em] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone lg:pointer-events-none lg:pt-1">
        {titulo}
        <Icon
          name="chevron-baixo"
          className="ft-chev size-[22px] flex-none transition-transform duration-250 group-open:rotate-180 lg:hidden"
        />
      </summary>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0 pb-3">{children}</ul>
    </details>
  )
}
