import type { Imagem } from '@/conteudo/fotos'
import type { Media } from '@/payload-types'

// Upload do CMS: devolve o objeto Media quando ele veio populado e tem URL.
export const midia = (m: number | Media | Imagem | null | undefined): Imagem | null =>
  m && typeof m === 'object' && m.url ? { url: m.url, alt: m.alt ?? '', width: m.width ?? undefined, height: m.height ?? undefined } : null

// Prefere `prefers-reduced-motion: reduce`.
export const semMovimento = () =>
  typeof window !== 'undefined' && !!window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches
