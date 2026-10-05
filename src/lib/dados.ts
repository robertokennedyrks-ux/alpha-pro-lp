import 'server-only'

import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@payload-config'
import { textos } from '@/conteudo/textos'
import { fotos } from '@/conteudo/fotos'
import { depoimentos, faq, ingredientes, videos } from '@/conteudo/listas'
import { contato, cookies, prova, seo } from '@/conteudo/site'
import { abasPoliticas } from '@/conteudo/politicas'

// O painel edita três coisas: preços, frete grátis e bônus. Tudo o mais é estático,
// em `src/conteudo/`. Esta função junta as duas metades numa forma só para as seções.
export const getDados = cache(async () => {
  const payload = await getPayload({ config })
  const [ofertas, frete, bonus] = await Promise.all([
    payload.findGlobal({ slug: 'ofertas', depth: 1 }),
    payload.findGlobal({ slug: 'frete-gratis', depth: 1 }),
    payload.findGlobal({ slug: 'bonus', depth: 1 }),
  ])

  return {
    // do painel
    ofertas,
    frete,
    bonus,
    // de src/conteudo
    textos,
    fotos,
    prova,
    contato,
    seo,
    cookies,
    depoimentos,
    videos,
    faq,
    ingredientes,
    politicas: abasPoliticas,
  }
})

export type Dados = Awaited<ReturnType<typeof getDados>>

// Opções de compra ativas, em ordem de potes.
export const opcoesAtivas = (d: Dados) =>
  (d.ofertas.opcoes ?? []).filter((o) => o.ativo !== false).sort((a, b) => a.potes - b.potes)

export const whatsappUrl = (d: Dados) =>
  d.contato.whatsapp
    ? `https://wa.me/${d.contato.whatsapp}${d.contato.whatsappMensagem ? `?text=${encodeURIComponent(d.contato.whatsappMensagem)}` : ''}`
    : null
