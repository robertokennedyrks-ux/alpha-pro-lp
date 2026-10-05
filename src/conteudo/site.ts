// Configurações da página que não mudam pelo painel: prova social, contato e rodapé,
// SEO e aviso de cookies. Valores do protótipo aprovado.

export const prova = {
  anuncios: [
    { texto: '5x sem juros no cartão' },
    { texto: '5% de desconto no Pix' },
    { texto: 'Enviamos para todo o Brasil' },
    { texto: 'Nota fiscal em todas as compras' },
    { texto: '7 dias de garantia' },
  ],
  selo: { numero: '+25 mil', texto: 'vendas da linha ALPHA' },
  provaHero: '**Mais de 12 mil clientes** já usam a linha ALPHA.',
  numeros: [
    { valor: 25, sufixo: 'mil', legenda: 'vendas da linha ALPHA completa.' },
    { valor: 12, sufixo: 'mil', legenda: 'clientes da linha ALPHA' },
    { valor: 50, sufixo: '%', legenda: 'das clientes já voltam a comprar.' },
  ],
}

// Rede social com string vazia não aparece no rodapé.
export const contato = {
  whatsapp: '5514997343080',
  whatsappExibicao: '(14) 99734-3080',
  whatsappMensagem: 'Olá! Quero saber mais sobre o ALPHA PRO.',
  lojaTexto: 'Loja física em Marília/SP',
  lojaMaps: 'https://www.google.com/maps/search/?api=1&query=R.+XV+de+Novembro,+2326,+Mar%C3%ADlia+SP',
  redes: { instagram: '', tiktok: '', facebook: '', youtube: '' },
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
}

export const seo = {
  titulo: 'ALPHA PRO · Desligue a sua fome',
  descricao:
    'A versão mais forte da linha ALPHA para a vontade de doce, o estômago que nunca enche e o beliscar que não para. 5x sem juros ou 5% no Pix.',
  indexar: true,
  // Imagem de compartilhamento: caminho em `public/` ou null para não enviar nenhuma.
  imagem: null as string | null,
  favicon: '/favicon.svg',
}

export const cookies = {
  ativo: true,
  texto: 'Usamos cookies para melhorar sua experiência e medir nossos anúncios. Saiba mais na',
  botao: 'Entendi',
}
