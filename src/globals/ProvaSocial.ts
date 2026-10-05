import { global } from './base'

export const ProvaSocial = global({
  slug: 'prova-social',
  label: 'Prova social',
  admin: { group: 'Conteúdo' },
  fields: [
    {
      name: 'anuncios',
      label: 'Faixa de anúncios (topo)',
      labels: { singular: 'Anúncio', plural: 'Anúncios' },
      type: 'array',
      fields: [{ name: 'texto', label: 'Texto', type: 'text', required: true }],
    },
    {
      name: 'selo',
      label: 'Selo da foto principal',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'numero', label: 'Número', type: 'text', admin: { width: '40%', placeholder: '+25 mil' } },
            { name: 'texto', label: 'Texto', type: 'text', admin: { width: '60%' } },
          ],
        },
      ],
    },
    { name: 'provaHero', label: 'Frase abaixo do título', type: 'text', admin: { description: 'Use **texto** para negrito.' } },
    {
      name: 'numeros',
      label: 'Números da linha',
      labels: { singular: 'Número', plural: 'Números' },
      type: 'array',
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'valor', label: 'Valor', type: 'number', required: true, admin: { width: '25%' } },
            { name: 'sufixo', label: 'Sufixo', type: 'text', admin: { width: '25%', placeholder: 'mil, %' } },
            { name: 'legenda', label: 'Legenda', type: 'text', required: true, admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
})
