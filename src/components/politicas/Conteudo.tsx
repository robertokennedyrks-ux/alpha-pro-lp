import React from 'react'

import type { Politica } from '@/conteudo/politicas'

import { type Aba, LinkAba } from './Abas'

// Markdown simples das políticas: "## título", "- item", "> destaque",
// **negrito** e [texto](link). Nada além disso aparece nos três documentos.

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g

// Link que aponta para outra política vira troca de aba, sem recarregar a página.
function slugInterno(url: string, abas: Aba[]) {
  const m = url.match(/^(?:\/|#)?([\w-]+)\/?$/)
  return m && abas.some((a) => a.slug === m[1]) ? m[1] : null
}

function Inline({ texto, abas, atual }: { texto: string; abas: Aba[]; atual: string }) {
  return (
    <>
      {texto.split(INLINE).map((p, i) => {
        const negrito = p.match(/^\*\*([^*]+)\*\*$/)
        if (negrito) return <strong key={i}>{negrito[1]}</strong>

        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (link) {
          const [, rotulo, url] = link
          const slug = slugInterno(url, abas)
          if (slug) {
            return (
              <LinkAba key={i} slug={slug} atual={atual}>
                {rotulo}
              </LinkAba>
            )
          }
          const externo = /^https?:/.test(url)
          return (
            <a key={i} href={url} {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {rotulo}
            </a>
          )
        }

        return <React.Fragment key={i}>{p}</React.Fragment>
      })}
    </>
  )
}

function Corpo({ markdown, abas, atual }: { markdown: string; abas: Aba[]; atual: string }) {
  const blocos = markdown.trim().split(/\n{2,}/)
  return (
    <>
      {blocos.map((bloco, i) => {
        const linhas = bloco.split('\n')

        if (bloco.startsWith('## ')) {
          return (
            <h2 key={i}>
              <Inline texto={bloco.slice(3)} abas={abas} atual={atual} />
            </h2>
          )
        }

        if (bloco.startsWith('> ')) {
          return (
            <blockquote key={i}>
              <Inline texto={linhas.map((l) => l.replace(/^> ?/, '')).join(' ')} abas={abas} atual={atual} />
            </blockquote>
          )
        }

        if (linhas.every((l) => /^[-*] /.test(l))) {
          return (
            <ul key={i}>
              {linhas.map((l, j) => (
                <li key={j}>
                  <Inline texto={l.slice(2)} abas={abas} atual={atual} />
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={i}>
            <Inline texto={bloco} abas={abas} atual={atual} />
          </p>
        )
      })}
    </>
  )
}

export function Conteudo({ p, abas }: { p: Politica; abas: Aba[] }) {
  return (
    <div className="pol-doc" id="doc" role="tabpanel" tabIndex={-1} aria-labelledby={`tab-${p.slug}`}>
      <h1>{p.titulo}</h1>
      {p.atualizado ? <p className="upd">Última atualização: {p.atualizado}</p> : null}
      {p.intro ? (
        <p className="intro">
          <Inline texto={p.intro} abas={abas} atual={p.slug} />
        </p>
      ) : null}
      <Corpo markdown={p.corpo} abas={abas} atual={p.slug} />
    </div>
  )
}
