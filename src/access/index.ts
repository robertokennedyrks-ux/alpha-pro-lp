import type { Access } from 'payload'

// Leitura pública (o site lê sem login). Escrita só com login no painel.
export const publico: Access = () => true
export const logado: Access = ({ req }) => Boolean(req.user)
