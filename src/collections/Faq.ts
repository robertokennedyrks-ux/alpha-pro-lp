import type { CollectionConfig } from 'payload'

import { logado, publico } from '@/access'
import { revalidarAoApagar, revalidarColecao } from '@/hooks/revalidar'

export const Faq: CollectionConfig = {
  slug: 'faq',
  labels: { singular: 'Pergunta', plural: 'Perguntas frequentes' },
  orderable: true,
  admin: { useAsTitle: 'pergunta', group: 'Conteúdo', defaultColumns: ['pergunta', 'ativo'] },
  access: { read: publico, create: logado, update: logado, delete: logado },
  hooks: { afterChange: [revalidarColecao], afterDelete: [revalidarAoApagar] },
  fields: [
    { name: 'pergunta', label: 'Pergunta', type: 'text', required: true },
    { name: 'resposta', label: 'Resposta', type: 'textarea', required: true },
    { name: 'aberta', label: 'Começa aberta', type: 'checkbox', defaultValue: false },
    { name: 'ativo', label: 'Mostrar na página', type: 'checkbox', defaultValue: true },
  ],
}
