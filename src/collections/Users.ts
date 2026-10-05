import type { CollectionConfig } from 'payload'

import { logado } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: { useAsTitle: 'email', group: 'Sistema' },
  auth: true,
  access: { read: logado, create: logado, update: logado, delete: logado },
  fields: [{ name: 'nome', label: 'Nome', type: 'text' }],
}
