'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { Icon, type IconName } from '@/components/icons'
import { usePedido } from '@/components/pedido'

const FECHAR_MS = 640

const hdrBtn =
  'hdr-btn relative grid size-11 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-ink focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-stone'
const badge =
  'hdr-badge absolute top-1 right-0.5 box-content h-[18px] min-w-[18px] rounded-[999px] border-2 border-paper bg-ink px-[5px] text-center text-[11px] leading-[18px] font-bold text-white tabular-nums'
const drRow =
  'dr-row flex w-full cursor-pointer items-center gap-3.5 border-0 bg-transparent px-6 py-[17px] text-left text-[19px] leading-[1.2] font-semibold tracking-[-.01em] text-ink no-underline [&>span]:flex-1 [&>svg]:size-[22px] [&>svg]:flex-none [&>svg]:opacity-90'

function Marca({ className = '' }: { className?: string }) {
  return (
    <>
      ALPHA<span className={`ml-0.5 font-light ${className}`}>PRO</span>
    </>
  )
}

type ItemMenu = { texto: string; link: string; icone: string | null }
export type MenuLateral = {
  destaque: ItemMenu
  conheca: {
    titulo: string
    icone: string | null
    cards: { l1: string; l2: string; link: string; foto: { url: string; alt: string } | null }[]
  }
  // Já sem o item de bônus quando os bônus estão desligados.
  itens: ItemMenu[]
  rodape: string
}

const Ico = ({ name, className }: { name: string | null; className?: string }) =>
  name ? <Icon name={name as IconName} className={className} /> : null

