'use client'

import React from 'react'

// Link para a escolha da oferta (#comprar) ou para o checkout da quantidade.
// Sem link de checkout, rola suave até a oferta parando 16px acima dela, como o protótipo.
export function LinkPedido({
  link,
  onClick,
  ...rest
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { link?: string | null }) {
  return (
    <a
      {...rest}
      href={link || '#comprar'}
      onClick={(e) => {
        onClick?.(e)
        if (link || e.defaultPrevented) return
        const alvo = document.getElementById('comprar')
        if (!alvo) return
        e.preventDefault()
        const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: alvo.getBoundingClientRect().top + window.scrollY - 16, behavior: reduz ? 'auto' : 'smooth' })
      }}
    />
  )
}
