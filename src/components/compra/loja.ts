import type { Dados } from '@/lib/dados'
import type { IconName } from '@/components/icons'
import type { Media } from '@/payload-types'

// Sem imports de servidor: é usado também pelos componentes de cliente (por isso não usa opcoesAtivas, que vem de @/lib/dados).
// Dados de compra já resolvidos (oferta, bônus, frete e carrinho), prontos para ir a componentes de cliente.

export type Foto = { url: string; alt: string; w?: number; h?: number } | null

export type Opcao = { potes: number; preco: number; precoDe: number | null; link: string | null; foto: Foto }
export type BonusItem = { titulo: string; descricao: string; min: number; valor: number; icone: IconName | null; foto: Foto }

export type Loja = {
  nome: string
  capsulas: string
  dias: number
  foto: Foto
  pix: number
  parcelas: number
  opcoes: Opcao[]
  bonusOn: boolean
  bonus: BonusItem[]
  frete: {
    on: boolean
    meta: number
    segmentos: number
    textoProgresso: string
    textoLiberado: string
    subtextoProgresso: string
    subtextoLiberado: string
    comemorar: boolean
  }
  botaoPedido: string
}

export const foto = (m: number | Media | null | undefined): Foto => {
  if (!m || typeof m === 'number' || !m.url) return null
  return { url: m.url, alt: m.alt ?? '', w: m.width ?? undefined, h: m.height ?? undefined }
}

export function montarLoja(d: Dados): Loja {
  const bonusOn = d.bonus.ativo !== false
  const f = d.frete
  return {
    nome: d.ofertas.produto?.nome ?? 'ALPHA PRO',
    capsulas: d.ofertas.produto?.capsulas ?? '',
    dias: d.ofertas.produto?.diasPorPote ?? 30,
    foto: foto(d.ofertas.produto?.foto),
    pix: d.ofertas.pagamento?.descontoPix ?? 0,
    parcelas: Math.max(1, d.ofertas.pagamento?.parcelas ?? 1),
    opcoes: (d.ofertas.opcoes ?? [])
      .filter((o) => o.ativo !== false)
      .sort((a, b) => a.potes - b.potes)
      .map((o) => ({
      potes: o.potes,
      preco: o.preco,
      precoDe: o.precoDe ?? null,
      link: o.linkCheckout?.trim() || null,
      foto: foto(o.foto),
    })),
    bonusOn,
    bonus: bonusOn
      ? (d.bonus.itens ?? [])
          .map((b) => ({
            titulo: b.titulo,
            descricao: b.descricao ?? '',
            min: b.potesMinimos,
            valor: b.valorDe ?? 0,
            icone: (b.icone as IconName | null | undefined) ?? null,
            foto: foto(b.imagem),
          }))
          .sort((a, b) => a.min - b.min)
      : [],
    frete: {
      on: f.ativo !== false,
      meta: f.valorMinimo || 500,
      segmentos: Math.max(2, Math.min(10, f.segmentos || 5)),
      textoProgresso: f.textoProgresso || 'Frete grátis',
      textoLiberado: f.textoLiberado || 'Frete grátis liberado!',
      subtextoProgresso: f.subtextoProgresso || 'Falta {falta} para liberar!',
      subtextoLiberado: f.subtextoLiberado ?? '',
      comemorar: f.comemorar !== false,
    },
    botaoPedido: d.textos.botoes?.pedido || 'Fazer pedido',
  }
}

// Cálculos comuns (iguais aos do protótipo).
export const centavos = (v: number) => Math.round(v * 100) / 100
export const precoPix = (l: Loja, t: number) => centavos((t * (100 - l.pix)) / 100)
export const parcela = (l: Loja, t: number) => centavos(t / l.parcelas)
export const opcaoDe = (l: Loja, n: number) => l.opcoes.find((o) => o.potes === n) ?? null
export const totalDe = (l: Loja, n: number) => opcaoDe(l, n)?.preco ?? (l.opcoes[0] ? (l.opcoes[0].preco / l.opcoes[0].potes) * n : 0)
export const linkDe = (l: Loja, n: number) => opcaoDe(l, n)?.link ?? null
// Foto da quantidade escolhida; sem ela, a foto do produto.
export const fotoDe = (l: Loja, n: number): Foto => opcaoDe(l, n)?.foto ?? l.foto
export const potes = (n: number) => `${n} ${n === 1 ? 'pote' : 'potes'}`
// "60 cápsulas" x 2 = "120 cápsulas"
export const capsulasDe = (l: Loja, n: number) =>
  l.capsulas.replace(/^(\d+)/, (m) => String(Number(m) * n))
export const liberados = (l: Loja, n: number) => l.bonus.filter((b) => n >= b.min)

// Passo do seletor: vai para a próxima/anterior quantidade que existe nas ofertas.
export function passo(l: Loja, n: number, dir: 1 | -1) {
  const lista = l.opcoes.map((o) => o.potes)
  const alvo = dir > 0 ? lista.find((p) => p > n) : [...lista].reverse().find((p) => p < n)
  return alvo ?? n
}
