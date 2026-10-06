import { Baloes } from '@/components/historia/Baloes'
import { Letras } from '@/components/historia/letras'
import { Revelar } from '@/components/historia/Revelar'
import { Trilha } from '@/components/historia/Trilha'
import { Icon, type IconName } from '@/components/icons'
import { FotoOuEspaco } from '@/components/Foto'
import type { Dados } from '@/lib/dados'

// Posição de cada balão em volta da foto (o 2º e o 3º são escuros).
const lugares = ['b1', 'b2 dk', 'b3 dk', 'b4']

// Linha do fechamento: palavras com hífen não quebram no meio.
function LinhaLetras({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/(\S*-\S*)/).map((p, i) =>
        !p ? null : i % 2 ? (
          <span key={i} className="whitespace-nowrap">
            <Letras ocultar texto={p} />
          </span>
        ) : (
          <Letras key={i} ocultar texto={p} />
        ),
      )}
    </>
  )
}

// 2. espelho da dor.
export function Dor({ d }: { d: Dados }) {
  const t = d.textos.dor
  // "Toda segunda você começa." vira "começa," no computador, e a linha 2 começa com minúscula.
  const ponto = t.fecho1.trimEnd().endsWith('.')
  const l1 = ponto ? t.fecho1.trimEnd().slice(0, -1) : t.fecho1
  const l2 = t.fecho2
  return (
    <section className="soft pain bg-paper" data-secao="dor">
      <div className="wrap stack lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-5 lg:*:col-span-full">
        <span className="pill lg:justify-self-start">{t.etiqueta}</span>
        <h2 className="lg:max-w-[20ch]">
          {t.titulo} {t.tituloLeve && <span className="l">{t.tituloLeve}</span>}
        </h2>
        <p className="mt-2.5 text-[13px] leading-none font-semibold tracking-[.14em] text-graphite uppercase">
          {t.chamada}
        </p>

        <Trilha className="tl flex flex-col gap-[14px] md:max-w-[600px] lg:col-[1]! lg:row-[4] lg:max-w-none">
          {t.dia.map((item, i) => (
            <li key={i} className="relative grid grid-cols-[42px_1fr] gap-[14px]">
              <span className="n grid size-[42px] place-items-center rounded-full bg-realce text-[17px] leading-none font-semibold text-ink">
                {i + 1}
              </span>
              <div className="tc flex min-w-0 flex-col gap-2 rounded-card border border-border p-8">
                <span className="tc-ico mb-1.5 grid size-[34px] flex-none place-items-center rounded-[11px] border border-border bg-paper text-ink">
                  {item.icone && <Icon name={item.icone as IconName} className="size-[17px]" />}
                </span>
                <h3 className="text-[18px] leading-[1.3] font-semibold tracking-[-.01em]">{item.titulo}</h3>
                <p className="text-[15.5px] leading-[1.55] text-graphite">{item.texto}</p>
              </div>
            </li>
          ))}
        </Trilha>

        {/* o sticky para no fim da trilha (card 6) */}
        <div className="bx-hold lg:col-[2]! lg:row-[4]">
          <div className="bx relative mt-2 h-[380px] md:mx-auto md:w-full md:max-w-[560px] lg:sticky lg:top-[max(112px,calc(50vh-230px))] lg:mt-0 lg:h-[460px] lg:max-w-none lg:self-start">
            <div
              className="absolute inset-x-0 bottom-0 h-[300px] rounded-panel bg-realce lg:h-[370px]"
              aria-hidden="true"
            />
            <FotoOuEspaco
              foto={d.fotos.dor}
              titulo="Foto"
              texto="Mulher, olhar cansado"
              sizes="300px"
              className="absolute! top-0 bottom-0 left-1/2 min-h-0! w-[min(62%,300px)] -translate-x-1/2 items-start! justify-center rounded-[24px_24px_0_0]! pt-[26px]! *:text-center"
            />
            <Baloes className="bx-bal" aria-label="O que você vive hoje">
              {t.baloes.slice(0, lugares.length).map((b, i) => (
                <li key={i} className={lugares[i]}>
                  {b.texto}
                </li>
              ))}
            </Baloes>
          </div>
        </div>

        <Revelar
          modo="fecho"
          className="hero-close text-center text-[50px] leading-[1.1] font-semibold tracking-[-.04em] text-balance text-ink py-6 lg:pt-14 lg:pb-4 lg:text-[clamp(52px,5.4vw,68px)]"
        >
          <span className="sr-only">{[t.fecho1, t.fecho2, t.fecho3].join(' ')}</span>
          <span className="block lg:whitespace-nowrap">
            <Letras ocultar texto={l1} />
            {ponto && (
              <>
                <span className="pm">
                  <Letras ocultar texto="." />
                </span>
                <span className="pd">
                  <Letras ocultar texto="," />
                </span>
              </>
            )}
          </span>{' '}
          <span className="block lg:whitespace-nowrap">
            {ponto ? (
              <>
                <span className="pm">
                  <Letras ocultar texto={l2.charAt(0)} />
                </span>
                <span className="pd">
                  <Letras ocultar texto={l2.charAt(0).toLowerCase()} />
                </span>
                <Letras ocultar texto={l2.slice(1)} />
              </>
            ) : (
              <Letras ocultar texto={l2} />
            )}
          </span>{' '}
          <span className="l mt-3.5 block text-[clamp(18px,5.8vw,34px)] font-light tracking-[-.03em] whitespace-nowrap lg:text-[40px]">
            <LinhaLetras texto={t.fecho3} />
          </span>
        </Revelar>

        <div className="flex justify-center pb-6">
          <a className="btn2" href="#comprar">
            {d.textos.botoes?.produto || 'Quero meu ALPHA PRO'} <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
