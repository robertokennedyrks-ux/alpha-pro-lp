// Preenche o banco com o conteúdo do protótipo aprovado (reference/alpha-pro-lp.html).
// Uso: pnpm seed          (só roda com o banco vazio)
//      pnpm seed:reset    (apaga o conteúdo e começa de novo; usuários e mídias ficam)
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { getPayload } from 'payload'

import config from '@payload-config'

import { textosPadrao } from '@/lib/textos-padrao'

import dados from './dados.json'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ctx = { disableRevalidate: true }

const politicas = [
  { slug: 'trocas-e-devolucoes', titulo: 'Trocas e devoluções' },
  { slug: 'politica-de-privacidade', titulo: 'Política de privacidade' },
  { slug: 'termos-de-uso', titulo: 'Termos de uso' },
]

// O .md tem: título, nota de modelo, "Última atualização: ..." e um parágrafo de introdução.
// Esses quatro viram campos próprios; o resto vira o conteúdo.
function lerPolitica(slug: string) {
  const md = fs.readFileSync(path.join(dirname, 'politicas', `${slug}.md`), 'utf8')
  const blocos = md.trim().split(/\n{2,}/)
  const corpo = blocos.filter((b) => !b.startsWith('# ') && !b.startsWith('> '))
  const iAtual = corpo.findIndex((b) => b.startsWith('Última atualização:'))
  const atualizado = iAtual >= 0 ? corpo[iAtual].replace('Última atualização:', '').trim() : ''
  if (iAtual >= 0) corpo.splice(iAtual, 1)
  const intro = corpo[0] && !corpo[0].startsWith('#') ? corpo.shift()! : ''
  return { atualizado, intro, markdown: corpo.join('\n\n') }
}

const colecoes = ['depoimentos', 'videos', 'faq', 'ingredientes', 'politicas'] as const

