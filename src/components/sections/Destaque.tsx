import { FaixaFotos, type FotoFaixa } from '@/components/historia/FaixaFotos'
import { Letras } from '@/components/historia/letras'
import { Revelar } from '@/components/historia/Revelar'
import type { Dados } from '@/lib/dados'

// Textos fixos (não existem no CMS): título, subtítulo e legendas das fotos.
const fotos: FotoFaixa[] = [
  { altura: 260, titulo: 'Noite', texto: 'Na cozinha à noite, passando direto pela geladeira' },
  { altura: 330, titulo: 'Espelho', texto: 'Se olhando no espelho, sorrindo' },
  { altura: 290, titulo: 'Provador', texto: 'No provador, à vontade' },
  { altura: 340, titulo: 'Rotina', texto: 'Rindo com as amigas, leve' },
  { altura: 280, titulo: 'Foto', texto: 'Segurando o pote, olhar firme' },
]

const Box = ({ texto }: { texto: string }) => (
  <span className="tw-box">
    <Letras texto={texto} />
  </span>
)

// 4a. "Conheça a sua real versão alpha".
export function Destaque(_props: { d: Dados }) {
  return (
    <section
      className="hl-sec overflow-hidden border-b border-border bg-paper pt-16 pb-14 lg:pt-28 lg:pb-[88px]"
      data-secao="destaque"
    >
      <div className="wrap">
        <Revelar
          modo="titulo"
          as="h2"
          className="hl-title flex flex-col items-center text-center text-[clamp(28px,9vw,54px)]! leading-[1.08]! font-semibold tracking-[-.01em]! text-ink uppercase *:flex *:items-center *:whitespace-nowrap lg:text-[84px]!"
          aria-label="Conheça a sua real versão alpha"
        >
          <span aria-hidden="true">
            <Box texto="CONHEÇA" />
          </span>
          <span aria-hidden="true">
            <Box texto="A SUA" />
            <i className="cap" />
            <Box texto="REAL" />
          </span>
          <span aria-hidden="true">
            <Box texto="VERSÃO ALPHA" />
          </span>
        </Revelar>
        <p className="mx-auto mt-5 max-w-[28ch] text-center text-[18px] font-medium text-graphite lg:mt-7 lg:text-[21px]">
          A que manda na própria fome.
        </p>
      </div>
      <div className="hl-strip mt-[38px] overflow-hidden lg:mt-16" aria-label="Fotos da rotina dela">
        <FaixaFotos itens={fotos} />
      </div>
    </section>
  )
}
