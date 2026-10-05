# ALPHA PRO · Landing page

Next.js 16 (App Router) + Payload CMS 3 + Tailwind v4 + SQLite.
O site fica em `/` e o painel administrativo em `/admin`, no mesmo servidor.

O painel edita **três coisas**: preços, frete grátis e bônus. Todo o resto da página
é estático, em `src/conteudo/`.

## Rodar local

Precisa só de Node 20.9+ e pnpm 10+. Não precisa de Docker nem de servidor de banco.

```bash
pnpm install
cp .env.example .env        # depois troque o PAYLOAD_SECRET
pnpm dev                    # http://localhost:3000 e http://localhost:3000/admin
```

O banco é um arquivo (`alpha-pro.db`), criado sozinho na primeira execução e fora do git.
Na primeira vez que abrir `/admin`, o Payload pede para criar o primeiro usuário.
Ele vira perfil **RK Studios** automaticamente.

## O que se edita no painel

| Grupo | Item | O que tem |
| --- | --- | --- |
| Loja | Ofertas e preços | produto, desconto no Pix, parcelas, opções de 1 a 4 potes (preço, preço "de", link do checkout) |
| Loja | Frete grátis | liga/desliga, valor mínimo, segmentos da barra, textos |
| Loja | Bônus | liga/desliga, textos da seção, cada bônus (título, descrição, a partir de quantos potes, valor riscado, ícone, imagem) |
| Sistema | Mídias | as imagens dos bônus e a foto do produto |
| Sistema | Usuários | só o perfil RK Studios vê |

Salvar grava direto e a página no ar é gerada de novo (revalidação). Não há rascunho,
versões nem pré-visualização: com três telas de configuração, não compensavam a complexidade.

## O que é estático (editar no código)

| Arquivo | O que tem |
| --- | --- |
| `src/conteudo/textos.ts` | todos os textos da página, seção por seção, na ordem em que aparecem |
| `src/conteudo/fotos.ts` | as fotos de cada seção — um `null` por foto, trocar quando as reais chegarem |
| `src/conteudo/listas.ts` | perguntas frequentes, ingredientes, depoimentos e vídeos |
| `src/conteudo/site.ts` | prova social, contato e rodapé, SEO e aviso de cookies |
| `src/conteudo/politicas.ts` | as três políticas, em markdown simples |

### Pôr uma foto real

1. jogue o arquivo em `public/fotos/`
2. em `src/conteudo/fotos.ts`, troque o `null` por `{ url: '/fotos/hero.jpg', alt: '...', width: 1440, height: 1800 }`

Enquanto for `null`, a seção mostra o espaço reservado do protótipo com a descrição da foto que falta.

## Perfis de acesso

| Perfil | O que pode |
| --- | --- |
| RK Studios (`rk`) | tudo, inclusive criar, editar e apagar usuários e trocar perfis |
| Cliente (`cliente`) | editar preços, frete, bônus, mídias e a própria conta |

Login bloqueia por 10 minutos depois de 5 senhas erradas.

## Marca do painel

Logo, ícone e aviso do login ficam em `src/components/admin/Marca.tsx`; fonte, raios e estilos em
`src/app/(payload)/custom.scss` (a fonte vem de `public/fonts`). O favicon do site sai de
`src/conteudo/site.ts`.

## Estrutura

```
src/
  app/(site)/          páginas públicas (landing e políticas)
  app/(payload)/       painel admin e API do Payload (não editar à mão)
  conteudo/            tudo o que é estático: textos, fotos, listas, políticas
  components/sections/ seções da landing, uma por arquivo
  components/icons/    catálogo único de ícones (Icon name="...")
  collections/         Mídias e Usuários
  globals/             as três telas do painel (Ofertas, Frete, Bônus)
  hooks/               revalidação da página ao salvar
reference/             protótipo aprovado em HTML, fonte da verdade visual
```

## Regras visuais

- Fonte única: Plus Jakarta Sans.
- Só tons de cinza, o mais escuro é `#121212` (`ink`). Verde (`ok`) só em "Grátis", "Liberado" e frete grátis.
- Raios de 8, 12 ou 16px (`rounded-sm`, `rounded-md`, `rounded-lg`). Nada totalmente redondo.
- CTAs em uma linha. Texto de preço e condição com no mínimo 13px. Áreas de toque com no mínimo 44px.
- Ícone novo entra em `src/components/icons/catalog.ts`.

## Scripts

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | servidor local |
| `pnpm build` / `pnpm start` | build de produção |
| `pnpm generate:types` | atualiza `src/payload-types.ts` |
| `pnpm generate:importmap` | atualiza o import map do admin |
| `pnpm lint` / `pnpm typecheck` | checagens |
| `pnpm comparar:alturas` | altura de cada seção e print da página inteira, protótipo x site |
| `pnpm comparar <nome> <sel-protótipo> <sel-site>` | print de um trecho nos dois, em 390, 800 e 1440px |

As comparações usam o Playwright. Na primeira vez: `pnpm exec playwright install chromium`.

## Deploy (Hostinger Business)

O plano Business roda aplicação Node.js. Dois cuidados:

- **O banco e os uploads precisam ficar fora da pasta do deploy.** Aponte `DATABASE_URI`
  para um caminho persistente (ex.: `file:/home/usuario/dados/alpha-pro.db`), senão cada
  publicação de código apaga o que o cliente configurou.
- **O build pede bastante memória** (`--max-old-space-size=8000`). Se o servidor não der conta,
  rode `pnpm build` localmente e suba o resultado.

Antes do primeiro deploy, gerar as migrations: `pnpm payload migrate:create`.
