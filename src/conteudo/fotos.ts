// Fotos da página. Um lugar só: quando as fotos reais chegarem, é aqui que elas entram.
//
// Como pôr uma foto:
//   1. jogue o arquivo em `public/fotos/` (ex.: public/fotos/hero.jpg)
//   2. troque o `null` por { url: '/fotos/hero.jpg', alt: 'descrição para leitor de tela', width: 1440, height: 1800 }
//
// Enquanto for `null`, a seção mostra o espaço reservado do protótipo com a descrição
// da foto que falta — igual ao que está no ar hoje.

export type Imagem = { url: string; alt: string; width?: number; height?: number }

export const fotos = {
  hero: null as Imagem | null,
  dor: null as Imagem | null,
  naoCulpa: null as Imagem | null,
  depoimentos: null as Imagem | null,
  duvidas: null as Imagem | null,
  final: null as Imagem | null,

  // Faixa de 5 fotos da seção "Conheça a sua real versão ALPHA", na ordem do protótipo.
  destaque: [null, null, null, null, null] as (Imagem | null)[],

  // Os 2 cartões do menu lateral ("Clientes reais", "O que tem dentro").
  menuCards: [null, null] as (Imagem | null)[],

  // Os 3 itens da esteira "Da sua ALPHA para o PRO".
  ticker: [null, null, null] as (Imagem | null)[],
}