async function seed() {
  const payload = await getPayload({ config })
  const reset = process.env.SEED_RESET === '1'

  const { totalDocs } = await payload.count({ collection: 'faq' })
  if (totalDocs > 0 && !reset) {
    payload.logger.warn('O banco já tem conteúdo. Use "pnpm seed:reset" para apagar e preencher de novo.')
    process.exit(0)
  }

  if (reset) {
    for (const collection of colecoes) {
      await payload.delete({ collection, where: { id: { exists: true } }, context: ctx })
    }
  }

  const criar = async <T extends (typeof colecoes)[number]>(collection: T, itens: Record<string, unknown>[]) => {
    for (const data of itens) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.create({ collection, data: { ...data, _status: 'published' } as any, context: ctx })
    }
    payload.logger.info(`${collection}: ${itens.length}`)
  }

  await criar('faq', dados.faq)
  await criar('ingredientes', dados.ingredientes)
  await criar('depoimentos', dados.depoimentos)
  await criar('videos', dados.videos)

  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  await criar(
    'politicas',
    politicas.map(({ slug, titulo }) => {
      const { atualizado, intro, markdown } = lerPolitica(slug)
      return { slug, titulo, atualizado, intro, conteudo: convertMarkdownToLexical({ editorConfig, markdown }) }
    }),
  )

  const ct = dados.contato
  const globais = {
    ofertas: {
      produto: { nome: 'ALPHA PRO', capsulas: '60 cápsulas', diasPorPote: 30 },
      pagamento: { descontoPix: 5, parcelas: 5 },
      plataformaCheckout: '',
      opcoes: dados.ofertas.map((o) => ({ ...o, linkCheckout: '', ativo: true })),
    },
    'frete-gratis': {
      ativo: dados.frete.ativo,
      valorMinimo: dados.frete.valor_minimo,
      segmentos: dados.frete.segmentos,
      textoProgresso: dados.frete.texto_progresso,
      textoLiberado: dados.frete.texto_liberado,
      subtextoProgresso: dados.frete.subtexto_progresso,
      subtextoLiberado: dados.frete.subtexto_liberado,
      comemorar: dados.frete.comemorar,
    },
    bonus: {
      ativo: dados.bonusConfig.ativo,
      subtitulo: 'Leve 2, 3 ou 4 potes e libere os bônus.',
      entrega: dados.bonusConfig.entrega,
      itens: dados.bonus,
    },
    // todos os textos da página, iguais ao protótipo (a mesma fonte é o padrão dos componentes)
    textos: textosPadrao,
    'prova-social': {
      anuncios: dados.anuncios.map((texto) => ({ texto })),
      selo: { numero: '+25 mil', texto: 'vendas da linha ALPHA' },
      provaHero: '**Mais de 12 mil clientes** já usam a linha ALPHA.',
      numeros: [
        { valor: 25, sufixo: 'mil', legenda: 'vendas da linha ALPHA completa.' },
        { valor: 12, sufixo: 'mil', legenda: 'clientes da linha ALPHA' },
        { valor: 50, sufixo: '%', legenda: 'das clientes já voltam a comprar.' },
      ],
    },
    contato: {
      whatsapp: ct.whatsapp,
      whatsappExibicao: '(14) 99734-3080',
      whatsappMensagem: ct.whatsapp_mensagem,
      lojaTexto: 'Loja física em Marília/SP',
      lojaMaps: ct.loja_maps,
      redes: { instagram: ct.instagram, tiktok: ct.tiktok, facebook: ct.facebook, youtube: ct.youtube },
      grupos: [
        {
          titulo: 'Produto',
          links: [
            { rotulo: 'Escolher minha oferta', href: '#oferta' },
            { rotulo: 'Bônus exclusivos', href: '#bonus' },
            { rotulo: 'O que tem dentro', href: '#ingredientes' },
            { rotulo: 'Já usa ALPHA?', href: '#ja-usa' },
          ],
        },
        {
          titulo: 'Resultados',
          links: [
            { rotulo: 'Clientes reais', href: '#depoimentos' },
            { rotulo: 'Depoimentos em vídeo', href: '#videos' },
          ],
        },
        {
          titulo: 'Dúvidas',
          links: [
            { rotulo: 'Perguntas frequentes', href: '#duvidas' },
            { rotulo: 'Como tomar', href: '#ingredientes' },
            { rotulo: 'Para usar com tranquilidade', href: '#duvidas' },
          ],
        },
      ],
      formasPagamento: ['Visa', 'Mastercard', 'Amex', 'Elo', 'Hipercard', 'Diners', 'Pix'],
      avisoLegal:
        'Este produto não é um medicamento. Não indicado para gestantes, lactantes e menores de 19 anos. Não exceder a recomendação diária. Alimento notificado na ANVISA nº 25351118192202606.',
      empresa:
        'Comercializado por Alpha Zago Suplementos Ltda, CNPJ 60.689.966/0001-60, R. XV de Novembro, 2326, Somenzari, Marília/SP, CEP 17506-020. SAC (14) 99734-3080.',
      copyright: '© 2026 · Todos os direitos reservados',
    },
    seo: {
      titulo: 'ALPHA PRO · Desligue a sua fome',
      descricao:
        'A versão mais forte da linha ALPHA para a vontade de doce, o estômago que nunca enche e o beliscar que não para. 5x sem juros ou 5% no Pix.',
      indexar: true,
    },
    cookies: {
      ativo: true,
      texto: 'Usamos cookies para melhorar sua experiência e medir nossos anúncios. Saiba mais na',
      botao: 'Entendi',
    },
  } as const

  for (const [slug, data] of Object.entries(globais)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.updateGlobal({ slug: slug as any, data: { ...data, _status: 'published' } as any, context: ctx })
    payload.logger.info(`global ${slug}`)
  }

  payload.logger.info('Seed concluído.')
  process.exit(0)
}

// `payload run` só espera o import do arquivo, por isso o await no topo.
await seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
