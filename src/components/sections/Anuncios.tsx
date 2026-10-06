import { Faixa } from '@/components/topo/Faixa'
import type { Dados } from '@/lib/dados'

// A faixa de anúncios fica dentro do header fixo (no protótipo, .topbar = .ann + .hdr,
// os dois sobem e descem juntos). Por isso o <Topo> é quem a coloca na página.
export function FaixaAnuncios({ d }: { d: Dados }) {
  const textos = (d.prova.anuncios ?? []).map((a) => a.texto).filter(Boolean)
  if (!textos.length) return null
  return (
    <div
      className="ann overflow-hidden bg-mist text-[12.5px] leading-none font-semibold tracking-[.04em] whitespace-nowrap text-white"
      aria-label="Avisos"
    >
      <Faixa textos={textos} />
    </div>
  )
}
