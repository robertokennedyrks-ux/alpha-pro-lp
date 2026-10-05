import type { CollectionConfig } from 'payload'

import { logado, publico } from '@/access'
import { revalidarAoApagar, revalidarColecao } from '@/hooks/revalidar'
import { campoIcone } from '@/fields/icone'

export const Ingredientes: CollectionConfig = {
  slug: 'ingredientes',
  labels: { singular: 'Ingrediente', plural: 'Ingredientes' },
  orderable: true,
  admin: { useAsTitle: 'nome', group: 'Conteúdo', defaultColumns: ['nome', 'dosagem', 'ativo'] },
  access: { read: publico, create: logado, update: logado, delete: logado },
  hooks: { afterChange: [revalidarColecao], afterDelete: [revalidarAoApagar] },
  fields: [
    { name: 'nome', label: 'Nome', type: 'text', required: true },
    { name: 'beneficio', label: 'Benefício', type: 'textarea', required: true },
    { name: 'dosagem', label: 'Dosagem por porção', type: 'text', admin: { placeholder: '250 mcg de cromo por porção.' } },
    { name: 'foto', label: 'Foto', type: 'upload', relationTo: 'media' },
    campoIcone(),
    { name: 'ativo', label: 'Mostrar na página', type: 'checkbox', defaultValue: true },
  ],
}
