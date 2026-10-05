import type { Access, CollectionConfig, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

// Dois perfis: a RK (gerencia usuários) e o cliente (edita o conteúdo da página).
const ehRk = (user: unknown) => (user as User | null)?.papel === 'rk'

const soRk: Access = ({ req }) => ehRk(req.user)
const rkOuProprio: Access = ({ req }) => (ehRk(req.user) ? true : req.user ? { id: { equals: req.user.id } } : false)
const papelSoRk: FieldAccess = ({ req }) => ehRk(req.user)

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: {
    useAsTitle: 'email',
    group: 'Sistema',
    defaultColumns: ['email', 'nome', 'papel'],
    hidden: ({ user }) => !ehRk(user),
  },
  auth: { maxLoginAttempts: 5, lockTime: 10 * 60 * 1000 },
  access: {
    read: rkOuProprio,
    create: soRk,
    update: rkOuProprio,
    delete: soRk,
    admin: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      // O primeiro usuário (criado na tela inicial do painel) é sempre da RK.
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req, overrideAccess: true })
          if (totalDocs === 0) data.papel = 'rk'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'nome', label: 'Nome', type: 'text' },
    {
      name: 'papel',
      label: 'Perfil',
      type: 'select',
      required: true,
      defaultValue: 'cliente',
      options: [
        { value: 'rk', label: 'RK Studios (tudo, inclusive usuários)' },
        { value: 'cliente', label: 'Cliente (conteúdo da página)' },
      ],
      access: { create: papelSoRk, update: papelSoRk },
      saveToJWT: true,
      admin: { position: 'sidebar' },
    },
  ],
}
