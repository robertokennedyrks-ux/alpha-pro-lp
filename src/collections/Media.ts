import type { CollectionConfig } from 'payload'

import { logado, publico } from '@/access'
import { revalidarAoApagar, revalidarColecao } from '@/hooks/revalidar'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Mídia', plural: 'Mídias' },
  admin: { group: 'Sistema' },
  access: { read: publico, create: logado, update: logado, delete: logado },
  hooks: { afterChange: [revalidarColecao], afterDelete: [revalidarAoApagar] },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      required: true,
      admin: { description: 'Descreva a imagem para quem usa leitor de tela.' },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/*'],
    imageSizes: [
      { name: 'thumb', width: 240 },
      { name: 'card', width: 640 },
      { name: 'hero', width: 1440 },
    ],
  },
}
