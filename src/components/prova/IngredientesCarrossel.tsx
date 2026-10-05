'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { Icon } from '@/components/icons'

import { semMovimento } from './midia'

const DUR = 8000
const ANIM = 1000

/* Ingredientes: no celular/tablet os cards entram ao rolar a página; no PC (1024px+) vira carrossel com
   3 por vez, avanço automático a cada 8s (transição de 1s) e paginação em barra de progresso. */
export function IngredientesCarrossel({ titulo, children }: { titulo: ReactNode; children: ReactNode }) {
  const listRef = useRef<HTMLDivElement>(null)
  const fills = useRef<(HTMLElement | null)[]>([])
  const ctl = useRef({ go: (_k: number) => {}, step: (_d: number) => {} })
  const [grupos, setGrupos] = useState(0)

  // entrada dos cards conforme a rolagem
  useEffect(() => {
    const list = listRef.current
    if (!list || semMovimento()) return
    const cards = Array.from(list.children) as HTMLElement[]
    list.classList.add('anim')
    let pend = false
    const cl = (v: number) => Math.max(0, Math.min(1, v))
    const upd = () => {
      pend = false
      const vh = window.innerHeight
      cards.forEach((c) => {
        const top = c.getBoundingClientRect().top
        const t = cl((vh * 0.95 - top) / (vh * 0.4)),
          e = t * t
        const ti = cl((t - 0.2) / 0.8),
          es = ti * ti
        c.style.setProperty('--o', e.toFixed(3))
        c.style.setProperty('--x', (-60 * (1 - e)).toFixed(1) + 'px')
        c.style.setProperty('--s', es.toFixed(3))
      })
    }
    const req = () => {
      if (!pend) {
        pend = true
        requestAnimationFrame(upd)
      }
    }
    window.addEventListener('scroll', req, { passive: true })
    window.addEventListener('resize', req)
    upd()
    return () => {
      window.removeEventListener('scroll', req)
      window.removeEventListener('resize', req)
    }
  }, [])

  // carrossel do PC
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const cards = Array.from(list.children) as HTMLElement[]
    if (!cards.length) return
    const mq = matchMedia('(min-width:1024px)')
    const still = semMovimento()
    let pos: number[] = [],
      i = 0,
      el = 0,
      last = 0,
      raf = 0,
      anim = 0,
      hover = false,
      lock = 0
    const paint = () => {
      const p = Math.min(1, el / DUR)
      fills.current.forEach((f, k) => {
        if (f) f.style.width = (k < i ? 100 : k > i ? 0 : still ? 100 : p * 100) + '%'
      })
    }
    const build = () => {
      const base = cards[0].offsetLeft,
        max = list.scrollWidth - list.clientWidth
      pos = []
      cards.forEach((c) => {
        const x = Math.min(max, Math.max(0, c.offsetLeft - base))
        if (!pos.length || x - pos[pos.length - 1] > 8) pos.push(x)
      })
      if (i >= pos.length) i = 0
      setGrupos(pos.length)
      requestAnimationFrame(paint)
    }
    // transição própria (o smooth nativo não aceita duração): ease-in-out de 1000ms
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    const slide = (to: number) => {
      cancelAnimationFrame(anim)
      if (still) {
        list.scrollLeft = to
        return
      }
      const from = list.scrollLeft,
        t0 = performance.now()
      list.classList.add('is-moving')
      const f = (t: number) => {
        const k = Math.min(1, (t - t0) / ANIM)
        list.scrollLeft = from + (to - from) * ease(k)
        if (k < 1) anim = requestAnimationFrame(f)
        else list.classList.remove('is-moving')
      }
      f(t0)
    }
    const go = (k: number) => {
      if (!pos.length) return
      i = (k + pos.length) % pos.length
      el = 0
      lock = Date.now()
      slide(pos[i])
      paint()
    }
    ctl.current = { go, step: (dlt) => go(i + dlt) }
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      const dt = last ? t - last : 0
      last = t
      if (still || hover || document.hidden) return
      const r = list.getBoundingClientRect()
      if (r.bottom < 0 || r.top > innerHeight) return // só anda quando está na tela
      el += dt
      paint()
      if (el >= DUR) go(i + 1)
    }
    // rolagem manual (trackpad) atualiza a posição
    let st: ReturnType<typeof setTimeout> | undefined
    const onScroll = () => {
      clearTimeout(st)
      st = setTimeout(() => {
        if (!mq.matches || Date.now() - lock < ANIM + 300) return
        const L = list.scrollLeft
        let b = 0,
          bd = 1e9
        pos.forEach((x, k) => {
          const d = Math.abs(x - L)
          if (d < bd) {
            bd = d
            b = k
          }
        })
        if (b !== i) {
          i = b
          el = 0
          paint()
        }
      }, 120)
    }
    const enter = () => (hover = true)
    const leave = () => (hover = false)
    const setup = () => {
      cancelAnimationFrame(raf)
      if (!mq.matches) {
        setGrupos(0)
        return
      }
      i = 0
      el = 0
      last = 0
      list.scrollLeft = 0
      build()
      raf = requestAnimationFrame(tick)
    }
    let rt: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      if (!mq.matches) return
      clearTimeout(rt)
      rt = setTimeout(() => {
        build()
        list.scrollLeft = pos[i] || 0
      }, 150)
    }
    list.addEventListener('scroll', onScroll, { passive: true })
    list.addEventListener('mouseenter', enter)
    list.addEventListener('mouseleave', leave)
    mq.addEventListener('change', setup)
    window.addEventListener('resize', onResize)
    setup()
    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(anim)
      clearTimeout(st)
      clearTimeout(rt)
      list.removeEventListener('scroll', onScroll)
      list.removeEventListener('mouseenter', enter)
      list.removeEventListener('mouseleave', leave)
      mq.removeEventListener('change', setup)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <div className="ic-head">
        {titulo}
        <div className="ic-nav" aria-label="Navegar pelos ingredientes" role="group">
          <button type="button" className="pv-arr" aria-label="Ingrediente anterior" onClick={() => ctl.current.step(-1)}>
            <Icon name="chevron-esquerda" />
          </button>
          <button type="button" className="pv-arr" aria-label="Próximo ingrediente" onClick={() => ctl.current.step(1)}>
            <Icon name="chevron-direita" />
          </button>
        </div>
      </div>
      <div className="ic-list" id="ic-list" ref={listRef} tabIndex={0} role="group" aria-label="Ingredientes (role de lado)">
        {children}
      </div>
      <div className="ic-pg" id="ic-pg" role="group" aria-label="Posição no carrossel de ingredientes">
        {Array.from({ length: grupos }, (_, k) => (
          <button key={k} type="button" aria-label={`Ir para o grupo ${k + 1} de ${grupos}`} onClick={() => ctl.current.go(k)}>
            <i>
              <b
                ref={(el) => {
                  fills.current[k] = el
                }}
              />
            </i>
          </button>
        ))}
      </div>
    </>
  )
}
