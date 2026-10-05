import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// A página é estática: ao salvar no painel, ela é gerada de novo.
const revalidarTudo = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // fora do servidor Next (scripts), não há o que revalidar
  }
}

export const revalidarGlobal: GlobalAfterChangeHook = ({ doc }) => {
  revalidarTudo()
  return doc
}

export const revalidarColecao: CollectionAfterChangeHook = ({ doc }) => {
  revalidarTudo()
  return doc
}

export const revalidarAoApagar: CollectionAfterDeleteHook = ({ doc }) => {
  revalidarTudo()
  return doc
}
