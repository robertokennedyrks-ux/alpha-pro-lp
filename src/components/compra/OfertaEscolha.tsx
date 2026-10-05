'use client'

import { useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/icons'
import { usePedido } from '@/components/pedido'
import { brl } from '@/lib/texto'

import { LinkPedido } from './LinkPedido'
import { type Loja, linkDe, parcela, precoPix, totalDe } from './loja'

function pertoDe(t: HTMLElement | null, pos: number[]) {
  if (!t) return 0
  let b = 0
  let bd = 1e9
  pos.forEach((x, k) => {
    const d = Math.abs(x - t.scrollLeft)
    if (d < bd) {
      bd = d
      b = k
    }
  })
  return b
}

// Carrossel de ofertas (.ofc) + preço da oferta escolhida + botão de pedido.
export function OfertaEscolha({ loja }: { loja: Loja }) {
  const { qtd, setQtd } = usePedido()
  const trackRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLElement | null)[]>([])
  const posRef = useRef<number[]>([])
  const cliqueRef = useRef<number | null>(qtd)
  const arrastouRef = useRef(false)
  const [paginas, setPaginas] = useState(loja.opcoes.length)
  const [atual, setAtual] = useState(0)
  const [arrastando, setArrastando] = useState(false)

  const maisPerto = () => pertoDe(trackRef.current, posRef.current)

  // Posições reais de rolagem: no PC cabem várias ofertas, então há menos "páginas" que cards.
  useEffect(() => {
    const t = trackRef.current
    if (!t) return
    const medir = () => {
      const cards = cardsRef.current.filter(Boolean) as HTMLElement[]
      if (!cards.length) return
      const base = cards[0].offsetLeft
      const max = t.scrollWidth - t.clientWidth
      const pos: number[] = []
      cards.forEach((c) => {
        const x = Math.min(max, Math.max(0, c.offsetLeft - base))
        if (!pos.length || x - pos[pos.length - 1] > 8) pos.push(x)
      })
      posRef.current = pos
      setPaginas(pos.length)
      setAtual(pertoDe(t, pos))
    }
    const ro = new ResizeObserver(medir)
    ro.observe(t)
    return () => ro.disconnect()
  }, [loja.opcoes.length])

  // Quantidade mudou fora do carrossel (bônus, carrinho): leva até a oferta escolhida.
  useEffect(() => {
    if (cliqueRef.current === qtd) return
    cliqueRef.current = qtd
    const i = loja.opcoes.findIndex((o) => o.potes === qtd)
    const t = trackRef.current
    const c = cardsRef.current[i]
    if (!t || !c || i < 0) return
    const base = cardsRef.current[0]?.offsetLeft ?? 0
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    t.scrollTo({ left: c.offsetLeft - base, behavior: reduz ? 'auto' : 'smooth' })
  }, [qtd, loja.opcoes])

  // Arrastar com o mouse (no toque a rolagem já é nativa).
  useEffect(() => {
    const t = trackRef.current
    if (!t) return
    let drag: { x: number; left: number; id: number } | null = null
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      drag = { x: e.clientX, left: t.scrollLeft, id: e.pointerId }
      arrastouRef.current = false
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      if (!arrastouRef.current && Math.abs(dx) > 5) {
        arrastouRef.current = true
        setArrastando(true)
        try {
          t.setPointerCapture(drag.id)
        } catch {}
      }
      if (arrastouRef.current) {
        t.scrollLeft = drag.left - dx
        e.preventDefault()
      }
    }
    let tm: ReturnType<typeof setTimeout>
    const up = () => {
      if (!drag) return
      drag = null
      if (!arrastouRef.current) return
      // encaixa na oferta mais próxima, como o snap faz no toque
      t.scrollTo({ left: posRef.current[pertoDe(t, posRef.current)] ?? 0, behavior: 'smooth' })
      tm = setTimeout(() => setArrastando(false), 350)
    }
    // depois de arrastar, o clique não seleciona a oferta sem querer
    const clique = (e: MouseEvent) => {
      if (arrastouRef.current) {
        e.stopPropagation()
        e.preventDefault()
        arrastouRef.current = false
      }
    }
    const semDrag = (e: DragEvent) => e.preventDefault()
    t.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    t.addEventListener('click', clique, true)
    t.addEventListener('dragstart', semDrag)
    return () => {
      clearTimeout(tm)
      t.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      t.removeEventListener('click', clique, true)
      t.removeEventListener('dragstart', semDrag)
    }
  }, [])

  const escolher = (n: number) => {
    cliqueRef.current = n
    setQtd(n)
  }

  const primeira = loja.opcoes[0]
  const base = primeira ? primeira.preco / primeira.potes : 0
  const t = totalDe(loja, qtd)

  return (
    <>
      <div className="ofc-wrap">
        <div
          className={`ofc-track${arrastando ? ' is-drag' : ''}`}
          id="ofc-track"
          ref={trackRef}
          onScroll={() => setAtual(maisPerto())}
        >
          {loja.opcoes.map((o, i) => {
            const n = o.potes
            const sel = n === qtd
            const cols = n <= 3 ? n : n === 4 ? 2 : 3
            const sm = n >= 4
            const economia = base * n - o.preco
            const perks: { txt: string; ok?: boolean }[] = []
            if (economia >= 1) perks.push({ txt: `Economize ${brl(economia).replace(',00', '')}` })
            const nb = loja.bonus.filter((b) => n >= b.min).length
            if (loja.bonusOn && nb > 0) perks.push({ txt: `+${nb} bônus` })
            if (loja.frete.on && o.preco >= loja.frete.meta) perks.push({ txt: 'Frete grátis', ok: true })
            return (
              <article
                key={n}
                ref={(el) => {
                  cardsRef.current[i] = el
                }}
                className={`ofc${sel ? ' is-sel' : ''}`}
                data-n={n}
                onClick={() => escolher(n)}
              >
                <div className="ofc-ph">
                  <button
                    type="button"
                    className="ofc-chk"
                    aria-pressed={sel}
                    aria-label={`Selecionar oferta de ${n} ${n === 1 ? 'pote' : 'potes'}`}
                  >
                    <Icon name="check-pequeno" />
                  </button>
                  {o.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="ofc-foto" src={o.foto.url} alt="" aria-hidden="true" />
                  ) : (
                    <span className={`ofc-pots c${cols}${sm ? ' is-sm' : ''}`} aria-hidden="true">
                      {Array.from({ length: n }, (_, k) => (
                        <i key={k} />
                      ))}
                    </span>
                  )}
                  <span className="ofc-tag" aria-label={`${n} ${n === 1 ? 'pote' : 'potes'} para ${n * loja.dias} dias`}>
                    <b>{n}X</b>
                    <span>{n * loja.dias} dias</span>
                  </span>
                </div>
                <div className="ofc-body">
                  <span className="ofc-lbl">Por apenas:</span>
                  <b className="ofc-total">{brl(o.preco)}</b>
                  {o.precoDe ? (
                    <s className="ofc-de" aria-label={`Preço normal ${brl(o.precoDe)}`}>
                      {brl(o.precoDe)}
                    </s>
                  ) : null}
                  <p className="ofc-unit">{brl(o.preco / n)} por pote</p>
                  {perks.length ? (
                    <p className="ofc-perks">
                      {perks.map((p) => (
                        <span key={p.txt} className={p.ok ? 'is-ok' : undefined}>
                          {p.txt}
                        </span>
                      ))}
                    </p>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
      <div className="ofc-dots" role="group" aria-label="Navegar pelas ofertas">
        {loja.opcoes.map((o, k) => (
          <button
            key={o.potes}
            type="button"
            hidden={k >= paginas}
            aria-label={`Ver oferta de ${o.potes} ${o.potes === 1 ? 'pote' : 'potes'}`}
            aria-current={k === atual ? 'true' : undefined}
            onClick={() => {
              const x = posRef.current[k]
              if (x != null) trackRef.current?.scrollTo({ left: x, behavior: 'smooth' })
            }}
          >
            <i className={k === atual ? 'on' : undefined} />
          </button>
        ))}
      </div>
      {loja.pix > 0 ? (
        <p className="mt-[30px] text-[15px] font-medium text-ink">
          <s className="mr-1 text-stone">{brl(t)}</s> <b className="font-medium">{loja.pix}% OFF no Pix</b>
        </p>
      ) : null}
      <p className="of-price">
        <span>{brl(precoPix(loja, t))}</span> <small>no Pix</small>
      </p>
      <p className="text-[15.5px] leading-[1.55] text-graphite">
        ou <span>{brl(t)}</span> em até
        <br />
        {loja.parcelas}x de <span>{brl(parcela(loja, t))}</span> sem juros no cartão
      </p>
      <LinkPedido
        link={linkDe(loja, qtd)}
        className="btn of-btn"
        data-checkout=""
        aria-label={loja.pix > 0 ? `${loja.botaoPedido}, ${loja.pix}% de desconto no Pix` : loja.botaoPedido}
      >
        <Icon name="sacola-grande" />
        {loja.botaoPedido}
        {loja.pix > 0 ? (
          <span className="bdg" aria-hidden="true">
            -{loja.pix}% no Pix
          </span>
        ) : null}
      </LinkPedido>
    </>
  )
}
