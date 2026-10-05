import 'server-only'

import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@payload-config'
import { soPublicado } from '@/lib/dados'

// Uma política completa (com o rich text), pelo slug da URL.
export const getPolitica = cache(async (slug: string, rascunho: boolean = false) => {
  const payload = await getPayload({ config })
  const r = await payload.find({
    collection: 'politicas',
    where: { slug: { equals: slug }, ...soPublicado(rascunho) },
    limit: 1,
    depth: 0,
    draft: rascunho,
  })
  return r.docs[0] ?? null
})

// Só título e slug de todas, na ordem do painel (abas e generateStaticParams).
export const getListaPoliticas = cache(async (rascunho: boolean = false) => {
  const payload = await getPayload({ config })
  const r = await payload.find({
    collection: 'politicas',
    where: soPublicado(rascunho),
    sort: '_order',
    limit: 20,
    depth: 0,
    draft: rascunho,
    select: { titulo: true, slug: true },
  })
  return r.docs.map((p) => ({ slug: p.slug, titulo: p.titulo }))
})
