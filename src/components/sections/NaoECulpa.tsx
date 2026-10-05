import { CartoesNc } from '@/components/historia/CartoesNc'
import { Icon } from '@/components/icons'
import type { Dados } from '@/lib/dados'

// Textos fixos (não existem no CMS), iguais ao protótipo.
const tentativas = ['Dieta', 'Chá', 'Remédio', 'Academia', 'Até caneta']

const cards = [
  { titulo: 'A dieta', texto: 'Quem largou a dieta viu a fome voltar.' },
  {
    titulo: 'Chá, remédio, academia',
    texto: 'Cada tentativa que não deu certo virou mais uma prova, na sua cabeça, de que "o problema sou eu".',
  },
  { titulo: 'Até a caneta', texto: 'Quem parou a caneta viu a fome voltar com tudo.' },
]

const faixa = Array.from({ length: 12 }, () => 'Mas dá para desligar!')

// 3. não é culpa sua.
export function NaoECulpa(_props: { d: Dados }) {
  return (
    <section className="nc overflow-x-clip" data-secao="nao-e-culpa">
      <div className="wrap stack lg:grid lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-x-14 lg:gap-y-[18px] lg:*:col-[2]">
        <div className="ph min-h-[420px] items-end lg:col-[1]! lg:row-[1/span_4] lg:h-full lg:min-h-0!">
          <span>
            <b>Foto 3</b>Mulher pensativa, mão no rosto, olhar cansado, em P&amp;B. Na mesa, desfocados: xícara de chá e
            cartela de remédio.
          </span>
        </div>
        <span className="pill lg:self-end! lg:justify-self-start">Não é culpa sua</span>
        <h2>
          Você não é fraca. <span className="l">Você está lutando contra a fome sozinha.</span>
        </h2>
        <div className="flex flex-wrap gap-2" aria-label="O que você já tentou">
          {tentativas.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-[7px] rounded-sm border border-border bg-paper py-[9px] pr-[14px] pl-[11px] text-[14px] leading-none font-bold text-graphite"
            >
              <Icon name="x-pequeno" className="size-[13px] text-stone" />
              {t}
            </span>
          ))}
        </div>
        <CartoesNc className="mt-1.5 flex flex-col gap-2.5 md:grid md:grid-cols-2 lg:grid-cols-1">
          {cards.map((c, i) => (
            <article
              key={c.titulo}
              className={`nc-card relative flex min-h-[132px] flex-col justify-center gap-2 overflow-hidden rounded-card bg-paper py-[22px] pr-[110px] pl-5 ${i === cards.length - 1 ? 'md:col-span-full lg:col-auto' : ''}`}
            >
              <Icon
                name="rosto-triste-grande"
                className="sad absolute -top-[22px] -right-[26px] size-[118px] text-stone opacity-75"
              />
              <h3 className="text-[19px] leading-[1.15] font-semibold tracking-[-.02em]">{c.titulo}</h3>
              <p className="text-[14.5px] leading-[1.5] text-graphite">{c.texto}</p>
            </article>
          ))}
        </CartoesNc>
        <div className="mt-1.5 flex flex-col items-start gap-[18px] rounded-panel border border-border bg-white px-[22px] pt-[30px] pb-8 lg:col-span-full! lg:mt-7 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-7 lg:gap-y-4 lg:px-11 lg:py-10">
          <p className="text-[clamp(26px,7.6vw,32px)] leading-[1.15] font-semibold tracking-[-.035em] text-balance text-ink lg:flex-[1_1_420px] lg:text-[36px]">
            O problema é que nada até agora segurou a sua fome.
          </p>
          <span className="inline-block rounded-sm bg-mist px-[13px] py-[7px] text-[12px] leading-[1.2] font-semibold tracking-[.03em] text-graphite uppercase">
            A fome nunca foi embora
          </span>
          <p className="-mt-0.5 text-[15.5px] text-graphite">Ela só estava esperando.</p>
        </div>
        <p className="nc-close mx-auto mt-[30px] text-center text-[clamp(28px,8.2vw,36px)] leading-[1.08] font-semibold tracking-[-.045em] text-ink *:block *:whitespace-nowrap lg:col-span-full! lg:mt-12 lg:text-[52px] lg:*:inline">
          <span>Apenas a força</span> <span>de vontade</span>{' '}
          <span className="lg:block!">
            não desliga <i className="pd not-italic">sua </i>fome<i className="pm not-italic">.</i>
          </span>
        </p>
      </div>
      <div
        className="mx-[-5%] mt-[30px] mb-2.5 w-[110%] -rotate-4 overflow-hidden bg-ink py-[14px] lg:mt-12"
        role="text"
        aria-label="Mas dá para desligar!"
      >
        <div className="nc-band-track flex w-max" aria-hidden="true">
          {faixa.map((t, i) => (
            <span
              key={i}
              className="px-3 text-[clamp(20px,6vw,26px)] leading-none font-semibold tracking-[-.04em] whitespace-nowrap text-white uppercase lg:text-[32px]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
