'use client'

import { useRowLabel } from '@payloadcms/ui'

type Item = { texto?: string; titulo?: string; linha1?: string; linha2?: string; rotulo?: string }

// Título de cada item das listas de "Textos da página": mostra o próprio texto em vez de "Item 01".
export function RowLabelTexto() {
  const { data, rowNumber } = useRowLabel<Item>()
  const n = String((rowNumber ?? 0) + 1).padStart(2, '0')
  const card = [data?.linha1, data?.linha2].filter(Boolean).join(' ')
  const t = (data?.titulo || data?.texto || card || '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim()
  if (!t) return <span>{n}</span>
  return (
    <span>
      {n} · {t.length > 70 ? `${t.slice(0, 70)}…` : t}
    </span>
  )
}
