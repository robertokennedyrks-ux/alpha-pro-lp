import { campoIcone } from '@/fields/icone'

import { ajuda, global } from './base'

export const Bonus = global({
  slug: 'bonus',
  label: 'Bônus',
  admin: { group: 'Loja' },
  fields: [
    { name: 'ativo', label: 'Bônus ligados', type: 'checkbox', defaultValue: true, admin: ajuda('Desligado, a seção, os selos e os bônus do carrinho somem.') },
    { name: 'subtitulo', label: 'Subtítulo da seção', type: 'textarea' },
    { name: 'entrega', label: 'Como a cliente recebe', type: 'text' },
    {
      name: 'itens',
      label: 'Bônus',
      labels: { singular: 'Bônus', plural: 'Bônus' },
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', required: true },
        { name: 'descricao', label: 'Descrição', type: 'textarea' },
        {
          type: 'row',
          fields: [
            {
              name: 'potesMinimos',
              label: 'Libera a partir de (potes)',
              type: 'number',
              required: true,
              min: 1,
              admin: { width: '50%' },
            },
            { name: 'valorDe', label: 'Valor riscado (R$)', type: 'number', min: 0, admin: { width: '50%', step: 0.01 } },
          ],
        },
        campoIcone(),
        { name: 'imagem', label: 'Imagem', type: 'upload', relationTo: 'media', admin: ajuda('Usada no carrinho. Sem imagem, usa o ícone.') },
      ],
    },
  ],
})
