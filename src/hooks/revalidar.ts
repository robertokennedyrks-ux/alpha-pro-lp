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

export const revalidarGlobal: GlobalAfterChangeHook = ({ doc, req }) => {
  revalidarTudo(req.context)
  return doc
}

export const revalidarColecao: CollectionAfterChangeHook = ({ doc, req }) => {
  revalidarTudo(req.context)
  return doc
}

export const revalidarAoApagar: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidarTudo(req.context)
  return doc
}
