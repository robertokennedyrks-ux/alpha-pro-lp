import { ajuda, global } from './base'

const link = (name: string, label: string) => ({
  name,
  label,
  type: 'text' as const,
  admin: { width: '50%', description: 'Vazio esconde o ícone.' },
})

export const Contato = global({
  slug: 'contato',
  label: 'Contato e rodapé',
  admin: { group: 'Configurações' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Atendimento',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'whatsapp', label: 'WhatsApp (só números, com DDI)', type: 'text', admin: { width: '50%', placeholder: '5514999999999' } },
                { name: 'whatsappExibicao', label: 'WhatsApp como aparece', type: 'text', admin: { width: '50%', placeholder: '(14) 99999-9999' } },
              ],
            },
            { name: 'whatsappMensagem', label: 'Mensagem inicial do WhatsApp', type: 'text' },
            {
              type: 'row',
              fields: [
                { name: 'lojaTexto', label: 'Texto da loja física', type: 'text', admin: { width: '50%' } },
                { name: 'lojaMaps', label: 'Link do Google Maps', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Redes sociais',
          fields: [
            {
              name: 'redes',
              label: false,
              type: 'group',
              fields: [
                { type: 'row', fields: [link('instagram', 'Instagram'), link('tiktok', 'TikTok')] },
                { type: 'row', fields: [link('facebook', 'Facebook'), link('youtube', 'YouTube')] },
              ],
            },
          ],
        },
        {
          label: 'Rodapé',
          fields: [
            {
              name: 'grupos',
              label: 'Grupos de links',
              labels: { singular: 'Grupo', plural: 'Grupos' },
              type: 'array',
              admin: {
                initCollapsed: true,
                description: 'O grupo Atendimento (WhatsApp, loja e políticas) é montado sozinho com os dados acima.',
              },
              fields: [
                { name: 'titulo', label: 'Título', type: 'text', required: true },
                {
                  name: 'links',
                  label: 'Links',
                  type: 'array',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'rotulo', label: 'Texto', type: 'text', required: true, admin: { width: '50%' } },
                        { name: 'href', label: 'Destino', type: 'text', required: true, admin: { width: '50%', placeholder: '#oferta' } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'formasPagamento',
              label: 'Formas de pagamento',
              type: 'select',
              hasMany: true,
              options: ['Visa', 'Mastercard', 'Amex', 'Elo', 'Hipercard', 'Diners', 'Pix'],
            },
            { name: 'avisoLegal', label: 'Aviso legal', type: 'textarea' },
            { name: 'empresa', label: 'Dados da empresa', type: 'textarea', admin: ajuda('Razão social, CNPJ, endereço e SAC.') },
            { name: 'copyright', label: 'Linha de copyright', type: 'text' },
          ],
        },
      ],
    },
  ],
})
