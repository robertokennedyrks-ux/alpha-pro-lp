import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'
import { type JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { Rico } from '@/lib/texto'
import type { Politica } from '@/payload-types'

import { type Aba, LinkAba } from './Abas'

const textoDe = (n: { text?: unknown; children?: unknown[] }): string =>
  typeof n.text === 'string' ? n.text : (n.children ?? []).map((c) => textoDe(c as typeof n)).join('')

// Link do texto que aponta para outra política ("/termos-de-uso", "#termos-de-uso", ou "#"
// com o nome da política no texto) vira troca de aba, sem recarregar.
function slugInterno(node: SerializedLinkNode, abas: Aba[]) {
  let url = node.fields.url ?? ''
  try {
    url = decodeURIComponent(url)
  } catch {}
  const m = url.match(/^(?:\/|#)?([\w-]+)\/?$/)
  if (m && abas.some((a) => a.slug === m[1])) return m[1]
  if (url === '#' || url === '') {
    const t = textoDe(node).trim().toLowerCase()
    return abas.find((a) => a.titulo.toLowerCase() === t)?.slug ?? null
  }
  return null
}

export function Conteudo({ p, abas }: { p: Politica; abas: Aba[] }) {
  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    link: (args) => {
      const { node, nodesToJSX } = args
      const slug = slugInterno(node, abas)
      if (!slug) return defaultConverters.link ? (defaultConverters.link as (a: typeof args) => React.ReactNode)(args) : null
      return (
        <LinkAba slug={slug} atual={p.slug}>
          {nodesToJSX({ nodes: node.children })}
        </LinkAba>
      )
    },
  })

  return (
    <article className="pol-doc" id="doc" role="tabpanel" tabIndex={-1} aria-labelledby={`tab-${p.slug}`}>
      <h1>{p.titulo}</h1>
      {p.atualizado ? <p className="upd">Última atualização: {p.atualizado}</p> : null}
      {p.intro ? (
        <p className="intro">
          <Rico texto={p.intro} />
        </p>
      ) : null}
      <RichText data={p.conteudo as never} converters={converters} disableContainer />
    </article>
  )
}
