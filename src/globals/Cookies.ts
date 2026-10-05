import { global } from './base'

export const Cookies = global({
  slug: 'cookies',
  label: 'Aviso de cookies',
  admin: { group: 'Configurações' },
  fields: [
    { name: 'ativo', label: 'Mostrar aviso', type: 'checkbox', defaultValue: true },
    {
      name: 'texto',
      label: 'Texto',
      type: 'textarea',
      admin: { description: 'O link para a Política de privacidade entra no final, automaticamente.' },
    },
    { name: 'botao', label: 'Botão', type: 'text', defaultValue: 'Entendi', maxLength: 20 },
  ],
})
