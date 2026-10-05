import type { CollectionConfig } from 'payload'

import { logado, publicadoOuLogado } from '@/access'
import { versoes } from '@/globals/base'
import { revalidarAoApagar, revalidarColecao } from '@/hooks/revalidar'

// Trocas e devoluções, Política de privacidade e Termos de uso.
// Cada uma vira uma URL própria (/<slug>) dentro do mesmo widget de abas.
export const Politicas: CollectionConfig = {
  slug: 'politicas',
  labels: { singular: 'Política', plural: 'Políticas' },
  orderable: true,
  admin: { useAsTitle: 'titulo', group: 'Conteúdo', defaultColumns: ['titulo', 'slug', 'atualizado'] },
  access: { read: publicadoOuLogado, create: logado, update: logado, delete: logado },
  versions: versoes,
  hooks: { afterChange: [revalidarColecao], afterDelete: [revalidarAoApagar] },
  fields: [
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    {
      name: 'slug',
      label: 'Endereço',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Parte final da URL, ex.: politica-de-privacidade' },
    },
    { name: 'atualizado', label: 'Última atualização', type: 'text', admin: { placeholder: '05/10/2026' } },
    { name: 'intro', label: 'Introdução', type: 'textarea' },
    { name: 'conteudo', label: 'Conteúdo', type: 'richText', required: true },
  ],
}
