import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// A página é estática: ao salvar no painel, ela é gerada de novo.
// O seed roda fora do Next e passa context.disableRevalidate.
const revalidarTudo = (context: Record<string, unknown>) => {
  if (context?.disableRevalidate) return
  try {
    revalidatePath('/', 'layout')
  } catch {
    // fora do servidor Next (scripts), não há o que revalidar
  }
}

// O salvamento automático grava rascunho e não mexe na página no ar: só revalida
// ao publicar ou ao despublicar o que estava no ar.
type ComStatus = { _status?: 'draft' | 'published' | null } | undefined
const mudouOQueEstaNoAr = (doc: ComStatus, anterior: ComStatus) =>
  doc?._status !== 'draft' || anterior?._status === 'published'

export const revalidarGlobal: GlobalAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (mudouOQueEstaNoAr(doc, previousDoc)) revalidarTudo(req.context)
  return doc
}

export const revalidarColecao: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (mudouOQueEstaNoAr(doc, previousDoc)) revalidarTudo(req.context)
  return doc
}

export const revalidarAoApagar: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidarTudo(req.context)
  return doc
}