export function Cabecalho({ faixa, menu }: { faixa: React.ReactNode; menu: MenuLateral }) {
  const { qtd, abrirCarrinho, carrinhoAberto } = usePedido()

  // ===== header: some ao descer, volta ao subir, sombra quando flutua =====
  const topRef = useRef<HTMLDivElement>(null)
  const [escondido, setEscondido] = useState(false)
  const [flutua, setFlutua] = useState(false)
  const travado = useRef(false)
  useEffect(() => {
    travado.current = carrinhoAberto
  }, [carrinhoAberto])

  useEffect(() => {
    let lastY = window.scrollY
    let tick = false
    const upd = () => {
      tick = false
      const y = window.scrollY
      const d = y - lastY
      const b = document.body.classList
      if (travado.current || b.contains('drawer-open') || b.contains('sheet-open')) {
        lastY = y
        return
      }
      const h = topRef.current?.offsetHeight ?? 0
      if (y <= h) setEscondido(false)
      else if (d > 6) setEscondido(true)
      else if (d < -6) setEscondido(false)
      setFlutua(y > 2)
      if (Math.abs(d) > 6) lastY = y
    }
    const onScroll = () => {
      if (!tick) {
        tick = true
        requestAnimationFrame(upd)
      }
    }
    upd()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ===== badge: pulso quando a quantidade muda =====
  const [pulso, setPulso] = useState(0)
  const qtdAnterior = useRef(qtd)
  useEffect(() => {
    if (qtdAnterior.current !== qtd) {
      qtdAnterior.current = qtd
      setPulso((p) => p + 1)
    }
  }, [qtd])

  // ===== menu lateral =====
  const [montado, setMontado] = useState(false) // equivale a hidden=false
  const [aberto, setAberto] = useState(false) // .is-open
  const [conhecaAberto, setConhecaAberto] = useState(true)
  const drRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const fecharRef = useRef<HTMLButtonElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const ultimoFoco = useRef<HTMLElement | null>(null)
  const abertoRef = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const abrir = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    ultimoFoco.current = document.activeElement as HTMLElement | null
    setMontado(true)
    document.body.classList.add('drawer-open')
    abertoRef.current = true
    requestAnimationFrame(() => {
      setAberto(true)
      fecharRef.current?.focus()
    })
  }, [])

  const fechar = useCallback(() => {
    abertoRef.current = false
    setAberto(false)
    document.body.classList.remove('drawer-open')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (!abertoRef.current) setMontado(false)
    }, FECHAR_MS)
    ultimoFoco.current?.focus?.({ preventScroll: true })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && abertoRef.current) fechar()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('drawer-open')
      if (timer.current) clearTimeout(timer.current)
    }
  }, [fechar])

  // fechar com arrasto para a esquerda (toque ou mouse)
  useEffect(() => {
    const root = drRef.current
    const panel = panelRef.current
    if (!root || !panel) return
    type St = { x: number; y: number; t: number; lock: null | 'drag' | 'skip'; off: number }
    let st: St | null = null
    const pt = (e: TouchEvent | MouseEvent) => {
      const t = 'touches' in e ? e.touches[0] : e
      return { x: t.clientX, y: t.clientY }
    }
    const down = (e: TouchEvent | MouseEvent) => {
      if (!abertoRef.current) return
      if (e.type === 'mousedown' && (e as MouseEvent).button !== 0) return
      const p = pt(e)
      st = { x: p.x, y: p.y, t: Date.now(), lock: null, off: 0 }
    }
    const move = (e: TouchEvent | MouseEvent) => {
      if (!st) return
      const p = pt(e)
      const dx = p.x - st.x
      const dy = p.y - st.y
      if (!st.lock) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        st.lock = Math.abs(dx) > Math.abs(dy) ? 'drag' : 'skip'
        if (st.lock === 'drag') panel.style.transition = 'none'
      }
      if (st.lock !== 'drag') return
      st.off = Math.max(0, -dx)
      panel.style.transform = `translateX(${-st.off}px)`
      if (e.cancelable) e.preventDefault()
    }
    const up = () => {
      if (!st) return
      const s = st
      st = null
      if (s.lock !== 'drag') return
      const vel = s.off / Math.max(1, Date.now() - s.t)
      panel.style.transition = ''
      if (s.off > panel.offsetWidth * 0.25 || (vel > 0.5 && s.off > 30)) fechar()
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
    const drag = (e: Event) => {
      if (st) e.preventDefault()
    }
    root.addEventListener('touchstart', down, { passive: true })
    root.addEventListener('mousedown', down)
    root.addEventListener('dragstart', drag)
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('mousemove', move)
    window.addEventListener('touchend', up)
    window.addEventListener('touchcancel', up)
    window.addEventListener('mouseup', up)
    return () => {
      root.removeEventListener('touchstart', down)
      root.removeEventListener('mousedown', down)
      root.removeEventListener('dragstart', drag)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('touchend', up)
      window.removeEventListener('touchcancel', up)
      window.removeEventListener('mouseup', up)
    }
  }, [fechar])

  const onDrawerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const alvo = e.target as HTMLElement
    // clique no fundo escuro (PC) ou em qualquer link fecha o menu
    if (alvo === e.currentTarget || alvo.closest('a')) fechar()
  }

  const abrirPedido = () => {
    fechar()
    setTimeout(abrirCarrinho, 200)
  }

  const rotuloPedido = `Abrir pedido, ${qtd} ${qtd === 1 ? 'pote' : 'potes'}`

  return (
    <>
      <header
        ref={topRef}
        id="topbar"
        className={`topbar sticky top-0 z-12 ${escondido ? 'is-hidden' : ''} ${flutua ? 'is-float' : ''}`}
      >
        {faixa}
        <div
          id="hdr"
          className="hdr relative grid grid-cols-[88px_1fr_88px] items-center gap-2 border-b border-border bg-card px-3 py-2 md:px-12"
        >
          <button
            ref={menuBtnRef}
            type="button"
            className={hdrBtn}
            id="menu-btn"
            aria-label="Abrir menu"
            aria-haspopup="dialog"
            aria-controls="drawer"
            aria-expanded={aberto}
            onClick={abrir}
          >
            <Icon name="menu" className="size-6" />
          </button>
          <a
            className="mark hdr-logo justify-self-center text-[21px] leading-none font-semibold tracking-[-.03em] text-ink no-underline"
            href="#inicio"
            aria-label="ALPHA PRO, voltar ao início"
          >
            <Marca />
          </a>
          <div className="hdr-act flex justify-end">
            <button
              type="button"
              className={`${hdrBtn} hdr-cart`}
              id="cart-btn"
              aria-haspopup="dialog"
              aria-controls="gift-sheet"
              aria-label={rotuloPedido}
              onClick={abrirCarrinho}
            >
              <Icon name="sacola" className="size-6" />
              <span key={pulso} className={`${badge} ${pulso ? 'bump' : ''}`} id="cart-badge" aria-hidden="true">
                {qtd}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={drRef}
        className={`drawer fixed inset-0 z-40 ${aberto ? 'is-open' : ''} ${montado ? '' : 'pointer-events-none invisible'}`}
        id="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={montado ? undefined : true}
        onClick={onDrawerClick}
      >
        <nav
          ref={panelRef}
          className="dr-panel absolute inset-0 flex flex-col overflow-y-auto bg-card pt-2 pb-7 text-ink"
          data-lenis-prevent
        >
          <div className="dr-head grid grid-cols-[44px_1fr_44px] items-center gap-2 px-3 pb-7">
            <button ref={fecharRef} type="button" className={hdrBtn} data-dr-close aria-label="Fechar menu" onClick={fechar}>
              <Icon name="fechar" className="size-6" />
            </button>
            <a
              className="mark justify-self-center text-[22px] leading-none font-semibold tracking-[-.03em] text-ink no-underline"
              href="#inicio"
            >
              <Marca />
            </a>
            <button type="button" className={`${hdrBtn} hdr-cart`} data-dr-cart aria-label="Abrir pedido" onClick={abrirPedido}>
              <Icon name="sacola" className="size-6" />
              <span className={badge} id="dr-badge" aria-hidden="true">
                {qtd}
              </span>
            </button>
          </div>
          <ul className="dr-list m-0 flex list-none flex-col gap-1 p-0">
            <li>
              <a className={`${drRow} is-hl`} href={menu.destaque.link}>
                <Ico name={menu.destaque.icone} />
                <span>{menu.destaque.texto}</span>
              </a>
            </li>
            <li className={`dr-acc ${conhecaAberto ? 'is-open' : ''}`}>
              <button
                type="button"
                className={drRow}
                aria-expanded={conhecaAberto}
                aria-controls="dr-know"
                onClick={() => setConhecaAberto((o) => !o)}
              >
                <Ico name={menu.conheca.icone} />
                <span>{menu.conheca.titulo}</span>
                <Icon name="chevron-cima" className="dr-chev" />
              </button>
              <div className="dr-sub" id="dr-know">
                <div className="dr-sub-in grid min-h-0 grid-cols-2 gap-3 overflow-hidden">
                  {menu.conheca.cards.map((c, i) => (
                    <CartaoMenu key={i} href={c.link} l1={c.l1} l2={c.l2} foto={c.foto} />
                  ))}
                </div>
              </div>
            </li>
            {menu.itens.map((item, i) => (
              <li key={i}>
                <a className={drRow} href={item.link}>
                  <Ico name={item.icone} />
                  <span>{item.texto}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="dr-foot mt-auto px-6 pt-7 text-center text-[12.5px] text-stone">
            {menu.rodape}
          </p>
        </nav>
      </div>
    </>
  )
}

function CartaoMenu({
  href,
  l1,
  l2,
  foto,
}: {
  href: string
  l1: string
  l2: string
  foto: { url: string; alt: string } | null
}) {
  return (
    <a
      className="dr-card relative flex aspect-square flex-col justify-between overflow-hidden rounded-lg border border-border bg-paper p-3.5 text-ink no-underline active:scale-[.98]"
      href={href}
    >
      {foto ? (
        <Image src={foto.url} alt={foto.alt} fill sizes="200px" className="object-cover" />
      ) : (
        <span className="dr-ph absolute inset-0" />
      )}
      <b className="relative text-sm leading-[1.15] font-bold tracking-[.04em] uppercase">
        {l1}
        <br />
        {l2}
      </b>
      <span
        className="dr-go relative grid size-8 place-items-center rounded-sm bg-ink text-on-ink [&>svg]:size-4"
        aria-hidden="true"
      >
        <Icon name="seta-direita" />
      </span>
    </a>
  )
}
