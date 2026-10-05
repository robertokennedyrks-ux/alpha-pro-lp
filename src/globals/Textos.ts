import type { ArrayField, Field, Tab, TextField, TextareaField, UploadField } from 'payload'

import { campoIcone } from '@/fields/icone'

import { global } from './base'

// Uma aba por seção, na ordem da página. Campo vazio volta para o texto do protótipo
// (src/lib/textos-padrao.ts), então a página nunca fica sem texto.

const negrito = { description: 'Use **texto** para negrito.' }
const umaLinha = 'Texto curto: fica sempre em uma linha.'
const quebra = 'Aperte Enter onde a linha deve quebrar.'

type ExtraTexto = { maxLength?: number; required?: boolean; admin?: TextField['admin'] }
const texto = (name: string, label: string, extra: ExtraTexto = {}): TextField => ({
  name,
  label,
  type: 'text',
  ...extra,
})

const area = (name: string, label: string, extra: Partial<TextareaField> = {}): TextareaField => ({
  name,
  label,
  type: 'textarea',
  ...extra,
})

const foto = (name: string, label: string, description = 'Sem foto, aparece o espaço reservado.'): UploadField => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
  admin: { description },
})

const etiqueta = (label = 'Tag da seção') => texto('etiqueta', label, { maxLength: 40, admin: { description: umaLinha } })

// Títulos com uma parte em peso fino viram dois campos lado a lado.
const titulo = (descricao?: string): Field => ({
  type: 'row',
  fields: [
    texto('titulo', 'Título', { admin: { width: '55%', description: descricao } }),
    texto('tituloLeve', 'Complemento (fino)', { admin: { width: '45%', description: 'Continua o título com letra fina.' } }),
  ],
})

const lista = (
  name: string,
  label: string,
  [singular, plural]: [string, string],
  fields: Field[],
  extra: Partial<ArrayField> = {},
): ArrayField => ({
  name,
  label,
  type: 'array',
  labels: { singular, plural },
  ...extra,
  admin: {
    initCollapsed: true,
    components: { RowLabel: '@/components/admin/RowLabelTexto#RowLabelTexto' },
    ...extra.admin,
  },
  fields,
})

const linha = (...fields: Field[]): Field => ({ type: 'row', fields })
const largura = (w: string) => ({ admin: { width: w } })

const aba = (label: string, name: string, fields: Field[], description?: string): Tab => ({ label, name, description, fields })

