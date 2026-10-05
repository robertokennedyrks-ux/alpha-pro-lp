import { ajuda, global } from './base'

export const Ofertas = global({
  slug: 'ofertas',
  label: 'Ofertas e preços',
  admin: { group: 'Loja' },
  fields: [
    {
      name: 'produto',
      label: 'Produto',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'nome', label: 'Nome', type: 'text', required: true, defaultValue: 'ALPHA PRO', admin: { width: '50%' } },
            { name: 'capsulas', label: 'Conteúdo do pote', type: 'text', defaultValue: '60 cápsulas', admin: { width: '25%' } },
            { name: 'diasPorPote', label: 'Dias por pote', type: 'number', defaultValue: 30, min: 1, admin: { width: '25%' } },
          ],
        },
        { name: 'foto', label: 'Foto do produto', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'pagamento',
      label: 'Pagamento',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'descontoPix', label: 'Desconto no Pix (%)', type: 'number', defaultValue: 5, min: 0, max: 100, admin: { width: '50%' } },
            { name: 'parcelas', label: 'Parcelas sem juros', type: 'number', defaultValue: 5, min: 1, max: 12, admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'plataformaCheckout',
      label: 'Plataforma de checkout',
      type: 'text',
      admin: ajuda('Só para referência, ex.: Yampi, B4You, Shopify.'),
    },
    {
      name: 'opcoes',
      label: 'Opções de compra',
      labels: { singular: 'Opção', plural: 'Opções' },
      type: 'array',
      minRows: 1,
      maxRows: 6,
      // Valores de exemplo do protótipo aprovado: servem até a Genesy pôr os preços reais.
      defaultValue: [
        { potes: 1, preco: 227, precoDe: 297, ativo: true },
        { potes: 2, preco: 434, precoDe: 594, ativo: true },
        { potes: 3, preco: 621, precoDe: 891, ativo: true },
        { potes: 4, preco: 788, precoDe: 1188, ativo: true },
      ],
      admin: { initCollapsed: true, components: { RowLabel: '@/components/admin/RowLabelOferta#RowLabelOferta' } },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'potes', label: 'Potes', type: 'number', required: true, min: 1, admin: { width: '20%' } },
            { name: 'preco', label: 'Preço (R$)', type: 'number', required: true, min: 0, admin: { width: '40%', step: 0.01 } },
            {
              name: 'precoDe',
              label: 'Preço "de" (R$)',
              type: 'number',
              min: 0,
              admin: { width: '40%', step: 0.01, description: 'Riscado ao lado do preço. Vazio esconde.' },
            },
          ],
        },
        {
          name: 'linkCheckout',
          label: 'Link do checkout',
          type: 'text',
          admin: ajuda('Para onde o botão "Fazer pedido" leva com essa quantidade.'),
        },
        {
          name: 'foto',
          label: 'Foto desta quantidade',
          type: 'upload',
          relationTo: 'media',
          admin: ajuda('Aparece no card da oferta e no carrinho. Sem foto, usa a foto do produto.'),
        },
        { name: 'ativo', label: 'Mostrar na página', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
})
