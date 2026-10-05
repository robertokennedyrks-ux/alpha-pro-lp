import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { pt } from '@payloadcms/translations/languages/pt'

import { Depoimentos } from './collections/Depoimentos'
import { Faq } from './collections/Faq'
import { Ingredientes } from './collections/Ingredientes'
import { Media } from './collections/Media'
import { Politicas } from './collections/Politicas'
import { Users } from './collections/Users'
import { Videos } from './collections/Videos'
import { Bonus, Contato, Cookies, FreteGratis, Ofertas, ProvaSocial, Seo, Textos } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · ALPHA PRO' },
    avatar: 'default',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Depoimentos, Videos, Faq, Ingredientes, Politicas, Media, Users],
  globals: [Ofertas, FreteGratis, Bonus, Textos, ProvaSocial, Contato, Seo, Cookies],
  editor: lexicalEditor(),
  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: 'pt',
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
