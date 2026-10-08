# Migração para WordPress + Elementor

Decidido em 07/10/2026 por Roberto. A LP sai do Next.js + Payload e passa para
WordPress com um plugin próprio, usando o Elementor só como base de montagem.

## Por que

Uma análise externa apontou brechas de segurança no código em Next.js. A decisão é
trocar por um stack onde autenticação, sessão e permissões vêm prontas e mantidas
pelo WordPress, e onde o código próprio segue as convenções já provadas no projeto
CP Import World.

**O ganho de segurança não vem do WordPress sozinho** — ele tem superfície de ataque
maior (login público, plugins, tema, XML-RPC). Vem das convenções: nonce em toda
escrita, capability check em tudo que é admin, `sanitize_*` na entrada, `esc_*` na
saída, e nunca confiar em valor vindo do cliente.

## O que se perde, declarado

A build atual tira **100/100/100/100 no Lighthouse desktop** (84 em performance no
celular). WordPress + Elementor dificilmente chega lá: são mais requisições, mais CSS
e PHP a cada visita contra HTML estático. É um custo real da troca, aceito em nome do
backend pronto e da manutenção.

## Stack alvo

WordPress · Elementor (base, sem Pro obrigatório) · PHP 8.3 · Hostinger Business ·
plugin próprio `alpha-pro-core`, prefixo `rksap`.

**Sem WooCommerce.** A LP não tem carrinho real nem checkout: cada quantidade de potes
aponta para um link externo. Woo traria um módulo enorme, tabelas, cron e superfície de
ataque para resolver um problema que não existe aqui.

## Divisão de responsabilidade

| Camada | Onde vive | Quem edita |
|---|---|---|
| Layout e visual | controls dos widgets, no painel do Elementor | Roberto |
| Preços, frete, bônus | painel próprio (`/adm`), fora do wp-admin | Genesy |
| Textos, listas, políticas | controls do Elementor ou options | Roberto |
| Lógica (carrinho, oferta, revelações) | JS do plugin | — |

## O que migra

- **18 seções** → um widget Elementor cada, todos nossos. O Elementor entra só como
  canvas e sistema de controls.
- **4.060 linhas de CSS** → portam quase inteiras para `assets/css/` do plugin, com os
  tokens virando `--rksap-*` e lendo `--e-global-color-*` quando fizer sentido.
- **28 componentes interativos** → JS do plugin. A maior parte já é lógica de rolagem e
  estado local, sem API específica de React; o carrinho é o único que precisa de
  reescrita de verdade.
- **3 telas de painel** (ofertas, frete, bônus) → painel próprio, modelo `/adm` do CP.
- **712 linhas de conteúdo estático** → controls e options.

## Fases

**0 · Pipeline.** Chave SSH na Hostinger, `.env`, scaffold com `bin/deploy.sh`,
`watch.sh`, `logs.sh`, `wp.sh`. Validar com um plugin vazio antes de escrever qualquer
coisa. Sem isso funcionando, nada mais anda.

**1 · Plugin base.** Loader de módulos, tokens de cor e tipografia, CSS global,
registro da categoria de widgets, helpers de sanitização e de nonce.

**2 · Widgets de seção.** Um módulo por seção, na ordem da página: topo, hero, dor,
não é culpa, destaque, produto, depoimentos, vídeos, ingredientes, já usa, bônus,
oferta, dúvidas, final, rodapé, aviso de cookies.

**3 · Compra.** Estado do pedido, carrinho em gaveta, seletor de oferta, barra de frete
e os links de checkout por quantidade. É a parte com mais lógica.

**4 · Painel da Genesy.** Preços, frete e bônus. Modelo `/adm`: rewrite próprio, não
página do Elementor, nunca cacheado.

**5 · Políticas, SEO e cookies.** Três URLs reais por rewrite, texto em option.

**6 · Revisão.** Acessibilidade (axe-core), Lighthouse, teclado, `prefers-reduced-motion`,
e a comparação lado a lado com o site atual.

## O que não se repete

Erros já pagos neste projeto, que valem para o novo código:

- Nada de credencial em código. `.env` fora do Git, constantes no `wp-config.php`.
- Nada de painel acessível sem conta criada. O `/admin` do Payload ficou aberto para
  "criar primeiro usuário" enquanto o túnel estava no ar.
- Contraste medido, não estimado. Vários tons do tema escuro só passaram depois de
  medição por pixel.
- `background-image` não interpola, `opacity` desbota filhos, `overflow: clip` vira
  `hidden` quando o outro eixo é `auto`. Está tudo em
  [[visual-tema-escuro-alpha-pro]] na memória do projeto.

## O que acontece com o projeto atual

A pasta `alpha-pro-lp-main` fica congelada como referência de layout e de conteúdo —
é dela que saem textos, medidas, cores e comportamento. Não recebe mais feature.
Os 40 commits locais precisam ser publicados antes de congelar.
