import React from 'react'

import { Icon, type IconName } from '@/components/icons'
import { GrupoRodape } from '@/components/topo/GrupoRodape'
import { ComQuebras } from '@/components/Foto'
import { type Dados, whatsappUrl } from '@/lib/dados'

const externo = (href: string) => (/^https?:/.test(href) ? { target: '_blank', rel: 'noopener' } : {})

const linkCls =
  'inline-block py-[7px] text-[15px] text-graphite no-underline hover:text-ink hover:underline hover:underline-offset-3'

const legalLink =
  'ft-toque text-[13px] font-bold text-ink underline decoration-[1.5px] underline-offset-2'

const redes: { k: 'instagram' | 'tiktok' | 'facebook' | 'youtube'; rotulo: string }[] = [
  { k: 'instagram', rotulo: 'Instagram' },
  { k: 'tiktok', rotulo: 'TikTok' },
  { k: 'facebook', rotulo: 'Facebook' },
  { k: 'youtube', rotulo: 'YouTube' },
]

// O telefone de exibição dentro do texto da empresa vira link de ligação (como no protótipo).
function TextoEmpresa({ texto, fone, numero }: { texto: string; fone?: string | null; numero?: string | null }) {
  if (!fone || !numero || !texto.includes(fone)) return <>{texto}</>
  const [antes, ...resto] = texto.split(fone)
  return (
    <>
      {antes}
      <a className={legalLink} href={`tel:+${numero}`}>
        {fone}
      </a>
      {resto.join(fone)}
    </>
  )
}

export function Rodape({ d }: { d: Dados }) {
  const c = d.contato
  const t = d.textos.rodape
  const bonusOn = d.bonus.ativo !== false
  const wa = whatsappUrl(d)
  const redesAtivas = redes.filter((r) => c.redes?.[r.k])

  const atendimento: { rotulo: string; href: string }[] = []
  if (wa) atendimento.push({ rotulo: `WhatsApp ${c.whatsappExibicao ?? ''}`.trim(), href: wa })
  if (c.lojaTexto) atendimento.push({ rotulo: c.lojaTexto, href: c.lojaMaps || '#' })
  for (const p of d.politicas) if (p.slug) atendimento.push({ rotulo: p.titulo, href: `/${p.slug}` })

  const grupos = [
    ...(c.grupos ?? []).map((g) => ({
      titulo: g.titulo,
      links: (g.links ?? []).filter((l) => bonusOn || l.href !== '#bonus'),
    })),
    { titulo: t.tituloAtendimento, links: atendimento },
  ]

  return (
    <footer className="ft border-t border-border bg-card pt-11 pb-10 text-ink lg:pt-[72px] lg:pb-12">
      <div className="wrap flex flex-col">
        <div
          className="ft-mono relative mb-7 h-[120px] w-full overflow-hidden rounded-lg bg-mist text-white lg:mb-12 lg:h-[170px]"
          aria-hidden="true"
        >
          <span className="ft-a absolute -right-[1%] -bottom-[52%] text-[210px] leading-none font-extrabold tracking-[-.08em] text-white opacity-10 lg:-bottom-[42%] lg:text-[520px]">
            A
          </span>
          <p className="ft-tag absolute bottom-5 left-5 text-xl leading-[1.15] font-semibold tracking-[-.02em] text-white lg:bottom-10 lg:left-10 lg:text-[40px]">
            <ComQuebras texto={t.faixa} />
          </p>
        </div>

        <div className="ft-top grid grid-cols-[minmax(0,1fr)] gap-7 border-b border-ink/14 pb-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-[72px] lg:pb-10">
          <div className="ft-brand flex flex-col gap-5 lg:order-2">
            {redesAtivas.length > 0 && (
              <div className="ft-soc flex gap-1.5" aria-label="Redes sociais">
                {redesAtivas.map((r) => {
                  const href = c.redes![r.k]!
                  return (
                    <a
                      key={r.k}
                      href={href}
                      {...externo(href)}
                      aria-label={r.rotulo}
                      className="grid size-11 place-items-center rounded-md text-ink hover:bg-ink/7"
                    >
                      <Icon name={r.k as IconName} className="size-6" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
          <nav
            className="ft-nav flex flex-col lg:grid lg:grid-cols-4 lg:content-start lg:gap-6"
            aria-label="Links do rodapé"
          >
            {grupos.map((g) => (
              <GrupoRodape key={g.titulo} titulo={g.titulo}>
                {g.links.map((l, i) => (
                  <li key={i}>
                    <a className={linkCls} href={l.href} {...externo(l.href)}>
                      {l.rotulo}
                    </a>
                  </li>
                ))}
              </GrupoRodape>
            ))}
          </nav>
        </div>

        {(c.formasPagamento?.length ?? 0) > 0 && (
          <div className="ft-row pt-6 lg:flex lg:items-center lg:gap-6 lg:pt-7">
            <p className="ft-h mb-3 text-sm leading-[1.2] font-bold tracking-[.02em] text-ink lg:m-0 lg:flex-[0_0_200px]">
              {t.tituloPagamento}
            </p>
            <ul className="ft-pay m-0 flex list-none flex-wrap gap-2 p-0">
              {c.formasPagamento!.map((f) => (
                <li
                  key={f}
                  className="grid h-[38px] min-w-[68px] place-items-center rounded-sm border-[1.5px] border-ink px-2.5 text-[12.5px] leading-none font-bold tracking-[-.01em] text-ink"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="ft-legal mt-7 flex flex-col gap-2.5 border-t border-ink/14 pt-6 text-xs leading-[1.55] text-graphite">
          {c.avisoLegal && <p className="text-[13px] lg:max-w-[90ch]">{c.avisoLegal}</p>}
          {c.empresa && (
            <p className="text-[13px] lg:max-w-[90ch]">
              <TextoEmpresa texto={c.empresa} fone={c.whatsappExibicao} numero={c.whatsapp} />
            </p>
          )}
          <div className="ft-sec mt-3.5 text-sm text-ink lg:flex lg:items-center lg:gap-6" aria-label="Compre com segurança">
            <ul className="ft-seals m-0 grid list-none grid-cols-2 gap-x-4 gap-y-3.5 p-0 lg:grid-cols-[repeat(4,auto)] lg:justify-start lg:gap-x-9 lg:gap-y-4">
              {t.selos.map((s, i) => (
                <Selo key={i} icone={s.icone} titulo={s.titulo} texto={s.texto ?? ''} />
              ))}
            </ul>
          </div>
          <div className="ft-copy mt-1.5 flex items-center gap-2.5 text-stone">
            <span className="mark text-sm leading-none font-semibold tracking-[-.03em] text-ink">
              ALPHA<span className="ml-0.5 font-light">PRO</span>
            </span>
            {c.copyright && <p className="text-[13px]">{c.copyright}</p>}
          </div>
        </div>
      </div>
    </footer>
  )
}

function Selo({ icone, titulo, texto }: { icone?: string | null; titulo: string; texto: string }) {
  return (
    <li className="flex items-center gap-2 text-ink">
      {icone && <Icon name={icone as IconName} className="size-[26px] flex-none" />}
      <span className="flex flex-col text-[11px] leading-[1.2] font-medium text-graphite">
        <b className="text-[13px] leading-[1.15] font-bold text-ink">{titulo}</b>
        {texto}
      </span>
    </li>
  )
}
