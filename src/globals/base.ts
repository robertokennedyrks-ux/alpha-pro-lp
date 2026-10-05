import type { GlobalConfig } from 'payload'

import { logado, publico } from '@/access'
import { revalidarGlobal } from '@/hooks/revalidar'

// Todas as configurações únicas: leitura pública, edição com login, revalida a página ao salvar.
export const global = (config: GlobalConfig): GlobalConfig => ({
  ...config,
  access: { read: publico, update: logado, ...config.access },
  hooks: { ...config.hooks, afterChange: [revalidarGlobal, ...(config.hooks?.afterChange ?? [])] },
})

export const ajuda = (description: string) => ({ description })
