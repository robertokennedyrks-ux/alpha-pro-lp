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

## Critério de aceite

`docs/SEGURANCA.md` governa esta migração. São 22 critérios, e eles não são revisão de
fim de obra: entram como porta de cada fase. A regra que o documento fecha vale repetir —
**a segurança não é propriedade do WordPress**, é do conjunto ambiente + plugins + código
próprio + autorização + validação + testes.

Quatro artefatos nascem com o projeto e são mantidos vivos:

| Artefato | Nasce na fase |
|---|---|
| Matriz de permissões (Next × WordPress) | 0 — antes de escrever código |
| Inventário de plugins e dependências | 0 |
| Inventário de endpoints | 3, quando o primeiro endpoint existir |
| Evidências dos testes de autorização | 6, mas cada fase deixa a sua |

## Fases

**0 · Pipeline.** Chave SSH na Hostinger, `.env`, scaffold com `bin/deploy.sh`,
`watch.sh`, `logs.sh`, `wp.sh`. Validar com um plugin vazio antes de escrever qualquer
coisa. Sem isso funcionando, nada mais anda.
Entra aqui também o endurecimento do AC-16 (HTTPS, cookies, debug, XML-RPC, REST,
cabeçalhos, versão exposta), a matriz de permissões do AC-21 e o inventário do AC-14 —
é barato fazer agora e caro descobrir depois.

**1 · Plugin base.** Loader de módulos, tokens de cor e tipografia, CSS global,
registro da categoria de widgets, helpers de sanitização e de nonce.

**2 · Widgets de seção.** Um módulo por seção, na ordem da página: topo, hero, dor,
não é culpa, destaque, produto, depoimentos, vídeos, ingredientes, já usa, bônus,
oferta, dúvidas, final, rodapé, aviso de cookies.

**3 · Compra.** Estado do pedido, carrinho em gaveta, seletor de oferta, barra de frete
e os links de checkout por quantidade. É a parte com mais lógica.
Atenção ao AC-06: preço, total e quantidade **nunca** vêm do cliente. O link de checkout
é montado a partir da quantidade relida do banco, não do que o navegador mandou.

**4 · Painel da Genesy.** Preços, frete e bônus. Modelo `/adm`: rewrite próprio, não
página do Elementor, nunca cacheado.
É a parte com mais superfície: login nativo (AC-01), capability em cada ação (AC-03),
nonce em cada escrita (AC-05), endpoints documentados (AC-10) e upload de imagem de bônus
validado no servidor (AC-12).

**5 · Políticas, SEO e cookies.** Três URLs reais por rewrite, texto em option.

**6 · Revisão.** Acessibilidade (axe-core), Lighthouse, teclado, `prefers-reduced-motion`,
e a comparação lado a lado com o site atual.
Mais a bateria do AC-22 em cada funcionalidade protegida — admin, usuário autorizado, sem
permissão, recurso de outro, não autenticado, sem nonce, nonce inválido, ID manipulado —
com as evidências guardadas. Sem isso não há go-live.

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
Os 42 commits locais foram publicados no GitHub em 07/10/2026 (`c5c7e3a..6eadef6`);
o congelamento vale a partir daí.

## Onde paramos (08/10/2026)

Só existe planejamento. **Nenhuma linha de WordPress foi escrita.** O que está pronto é
este plano, o `docs/SEGURANCA.md` com os 22 critérios e a pasta `docs/seguranca/` esperando
os quatro artefatos. O repositório Next está publicado e congelado.

Três coisas travam a fase 0, todas do Roberto:

| Falta | Para quê |
|---|---|
| A lista de brechas que o dev encontrou | AC-21: nenhuma regra de segurança pode se perder na troca. Sem ela há risco de repetir em PHP o mesmo erro achado em TS |
| SSH da Hostinger: host, porta (normalmente 65002), usuário, caminho absoluto do site, e a chave pública no hPanel → SSH | Fase 0 inteira — `bin/deploy.sh`, `watch.sh`, `logs.sh`, `wp.sh` |
| O subdomínio, e se já existe WordPress instalado nele | Saber se a fase 0 instala ou herda |

Com o SSH na mão, a ordem é: validar o pipeline com um plugin vazio, aí o endurecimento do
AC-16, a matriz de permissões do AC-21 e o inventário de plugins do AC-14 — antes de
qualquer widget.
