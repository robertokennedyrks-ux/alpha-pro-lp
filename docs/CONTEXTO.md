# Contexto do projeto (leia antes de mexer)

LP do ALPHA PRO, cliente Genesy, feita pela RK Studios (Roberto). Responda ao Roberto sempre em português (pt-BR).

## Onde está

- Protótipo aprovado, fonte da verdade visual: `reference/alpha-pro-lp.html` (landing) e `reference/legal.html` (políticas).
- Decisões da revisão final do Roberto: `reference/decisoes-revisao.md`.
- Fases 1 a 6 do porte prontas: base, dados, todas as seções, carrinho e interações, políticas em `/<slug>`, painel do cliente (marca RK, perfis `rk`/`cliente`). Detalhes no `README.md`.

## Tema (mudou em 05/10/2026)

A página foi convertida para **tema escuro com a paleta da Netflix**, a pedido do Roberto.
Isso substitui as regras antigas de "só tons de cinza", "nunca preto puro" e "só tema claro
na v1" (decisão 13). Tudo passa pelos tokens em `src/app/(site)/globals.css`:

- fundo da página `#080808`, card `#101010`, superfície elevada `#1a1a1a`
- texto `#ffffff`, secundário `#b3b3b3`, leitura corrida `#e5e5e5`
- vermelho `#e50914` no CTA principal, verde `#46d369` em "Grátis", "Liberado" e frete grátis
- bordas e divisórias em branco translúcido (8% e 7%), não cinza sólido

Dois tokens existem por causa da inversão: `--color-card` (superfície, antes era `white`)
e `--color-on-ink` (texto sobre um fundo `ink`, que no escuro é claro). `--color-white`
continua sendo branco de verdade, para texto e traços sobre foto e scrim.

O protótipo em `reference/` continua claro: ele é a referência de **layout**, não mais de cor.

## Escopo (mudou em 05/10/2026)

O painel edita **só três coisas**: preços/ofertas, frete grátis e bônus. Todo o resto da
página é estático, em `src/conteudo/` — textos, fotos, listas (FAQ, ingredientes,
depoimentos, vídeos), prova social, contato, SEO, cookies e as três políticas.

Saíram junto o rascunho com autosave, o histórico de versões e a pré-visualização ao vivo:
com três telas de configuração, não compensavam a complexidade.

Banco: **SQLite em arquivo** (`@payloadcms/db-sqlite`). Não há Postgres, Docker nem
servidor de banco. Motivo: o deploy vai para a **Hostinger no plano Business**, que roda
aplicação Node.js mas não oferece PostgreSQL — e o Payload 3 não tem adaptador MySQL.

## Regras que não mudam

- Só Plus Jakarta Sans.
- CTAs em uma linha. Raios de 8, 12 ou 16px; nada totalmente redondo (exceções: contador do carrinho, balões da dor, cápsula decorativa do título).
- Usabilidade é pilar: texto de preço e condição com no mínimo 13px, áreas de toque com no mínimo 44px.
- Sem promessa de emagrecimento e sem comparação com caneta. Sem boleto.
- Não mexer em hospedagem nem DNS sem a confirmação do Roberto.

## Fase 7: revisão antes do deploy

1. **Lado a lado com o protótipo** em 390, 800 e 1440px, seção por seção, inclusive carrinho, menu lateral, aviso de cookies e as três políticas. Ferramentas (com `pnpm dev` rodando):
   - `pnpm comparar:alturas`: altura de cada seção e print da página inteira, protótipo x site.
   - `pnpm comparar <nome> <seletor-protótipo> <seletor-site> [larguras]`: print de um trecho nos dois.
   - Prints saem em `.comparar/` (fora do git). Diferença esperada: a seção 3 (`nc`) ficou menor porque o card da caneta saiu.
2. **Acessibilidade**: contraste, foco visível, navegação por teclado no carrinho, menu e abas, `aria` dos controles, textos alternativos, ordem dos títulos, `prefers-reduced-motion`.
3. **Performance**: Lighthouse no build de produção (`pnpm build && pnpm start`), peso das imagens, fonte, JS do cliente.
4. **Painel**: revisar com o perfil cliente as três telas que a Genesy vai usar.
5. **Antes do deploy**: criar as migrations do Payload (`pnpm payload migrate:create`); hoje o dev usa push automático do schema.

## Deploy (Hostinger Business)

- `DATABASE_URI` tem que apontar para um caminho **fora da pasta do deploy**, senão cada publicação apaga o que o cliente configurou. O mesmo vale para a pasta de uploads das mídias.
- O build pede até 8 GB de heap (`--max-old-space-size=8000`); se o servidor não der conta, compilar local e subir o resultado.

## Pendente do cliente

Plataforma e links do checkout (um por quantidade de potes), preços reais e preço "de", redes sociais, campos [entre colchetes] nas políticas (`src/conteudo/politicas.ts`), fotos e vídeos reais (`src/conteudo/fotos.ts`), subdomínio.
