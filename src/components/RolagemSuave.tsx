'use client'

import { useEffect } from 'react'

// Quanto da distância que falta é percorrida por quadro (a 60Hz). Maior = mais seco.
const FATOR = 0.13
// Rampa de entrada: nos primeiros instantes do gesto o fator sobe do zero, para o
// começo não dar um tranco. É o "in" do ease-in-out; o "out" vem da perseguição.
const RAMPA = 0.16

// Rolagem com um leve ease-in-out no mouse: a roda passa a mover um alvo, e a página
// persegue esse alvo. No toque não faz nada — a inércia nativa do celular é melhor que
// qualquer imitação. Também sai de cena com `prefers-reduced-motion`.
export function RolagemSuave() {
  useEffect(() => {
    const m = window.matchMedia
    if (m?.('(prefers-reduced-motion: reduce)').matches) return
    if (!m?.('(hover: hover) and (pointer: fine)').matches) return

    let alvo = window.scrollY
    let rodando = false
    let inicio = 0
    let raf = 0

    const limite = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

    const passo = (agora: number) => {
      const d = alvo - window.scrollY
      if (Math.abs(d) < 0.5) {
        window.scrollTo(0, alvo)
        rodando = false
        return
      }
      const rampa = Math.min(1, (agora - inicio) / 1000 / RAMPA)
      // smoothstep na rampa: entra macio em vez de ligar o movimento de uma vez
      const suave = rampa * rampa * (3 - 2 * rampa)
      window.scrollTo(0, window.scrollY + d * FATOR * suave)
      raf = requestAnimationFrame(passo)
    }

    const naRoda = (e: WheelEvent) => {
      // ctrl+roda é zoom; deltaMode != 0 vem de dispositivos que já mandam passos grandes
      if (e.ctrlKey || e.deltaMode !== 0) return
      e.preventDefault()
      alvo = Math.max(0, Math.min(limite(), alvo + e.deltaY))
      if (!rodando) {
        rodando = true
        inicio = performance.now()
        raf = requestAnimationFrame(passo)
      }
    }

    // Âncora, teclado, barra de rolagem e busca na página mexem na posição por fora:
    // quando isso acontece sem a perseguição ativa, o alvo acompanha.
    const naRolagem = () => {
      if (!rodando) alvo = window.scrollY
    }

    window.addEventListener('wheel', naRoda, { passive: false })
    window.addEventListener('scroll', naRolagem, { passive: true })
    return () => {
      window.removeEventListener('wheel', naRoda)
      window.removeEventListener('scroll', naRolagem)
      cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