export const Textos = global({
  slug: 'textos',
  label: 'Textos da página',
  admin: { group: 'Conteúdo' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        aba('Topo e menu', 'hero', [
          texto('etiqueta', 'Etiqueta'),
          {
            type: 'row',
            fields: [
              { name: 'titulo', label: 'Título', type: 'text', required: true, admin: { width: '60%' } },
              { name: 'tituloLeve', label: 'Complemento (fino)', type: 'text', admin: { width: '40%' } },
            ],
          },
          { name: 'subtitulo', label: 'Subtítulo', type: 'textarea', admin: negrito },
          { name: 'condicao', label: 'Condição abaixo do botão', type: 'text', admin: negrito },
          { name: 'foto', label: 'Foto principal', type: 'upload', relationTo: 'media' },
          {
            name: 'menu',
            label: 'Menu lateral',
            type: 'group',
            admin: { description: 'O menu que abre no ícone ☰ do topo. Links são âncoras de seção, como #oferta.' },
            fields: [
              {
                name: 'destaque',
                label: 'Primeiro item (em destaque)',
                type: 'group',
                fields: [
                  linha(
                    texto('texto', 'Texto', { maxLength: 30, ...largura('40%') }),
                    texto('link', 'Link', largura('25%')),
                    { ...campoIcone(), admin: { width: '35%' } },
                  ),
                ],
              },
              {
                name: 'conheca',
                label: 'Item que abre os cards',
                type: 'group',
                fields: [
                  linha(texto('titulo', 'Texto', { maxLength: 30, ...largura('65%') }), { ...campoIcone(), admin: { width: '35%' } }),
                  lista('cards', 'Cards', ['Card', 'Cards'], [
                    linha(
                      texto('linha1', 'Linha 1', { maxLength: 14, ...largura('35%') }),
                      texto('linha2', 'Linha 2', { maxLength: 14, ...largura('35%') }),
                      texto('link', 'Link', largura('30%')),
                    ),
                    foto('foto', 'Foto de fundo'),
                  ], { maxRows: 2 }),
                ],
              },
              lista('itens', 'Outros itens', ['Item', 'Itens'], [
                linha(
                  texto('texto', 'Texto', { required: true, maxLength: 30, ...largura('40%') }),
                  texto('link', 'Link', { required: true, ...largura('25%') }),
                  { ...campoIcone(), admin: { width: '35%' } },
                ),
              ], { admin: { description: 'O item com link #bonus some quando os bônus estão desligados.' } }),
              texto('rodape', 'Frase no pé do menu'),
            ],
          },
        ]),

        aba('Dor', 'dor', [
          etiqueta(),
          titulo(),
          texto('chamada', 'Chamada da linha do tempo', { maxLength: 40 }),
          lista('dia', 'Linha do tempo', ['Momento', 'Momentos'], [
            texto('titulo', 'Título', { required: true }),
            area('texto', 'Texto', { required: true }),
            campoIcone(),
          ]),
          foto('foto', 'Foto ao lado (mulher, olhar cansado)'),
          lista('baloes', 'Balões em volta da foto', ['Balão', 'Balões'], [
            texto('texto', 'Texto', { required: true, maxLength: 24 }),
          ], { maxRows: 4, admin: { description: 'Até 4. Cada posição tem seu lugar fixo em volta da foto.' } }),
          {
            type: 'collapsible',
            label: 'Frase de fechamento (aparece letra por letra)',
            admin: {
              description:
                'Três linhas. Se a primeira terminar em ponto, no computador ele vira vírgula e a segunda começa com minúscula.',
            },
            fields: [
              texto('fecho1', 'Linha 1', { maxLength: 30 }),
              texto('fecho2', 'Linha 2', { maxLength: 30 }),
              texto('fecho3', 'Linha 3 (fina)', { maxLength: 32 }),
            ],
          },
        ]),

        aba('Não é culpa sua', 'naoCulpa', [
          foto('foto', 'Foto (mulher pensativa)'),
          etiqueta(),
          titulo(),
          lista('tentativas', 'O que ela já tentou', ['Tentativa', 'Tentativas'], [
            texto('texto', 'Texto', { required: true, maxLength: 20 }),
          ]),
          lista('cards', 'Cards', ['Card', 'Cards'], [texto('titulo', 'Título', { required: true }), area('texto', 'Texto')]),
          {
            type: 'collapsible',
            label: 'Quadro "nada segurou a sua fome"',
            fields: [
              area('destaque', 'Frase grande'),
              linha(
                texto('destaqueTag', 'Tag', { maxLength: 40, ...largura('50%') }),
                texto('destaqueTexto', 'Frase abaixo da tag', largura('50%')),
              ),
            ],
          },
          {
            type: 'collapsible',
            label: 'Frase de fechamento',
            admin: { description: 'No celular, uma linha por campo. No computador, as linhas 1 e 2 ficam juntas.' },
            fields: [
              linha(
                texto('fecho1', 'Linha 1', { maxLength: 22, ...largura('50%') }),
                texto('fecho2', 'Linha 2', { maxLength: 22, ...largura('50%') }),
              ),
              linha(
                texto('fecho3', 'Linha 3', { maxLength: 22, ...largura('50%') }),
                texto('fecho3Celular', 'Linha 3 no celular', {
                  maxLength: 22,
                  admin: { width: '50%', description: 'Vazio usa a linha 3.' },
                }),
              ),
            ],
          },
          texto('faixa', 'Faixa inclinada', { maxLength: 30, admin: { description: 'Repete em loop na faixa preta.' } }),
        ]),

        aba('Destaque', 'destaque', [
          {
            type: 'collapsible',
            label: 'Título grande',
            admin: { description: 'Aparece em maiúsculas, uma linha por campo. A cápsula fica entre as duas partes da linha 2.' },
            fields: [
              texto('linha1', 'Linha 1', { maxLength: 14 }),
              linha(
                texto('linha2', 'Linha 2, antes da cápsula', { maxLength: 8, ...largura('50%') }),
                texto('linha2b', 'Linha 2, depois da cápsula', { maxLength: 8, ...largura('50%') }),
              ),
              texto('linha3', 'Linha 3', { maxLength: 14 }),
            ],
          },
          texto('subtitulo', 'Subtítulo'),
          lista('fotos', 'Faixa de fotos', ['Foto', 'Fotos'], [
            foto('foto', 'Foto'),
            linha(
              texto('titulo', 'Nome do espaço', { maxLength: 20, ...largura('35%') }),
              texto('texto', 'O que mostra', { admin: { width: '65%', description: 'Aparece no espaço enquanto não há foto.' } }),
            ),
          ], { admin: { description: 'As fotos passam em loop. As alturas variam sozinhas.' } }),
        ]),

        aba('Produto', 'produto', [
          area('paragrafo1', 'Parágrafo 1', { admin: negrito }),
          area('paragrafo2', 'Parágrafo 2', { admin: negrito }),
          {
            type: 'collapsible',
            label: 'O que você vai sentir',
            fields: [
              texto('sentirTitulo', 'Título'),
              area('sentirTexto', 'Texto'),
              lista('sentir', 'Itens', ['Item', 'Itens'], [
                area('texto', 'Texto', { required: true, admin: { description: quebra, rows: 2 } }),
                campoIcone(),
              ]),
            ],
          },
          {
            type: 'collapsible',
            label: 'Tabela comparativa',
            fields: [
              texto('tabelaTitulo', 'Título'),
              linha(
                texto('tabelaSem', 'Coluna "sem"', { maxLength: 16, ...largura('50%') }),
                texto('tabelaCom', 'Coluna "com"', { maxLength: 16, ...largura('50%') }),
              ),
              lista('tabela', 'Linhas', ['Linha', 'Linhas'], [texto('texto', 'Texto', { required: true })]),
            ],
          },
          linha(texto('fecho', 'Frase final', largura('50%')), texto('fechoLeve', 'Complemento (fino)', largura('50%'))),
        ]),

        aba('Depoimentos', 'depoimentos', [
          etiqueta(),
          titulo(),
          area('subtitulo', 'Subtítulo'),
          {
            type: 'collapsible',
            label: 'Painel "Quem usa, volta."',
            admin: { description: 'Os números do painel ficam em Prova social.' },
            fields: [
              foto('foto', 'Foto (ela sorrindo, com o pote)'),
              linha(texto('painelTitulo', 'Título', largura('50%')), texto('painelSubtitulo', 'Subtítulo', largura('50%'))),
            ],
          },
        ], 'Os depoimentos ficam em Conteúdo > Depoimentos.'),

        aba('Vídeos', 'videos', [etiqueta(), titulo(), area('subtitulo', 'Subtítulo')], 'Os vídeos ficam em Conteúdo > Vídeos.'),

        aba('Ingredientes', 'ingredientes', [
          etiqueta(),
          titulo(),
          {
            type: 'collapsible',
            label: 'Como usar',
            fields: [texto('porcao', 'Porção', { maxLength: 30 }), area('comoUsar', 'Texto', { admin: negrito })],
          },
        ], 'Os ingredientes ficam em Conteúdo > Ingredientes.'),

        aba('Já usa', 'jaUsa', [
          texto('etiqueta', 'Chamada acima do título', { maxLength: 30 }),
          {
            type: 'collapsible',
            label: 'Título',
            admin: { description: 'Três linhas em maiúsculas, esticadas na largura do bloco. Textos curtos ficam melhores.' },
            fields: [
              texto('titulo1', 'Linha 1', { maxLength: 16 }),
              texto('titulo2', 'Linha 2 (ao lado do ícone)', { maxLength: 14 }),
              texto('titulo3', 'Linha 3', { maxLength: 16 }),
            ],
          },
          area('subtitulo', 'Subtítulo'),
          lista('vantagens', 'Vantagens', ['Vantagem', 'Vantagens'], [texto('texto', 'Texto', { required: true })]),
          {
            type: 'collapsible',
            label: 'Comparação com fotos',
            fields: [
              texto('forte', 'Frase em destaque'),
              texto('tickerRotulo', 'Rótulo do texto que troca', { maxLength: 30 }),
              lista('ticker', 'Textos que trocam (com foto)', ['Texto', 'Textos'], [
                texto('texto', 'Texto', { required: true, maxLength: 30 }),
                foto('foto', 'Foto que aparece junto'),
              ], { admin: { description: 'Texto e foto trocam juntos a cada 2,6 s.' } }),
            ],
          },
        ]),

        aba('Bônus', 'bonus', [etiqueta(), titulo()], 'Subtítulo e bônus ficam em Loja > Bônus.'),

        aba('Oferta', 'oferta', [
          etiqueta(),
          titulo(),
          lista('gastos', 'Onde o dinheiro foi', ['Gasto', 'Gastos'], [
            texto('texto', 'Texto', { required: true }),
            campoIcone(),
          ]),
          texto('fraseGastos', 'Frase depois dos gastos', {
            admin: { description: '{produto} vira o nome do produto e {valor} o preço por dia.' },
          }),
          linha(
            texto('cardEtiqueta', 'Tag do card do produto', { maxLength: 40, ...largura('50%') }),
            texto('escolha', 'Chamada acima das ofertas', { maxLength: 40, ...largura('50%') }),
          ),
          { name: 'garantia', label: 'Linha da garantia', type: 'text', admin: negrito },
          {
            name: 'precoPorDia',
            label: 'Frase do preço por dia',
            type: 'text',
            admin: { description: '{valor} vira o preço por dia do pote avulso.' },
          },
          lista('confianca', 'Selos de confiança', ['Selo', 'Selos'], [
            texto('titulo', 'Título', { required: true }),
            texto('texto', 'Texto'),
            campoIcone(),
          ]),
        ], 'Preços, fotos e opções ficam em Loja > Ofertas e preços.'),

        aba('Dúvidas', 'duvidas', [
          titulo(),
          foto('ilustracao', 'Ilustração do banner', 'Sem imagem, aparece o espaço reservado.'),
          {
            type: 'collapsible',
            label: 'Avisos "Para usar com tranquilidade"',
            fields: [
              texto('avisosTitulo', 'Título'),
              area('avisosTexto', 'Texto'),
              lista('avisos', 'Avisos', ['Aviso', 'Avisos'], [
                linha(
                  texto('rotulo', 'Rótulo', { maxLength: 20, ...largura('40%') }),
                  { ...campoIcone(), admin: { width: '60%' } },
                ),
                texto('titulo', 'Título', { required: true }),
                area('texto', 'Texto'),
              ], { admin: { description: 'Trocam sozinhos a cada 5 s.' } }),
            ],
          },
        ], 'As perguntas ficam em Conteúdo > Perguntas frequentes.'),

        aba('Final', 'final', [
          foto('foto', 'Foto (persona)'),
          texto('chamada', 'Chamada acima do título'),
          titulo(),
          texto('opcaoNao', 'Escolha riscada', { maxLength: 40, admin: negrito }),
          texto('opcaoSim', 'Escolha certa', { maxLength: 40, admin: negrito }),
          texto('frase', 'Frase acima do botão'),
        ]),

        aba('Rodapé', 'rodape', [
          area('faixa', 'Frase da faixa preta', { admin: { description: quebra, rows: 2 } }),
          linha(
            texto('tituloAtendimento', 'Título do grupo de atendimento', largura('50%')),
            texto('tituloPagamento', 'Título das formas de pagamento', largura('50%')),
          ),
          lista('selos', 'Selos de segurança', ['Selo', 'Selos'], [
            linha(texto('titulo', 'Título', { required: true, ...largura('50%') }), texto('texto', 'Texto', largura('50%'))),
            campoIcone(),
          ]),
        ], 'Links, contato e aviso legal ficam em Configurações > Contato e rodapé.'),

        aba('Botões', 'botoes', [
          {
            type: 'row',
            fields: [
              { name: 'principal', label: 'Topo e final', type: 'text', maxLength: 28, admin: { width: '50%' } },
              { name: 'produto', label: 'Dor, produto e "Já usa"', type: 'text', maxLength: 28, admin: { width: '50%' } },
            ],
          },
          {
            type: 'row',
            fields: [
              { name: 'bonus', label: 'Bônus', type: 'text', maxLength: 28, admin: { width: '50%' } },
              { name: 'pedido', label: 'Oferta e carrinho', type: 'text', maxLength: 28, admin: { width: '50%' } },
            ],
          },
        ], 'Textos curtos: o botão fica sempre em uma linha.'),
      ],
    },
  ],
})
