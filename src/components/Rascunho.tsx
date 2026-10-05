'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { usePathname, useRouter } from 'next/navigation'

// Só aparece no modo rascunho (pré-visualização do painel): recarrega os dados
// a cada salvamento automático e mostra, num canto, um aviso de que é o rascunho.
export function Rascunho({ serverURL }: { serverURL: string }) {
  const router = useRouter()
  const caminho = usePathname()
  return (
    <>
      <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
      <div className="fixed bottom-[104px] left-2 z-[100] flex items-center md:bottom-4 md:left-4 gap-3 rounded-md bg-ink py-1 pr-1 pl-3.5 text-[13px] font-semibold whitespace-nowrap text-white shadow-lg">
        Pré-visualização do rascunho
        <a
          href={`/previa/sair?caminho=${encodeURIComponent(caminho)}`}
          className="inline-flex min-h-[44px] items-center rounded-sm bg-white/15 px-3.5 hover:bg-white/25"
        >
          Sair
        </a>
      </div>
    </>
  )
}
