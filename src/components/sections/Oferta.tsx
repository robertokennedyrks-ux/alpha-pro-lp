import { OfertaEscolha } from '@/components/compra/OfertaEscolha'
import { montarLoja } from '@/components/compra/loja'
import { Icon, type IconName } from '@/components/icons'
import type { Dados } from '@/lib/dados'
import { Rico, brl } from '@/lib/texto'

// 8. oferta: quanto já gastou, card do produto com o carrossel de ofertas e selos de confiança.
export function Oferta({ d }: { d: Dados }) {
  const loja = montarLoja(d)
  const avulso = loja.opcoes.find((o) => o.potes === 1) ?? loja.opcoes[0]
  // "menos de R$ 7,60": preço por dia do pote avulso, arredondado para cima nos 10 centavos.
  const porDia = avulso ? brl(Math.ceil((avulso.preco / avulso.potes / loja.dias) * 10 - 1e-9) / 10) : ''
  const fraseDia = (d.textos.oferta?.precoPorDia || '').replace('{valor}', porDia)
  const t = d.textos.oferta
  const fraseGastos = t.fraseGastos.replace(/\{produto\}/g, loja.nome).replace(/\{valor\}/g, porDia)

  return (
    <section className="bg-paper" id="oferta" data-secao="oferta">
      <div className="wrap stack">
        <span className="pill">{t.etiqueta}</span>
        <h2 className="lg:max-w-[26ch]">
          {t.titulo} {t.tituloLeve && <span className="l">{t.tituloLeve}</span>}
        </h2>
        <div className="flex flex-col gap-3 text-graphite">
          <ul
            className="mt-1.5 mb-2.5 grid list-none grid-cols-2 gap-x-3.5 gap-y-[18px] p-0 lg:grid-cols-[repeat(4,auto)] lg:justify-start lg:gap-x-8 lg:gap-y-3.5"
            aria-label="Onde o dinheiro foi"
          >
            {t.gastos.map((g, i) => (
              <li
                key={i}
                className="flex min-w-0 items-center gap-2.5 text-[15px] leading-[1.3] font-semibold tracking-[-.01em] text-ink max-[380px]:flex-col max-[380px]:items-start max-[380px]:gap-1.5"
              >
                <span className="grid size-11 flex-none place-items-center text-ink">
                  {g.icone && <Icon name={g.icone as IconName} className="size-10" />}
                </span>
                <span>{g.texto}</span>
              </li>
            ))}
          </ul>
          {porDia ? (
            <p>{fraseGastos}</p>
          ) : null}
        </div>
        <div className="overflow-hidden rounded-panel border border-border bg-white shadow-[0_18px_50px_rgba(18,18,18,.07)] lg:grid lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-stretch">
          {loja.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={loja.foto.url}
              alt={loja.foto.alt}
              width={loja.foto.w}
              height={loja.foto.h}
              className="h-full min-h-[300px] w-full object-cover"
            />
          ) : (
            <div className="ph min-h-[300px] items-center justify-center rounded-none lg:min-h-full">
              <span>
                <b>Foto do produto</b>Pote do {loja.nome} em fundo claro
              </span>
            </div>
          )}
          <div className="flex flex-col gap-1.5 p-8 lg:p-11" id="comprar">
            <span className="pill bg-[#d6d6d6] text-graphite">{t.cardEtiqueta}</span>
            <h3 className="mt-3.5 flex items-center gap-2.5 text-[clamp(17px,5.6vw,26px)] leading-[1.15] font-semibold tracking-[-.025em] whitespace-nowrap">
              {loja.nome}{' '}
              {loja.capsulas ? (
                <span className="flex-none rounded-sm bg-ink px-2.5 py-1.5 text-[clamp(10.5px,3.2vw,12.5px)] leading-none font-bold tracking-normal text-white">
                  {loja.capsulas}
                </span>
              ) : null}
            </h3>
            <p className="mt-2.5 text-[15.5px] leading-[1.55] text-graphite">
              1 pote{loja.capsulas ? ` com ${loja.capsulas}` : ''} = {loja.dias} dias de uso.{fraseDia ? ` ${fraseDia}` : ''}
            </p>
            <p className="mt-[22px] block text-[14px] leading-none font-medium text-ink">{t.escolha}</p>
            <OfertaEscolha loja={loja} />
            {d.textos.oferta?.garantia ? (
              <p className="mt-3.5 flex items-center justify-center gap-2 text-left text-[14px] leading-[1.35] text-ink">
                <Icon name="escudo-check" className="size-5 flex-none" />
                <span>
                  <Rico texto={d.textos.oferta.garantia} />
                </span>
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-[22px] grid grid-cols-2 gap-3 lg:mt-7 lg:grid-cols-4 lg:gap-4">
          {t.confianca.map((c, i) => (
            <div key={i} className="flex min-w-0 flex-col items-center gap-1.5 rounded-panel bg-white p-6 text-center">
              <span className="mb-2 grid size-16 place-items-center rounded-full bg-paper text-ink">
                {c.icone && <Icon name={c.icone as IconName} className="size-8" />}
              </span>
              <h3 className="text-[15.5px] leading-[1.25] font-semibold tracking-[-.01em]">{c.titulo}</h3>
              {c.texto && <p className="text-[13.5px] leading-[1.45] text-graphite">{c.texto}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
