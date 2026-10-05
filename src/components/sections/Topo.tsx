import { FaixaAnuncios } from '@/components/sections/Anuncios'
import { Cabecalho } from '@/components/topo/Cabecalho'
import type { Dados } from '@/lib/dados'

// Header fixo (faixa de anúncios + barra com menu, marca e sacola) e menu lateral.
export function Topo({ d }: { d: Dados }) {
  return <Cabecalho faixa={<FaixaAnuncios d={d} />} bonusAtivo={d.bonus.ativo !== false} />
}
