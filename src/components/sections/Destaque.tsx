import { FaixaFotos, type FotoFaixa } from '@/components/historia/FaixaFotos'
import { Letras } from '@/components/historia/letras'
import { Revelar } from '@/components/historia/Revelar'
import type { Dados } from '@/lib/dados'
import { textosDe } from '@/lib/textos-padrao'

// Alturas da faixa de fotos, em ciclo (iguais ao protótipo).
const ALTURAS = [260, 330, 290, 340, 280]

const Box = ({ texto }: { texto: string }) => (
  <span className="tw-box">
    <Letras texto={texto} />
  </span>
)

// 4a. "Conheça a sua real versão alpha".
export function Destaque({ d }: { d: Dados }) {
  const t = textosDe(d.textos).destaque
  const rotulo = [t.linha1, t.linha2, t.linha2b, t.linha3].join(' ').toLowerCase()
  const fotos: FotoFaixa[] = t.fotos.map((f, i) => ({
    altura: ALTURAS[i % ALTURAS.length],
    titulo: f.titulo ?? '',
    texto: f.texto ?? '',
    foto: f.foto,
  }))
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
          aria-label={rotulo.charAt(0).toUpperCase() + rotulo.slice(1)}
        >
          <span aria-hidden="true">
            <Box texto={t.linha1} />
          </span>
          <span aria-hidden="true">
            <Box texto={t.linha2} />
            <i className="cap" />
            <Box texto={t.linha2b} />
          </span>
          <span aria-hidden="true">
            <Box texto={t.linha3} />
          </span>
        </Revelar>
        <p className="mx-auto mt-5 max-w-[28ch] text-center text-[18px] font-medium text-graphite lg:mt-7 lg:text-[21px]">
          {t.subtitulo}
        </p>
      </div>
      <div className="hl-strip mt-[38px] overflow-hidden lg:mt-16" aria-label="Fotos da rotina dela">
        <FaixaFotos itens={fotos} />
      </div>
    </section>
  )
}
