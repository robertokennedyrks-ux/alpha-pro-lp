import { ajuda, global } from './base'

export const FreteGratis = global({
  slug: 'frete-gratis',
  label: 'Frete grátis',
  admin: {
    group: 'Loja',
    description:
      'A barra no carrinho é só visual. O checkout precisa aplicar a mesma regra (subtotal a partir do valor mínimo = frete zero).',
  },
  fields: [
    { name: 'ativo', label: 'Frete grátis ligado', type: 'checkbox', defaultValue: true, admin: ajuda('Desligado, some do carrinho e das ofertas.') },
    {
      type: 'row',
      fields: [
        { name: 'valorMinimo', label: 'Valor mínimo (R$)', type: 'number', defaultValue: 500, min: 0, admin: { width: '50%' } },
        { name: 'segmentos', label: 'Segmentos da barra', type: 'number', defaultValue: 5, min: 1, max: 10, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'textoProgresso', label: 'Título antes da meta', type: 'text', defaultValue: 'Frete grátis', admin: { width: '50%' } },
        { name: 'textoLiberado', label: 'Título com a meta', type: 'text', defaultValue: 'Frete grátis liberado!', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'subtextoProgresso',
          label: 'Texto antes da meta',
          type: 'text',
          defaultValue: 'Falta {falta} para liberar!',
          admin: { width: '50%', description: '{falta} vira o valor que falta.' },
        },
        { name: 'subtextoLiberado', label: 'Texto com a meta', type: 'text', defaultValue: 'Entrega sem custo adicional!', admin: { width: '50%' } },
      ],
    },
    { name: 'comemorar', label: 'Animação ao liberar', type: 'checkbox', defaultValue: true },
  ],
})
