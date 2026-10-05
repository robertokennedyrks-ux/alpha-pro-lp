import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { pt } from '@payloadcms/translations/languages/pt'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Bonus, FreteGratis, Ofertas } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' · Painel ALPHA PRO',
      description: 'Painel da landing ALPHA PRO',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
    },
    avatar: 'default',
    components: {
      graphics: {
        Logo: '@/components/admin/Marca#Logo',
        Icon: '@/components/admin/Marca#Icone',
      },
      beforeLogin: ['@/components/admin/Marca#AntesDoLogin'],
      afterNavLinks: ['@/components/admin/Marca#VerPagina'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Media, Users],
  globals: [Ofertas, FreteGratis, Bonus],
  editor: lexicalEditor(),
  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: 'pt',
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Banco em arquivo: nada de servidor de banco para instalar ou manter.
  // Em produção aponte DATABASE_URI para um caminho FORA da pasta do deploy,
  // senão cada publicação de código apaga o que o cliente configurou.
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI || 'file:./alpha-pro.db' },
  }),
  sharp,
  plugins: [],
})
