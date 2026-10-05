import { Icon } from '@/components/icons'
import type { Dados } from '@/lib/dados'
import { Rico } from '@/lib/texto'

// 10. Chamada final: foto da persona com a pergunta e as duas escolhas.
export function Final({ d }: { d: Dados }) {
  const condicao = d.textos.hero.condicao
  return (
    <section className="final" data-secao="final">
      <div className="wrap">
        <div className="panel flex flex-col overflow-hidden rounded-panel bg-ink text-white lg:grid lg:grid-cols-2">
          <div className="ph fn-photo min-h-[380px] flex-col items-start justify-between rounded-none p-5 max-[380px]:min-h-[340px] md:min-h-[460px] lg:min-h-[560px] lg:p-7">
            <span>
              <b>Foto da persona</b>Mulher de 35 a 45 anos, olhar direto para a câmera, sério e decidido. Luz lateral, P&amp;B.
            </span>
            <div className="fn-head relative mt-auto px-3">
              <p className="fn-kick mb-2.5 text-xs leading-[1.3] font-semibold tracking-[.08em] text-white/70 uppercase">
                Toda segunda, a mesma promessa.
              </p>
              <h2 className="text-[clamp(34px,10.5vw,48px)] leading-[1.02] tracking-[-.035em] text-white md:text-[clamp(34px,10.5vw,48px)] lg:text-[clamp(36px,3.4vw,46px)]">
                Quantas segundas-feiras <i className="fn-l font-light not-italic">mais?</i>
              </h2>
            </div>
          </div>
          <div className="fn-body flex flex-col gap-4 px-8 pt-2 pb-8 max-[380px]:px-6 max-[380px]:pb-6 lg:justify-center lg:gap-5 lg:p-12">
            <ul className="fn-fork m-0 flex list-none flex-col gap-2 p-0" aria-label="Duas escolhas">
              <li className="is-no flex items-center gap-3.5 rounded-lg border border-dashed border-white/22 px-4 py-3.5 text-white/50">
                <span className="fn-ic grid size-8 flex-none place-items-center rounded-[10px] bg-white/10" aria-hidden="true">
                  <Icon name="x-negrito" className="size-[18px]" />
                </span>
                <p className="text-base leading-[1.3] font-medium line-through decoration-1 max-[380px]:text-[15px]">
                  Deixar a fome <b className="font-semibold">mandar</b>
                </p>
              </li>
              <li className="is-yes flex items-center gap-3.5 rounded-lg border border-white/18 bg-[#2a2a2a] px-4 py-3.5 text-white">
                <span className="fn-ic grid size-8 flex-none place-items-center rounded-[10px] bg-white text-ink" aria-hidden="true">
                  <Icon name="check-negrito" className="size-[18px]" />
                </span>
                <p className="text-base leading-[1.3] font-medium max-[380px]:text-[15px]">
                  Desligar a fome e <b className="font-semibold">voltar a mandar</b>
                </p>
              </li>
            </ul>
            <p className="fn-line text-[17px] leading-[1.35] font-semibold tracking-[-.01em] text-white">
              Sua versão alpha está a um clique.
            </p>
            <div className="cta mt-[22px] flex flex-col gap-2.5 md:items-start">
              <a className="btn w-full !bg-white !text-ink hover:!bg-mist" href="#comprar">
                {d.textos.botoes?.principal} <span className="arr text-xl leading-none font-normal">→</span>
              </a>
              {condicao && (
                <p className="under text-center text-[13.5px] text-[#9a9a9a] md:w-full md:max-w-[440px]">
                  <Rico texto={condicao} forte="font-bold text-white" />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
