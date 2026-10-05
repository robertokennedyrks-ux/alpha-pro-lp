'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Icon, type IconName } from '@/components/icons'

const D = 5000

const AVISOS: { ico: IconName; lab: string; t: string; p: string }[] = [
  {
    ico: 'gota',
    lab: 'Hidratação',
    t: 'Beba mais água',
    p: 'Ele pede bastante água. Algumas clientes sentem mais sede e boca seca, e o intestino costuma funcionar melhor.',
  },
  {
    ico: 'relogio',
    lab: 'Melhor horário',
    t: 'De manhã ou à tarde',
    p: 'Tome de manhã ou à tarde. À noite, ele pode deixar você com um pouco mais de energia na hora de dormir.',
  },
  {
    ico: 'escudo-alerta',
    lab: 'Cuidado',
    t: 'Quem deve esperar',
    p: 'Não é indicado para gestantes, lactantes e menores de 19 anos. Nesses casos, espere o momento certo.',
  },
  {
    ico: 'selo',
    lab: 'Qualidade',
    t: 'Seguro e notificado',
    p: 'Sem glúten e sem lactose, e notificado na ANVISA (nº 25351118192202606). Você sabe o que está tomando.',
  },
  {
    ico: 'info',
    lab: 'Alergias',
    t: 'Se você tem alergia',
    p: 'Pode conter derivados de crustáceos (caranguejo), soja e pinoli. A cápsula é feita de colágeno bovino.',
  },
]

/* "Para usar com tranquilidade": avisos em card único que trocam sozinhos a cada 5s (com pausa que retoma
   do mesmo ponto); a cada troca o card sobe de leve. */
export function Avisos() {
  const n = AVISOS.length
  const [i, setI] = useState(0)
  const [out, setOut] = useState(-1)
  const [paused, setPaused] = useState(false)
  const st = useRef({ i: 0, paused: false, left: D, t0: 0 })
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const outT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const listRef = useRef<HTMLUListElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const primeira = useRef(true)
  const goRef = useRef<(k: number) => void>(() => {})

  const arm = useCallback(() => {
    clearTimeout(timer.current)
    if (st.current.paused) return
    st.current.t0 = Date.now()
    timer.current = setTimeout(() => goRef.current(st.current.i + 1), st.current.left)
  }, [])

  const go = useCallback(
    (k: number) => {
      const cur = st.current.i
      const nx = (k + n) % n
      if (nx === cur) return
      st.current.i = nx
      setOut(cur)
      setI(nx)
      clearTimeout(outT.current)
      outT.current = setTimeout(() => setOut(-1), 600)
      st.current.left = D
      arm()
    },
    [n, arm],
  )

  useEffect(() => {
    goRef.current = go
    arm()
    return () => {
      clearTimeout(timer.current)
      clearTimeout(outT.current)
    }
  }, [arm, go])

  // a cada troca de aviso, o card e os controles sobem de leve
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false
      return
    }
    ;[listRef.current, navRef.current].forEach((el) => {
      if (!el) return
      el.classList.remove('lift')
      void el.offsetWidth
      el.classList.add('lift')
    })
  }, [i])

  const togglePause = () => {
    const p = !st.current.paused
    st.current.paused = p
    setPaused(p)
    if (p) {
      clearTimeout(timer.current)
      st.current.left = Math.max(0, st.current.left - (Date.now() - st.current.t0))
    } else arm()
  }

  return (
    <div className="ntf-wrap">
      <div className="ntf-nav" ref={navRef}>
        <button
          type="button"
          className="pv-arr ntf-pp"
          aria-label={paused ? 'Retomar avisos' : 'Pausar avisos'}
          aria-pressed={paused}
          onClick={togglePause}
        >
          <Icon name="pausar" className="ic-pause" />
          <Icon name="tocar" className="ic-play" />
        </button>
        <button type="button" className="pv-arr" aria-label="Aviso anterior" onClick={() => go(st.current.i - 1)}>
          <Icon name="chevron-esquerda" />
        </button>
        <button type="button" className="pv-arr" aria-label="Próximo aviso" onClick={() => go(st.current.i + 1)}>
          <Icon name="chevron-direita" />
        </button>
      </div>
      <ul
        className={`ntf${paused ? ' is-paused' : ''}`}
        ref={listRef}
        style={{ ['--ntf-d' as string]: `${D}ms` }}
      >
        {AVISOS.map((a, k) => (
          <li key={a.lab} className={`ntf-card${k === i ? ' is-on' : ''}${k === out ? ' is-out' : ''}`}>
            <div className="ntf-top">
              <span className="ntf-ico">
                <Icon name={a.ico} />
              </span>
              <span className="ntf-lab">{a.lab}</span>
              <small>
                {k + 1} de {n}
              </small>
            </div>
            <h4 className="ntf-t">{a.t}</h4>
            <p>{a.p}</p>
            <div className="ntf-foot">
              <span className="ntf-seg" aria-hidden="true">
                {AVISOS.map((_, s) => (
                  <i key={s} className={s < k ? 'd' : s === k ? 'c' : undefined} />
                ))}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
