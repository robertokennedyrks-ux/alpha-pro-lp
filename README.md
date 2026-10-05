# ALPHA PRO · Landing page

Next.js 16 (App Router) + Payload CMS 3 + Tailwind v4 + Postgres.
O site fica em `/` e o painel administrativo em `/admin`, no mesmo servidor.

## Rodar local

Precisa de Node 20.9+, pnpm 10+ e Docker.

```bash
pnpm install
cp .env.example .env        # depois troque o PAYLOAD_SECRET
pnpm db:up                  # sobe o Postgres em Docker
pnpm seed                   # preenche o painel com o conteúdo do protótipo
pnpm dev                    # http://localhost:3000 e http://localhost:3000/admin
```

Na primeira vez que abrir `/admin`, o Payload pede para criar o usuário administrador.
`pnpm seed` só roda com o banco vazio. Para apagar o conteúdo e preencher de novo: `pnpm seed:reset` (usuários e mídias ficam).

## O que se edita no painel

| Grupo | Item | O que tem |
| --- | --- | --- |
| Loja | Ofertas e preços | produto, desconto no Pix, parcelas, opções de 1 a 4 potes (preço, preço "de", link do checkout) |
| Loja | Frete grátis | liga/desliga, valor mínimo, segmentos da barra, textos |
| Loja | Bônus | liga/desliga, textos da seção, cada bônus (título, descrição, a partir de quantos potes, valor riscado, ícone, imagem) |
| Conteúdo | Textos da página | topo, textos dos botões, garantia |
| Conteúdo | Prova social | faixa de anúncios, selo da foto, números da linha |
| Conteúdo | Depoimentos, Vídeos, Perguntas frequentes, Ingredientes | listas com ordem por arrastar e "Mostrar na página" |
| Conteúdo | Políticas | Trocas e devoluções, Privacidade e Termos (cada uma vira uma URL) |
| Configurações | Contato e rodapé | WhatsApp, loja física, redes (vazio esconde), grupos de links, aviso legal |
| Configurações | SEO e compartilhamento, Aviso de cookies | título, descrição, imagem; texto e botão do aviso |

Salvar qualquer item gera a página de novo (revalidação).

## Estrutura

```
src/
  app/(site)/          páginas públicas (landing e políticas)
  app/(payload)/       painel admin e API do Payload (não editar à mão)
  components/sections/ seções da landing, uma por arquivo
  components/ui/       peças reutilizáveis (botão, tag, etc.)
  components/icons/    catálogo único de ícones (Icon name="...")
  collections/         coleções do CMS (Depoimentos, FAQ, Políticas, ...)
  globals/             configurações únicas do CMS (Ofertas, Frete, Bônus, ...)
  hooks/               revalidação da página ao salvar
  seed/                dados iniciais vindos do protótipo (dados.json + políticas em .md)
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
| `pnpm db:up` / `pnpm db:down` | sobe ou derruba o Postgres |
| `pnpm seed` / `pnpm seed:reset` | preenche o painel com o conteúdo do protótipo |
| `pnpm build` / `pnpm start` | build de produção |
| `pnpm generate:types` | atualiza `src/payload-types.ts` |
| `pnpm generate:importmap` | atualiza o import map do admin |
| `pnpm lint` / `pnpm typecheck` | checagens |
