import { Baloes } from '@/components/historia/Baloes'
import { Letras } from '@/components/historia/letras'
import { Revelar } from '@/components/historia/Revelar'
import { Trilha } from '@/components/historia/Trilha'
import { Icon, type IconName } from '@/components/icons'
import type { Dados } from '@/lib/dados'

// Textos fixos (não existem no CMS): a linha do tempo, os balões e o fechamento.
const dia: { icone: IconName; titulo: string; texto: string }[] = [
  { icone: 'prato', titulo: 'A fome chega antes da razão', texto: 'Você come o prato inteiro. Meia hora depois, já está com fome de novo.' },
  { icone: 'bala', titulo: 'Depois do almoço, o doce chama', texto: 'E um doce chama outro.' },
  { icone: 'biscoito-mordido', titulo: 'O beliscar que não para', texto: 'O dia inteiro é um biscoito, um pedaço, uma mordida. Não é refeição.' },
  { icone: 'lua', titulo: 'E aí chega a noite', texto: 'Casa em silêncio, cansaço, geladeira aberta às 23h. O pacote de bolacha que "era só uma".' },
  { icone: 'calendario', titulo: 'A semana da TPM', texto: 'Aquela semana em que nada segura.' },
  { icone: 'pulso', titulo: 'Ansiedade, estresse, tédio', texto: 'Tudo termina na comida.' },
]

const baloes = [
  { cls: 'b1', texto: 'Você come escondido' },
  { cls: 'b2 dk', texto: 'A calça não fecha' },
  { cls: 'b3 dk', texto: 'Evita fotos' },
  { cls: 'b4', texto: 'Ignora o provador' },
]

// 2. espelho da dor.
export function Dor({ d }: { d: Dados }) {
  return (
    <section className="soft pain bg-paper" data-secao="dor">
      <div className="wrap stack lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-5 lg:*:col-span-full">
        <span className="pill lg:justify-self-start">Você se reconhece?</span>
        <h2 className="lg:max-w-[20ch]">
          Você sabe exatamente o que deveria comer. <span className="l">Não adianta.</span>
        </h2>
        <p className="mt-2.5 text-[13px] leading-none font-semibold tracking-[.14em] text-graphite uppercase">
          O seu dia com a fome no comando:
        </p>

        <Trilha className="tl flex flex-col gap-[14px] md:max-w-[600px] lg:col-[1]! lg:row-[4] lg:max-w-none">
          {dia.map((item, i) => (
            <li key={item.titulo} className="relative grid grid-cols-[42px_1fr] gap-[14px]">
              <span className="n grid size-[42px] place-items-center rounded-full bg-ink text-[17px] leading-none font-semibold text-white">
                {i + 1}
              </span>
              <div className="tc flex min-w-0 flex-col gap-2 rounded-card border border-border bg-white p-8 shadow-[0_1px_2px_rgba(18,18,18,.04),0_8px_24px_rgba(18,18,18,.05)]">
                <span className="mb-1.5 grid size-[34px] flex-none place-items-center rounded-[11px] border border-border bg-paper text-ink">
                  <Icon name={item.icone} className="size-[17px]" />
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
              className="absolute inset-x-0 bottom-0 h-[300px] rounded-panel bg-ink lg:h-[370px]"
              aria-hidden="true"
            />
            <div className="ph absolute! top-0 bottom-0 left-1/2 min-h-0! w-[min(62%,300px)] -translate-x-1/2 items-start! justify-center rounded-[24px_24px_0_0]! pt-[26px]! *:text-center">
              <span>
                <b>Foto</b>Mulher, olhar cansado
              </span>
            </div>
            <Baloes className="bx-bal" aria-label="O que você vive hoje">
              {baloes.map((b) => (
                <li key={b.cls} className={b.cls}>
                  {b.texto}
                </li>
              ))}
            </Baloes>
          </div>
        </div>

        <Revelar
          modo="fecho"
          className="hero-close text-center text-[50px] leading-[1.1] font-semibold tracking-[-.04em] text-balance text-ink py-6 lg:pt-14 lg:pb-4 lg:text-[clamp(52px,5.4vw,68px)]"
          aria-label="Toda segunda você começa. Toda quarta a fome vence. Quantas segundas-feiras mais?"
        >
          <span className="block lg:whitespace-nowrap">
            <Letras ocultar texto="Toda segunda você começa" />
            <span className="pm">
              <Letras ocultar texto="." />
            </span>
            <span className="pd">
              <Letras ocultar texto="," />
            </span>
          </span>{' '}
          <span className="block lg:whitespace-nowrap">
            <span className="pm">
              <Letras ocultar texto="T" />
            </span>
            <span className="pd">
              <Letras ocultar texto="t" />
            </span>
            <Letras ocultar texto="oda quarta a fome vence." />
          </span>{' '}
          <span className="l mt-3.5 block text-[clamp(18px,5.8vw,34px)] font-light tracking-[-.03em] whitespace-nowrap lg:text-[40px]">
            <Letras ocultar texto="Quantas " />
            <span className="whitespace-nowrap">
              <Letras ocultar texto="segundas-feiras" />
            </span>
            <Letras ocultar texto=" mais?" />
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
