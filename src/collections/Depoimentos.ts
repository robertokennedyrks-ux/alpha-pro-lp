import type { CollectionConfig } from 'payload'

import { logado, publico } from '@/access'
import { revalidarAoApagar, revalidarColecao } from '@/hooks/revalidar'

// Prints de conversa da seção "Clientes reais".
export const Depoimentos: CollectionConfig = {
  slug: 'depoimentos',
  labels: { singular: 'Depoimento', plural: 'Depoimentos' },
  orderable: true,
  admin: {
    useAsTitle: 'titulo',
    group: 'Conteúdo',
    defaultColumns: ['titulo', 'ativo'],
  },
  access: { read: publico, create: logado, update: logado, delete: logado },
  hooks: { afterChange: [revalidarColecao], afterDelete: [revalidarAoApagar] },
  fields: [
    { name: 'titulo', label: 'Título do card', type: 'text', required: true },
    {
      name: 'print',
      label: 'Print original',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Opcional. Com print, ele substitui as mensagens abaixo. Cubra o telefone.' },
    },
    {
      name: 'mensagens',
      label: 'Mensagens',
      type: 'array',
      labels: { singular: 'Mensagem', plural: 'Mensagens' },
      fields: [
        { name: 'texto', label: 'Texto', type: 'textarea', required: true },
        {
          type: 'row',
          fields: [
            { name: 'hora', label: 'Hora', type: 'text', admin: { placeholder: '14:02', width: '50%' } },
            {
              name: 'lado',
              label: 'Quem escreveu',
              type: 'select',
              defaultValue: 'cliente',
              options: [
                { value: 'cliente', label: 'Cliente' },
                { value: 'loja', label: 'Loja' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    { name: 'ativo', label: 'Mostrar na página', type: 'checkbox', defaultValue: true },
  ],
}
