import 'server-only'

import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@payload-config'

// Uma política completa (com o rich text), pelo slug da URL.
export const getPolitica = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'politicas', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  return r.docs[0] ?? null
})

// Só título e slug de todas, na ordem do painel (abas e generateStaticParams).
export const getListaPoliticas = cache(async () => {
  const payload = await getPayload({ config })
  const r = await payload.find({
    collection: 'politicas',
    sort: '_order',
    limit: 20,
    depth: 0,
    select: { titulo: true, slug: true },
  })
  return r.docs.map((p) => ({ slug: p.slug, titulo: p.titulo }))
})
