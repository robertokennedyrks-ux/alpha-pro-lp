import { BonusLista } from '@/components/compra/BonusLista'
import { LinkPedido } from '@/components/compra/LinkPedido'
import { montarLoja } from '@/components/compra/loja'
import type { Dados } from '@/lib/dados'
import { textosDe } from '@/lib/textos-padrao'
import { brl } from '@/lib/texto'

// 7b. bônus: quanto mais potes, mais presentes. Some inteira com os bônus desligados.
export function Bonus({ d }: { d: Dados }) {
  const loja = montarLoja(d)
  if (!loja.bonusOn || !loja.bonus.length) return null
  const maxPotes = Math.max(...loja.bonus.map((b) => b.min))
  const soma = loja.bonus.reduce((a, b) => a + b.valor, 0)
  const sub = [d.bonus.subtitulo, d.bonus.entrega].filter(Boolean).join(' ')
  const t = textosDe(d.textos).bonus

  return (
    <section className="bn" id="bonus" data-secao="bonus">
      <div className="wrap lg:grid lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-16 lg:[grid-template-areas:'pill_list'_'h2_list'_'sub_list'_'sum_list']">
        <span className="pill mb-3.5 flex w-fit lg:[grid-area:pill] lg:justify-self-start">{t.etiqueta}</span>
        <h2 className="lg:[grid-area:h2]">
          {t.titulo} {t.tituloLeve && <span className="l">{t.tituloLeve}</span>}
        </h2>
        {sub ? <p className="mt-3 max-w-[34ch] text-[16.5px] text-graphite lg:[grid-area:sub]">{sub}</p> : null}
        <BonusLista loja={loja} />
        <div className="mt-5 flex flex-col gap-3.5 rounded-[24px] bg-[color-mix(in_srgb,var(--color-ink)_4%,var(--color-white))] p-5 text-center lg:mt-8 lg:self-start lg:text-left lg:[grid-area:sum]">
          <p className="text-[16px] leading-[1.35] font-medium text-graphite">
            Com {maxPotes} potes você leva <b className="font-semibold text-ink">{brl(soma)}</b> em bônus de graça.
          </p>
          <LinkPedido className="btn w-full md:mx-auto md:max-w-[440px] lg:max-w-none">
            {d.textos.botoes?.bonus || 'Escolher minha oferta'}{' '}
            <span className="arr text-[20px] leading-none font-normal">↓</span>
          </LinkPedido>
        </div>
      </div>
    </section>
  )
}
