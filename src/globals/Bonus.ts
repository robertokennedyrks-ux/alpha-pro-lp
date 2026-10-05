import { campoIcone } from '@/fields/icone'

import { ajuda, global } from './base'

export const Bonus = global({
  slug: 'bonus',
  label: 'Bônus',
  admin: { group: 'Loja' },
  fields: [
    { name: 'ativo', label: 'Bônus ligados', type: 'checkbox', defaultValue: true, admin: ajuda('Desligado, a seção, os selos e os bônus do carrinho somem.') },
    {
      name: 'subtitulo',
      label: 'Subtítulo da seção',
      type: 'textarea',
      defaultValue: 'Leve 2, 3 ou 4 potes e libere os bônus.',
    },
    {
      name: 'entrega',
      label: 'Como a cliente recebe',
      type: 'text',
      defaultValue: 'Você recebe os bônus por e-mail e WhatsApp logo após a compra.',
    },
    {
      name: 'itens',
      label: 'Bônus',
      labels: { singular: 'Bônus', plural: 'Bônus' },
      type: 'array',
      // Bônus de exemplo do protótipo aprovado: servem até a Genesy definir os reais.
      defaultValue: [
        {
          titulo: 'Guia Noite Sem Geladeira',
          descricao: 'O passo a passo para atravessar a noite sem beliscar. Leitura de 10 minutos.',
          potesMinimos: 2,
          valorDe: 49.9,
          icone: 'livro',
        },
        {
          titulo: 'Cardápio Saciedade 30 dias',
          descricao: 'Refeições simples que seguram a fome por mais tempo, com lista de compras pronta.',
          potesMinimos: 3,
          valorDe: 59.9,
          icone: 'prato-talheres',
        },
        {
          titulo: 'Grupo VIP de acompanhamento',
          descricao: 'Um mês de apoio diário com quem está no mesmo caminho que você.',
          potesMinimos: 4,
          valorDe: 79.9,
          icone: 'balao-conversa',
        },
      ],
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
        { name: 'imagem', label: 'Imagem', type: 'upload', relationTo: 'media', admin: ajuda('Usada no carrinho. Sem imagem, aparece um espaço reservado.') },
      ],
    },
  ],
})
