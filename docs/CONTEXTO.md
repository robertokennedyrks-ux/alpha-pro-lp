# Contexto do projeto (leia antes de mexer)

LP do ALPHA PRO, cliente Genesy, feita pela RK Studios (Roberto). Responda ao Roberto sempre em português (pt-BR).

## Onde está

- Protótipo aprovado, fonte da verdade visual: `reference/alpha-pro-lp.html` (landing) e `reference/legal.html` (políticas).
- Decisões da revisão final do Roberto: `reference/decisoes-revisao.md`.
- Fases 1 a 6 do porte prontas na `main`: base, dados e seed, todas as seções, carrinho e interações, políticas em `/<slug>`, painel do cliente (marca RK, perfis `rk`/`cliente`, Textos da página, rascunho com prévia ao vivo, revalidação ao publicar). Detalhes no `README.md`.

## Regras que não mudam

- Só Plus Jakarta Sans. Só tons de cinza; o mais escuro é `#121212`, nunca preto puro. Verde só em "Grátis", "Liberado" e frete grátis.
- CTAs em uma linha. Raios de 8, 12 ou 16px; nada totalmente redondo (exceções: contador do carrinho, balões da dor, cápsula decorativa do título).
- Usabilidade é pilar: texto de preço e condição com no mínimo 13px, áreas de toque com no mínimo 44px.
- Sem promessa de emagrecimento e sem comparação com caneta. Sem boleto. Só tema claro na v1 (escuro vem depois; manter os tokens prontos).
- Não mexer em hospedagem nem DNS sem a confirmação do Roberto.

## Fase 7: revisão antes do deploy

1. **Lado a lado com o protótipo** em 390, 800 e 1440px, seção por seção, inclusive carrinho, menu lateral, aviso de cookies e as três políticas. Ferramentas (com `pnpm dev` rodando):
   - `pnpm comparar:alturas`: altura de cada seção e print da página inteira, protótipo x site.
   - `pnpm comparar <nome> <seletor-protótipo> <seletor-site> [larguras]`: print de um trecho nos dois.
   - Prints saem em `.comparar/` (fora do git). Diferença esperada: a seção 3 (`nc`) ficou menor porque o card da caneta saiu.
2. **Acessibilidade**: contraste, foco visível, navegação por teclado no carrinho, menu e abas, `aria` dos controles, textos alternativos, ordem dos títulos, `prefers-reduced-motion`.
3. **Performance**: Lighthouse no build de produção (`pnpm build && pnpm start`), peso das imagens, fonte, JS do cliente.
4. **Painel**: revisar com o perfil cliente, de ponta a ponta, as telas que a Genesy vai usar.
5. **Antes do deploy**: criar as migrations do Payload (`pnpm payload migrate:create`); hoje o dev usa push automático do schema.

## Pendente do cliente

Plataforma e links do checkout (um por quantidade de potes), preços reais e preço "de", redes sociais, campos [entre colchetes] nas políticas, fotos e vídeos reais, hospedagem e subdomínio.

## Plano completo

Claude Doc com as 7 fases: https://claude.ai/code/artifact/b0dce7d3-3738-4254-8511-0d9806ccc55f
