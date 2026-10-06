'use client'

import React, { useEffect, useRef } from 'react'

// Acende a marca quando o trecho entra na tela e apaga ao sair, para o efeito se
// repetir na volta. Usado pelos destaques que não passam pelo <Revelar>.
function useAcende(ref: React.RefObject<HTMLSpanElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('pronta')
      return
    }
    const io = new IntersectionObserver((es) => el.classList.toggle('pronta', es[0].isIntersecting), {
      rootMargin: '0px 0px -22% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}

// Destaque em forma de seleção de texto.
export function Selecao({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  useAcende(ref)
  return (
    <span ref={ref} className="sel-linha">
      {children}
    </span>
  )
}

// Marca só um trecho da frase; o resto fica como está.
export function SelecaoParcial({ texto, alvo }: { texto: string; alvo: string }) {
  const i = texto.indexOf(alvo)
  if (i < 0) return <>{texto}</>
  return (
    <>
      {texto.slice(0, i)}
      <Selecao>{alvo}</Selecao>
      {texto.slice(i + alvo.length)}
    </>
  )
}

// Trecho apagado com um rabisco vermelho por cima. São dois traços tortos, em SVG,
// desenhados da esquerda para a direita — uma barra reta não passa a ideia de rabisco.
// `pathLength=100` normaliza o comprimento, então o dash não depende do tamanho do texto,
// e `vector-effect` mantém a espessura mesmo com o SVG esticado na largura.
export function Rabisco({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  useAcende(ref)
  return (
    <span ref={ref} className="rabisco">
      {children}
      <svg className="rabisco-traco" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
        <path
          pathLength={100}
          d="M1.5 7.2c13-2.6 23 2.1 35-.6 11.5-2.6 22 2.4 33.5-.4 9-2.2 20 1.4 28.5-1.1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="volta"
          pathLength={100}
          d="M97 8.6c-12 2-22-1.8-34 .5-11 2.1-21-1.9-32.5.3-8 1.6-18-1-28.5 1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  )
}

// Rabisca só um trecho da frase.
export function RabiscoParcial({ texto, alvo }: { texto: string; alvo: string }) {
  const i = texto.indexOf(alvo)
  if (i < 0) return <>{texto}</>
  return (
    <>
      {texto.slice(0, i)}
      <Rabisco>{alvo}</Rabisco>
      {texto.slice(i + alvo.length)}
    </>
  )
}
