'use client'

import { useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/icons'
import { usePedido } from '@/components/pedido'
import { brl } from '@/lib/texto'

import { FreteBarra } from './FreteBarra'
import { LinkPedido } from './LinkPedido'
import { type Foto, type Loja, capsulasDe, fotoDe, linkDe, liberados, parcela, passo, potes, totalDe } from './loja'

function Miniatura({ foto, children }: { foto: Foto; children: React.ReactNode }) {
  if (!foto) return <>{children}</>
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="ct-thumb object-cover" src={foto.url} alt={foto.alt} width={60} height={60} />
}

// Carrinho: folha de baixo no celular, painel lateral à direita no PC (a partir de 1024px).
export function CarrinhoPainel({ loja }: { loja: Loja }) {
  const { qtd, setQtd, carrinhoAberto, fecharCarrinho } = usePedido()
  const [montado, setMontado] = useState(false)
  const [aberto, setAberto] = useState(false)
  if (carrinhoAberto && !montado) setMontado(true)
  if (!carrinhoAberto && aberto) setAberto(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const xRef = useRef<HTMLButtonElement>(null)
  const focoRef = useRef<HTMLElement | null>(null)

  // Abrir: mostra, no quadro seguinte desliza e leva o foco ao fechar.
  useEffect(() => {
    if (!carrinhoAberto) return
    focoRef.current = document.activeElement as HTMLElement | null
    document.body.classList.add('sheet-open')
    const r = requestAnimationFrame(() => {
      setAberto(true)
      xRef.current?.focus()
    })
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fecharCarrinho()
    }
    document.addEventListener('keydown', esc)
    return () => {
      cancelAnimationFrame(r)
      document.removeEventListener('keydown', esc)
      document.body.classList.remove('sheet-open')
    }
  }, [carrinhoAberto, fecharCarrinho])

  // Fechar: espera a animação (~640ms) e devolve o foco para quem abriu.
  useEffect(() => {
    if (carrinhoAberto || !montado) return
    focoRef.current?.focus?.({ preventScroll: true })
    const t = setTimeout(() => setMontado(false), 640)
    return () => clearTimeout(t)
  }, [carrinhoAberto, montado])

  // Fechar com arrasto: para baixo no celular, para a direita no PC.
  useEffect(() => {
    const root = rootRef.current
    const panel = panelRef.current
    if (!root || !panel) return
    const desk = window.matchMedia('(min-width:1024px)')
    type St = { x: number; y: number; t: number; d: 'right' | 'down'; lock: null | 'drag' | 'skip'; off: number }
    let st: St | null = null
    const pt = (e: TouchEvent | MouseEvent) => {
      const t = 'touches' in e ? e.touches[0] : e
      return { x: t.clientX, y: t.clientY }
    }
    const down = (e: TouchEvent | MouseEvent) => {
      if (!root.classList.contains('is-open')) return
      if (e.type === 'mousedown' && (e as MouseEvent).button !== 0) return
      const alvo = e.target as Element | null
      const sc = alvo?.closest?.('.sh-scroll')
      if (!desk.matches && sc && sc.scrollTop > 0) return
      const p = pt(e)
      st = { x: p.x, y: p.y, t: Date.now(), d: desk.matches ? 'right' : 'down', lock: null, off: 0 }
    }
    const move = (e: TouchEvent | MouseEvent) => {
      if (!st) return
      const p = pt(e)
      const dx = p.x - st.x
      const dy = p.y - st.y
      if (!st.lock) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        const horiz = Math.abs(dx) > Math.abs(dy)
        st.lock = (st.d === 'right') === horiz ? 'drag' : 'skip'
        if (st.lock === 'drag') panel.style.transition = 'none'
      }
      if (st.lock !== 'drag') return
      st.off = Math.max(0, st.d === 'right' ? dx : dy)
      panel.style.transform = st.d === 'down' ? `translateY(${st.off}px)` : `translateX(${st.off}px)`
      if (e.cancelable) e.preventDefault()
    }
    const up = () => {
      if (!st) return
      const s = st
      st = null
      if (s.lock !== 'drag') return
      const size = s.d === 'down' ? panel.offsetHeight : panel.offsetWidth
      const vel = s.off / Math.max(1, Date.now() - s.t)
      panel.style.transition = ''
      if (s.off > size * 0.25 || (vel > 0.5 && s.off > 30)) fecharCarrinho()
      requestAnimationFrame(() => {
        panel.style.transform = ''
      })
      // um arrasto não vira clique em link/botão
      const k = (ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
      }
      root.addEventListener('click', k, true)
      setTimeout(() => root.removeEventListener('click', k, true), 350)
    }
    const semDrag = (e: Event) => {
      if (st) e.preventDefault()
    }
    root.addEventListener('touchstart', down, { passive: true })
    root.addEventListener('mousedown', down)
    root.addEventListener('dragstart', semDrag)
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('mousemove', move)
    window.addEventListener('touchend', up)
    window.addEventListener('touchcancel', up)
    window.addEventListener('mouseup', up)
    return () => {
      root.removeEventListener('touchstart', down)
      root.removeEventListener('mousedown', down)
      root.removeEventListener('dragstart', semDrag)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('touchend', up)
      window.removeEventListener('touchcancel', up)
      window.removeEventListener('mouseup', up)
    }
  }, [fecharCarrinho])

  // Brindes que acabaram de liberar pulam uma vez.
  const [qAntes, setQAntes] = useState(qtd)
  const [novos, setNovos] = useState<number[]>([])
  if (qAntes !== qtd) {
    setQAntes(qtd)
    setNovos(qtd > qAntes ? loja.bonus.map((b, i) => (qtd >= b.min && qAntes < b.min ? i : -1)).filter((i) => i >= 0) : [])
  }

  const n = qtd
  const t = totalDe(loja, n)
  const ganhos = liberados(loja, n)
  const economia = ganhos.reduce((a, b) => a + b.valor, 0)
  const minBonus = loja.bonus[0]?.min ?? 2
  const menor = loja.opcoes[0]?.potes ?? 1
  const maior = loja.opcoes[loja.opcoes.length - 1]?.potes ?? 1

  return (
    <div
      ref={rootRef}
      className={`sheet${aberto ? ' is-open' : ''}`}
      id="gift-sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sh-title"
      hidden={!montado}
    >
      <div className="sh-back" onClick={fecharCarrinho} />
      <div className="sh-panel" ref={panelRef}>
        <div className="sh-grip" aria-hidden="true" />
        <div className="sh-head">
          <h3 id="sh-title">Seu pedido</h3>
          <button type="button" className="sh-x" aria-label="Fechar" ref={xRef} onClick={fecharCarrinho}>
            <Icon name="x-negrito" />
          </button>
        </div>
        <div className="sh-scroll" data-lenis-prevent>
          <ul className="ct-list">
            <li className="ct-item">
              <Miniatura foto={fotoDe(loja, n)}>
                <div className={`ct-thumb ct-pots n${Math.min(4, n)}`} aria-hidden="true">
                  {Array.from({ length: n }, (_, k) => (
                    <i key={k} />
                  ))}
                </div>
              </Miniatura>
              <div className="ct-mid">
                <span className="ct-tags">
                  <span className="ct-tag is-ink">{potes(n)}</span>
                  <span className="ct-tag">{n * loja.dias} dias</span>
                </span>
                <p className="ct-name">{loja.nome}</p>
                {loja.capsulas ? <p className="ct-sub">{capsulasDe(loja, n)}</p> : null}
              </div>
              <div className="ct-price">
                <b>{brl(t)}</b>
                <small>
                  {loja.parcelas}x de {brl(parcela(loja, t))}
                </small>
              </div>
            </li>
          </ul>
          {loja.bonusOn && loja.bonus.length ? <p className="sh-lbl">Seus brindes</p> : null}
          {loja.frete.on ? <FreteBarra frete={loja.frete} total={t} aberto={aberto} /> : null}
          {loja.bonusOn && loja.bonus.length ? (
            <ul className="ct-list ct-brindes">
              {loja.bonus.map((b, i) => {
                const preso = n < b.min
                return (
                  <li
                    key={i}
                    className={`ct-item gift${preso ? ' is-locked' : ''}${novos.includes(i) ? ' is-new' : ''}`}
                    onAnimationEnd={() => setNovos((v) => v.filter((k) => k !== i))}
                  >
                    <Miniatura foto={b.foto}>
                      <div className="ct-thumb ph">
                        <span>
                          <b>Foto</b>Brinde {i + 1}
                        </span>
                      </div>
                    </Miniatura>
                    <div className="ct-mid">
                      <span className="ct-tag">
                        <Icon name="presente" />
                        Brinde exclusivo
                      </span>
                      <p className="ct-name">{b.titulo}</p>
                      <p className="ct-lock">Leve {potes(b.min)} para liberar</p>
                      <p className="ct-ok">
                        <Icon name="check-pequeno" />
                        Liberado
                      </p>
                    </div>
                    <div className="ct-price">
                      <span className="ct-free">Grátis</span>
                      {b.valor ? <s>{brl(b.valor)}</s> : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
        <div className="sh-foot">
          {loja.bonusOn && loja.bonus.length ? (
            <p className="sh-save">
              {ganhos.length ? (
                <>
                  Você leva <b>{brl(economia)}</b> em brindes de graça
                </>
              ) : (
                <>
                  Leve <b>{potes(minBonus)}</b> e ganhe um brinde
                </>
              )}
            </p>
          ) : null}
          <div className="sh-row">
            <div className="step" role="group" aria-label="Quantidade de potes">
              <button type="button" aria-label="Menos um pote" disabled={n <= menor} onClick={() => setQtd(passo(loja, n, -1))}>
                &minus;
              </button>
              <output aria-live="polite">{n}</output>
              <button type="button" aria-label="Mais um pote" disabled={n >= maior} onClick={() => setQtd(passo(loja, n, 1))}>
                +
              </button>
            </div>
            <LinkPedido
              link={linkDe(loja, n)}
              className="btn"
              data-checkout=""
              aria-label={loja.pix > 0 ? `${loja.botaoPedido}, ${loja.pix}% de desconto no Pix` : loja.botaoPedido}
              onClick={fecharCarrinho}
            >
              {loja.botaoPedido} <span className="arr">→</span>
              {loja.pix > 0 ? (
                <span className="bdg" aria-hidden="true">
                  -{loja.pix}% no Pix
                </span>
              ) : null}
            </LinkPedido>
          </div>
        </div>
      </div>
    </div>
  )
}
