'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/icons'

import { semMovimento } from './midia'

export type VideoItem = {
  id: number | string
  tema: string
  nome: string
  legenda?: string | null
  video?: string | null
  capa?: string | null
}

// Sem arquivo de vídeo, o protótipo simula a duração (duracao_s = 8).
const DURACAO_PADRAO = 8

/* Grade de vídeos como carrossel infinito centrado (o card em foco fica nítido; a paginação enche no tempo
   do próprio vídeo e passa para o próximo) + visualizador estilo stories ao tocar no card. */
export function VideosCarrossel({ itens }: { itens: VideoItem[] }) {
  const N = itens.length
  const car = N >= 2
  const gridRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([])
  const fillsRef = useRef<(HTMLElement | null)[]>([])
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([])
  const goDot = useRef<(k: number) => void>(() => {})
  const syncThumbs = useRef<() => void>(() => {})
  const aberto = useRef(false)

  // lista renderizada: [cópias, originais, cópias] no carrossel; só os originais sem ele
  const lista = car ? [...itens, ...itens, ...itens] : itens

  /* ---------- carrossel ---------- */
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const items = cardsRef.current.slice(0, lista.length) as HTMLButtonElement[]
    const real = car ? items.slice(N, 2 * N) : items
    const still = semMovimento()

    // thumb = o próprio vídeo rodando mudo; só toca quando está na tela e (no carrossel) em foco
    const thumbs = real.map((c) => c.querySelector('video')).filter((v): v is HTMLVideoElement => !!v && !still)
    const seen = new Set<HTMLVideoElement>()
    syncThumbs.current = () => {
      thumbs.forEach((t) => {
        if (seen.has(t) && !aberto.current && (!car || t.parentElement?.classList.contains('is-focus')))
          t.play().catch(() => {})
        else t.pause()
      })
    }
    let ioThumbs: IntersectionObserver | null = null
    if (thumbs.length && 'IntersectionObserver' in window) {
      ioThumbs = new IntersectionObserver(
        (es) => {
          es.forEach((e) => (e.isIntersecting ? seen.add(e.target as HTMLVideoElement) : seen.delete(e.target as HTMLVideoElement)))
          syncThumbs.current()
        },
        { threshold: 0.25 },
      )
      thumbs.forEach((t) => ioThumbs!.observe(t))
    }
    if (!car) return () => ioThumbs?.disconnect()

    real.forEach((c) => {
      const v = c.querySelector('video')
      if (v) v.loop = false
    })
    let pos = N,
      el = 0,
      last = 0,
      visible = false,
      touching = false,
      scrollT: ReturnType<typeof setTimeout> | undefined,
      lock: ReturnType<typeof setTimeout> | number = 0,
      raf = 0
    const lg = () => ((pos % N) + N) % N
    const vidOf = () => real[lg()].querySelector('video')
    const dur = () => {
      const v = vidOf()
      return v && v.duration && isFinite(v.duration) ? v.duration : DURACAO_PADRAO
    }
    const paint = () => {
      const p = Math.min(1, el / dur()),
        c = lg()
      fillsRef.current.forEach((f, k) => {
        if (f) f.style.width = (k < c ? 100 : k > c ? 0 : p * 100) + '%'
      })
    }
    const mark = (restart: boolean) => {
      items.forEach((c, k) => {
        c.classList.toggle('is-focus', k === pos)
        if (k >= N && k < 2 * N) c.tabIndex = k === pos ? 0 : -1
      })
      dotsRef.current.forEach((d, k) => {
        if (!d) return
        if (k === lg()) d.setAttribute('aria-current', 'true')
        else d.removeAttribute('aria-current')
      })
      if (restart) {
        el = 0
        const v = vidOf()
        if (v) {
          try {
            v.currentTime = 0
          } catch {}
        }
      }
      paint()
      syncThumbs.current()
    }
    const left = (k: number) => {
      const c = items[k]
      return c.offsetLeft + c.offsetWidth / 2 - grid.clientWidth / 2
    }
    // se parou numa cópia, troca para o original equivalente sem animação
    const normalize = () => {
      if (pos >= N && pos < 2 * N) return
      const np = N + lg()
      grid.classList.add('vd-jump')
      items[pos].classList.remove('is-focus')
      pos = np
      items[pos].classList.add('is-focus')
      grid.style.scrollSnapType = 'none'
      grid.scrollLeft = left(pos)
      void grid.offsetWidth
      grid.style.scrollSnapType = ''
      requestAnimationFrame(() => grid.classList.remove('vd-jump'))
      mark(false)
    }
    const go = (k: number, smooth: boolean) => {
      pos = k
      mark(true)
      clearTimeout(lock as ReturnType<typeof setTimeout>)
      lock = -1
      grid.scrollTo({ left: left(pos), behavior: smooth && !still ? 'smooth' : 'auto' })
      lock = setTimeout(
        () => {
          lock = 0
          normalize()
        },
        smooth && !still ? 650 : 30,
      )
    }
    const nearest = () => {
      const mid = grid.scrollLeft + grid.clientWidth / 2
      let b = 0,
        bd = 1e9
      items.forEach((c, k) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid)
        if (d < bd) {
          bd = d
          b = k
        }
      })
      return b
    }
    const running = () => visible && !touching && !aberto.current && !document.hidden
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      const dt = last ? (t - last) / 1000 : 0
      last = t
      if (!running() || lock) return
      const v = vidOf()
      el = v && v.duration && isFinite(v.duration) && !v.paused ? v.currentTime : el + dt
      if (el >= dur() - 0.05) {
        go(pos + 1, true)
        return
      }
      paint()
    }
    const onScroll = () => {
      if (lock) return
      clearTimeout(scrollT)
      scrollT = setTimeout(() => {
        const n = nearest()
        if (n !== pos) {
          pos = n
          mark(true)
        }
        normalize()
      }, 120)
    }
    const onTs = () => (touching = true)
    const onTe = () => (touching = false)
    // tocar num card desfocado traz ele para o centro (não abre o stories)
    const onClickCap = (e: MouseEvent) => {
      const c = (e.target as Element).closest('.vd-card') as HTMLButtonElement | null
      if (!c) return
      const k = items.indexOf(c)
      if (k !== pos) {
        e.stopImmediatePropagation()
        e.stopPropagation()
        e.preventDefault()
        go(k, true)
      }
    }
    // paginação: vai pelo caminho mais curto (pode atravessar o fim e voltar ao começo)
    goDot.current = (k) => {
      let diff = k - lg()
      if (diff > N / 2) diff -= N
      if (diff < -N / 2) diff += N
      go(pos + diff, true)
    }
    const onResize = () => {
      grid.scrollLeft = left(pos)
    }
    grid.addEventListener('scroll', onScroll, { passive: true })
    grid.addEventListener('touchstart', onTs, { passive: true })
    grid.addEventListener('touchend', onTe, { passive: true })
    grid.addEventListener('click', onClickCap, true)
    window.addEventListener('resize', onResize)
    let io: IntersectionObserver | null = null
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((es) => (visible = es[0].isIntersecting), { threshold: 0.35 })
      io.observe(grid)
    } else visible = true
    const r0 = requestAnimationFrame(() => {
      grid.scrollLeft = left(pos)
      mark(true)
    })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(r0)
      cancelAnimationFrame(raf)
      clearTimeout(scrollT)
      clearTimeout(lock as ReturnType<typeof setTimeout>)
      grid.removeEventListener('scroll', onScroll)
      grid.removeEventListener('touchstart', onTs)
      grid.removeEventListener('touchend', onTe)
      grid.removeEventListener('click', onClickCap, true)
      window.removeEventListener('resize', onResize)
      io?.disconnect()
      ioThumbs?.disconnect()
    }
  }, [N, car, lista.length])

  /* ---------- stories ---------- */
  const [cur, setCur] = useState(-1)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(false)
  const [held, setHeld] = useState(false)
  const st = useRef({ cur: -1, el: 0, paused: false, held: false, back: null as HTMLElement | null })
  const vidRef = useRef<HTMLVideoElement | null>(null)
  const barsRef = useRef<(HTMLElement | null)[]>([])
  const xRef = useRef<HTMLButtonElement>(null)
  const vsRef = useRef<HTMLDivElement>(null)

  const paintBars = useCallback((p: number) => {
    const c = st.current.cur
    barsRef.current.forEach((f, i) => {
      if (f) f.style.width = (i < c ? 100 : i > c ? 0 : Math.min(100, p * 100)) + '%'
    })
  }, [])
  const load = useCallback(
    (i: number) => {
      st.current.cur = i
      st.current.el = 0
      setCur(i)
      paintBars(0)
    },
    [paintBars],
  )
  const close = useCallback(() => {
    if (st.current.cur < 0) return
    vidRef.current?.pause()
    st.current.cur = -1
    aberto.current = false
    setCur(-1)
    setHeld(false)
    document.body.style.overflow = ''
    st.current.back?.focus?.()
    syncThumbs.current()
  }, [])
  const next = useCallback(() => {
    if (st.current.cur < N - 1) load(st.current.cur + 1)
    else close()
  }, [N, load, close])
  const prev = useCallback(() => {
    if (st.current.el > 1.5 && !vidRef.current) {
      st.current.el = 0
      paintBars(0)
      return
    }
    load(Math.max(0, st.current.cur - 1))
  }, [load, paintBars])
  const open = (i: number) => {
    st.current.back = document.activeElement as HTMLElement | null
    st.current.paused = false
    setPaused(false)
    aberto.current = true
    document.body.style.overflow = 'hidden'
    load(i)
    syncThumbs.current()
  }
  const togglePause = () => {
    const v = !st.current.paused
    st.current.paused = v
    setPaused(v)
    const vid = vidRef.current
    if (vid) {
      if (v) vid.pause()
      else vid.play().catch(() => {})
    }
  }

  const estaAberto = cur >= 0
  // foco no botão de fechar ao abrir
  useEffect(() => {
    if (estaAberto) xRef.current?.focus()
  }, [estaAberto])

  // vídeo do story atual: som e reprodução
  useEffect(() => {
    const v = vidRef.current
    if (!v) return
    v.muted = muted
  }, [muted, cur])
  useEffect(() => {
    const v = vidRef.current
    if (v && !st.current.paused && !st.current.held) v.play().catch(() => {})
  }, [cur])

  // relógio do stories: barra do vídeo atual (ou duração simulada sem vídeo)
  useEffect(() => {
    if (!estaAberto) return
    let raf = 0,
      last = 0
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      const dt = last ? (t - last) / 1000 : 0
      last = t
      if (st.current.paused || st.current.held) return
      const v = vidRef.current
      if (v) {
        if (v.duration) paintBars(v.currentTime / v.duration)
        return
      }
      st.current.el += dt
      const p = st.current.el / DURACAO_PADRAO
      paintBars(p)
      if (p >= 1) next()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [estaAberto, next, paintBars])

  // teclado: Esc fecha, setas navegam, Tab fica dentro do player
  useEffect(() => {
    if (!estaAberto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'Tab' && vsRef.current) {
        const f = Array.from(
          vsRef.current.querySelectorAll<HTMLElement>('button:not([disabled]):not([tabindex="-1"]),a[href]'),
        ).filter((x) => x.offsetParent)
        const a = f[0],
          z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          z.focus()
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault()
          a.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [estaAberto, close, next, prev])

  // toque: esquerda volta, direita avança; segurar pausa (como no Instagram)
  const hold = useRef<{ t?: ReturnType<typeof setTimeout>; was: boolean }>({ was: false })
  const down = () => {
    hold.current.was = false
    hold.current.t = setTimeout(() => {
      st.current.held = true
      hold.current.was = true
      setHeld(true)
      vidRef.current?.pause()
    }, 220)
  }
  const up = () => {
    clearTimeout(hold.current.t)
    if (st.current.held) {
      st.current.held = false
      setHeld(false)
      if (vidRef.current && !st.current.paused) vidRef.current.play().catch(() => {})
    }
  }
  const tap = (fn: () => void) => {
    if (hold.current.was) {
      hold.current.was = false
      return
    }
    fn()
  }

  const atual = estaAberto ? itens[cur] : null

  return (
    <>
      <div ref={gridRef} className={`vd-grid${car ? ' is-car' : ''}`} id="vd-grid">
        {lista.map((v, k) => {
          const i = k % N
          const clone = car && (k < N || k >= 2 * N)
          return (
            <button
              key={k}
              ref={(el) => {
                cardsRef.current[k] = el
              }}
              type="button"
              className={`vd-card${v.video || v.capa ? '' : ' is-ph'}${clone ? ' is-clone' : ''}`}
              aria-label={clone ? undefined : `Ver depoimento: ${v.tema}`}
              aria-hidden={clone ? true : undefined}
              tabIndex={clone ? -1 : undefined}
              onClick={() => open(i)}
            >
              {v.video ? (
                <video
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={v.capa ?? undefined}
                  src={v.video}
                  aria-hidden="true"
                />
              ) : v.capa ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.capa} alt="" loading="lazy" />
              ) : (
                <span className="vd-ph">Vídeo {i + 1} rodando sem som</span>
              )}
              <span className="vd-mute" aria-hidden="true">
                <Icon name="mudo" />
              </span>
              <span className="vd-meta">
                <b>{v.nome}</b>
                <span>{v.legenda}</span>
              </span>
            </button>
          )
        })}
      </div>
      <div className="vd-pg" id="vd-pg" role="group" aria-label="Escolher depoimento">
        {car &&
          itens.map((v, k) => (
            <button
              key={v.id}
              ref={(el) => {
                dotsRef.current[k] = el
              }}
              type="button"
              aria-label={`Depoimento ${k + 1}`}
              onClick={() => goDot.current(k)}
            >
              <i>
                <b
                  ref={(el) => {
                    fillsRef.current[k] = el
                  }}
                />
              </i>
            </button>
          ))}
      </div>

      <div
        ref={vsRef}
        className={`vs${estaAberto ? ' is-open' : ''}${held ? ' is-held' : ''}`}
        id="vs"
        role="dialog"
        aria-modal="true"
        aria-label="Depoimento em vídeo"
        aria-hidden={!estaAberto}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
      >
        <button type="button" className="vs-side prev" aria-label="Vídeo anterior" disabled={cur <= 0} onClick={prev}>
          <Icon name="chevron-esquerda" />
        </button>
        <div className={`vs-frame${atual && !atual.video ? ' is-ph' : ''}`} id="vs-frame">
          <div>
            {atual?.video ? (
              <video
                key={cur}
                ref={vidRef}
                className="vs-media"
                playsInline
                preload="auto"
                poster={atual.capa ?? undefined}
                src={atual.video}
                onEnded={next}
              />
            ) : atual ? (
              <div className="vs-ph">
                <span>
                  <b>Vídeo {cur + 1}</b>Depoimento vertical 9:16, vindo do CMS
                </span>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="vs-tap prev"
            aria-label="Vídeo anterior"
            tabIndex={-1}
            onPointerDown={down}
            onPointerUp={up}
            onPointerLeave={up}
            onPointerCancel={up}
            onClick={() => tap(prev)}
          />
          <button
            type="button"
            className="vs-tap next"
            aria-label="Próximo vídeo"
            tabIndex={-1}
            onPointerDown={down}
            onPointerUp={up}
            onPointerLeave={up}
            onPointerCancel={up}
            onClick={() => tap(next)}
          />
          <div className="vs-top">
            <div className="vs-bars">
              {itens.map((v, k) => (
                <i key={v.id}>
                  <b
                    ref={(el) => {
                      barsRef.current[k] = el
                    }}
                  />
                </i>
              ))}
            </div>
            <div className="vs-head">
              <span className="vs-av" aria-hidden="true" />
              <div className="vs-who">
                <b>{atual?.nome}</b>
                <span>{atual?.legenda}</span>
              </div>
              <button
                type="button"
                className="vs-btn"
                aria-label={paused ? 'Continuar' : 'Pausar'}
                aria-pressed={paused}
                onClick={togglePause}
              >
                <Icon name="pausar" className="ic-a" />
                <Icon name="tocar" className="ic-b" />
              </button>
              <button
                type="button"
                className="vs-btn"
                aria-label={muted ? 'Ligar o som' : 'Tirar o som'}
                aria-pressed={muted}
                onClick={() => setMuted((m) => !m)}
              >
                <Icon name="som" className="ic-a" />
                <Icon name="mudo" className="ic-b" />
              </button>
              <button ref={xRef} type="button" className="vs-btn" aria-label="Fechar vídeo" onClick={close}>
                <Icon name="fechar" />
              </button>
            </div>
          </div>
          <div className="vs-foot">
            <p className="vs-tema">{atual?.tema}</p>
            <a className="vs-cta" href="#oferta" onClick={close}>
              Quero o meu ALPHA PRO
              <Icon name="seta-direita" />
            </a>
          </div>
        </div>
        <button
          type="button"
          className="vs-side next"
          aria-label="Próximo vídeo"
          disabled={cur === N - 1}
          onClick={next}
        >
          <Icon name="chevron-direita" />
        </button>
      </div>
    </>
  )
}
