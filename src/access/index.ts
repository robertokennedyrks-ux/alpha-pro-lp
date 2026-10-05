import type { Access } from 'payload'

// Leitura pública (o site lê sem login). Escrita só com login no painel.
export const publico: Access = () => true
export const logado: Access = ({ req }) => Boolean(req.user)

// Conteúdo com rascunho: o público só lê o que foi publicado; quem está logado lê tudo.
export const publicadoOuLogado: Access = ({ req }) => (req.user ? true : { _status: { equals: 'published' } })
