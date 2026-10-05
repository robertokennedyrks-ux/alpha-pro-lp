// As três políticas, estáticas. Conteúdo em markdown simples:
// "## título", "- item", "> destaque", **negrito** e [link](url).
// Os trechos [entre colchetes] aguardam confirmação do cliente (ver docs/CONTEXTO.md).

export type Politica = { slug: string; titulo: string; atualizado: string; intro: string; corpo: string }

export const politicas: Politica[] = [
  {
    slug: 'trocas-e-devolucoes',
    titulo: 'Trocas e devoluções',
    atualizado: '[data de publicação]',
    intro: "Queremos que você compre com tranquilidade. Aqui está como funcionam a desistência, a troca e o reembolso do ALPHA PRO.",
    corpo: `## 1. Garantia de 7 dias (direito de arrependimento)

Você pode desistir da compra em até **7 dias corridos a partir do recebimento**, conforme o artigo 49 do Código de Defesa do Consumidor. Não é preciso explicar o motivo.

## 2. Como pedir

Fale com a gente pelo WhatsApp [(14) 99734-3080](https://wa.me/5514997343080) ou pelo e-mail **[e-mail de atendimento]**, informando o número do pedido e o nome de quem comprou. Respondemos em dias úteis, das [8h às 18h].

## 3. Como devolver

Enviamos as instruções de devolução e, quando for o caso, o código de postagem. [Confirmar com o cliente: se aceita potes abertos e quem paga o frete de devolução.]

## 4. Reembolso

Depois que o produto chega até nós, devolvemos o valor pago pelo mesmo meio de pagamento:

- **Pix:** em até [5] dias úteis, na mesma conta que fez o pagamento.
- **Cartão de crédito:** pedimos o estorno à operadora em até [5] dias úteis. O crédito aparece em até duas faturas, conforme o seu banco.

## 5. Produto com defeito ou avariado

Se o pote chegar violado, danificado ou com defeito, avise em até [7] dias do recebimento, com fotos da embalagem e do produto. Trocamos sem custo para você ou devolvemos o valor, como preferir.

## 6. Atraso ou extravio

Se o rastreio parar de atualizar ou o prazo passar, fale com a gente. Acionamos a transportadora e, se o pedido for extraviado, enviamos outro ou devolvemos o valor.

## 7. Bônus

Os bônus digitais acompanham o pedido. Se o pedido for cancelado ou devolvido, o acesso aos bônus também é encerrado.

## 8. Contato

Alpha Zago Suplementos Ltda, CNPJ 60.689.966/0001-60, R. XV de Novembro, 2326, Somenzari, Marília/SP, CEP 17506-020.  
WhatsApp [(14) 99734-3080](https://wa.me/5514997343080) · E-mail **[e-mail de atendimento]**`,
  },
  {
    slug: 'politica-de-privacidade',
    titulo: 'Política de privacidade',
    atualizado: '[data de publicação]',
    intro: "Esta política explica como a **Alpha Zago Suplementos Ltda**, CNPJ 60.689.966/0001-60, com endereço na R. XV de Novembro, 2326, Somenzari, Marília/SP, CEP 17506-020 (\"Alpha\", \"nós\"), trata os dados pessoais de quem visita esta página e compra o ALPHA PRO, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).",
    corpo: `## 1. Quais dados coletamos

- **Dados que você informa no checkout:** nome, CPF, e-mail, telefone, endereço de entrega e dados de pagamento. O pagamento é processado pela plataforma de checkout [nome da plataforma]; a Alpha não armazena o número completo do seu cartão.
- **Dados de navegação:** endereço IP, tipo de aparelho e navegador, páginas visitadas, cliques e origem da visita (por exemplo, o anúncio que você clicou), coletados por cookies e tecnologias parecidas.
- **Dados de atendimento:** mensagens que você envia pelo WhatsApp, e-mail ou redes sociais.

## 2. Para que usamos

- **Processar o pedido, entregar o produto e emitir nota fiscal:** Execução de contrato e obrigação legal.
- **Enviar os bônus digitais e o código de rastreio por e-mail e WhatsApp:** Execução de contrato.
- **Responder dúvidas e atender trocas e devoluções:** Execução de contrato e legítimo interesse.
- **Medir o desempenho da página e dos anúncios:** Consentimento (cookies de marketing).
- **Enviar ofertas e novidades:** Consentimento, que pode ser retirado a qualquer momento.
- **Prevenir fraudes:** Legítimo interesse.

## 3. Com quem compartilhamos

Só com quem precisa dos dados para o pedido acontecer ou para cumprir a lei:

- plataforma de checkout e meios de pagamento;
- transportadora e Correios;
- ferramentas de e-mail, WhatsApp e atendimento;
- plataformas de anúncio e análise ([Meta, Google, TikTok — confirmar quais]), apenas com dados de navegação e quando você aceita os cookies;
- autoridades, quando a lei exigir.

Não vendemos seus dados.

## 4. Cookies

Usamos cookies necessários para a página funcionar e, com o seu consentimento, cookies de análise e de marketing para medir anúncios. Você pode recusar ou apagar cookies nas configurações do seu navegador; a página continua funcionando.

## 5. Por quanto tempo guardamos

Guardamos os dados do pedido pelo prazo exigido pela legislação fiscal e de defesa do consumidor (em geral, 5 anos). Dados de marketing ficam guardados até você pedir para sair ou retirar o consentimento.

## 6. Seus direitos

Você pode, a qualquer momento, pedir para: confirmar se tratamos seus dados, acessar, corrigir, apagar, levar para outro fornecedor, saber com quem compartilhamos e retirar o consentimento. Basta escrever para **[e-mail do encarregado / DPO]** ou chamar no WhatsApp (14) 99734-3080.

## 7. Segurança

Usamos conexão segura (HTTPS) e limitamos o acesso aos dados às pessoas que precisam deles para atender você.

## 8. Menores de idade

O ALPHA PRO não é indicado para menores de 19 anos, e esta página não é direcionada a eles.

## 9. Mudanças nesta política

Podemos atualizar esta política. A data da última atualização fica sempre no topo.

## 10. Contato

Encarregado de dados: **[nome]** · **[e-mail]**
Alpha Zago Suplementos Ltda · SAC (14) 99734-3080`,
  },
  {
    slug: 'termos-de-uso',
    titulo: 'Termos de uso',
    atualizado: '[data de publicação]',
    intro: "Estes termos valem para esta página e para as compras do ALPHA PRO feitas a partir dela, vendidas pela **Alpha Zago Suplementos Ltda**, CNPJ 60.689.966/0001-60, R. XV de Novembro, 2326, Somenzari, Marília/SP, CEP 17506-020.",
    corpo: `## 1. Sobre o produto

O ALPHA PRO é um alimento (suplemento alimentar) notificado na ANVISA sob o nº 25351118192202606. **Não é um medicamento.** Não é indicado para gestantes, lactantes e menores de 19 anos. Não exceda a recomendação diária. Os resultados variam de pessoa para pessoa. Em caso de dúvida sobre o uso, consulte um profissional de saúde.

## 2. Preços e ofertas

Os preços, ofertas por quantidade, bônus e condições de frete são os mostrados na página e no checkout no momento da compra. Se houver diferença entre os dois, vale o que aparece no checkout antes do pagamento. Ofertas podem mudar ou acabar sem aviso prévio, sem afetar pedidos já pagos.

## 3. Pagamento

Aceitamos cartão de crédito em até 5x sem juros e Pix com 5% de desconto. O pedido é confirmado depois da aprovação do pagamento.

## 4. Entrega

O prazo e o valor do frete para o seu CEP aparecem no checkout, antes do pagamento. Quando a oferta tem frete grátis, isso também aparece no checkout. O código de rastreio é enviado por e-mail e WhatsApp assim que o pedido sai.

## 5. Bônus

Os bônus são materiais digitais e acesso a grupo, liberados conforme a quantidade de potes comprada e enviados por e-mail e WhatsApp após a confirmação do pagamento. Eles não têm valor de troca por dinheiro e são de uso pessoal.

## 6. Direito de arrependimento (garantia de 7 dias)

Você pode desistir da compra em até **7 dias corridos a partir do recebimento**, conforme o artigo 49 do Código de Defesa do Consumidor. Para isso, fale com a gente pelo WhatsApp (14) 99734-3080 ou pelo e-mail **[e-mail de atendimento]**. Devolvemos o valor pago pelo mesmo meio de pagamento, [incluindo o frete de ida]. [Confirmar com o cliente: se aceita potes abertos e quem paga o frete de devolução.]

## 7. Trocas por defeito

Se o produto chegar danificado, violado ou com defeito, avise em até [7] dias do recebimento, com fotos, e fazemos a troca sem custo.

## 8. Uso da página

O conteúdo desta página (textos, imagens, vídeos e marca ALPHA) pertence à Alpha ou é usado com autorização. Os depoimentos são de clientes reais e foram publicados com consentimento; eles mostram experiências individuais.

## 9. Privacidade

O tratamento dos seus dados segue a nossa [Política de Privacidade](/politica-de-privacidade).

## 10. Contato e foro

Dúvidas: WhatsApp (14) 99734-3080 · **[e-mail]**. Fica eleito o foro do domicílio do consumidor.`,
  },
]

export const politicaDe = (slug: string) => politicas.find((p) => p.slug === slug) ?? null
export const abasPoliticas = politicas.map((p) => ({ slug: p.slug, titulo: p.titulo }))
