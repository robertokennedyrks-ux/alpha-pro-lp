import { global } from './base'

export const Seo = global({
  slug: 'seo',
  label: 'SEO e compartilhamento',
  admin: { group: 'Configurações' },
  fields: [
    { name: 'titulo', label: 'Título da aba', type: 'text', maxLength: 70 },
    { name: 'descricao', label: 'Descrição no Google', type: 'textarea', maxLength: 170 },
    { name: 'imagem', label: 'Imagem ao compartilhar', type: 'upload', relationTo: 'media', admin: { description: '1200 × 630 px.' } },
    {
      name: 'favicon',
      label: 'Ícone da aba (favicon)',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Imagem quadrada, PNG ou SVG. Vazio usa o "A" da ALPHA.' },
    },
    { name: 'indexar', label: 'Aparecer no Google', type: 'checkbox', defaultValue: true },
  ],
})
