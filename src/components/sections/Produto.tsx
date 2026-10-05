import React from 'react'

import { Sentir } from '@/components/historia/Sentir'
import { Icon, type IconName } from '@/components/icons'
import type { Dados } from '@/lib/dados'

// Textos fixos (não existem no CMS), iguais ao protótipo. Só o botão vem do painel.
const sentir: { icone: IconName; texto: React.ReactNode }[] = [
  { icone: 'bala-riscada', texto: <>Menos vontade<br />de comer doce</> },
  { icone: 'lua-grande', texto: <>Não ataca mais<br />a geladeira à noite</> },
  { icone: 'tigela-quente', texto: 'Barriga cheia por mais tempo' },
  { icone: 'raio', texto: <>Mais disposição<br />para o seu dia</> },
]

const linhas = [
  'Para de recomeçar a dieta toda segunda',
  'Não depende só da força de vontade',
  'Menos beliscos ao longo do dia',
  'Sente que voltou a ter o controle',
  'Só 2 cápsulas por dia, sem complicação',
]

const cabeca =
  'flex flex-col items-center justify-end gap-2 px-1 py-2.5 text-center text-[12px] leading-[1.25] font-bold tracking-[.04em] uppercase'

function ItemSentir({ icone, texto, copia }: { icone: IconName; texto: React.ReactNode; copia?: boolean }) {
  return (
    <li
      className={`flex min-w-0 flex-col items-center gap-3 ${copia ? 'cl in' : ''}`}
      aria-hidden={copia || undefined}
    >
      <span className="ico relative grid size-[92px] place-items-center rounded-full border-[1.5px] border-border bg-white text-ink">
        <Icon name={icone} className="size-11" />
        <i className="sp absolute top-0.5 right-1 text-[14px] text-[#9a9a9a] not-italic" aria-hidden="true">
          ✦
        </i>
      </span>
      <p className="max-w-[12ch] text-[14.5px] leading-[1.3] font-bold text-ink md:max-w-[14ch]">{texto}</p>
    </li>
  )
}

// 4. o produto.
export function Produto({ d }: { d: Dados }) {
  return (
    <section className="soft prod bg-paper" data-secao="produto">
      <div className="wrap stack lg:grid lg:grid-cols-2 lg:gap-6 lg:*:col-span-full">
        <div className="flex flex-col gap-3 text-graphite lg:mb-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:text-[18px] lg:leading-[1.6] lg:*:px-2 [&_strong]:font-bold [&_strong]:text-ink">
          <p>
            O ALPHA PRO é a versão mais forte da linha ALPHA, feita para atacar a fome por todos os lados:{' '}
            <strong>a vontade de doce, o estômago que nunca enche e o beliscar que não para.</strong>
          </p>
          <p>
            Você não precisa esperar semanas para saber se funciona. A maioria das clientes sente a fome diminuir{' '}
            <strong>já no primeiro ou no segundo dia</strong>. E o efeito aumenta com o uso.
          </p>
        </div>

        <Sentir className="feel rounded-panel bg-[#12121208] p-8 text-center text-ink lg:col-[1]! lg:flex lg:flex-col lg:justify-center lg:overflow-hidden lg:px-9 lg:py-11">
          <h3 className="text-[clamp(24px,7vw,30px)] leading-[1.1] font-semibold tracking-[-.03em]">
            O que você vai sentir
          </h3>
          <p className="mx-auto mt-2.5 max-w-[30ch] text-[15px] leading-[1.5] text-graphite">
            A vontade de doce, o estômago que nunca enche e o beliscar que não para.
          </p>
          <ul className="mt-[26px] grid grid-cols-2 gap-x-3 gap-y-[26px] md:grid-cols-4 lg:mt-10 lg:flex lg:w-max lg:gap-0">
            {sentir.map((s) => (
              <ItemSentir key={s.icone} {...s} />
            ))}
            {sentir.map((s) => (
              <ItemSentir key={`cl-${s.icone}`} {...s} copia />
            ))}
          </ul>
        </Sentir>

        <div className="cmp rounded-[24px] border border-border bg-white p-6 lg:col-[2]! lg:flex lg:items-center lg:p-8">
          <div className="mx-auto w-full max-w-[440px] md:max-w-none" role="table" aria-label="Sem Alpha PRO e com Alpha PRO">
            <div className="cmp-head grid grid-cols-[minmax(0,1fr)_76px_76px] md:grid-cols-[minmax(0,1fr)_112px_112px]" role="row">
              <h3
                className="self-center py-2 pr-2 pl-0.5 text-[clamp(21px,6.8vw,30px)] leading-[1.02] font-semibold tracking-[-.045em] text-ink"
                role="columnheader"
              >
                A decisão muda tudo
              </h3>
              <span className={`${cabeca} text-graphite`} role="columnheader">
                <Icon name="rosto-triste" className="size-[34px] text-stone" />
                Sem Alpha PRO
              </span>
              <span
                className={`${cabeca} rounded-t-[12px] border-2 border-b-0 border-white bg-ink pt-[14px] text-white`}
                role="columnheader"
              >
                <i
                  className="h-9 w-6 rounded-[6px_6px_9px_9px] border-[1.8px] border-dashed border-stone bg-white/12"
                  aria-hidden="true"
                />
                Com Alpha PRO
              </span>
            </div>
            {linhas.map((l) => (
              <div
                key={l}
                className="cmp-row grid grid-cols-[minmax(0,1fr)_76px_76px] md:grid-cols-[minmax(0,1fr)_112px_112px]"
                role="row"
              >
                <span className="cmp-lbl text-[12.5px] leading-[1.2] font-semibold tracking-[-.01em] text-ink lg:text-[14px]" role="rowheader">
                  {l}
                </span>
                <span className="cmp-c" role="cell">
                  <Icon name="x-circulo" className="size-6" aria-hidden={false} role="img" aria-label="Não" />
                </span>
                <span className="cmp-c is-on" role="cell">
                  <Icon name="check-circulo" className="size-6" aria-hidden={false} role="img" aria-label="Sim" />
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[23px] leading-[1.2] font-semibold tracking-[-.02em] text-balance text-ink lg:mt-6 lg:text-[28px]">
          Com a fome sob controle, <span className="font-light">fica mais fácil seguir firme.</span>
        </p>
        <div className="mt-[22px] flex flex-col gap-2.5 md:items-center lg:mt-1">
          <a className="btn md:w-full md:max-w-[440px]" href="#comprar">
            {d.textos.botoes?.produto || 'Quero meu ALPHA PRO'}{' '}
            <span className="text-[20px] leading-none font-normal">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
