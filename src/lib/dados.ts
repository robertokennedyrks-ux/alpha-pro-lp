import 'server-only'

import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import config from '@payload-config'

// Fora da pré-visualização, só o que já foi publicado (itens novos nascem como rascunho).
export const soPublicado = (rascunho: boolean): Where => (rascunho ? {} : { _status: { equals: 'published' } })

// Tudo o que a landing lê do CMS, numa ida só ao banco por requisição/geração.
// rascunho = true na pré-visualização do painel: lê a versão mais recente, publicada ou não.
export const getDados = cache(async (rascunho: boolean = false) => {
  const payload = await getPayload({ config })
  const g = <S extends Parameters<typeof payload.findGlobal>[0]['slug']>(slug: S) =>
    payload.findGlobal({ slug, depth: 1, draft: rascunho })
  const lista = <C extends 'depoimentos' | 'videos' | 'faq' | 'ingredientes'>(collection: C) =>
    payload
      .find({
        collection,
        where: { ativo: { equals: true }, ...soPublicado(rascunho) },
        sort: '_order',
        limit: 100,
        depth: 1,
        draft: rascunho,
      })
      .then((r) => r.docs)

  const [ofertas, frete, bonus, textos, prova, contato, seo, cookies, depoimentos, videos, faq, ingredientes, politicas] =
    await Promise.all([
      g('ofertas'),
      g('frete-gratis'),
      g('bonus'),
      g('textos'),
      g('prova-social'),
      g('contato'),
      g('seo'),
      g('cookies'),
      lista('depoimentos'),
      lista('videos'),
      lista('faq'),
      lista('ingredientes'),
      payload
        .find({
          collection: 'politicas',
          where: soPublicado(rascunho),
          sort: '_order',
          limit: 20,
          depth: 0,
          draft: rascunho,
          select: { titulo: true, slug: true },
        })
        .then((r) => r.docs),
    ])

  return { ofertas, frete, bonus, textos, prova, contato, seo, cookies, depoimentos, videos, faq, ingredientes, politicas }
})

export type Dados = Awaited<ReturnType<typeof getDados>>

// Opções de compra ativas, em ordem de potes.
export const opcoesAtivas = (d: Dados) =>
  (d.ofertas.opcoes ?? []).filter((o) => o.ativo !== false).sort((a, b) => a.potes - b.potes)

export const whatsappUrl = (d: Dados) =>
  d.contato.whatsapp
    ? `https://wa.me/${d.contato.whatsapp}${d.contato.whatsappMensagem ? `?text=${encodeURIComponent(d.contato.whatsappMensagem)}` : ''}`
    : null
