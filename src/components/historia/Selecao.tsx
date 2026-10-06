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

// Trecho apagado com um risco vermelho passando por cima.
export function Rabisco({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  useAcende(ref)
  return (
    <span ref={ref} className="rabisco">
      {children}
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
