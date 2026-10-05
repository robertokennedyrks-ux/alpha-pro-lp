import type { CollectionConfig } from 'payload'

import { logado, publicadoOuLogado } from '@/access'
import { versoes } from '@/globals/base'
import { revalidarAoApagar, revalidarColecao } from '@/hooks/revalidar'

// Depoimentos em vídeo (grade + stories).
export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: 'Vídeo', plural: 'Vídeos' },
  orderable: true,
  admin: { useAsTitle: 'tema', group: 'Conteúdo', defaultColumns: ['tema', 'nome', 'ativo'] },
  access: { read: publicadoOuLogado, create: logado, update: logado, delete: logado },
  versions: versoes,
  hooks: { afterChange: [revalidarColecao], afterDelete: [revalidarAoApagar] },
  fields: [
    { name: 'tema', label: 'Tema', type: 'text', required: true, admin: { placeholder: 'A primeira semana' } },
    {
      type: 'row',
      fields: [
        { name: 'nome', label: 'Nome da cliente', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'legenda',
          label: 'Legenda',
          type: 'text',
          admin: { width: '50%', placeholder: 'Cidade · 2 meses de uso' },
        },
      ],
    },
    { name: 'video', label: 'Vídeo', type: 'upload', relationTo: 'media' },
    { name: 'capa', label: 'Capa', type: 'upload', relationTo: 'media', admin: { description: 'Opcional. Imagem antes do vídeo carregar.' } },
    { name: 'ativo', label: 'Mostrar na página', type: 'checkbox', defaultValue: true },
  ],
}
