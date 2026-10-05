import { FaixaAnuncios } from '@/components/sections/Anuncios'
import { Cabecalho, type MenuLateral } from '@/components/topo/Cabecalho'
import type { Dados } from '@/lib/dados'

// Header fixo (faixa de anúncios + barra com menu, marca e sacola) e menu lateral.
export function Topo({ d }: { d: Dados }) {
  const m = d.textos.hero.menu
  const bonusAtivo = d.bonus.ativo !== false
  const menu: MenuLateral = {
    destaque: { texto: m.destaque.texto, link: m.destaque.link, icone: m.destaque.icone },
    conheca: {
      titulo: m.conheca.titulo,
      icone: m.conheca.icone,
      cards: m.conheca.cards.map((c, i) => ({
        l1: c.linha1 ?? '',
        l2: c.linha2 ?? '',
        link: c.link ?? '#',
        foto: d.fotos.menuCards[i] ?? null,
      })),
    },
    itens: m.itens
      .filter((i) => bonusAtivo || i.link.trim() !== '#bonus')
      .map((i) => ({ texto: i.texto, link: i.link, icone: i.icone ?? null })),
    rodape: m.rodape,
  }
  return <Cabecalho faixa={<FaixaAnuncios d={d} />} menu={menu} />
}
