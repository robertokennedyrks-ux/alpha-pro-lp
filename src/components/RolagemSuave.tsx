'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

// Rolagem suave com Lenis. Diferente de uma perseguição caseira, ele normaliza a roda
// entre navegadores, mantém a barra de rolagem coerente e emite os eventos de scroll
// que o resto da página escuta (trilha, balões, cabeçalho) — por isso não briga com eles.
//
// No toque fica a inércia nativa, que é melhor. Com `prefers-reduced-motion`, nem liga.
export function RolagemSuave() {
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      // Quanto da distância restante é coberta por quadro: menor = mais escorregadio.
      lerp: 0.12,
      smoothWheel: true,
      // Toque continua nativo.
      syncTouch: false,
    })

    let raf = 0
    const quadro = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(quadro)
    }
    raf = requestAnimationFrame(quadro)

    // Links de âncora (#oferta, #comprar, menu lateral): com o Lenis no comando, o
    // `scroll-behavior: smooth` do CSS não vale mais, então a navegação passa por ele.
    // O recuo sai do `scroll-margin-top`/`scroll-padding-top` que cada destino já define,
    // para o cabeçalho fixo não cobrir o título.
    const noClique = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href')
      if (!id || id === '#') return
      const alvo = document.querySelector(id)
      if (!alvo) return
      e.preventDefault()
      const cs = getComputedStyle(alvo)
      const margem = parseFloat(cs.scrollMarginTop) || parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
      lenis.scrollTo(alvo as HTMLElement, { offset: -margem })
      history.pushState(null, '', id)
    }

    document.addEventListener('click', noClique)
    return () => {
      document.removeEventListener('click', noClique)
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return null
}
