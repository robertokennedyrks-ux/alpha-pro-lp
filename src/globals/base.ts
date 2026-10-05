import type { GlobalConfig } from 'payload'

import { logado, publico } from '@/access'
import { revalidarGlobal } from '@/hooks/revalidar'

// Rascunho com salvamento automático: a pré-visualização ao lado acompanha cada mudança
// e a página no ar só muda quando a pessoa clica em Publicar.
export const versoes = { drafts: { autosave: { interval: 800 } }, maxPerDoc: 20 } as const

// Todas as configurações únicas: leitura pública, edição com login, revalida a página ao publicar.
export const global = (config: GlobalConfig): GlobalConfig => ({
  versions: { drafts: versoes.drafts, max: versoes.maxPerDoc },
  ...config,
  access: { read: publico, update: logado, ...config.access },
  hooks: { ...config.hooks, afterChange: [revalidarGlobal, ...(config.hooks?.afterChange ?? [])] },
})

export const ajuda = (description: string) => ({ description })
