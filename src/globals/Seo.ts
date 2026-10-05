import { global } from './base'

export const Seo = global({
  slug: 'seo',
  label: 'SEO e compartilhamento',
  admin: { group: 'Configurações' },
  fields: [
    { name: 'titulo', label: 'Título da aba', type: 'text', maxLength: 70 },
    { name: 'descricao', label: 'Descrição no Google', type: 'textarea', maxLength: 170 },
    { name: 'imagem', label: 'Imagem ao compartilhar', type: 'upload', relationTo: 'media', admin: { description: '1200 × 630 px.' } },
    { name: 'indexar', label: 'Aparecer no Google', type: 'checkbox', defaultValue: true },
  ],
})
