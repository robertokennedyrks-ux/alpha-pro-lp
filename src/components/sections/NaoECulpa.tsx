import { CartoesNc } from '@/components/historia/CartoesNc'
import { Icon } from '@/components/icons'
import { FotoOuEspaco } from '@/components/Foto'
import type { Dados } from '@/lib/dados'
import { textosDe } from '@/lib/textos-padrao'

// Mesmo texto com versões diferentes no computador e no celular: a parte comum fica uma vez só.
function Variante({ pc, celular }: { pc: string; celular: string }) {
  if (pc === celular) return <>{pc}</>
  let a = 0
  while (a < pc.length && a < celular.length && pc[a] === celular[a]) a++
  let z = 0
  while (z < pc.length - a && z < celular.length - a && pc[pc.length - 1 - z] === celular[celular.length - 1 - z]) z++
  return (
    <>
      {pc.slice(0, a)}
      <i className="pd not-italic">{pc.slice(a, pc.length - z)}</i>
      <i className="pm not-italic">{celular.slice(a, celular.length - z)}</i>
      {pc.slice(pc.length - z)}
    </>
  )
}

// 3. não é culpa sua.
export function NaoECulpa({ d }: { d: Dados }) {
  const t = textosDe(d.textos).naoCulpa
  // Linha 3 no celular: vazia usa a linha 3 (se a linha 3 também estiver vazia, o texto do protótipo).
  const cms = d.textos.naoCulpa
  const l3Celular = cms?.fecho3Celular?.trim() || (cms?.fecho3?.trim() ? t.fecho3 : t.fecho3Celular)
  const faixa = Array.from({ length: 12 }, () => t.faixa)
  return (
    <section className="nc overflow-x-clip" data-secao="nao-e-culpa">
      <div className="wrap stack lg:grid lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-x-14 lg:gap-y-[18px] lg:*:col-[2]">
        <FotoOuEspaco
          foto={t.foto}
          titulo="Foto 3"
          texto="Mulher pensativa, mão no rosto, olhar cansado, em P&B. Na mesa, desfocados: xícara de chá e cartela de remédio."
          sizes="(min-width:1024px) 45vw, 100vw"
          className="min-h-[420px] items-end lg:col-[1]! lg:row-[1/span_4] lg:h-full lg:min-h-0!"
        />
        <span className="pill lg:self-end! lg:justify-self-start">{t.etiqueta}</span>
        <h2>
          {t.titulo} {t.tituloLeve && <span className="l">{t.tituloLeve}</span>}
        </h2>
        <div className="flex flex-wrap gap-2" aria-label="O que você já tentou">
          {t.tentativas.map((item, i) => (
            <span
              key={item.id ?? i}
              className="inline-flex items-center gap-[7px] rounded-sm border border-border bg-paper py-[9px] pr-[14px] pl-[11px] text-[14px] leading-none font-bold text-graphite"
            >
              <Icon name="x-pequeno" className="size-[13px] text-stone" />
              {item.texto}
            </span>
          ))}
        </div>
        <CartoesNc className="mt-1.5 flex flex-col gap-2.5">
          {t.cards.map((c, i) => (
            <article
              key={c.id ?? i}
              className="nc-card relative flex min-h-[132px] flex-col justify-center gap-2 overflow-hidden rounded-card bg-paper py-[22px] pr-[110px] pl-5"
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
            {t.destaque}
          </p>
          <span className="inline-block rounded-sm bg-mist px-[13px] py-[7px] text-[12px] leading-[1.2] font-semibold tracking-[.03em] text-graphite uppercase">
            {t.destaqueTag}
          </span>
          <p className="-mt-0.5 text-[15.5px] text-graphite">{t.destaqueTexto}</p>
        </div>
        <p className="nc-close mx-auto mt-[30px] text-center text-[clamp(28px,8.2vw,36px)] leading-[1.08] font-semibold tracking-[-.045em] text-ink *:block *:whitespace-nowrap lg:col-span-full! lg:mt-12 lg:text-[52px] lg:*:inline">
          <span>{t.fecho1}</span> <span>{t.fecho2}</span>{' '}
          <span className="lg:block!">
            <Variante pc={t.fecho3} celular={l3Celular} />
          </span>
        </p>
      </div>
      <div
        className="mx-[-5%] mt-[30px] mb-2.5 w-[110%] -rotate-4 overflow-hidden bg-ink py-[14px] lg:mt-12"
        role="text"
        aria-label={t.faixa}
      >
        <div className="nc-band-track flex w-max" aria-hidden="true">
          {faixa.map((texto, i) => (
            <span
              key={i}
              className="px-3 text-[clamp(20px,6vw,26px)] leading-none font-semibold tracking-[-.04em] whitespace-nowrap text-white uppercase lg:text-[32px]"
            >
              {texto}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
