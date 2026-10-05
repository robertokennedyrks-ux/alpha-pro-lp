'use client'

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

export type Aba = { slug: string; titulo: string }

// Trocar de aba é uma navegação do Next para /<slug> (cada política tem a sua URL).
// A página nova monta de novo; esta marca diz se a troca veio de um clique/teclado
// (aí, como no protótipo, foca o conteúdo e leva a vista para o começo do widget)
// ou do voltar/avançar do navegador (aí não mexe na rolagem).
let veioDeClique = false

const reduzMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Abas({ abas, atual }: { abas: Aba[]; atual: string }) {
  const nav = useRef<HTMLElement>(null)

  useEffect(() => {
    const tabs = nav.current
    if (!tabs) return
    const desktop = window.innerWidth >= 1024
    if (veioDeClique) {
      veioDeClique = false
      document.getElementById('doc')?.focus({ preventScroll: true })
      const behavior: ScrollBehavior = reduzMovimento() ? 'auto' : 'smooth'
      if (desktop) window.scrollTo({ top: 0, behavior })
      else tabs.scrollIntoView({ block: 'start', behavior })
    }
    // No celular, a pílula ativa fica centralizada na faixa que rola de lado.
    const cur = tabs.querySelector<HTMLElement>('[aria-selected="true"]')
    if (cur && !desktop) {
      tabs.scrollLeft = cur.offsetLeft - (tabs.clientWidth - cur.offsetWidth) / 2
    }
  }, [atual])

  const teclado = (e: React.KeyboardEvent<HTMLElement>) => {
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>('[role="tab"]'))
    const i = links.indexOf(document.activeElement as HTMLAnchorElement)
    if (i < 0) return
    const passo =
      e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!passo) return
    e.preventDefault()
    const n = (i + passo + links.length) % links.length
    links[n].focus()
    links[n].click()
  }

  return (
    <nav
      ref={nav}
      className="pol-tabs flex gap-1.5 overflow-x-auto border-b border-border p-2.5 lg:sticky lg:top-0 lg:flex-col lg:self-stretch lg:overflow-visible lg:border-r lg:border-b-0 lg:p-4"
      id="tabs"
      role="tablist"
      aria-label="Políticas"
      onKeyDown={teclado}
    >
      {abas.map((p) => {
        const on = p.slug === atual
        return (
          <LinkAba
            key={p.slug}
            slug={p.slug}
            atual={atual}
            className="pol-tab"
            role="tab"
            id={`tab-${p.slug}`}
            aria-controls="doc"
            aria-selected={on ? 'true' : 'false'}
            tabIndex={on ? 0 : -1}
          >
            {p.titulo}
          </LinkAba>
        )
      })}
    </nav>
  )
}

// Link para outra política (abas e links dentro do texto).
export function LinkAba({
  slug,
  atual,
  children,
  ...rest
}: { slug: string; atual?: string; children: React.ReactNode } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>) {
  return (
    <Link
      {...rest}
      href={`/${slug}`}
      scroll={false}
      onClick={(e) => {
        if (slug === atual) {
          e.preventDefault()
          return
        }
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) veioDeClique = true
      }}
    >
      {children}
    </Link>
  )
}
