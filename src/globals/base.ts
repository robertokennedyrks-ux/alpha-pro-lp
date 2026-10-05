import type { GlobalConfig } from 'payload'

import { logado, publico } from '@/access'
import { revalidarGlobal } from '@/hooks/revalidar'

// As três configurações do painel: leitura pública, edição com login,
// e a página é gerada de novo assim que a pessoa salva.
export const global = (config: GlobalConfig): GlobalConfig => ({
  ...config,
  access: { read: publico, update: logado, ...config.access },
  hooks: { ...config.hooks, afterChange: [revalidarGlobal, ...(config.hooks?.afterChange ?? [])] },
})

export const ajuda = (description: string) => ({ description })
