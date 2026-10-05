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
    // Pré-visualização ao lado do formulário, atualizada a cada salvamento automático.
    livePreview: {
      url: ({ data, collectionConfig }) => {
        const caminho = collectionConfig?.slug === 'politicas' && data?.slug ? `/${data.slug}` : '/'
        return `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/previa?caminho=${caminho}`
      },
      globals: ['ofertas', 'frete-gratis', 'bonus', 'textos', 'prova-social', 'contato', 'seo', 'cookies'],
      collections: ['depoimentos', 'videos', 'faq', 'ingredientes', 'politicas'],
      breakpoints: [
        { name: 'celular', label: 'Celular', width: 390, height: 844 },
        { name: 'tablet', label: 'Tablet', width: 800, height: 1024 },
        { name: 'desktop', label: 'Computador', width: 1440, height: 900 },
      ],
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
