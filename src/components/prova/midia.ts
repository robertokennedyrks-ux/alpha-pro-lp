import type { Media } from '@/payload-types'

// Upload do CMS: devolve o objeto Media quando ele veio populado e tem URL.
export const midia = (m: number | Media | null | undefined): Media | null =>
  m && typeof m === 'object' && m.url ? m : null

// Prefere `prefers-reduced-motion: reduce`.
export const semMovimento = () =>
  typeof window !== 'undefined' && !!window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches
