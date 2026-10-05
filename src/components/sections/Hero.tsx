import Image from 'next/image'

import type { Dados } from '@/lib/dados'
import { Rico } from '@/lib/texto'

// 1. Abertura: etiqueta, foto com selo, título, subtítulo, prova social e CTA.
export function Hero({ d }: { d: Dados }) {
  const h = d.textos.hero
  const foto = d.fotos.hero
  const selo = d.prova.selo
  const alturaFoto = 'min-h-[300px] min-[720px]:min-h-[500px] md:min-h-[460px] lg:h-full lg:min-h-[600px]'

  return (
    <section className="hero pt-[14px] pb-12 md:pt-5 md:pb-16 lg:pt-7 lg:pb-24" id="inicio">
      <div className="wrap hero-wrap">
        <div className="hero-top flex items-center justify-between pt-1.5 pb-3.5">
          {h.etiqueta && <small className="text-xs leading-none font-semibold text-stone">{h.etiqueta}</small>}
        </div>

        <div className="hero-stage relative overflow-hidden rounded-panel bg-mist">
          {foto ? (
            <div className={`relative ${alturaFoto}`}>
              <Image
                src={foto.url!}
                alt={foto.alt ?? ''}
                fill
                priority
                sizes="(min-width:1024px) 640px, (min-width:768px) 720px, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className={`ph hero-ph items-start rounded-none ${alturaFoto}`}>
              <span>
                <b>Foto principal</b>Mulher de 35 a 45 anos, olhar firme e confiante, fundo claro. Ela é a protagonista, sem
                pote na mão.
              </span>
            </div>
          )}
          {(selo?.numero || selo?.texto) && (
            <div className="chip absolute bottom-[18px] left-3.5 flex flex-col gap-0.5 rounded-card bg-white px-3.5 py-[11px] shadow-[0_8px_24px_rgba(18,18,18,.08)]">
              {selo.numero && <b className="text-[22px] leading-none font-semibold tracking-[-.03em]">{selo.numero}</b>}
              {selo.texto && <span className="text-[11.5px] font-semibold text-stone">{selo.texto}</span>}
            </div>
          )}
          <div
            className="pot-wf absolute right-[18px] bottom-[18px] flex w-[104px] flex-col gap-1 min-[720px]:w-[140px]"
            aria-label="Espaço para a foto do pote"
          >
            <span className="lid h-[22px] rounded-[7px_7px_2px_2px] border-[1.5px] border-dashed border-stone bg-white/50" />
          </div>
        </div>

        <h1 className="mt-[26px] text-[38px] leading-[1.02] font-semibold tracking-[-.045em] md:text-5xl lg:mt-12 lg:text-[clamp(50px,4.4vw,62px)]">
          {h.titulo}
          {h.tituloLeve && (
            <>
              {' '}
              <span className="l block font-light text-graphite">{h.tituloLeve}</span>
            </>
          )}
        </h1>

        {h.subtitulo && (
          <p className="hero-sub mt-4 text-[17.5px] text-graphite lg:mt-6 lg:max-w-[46ch] lg:text-[19px] lg:leading-[1.55]">
            <Rico texto={h.subtitulo} forte="text-ink" />
          </p>
        )}

        {d.prova.provaHero && (
          <div className="hero-proof mt-[18px] flex items-center gap-3 rounded-card bg-paper px-4 py-3.5 text-[14.5px] text-graphite lg:mt-6 lg:self-start lg:justify-self-start">
            <span className="av flex flex-none" aria-hidden="true">
              <i className="size-[30px] rounded-full border-2 border-paper bg-[#c9c9c9]" />
              <i className="-ml-[9px] size-[30px] rounded-full border-2 border-paper bg-[#b5b5b5]" />
              <i className="-ml-[9px] size-[30px] rounded-full border-2 border-paper bg-line" />
            </span>
            <span>
              <Rico texto={d.prova.provaHero} forte="text-ink" />
            </span>
          </div>
        )}

        <div className="hero-cta mt-[22px] flex flex-col gap-2.5 md:items-start lg:mt-7">
          <a className="btn md:w-full md:max-w-[440px]" href="#comprar">
            {d.textos.botoes?.principal} <span className="arr text-xl leading-none font-normal">→</span>
          </a>
          {h.condicao && (
            <p className="under text-center text-[13.5px] text-stone md:w-full md:max-w-[440px] lg:text-left">
              <Rico texto={h.condicao} forte="font-bold text-ink" />
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
