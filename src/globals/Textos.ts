import { global } from './base'

const negrito = { description: 'Use **texto** para negrito.' }

export const Textos = global({
  slug: 'textos',
  label: 'Textos da página',
  admin: { group: 'Conteúdo' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Topo',
          name: 'hero',
          fields: [
            { name: 'etiqueta', label: 'Etiqueta', type: 'text' },
            {
              type: 'row',
              fields: [
                { name: 'titulo', label: 'Título', type: 'text', required: true, admin: { width: '60%' } },
                { name: 'tituloLeve', label: 'Complemento (fino)', type: 'text', admin: { width: '40%' } },
              ],
            },
            { name: 'subtitulo', label: 'Subtítulo', type: 'textarea', admin: negrito },
            { name: 'condicao', label: 'Condição abaixo do botão', type: 'text', admin: negrito },
            { name: 'foto', label: 'Foto principal', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Botões',
          name: 'botoes',
          description: 'Textos curtos: o botão fica sempre em uma linha.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'principal', label: 'Topo e final', type: 'text', maxLength: 28, admin: { width: '50%' } },
                { name: 'produto', label: 'Dor, produto e "Já usa"', type: 'text', maxLength: 28, admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'bonus', label: 'Bônus', type: 'text', maxLength: 28, admin: { width: '50%' } },
                { name: 'pedido', label: 'Oferta e carrinho', type: 'text', maxLength: 28, admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Oferta',
          name: 'oferta',
          fields: [
            { name: 'garantia', label: 'Linha da garantia', type: 'text' },
            { name: 'precoPorDia', label: 'Frase do preço por dia', type: 'text', admin: { description: '{valor} vira o preço por dia do pote avulso.' } },
          ],
        },
      ],
    },
  ],
})
