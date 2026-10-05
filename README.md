# ALPHA PRO · Landing page

Next.js 16 (App Router) + Payload CMS 3 + Tailwind v4 + Postgres.
O site fica em `/` e o painel administrativo em `/admin`, no mesmo servidor.

## Rodar local

Precisa de Node 20.9+, pnpm 10+ e Docker.

```bash
pnpm install
cp .env.example .env        # depois troque o PAYLOAD_SECRET
pnpm db:up                  # sobe o Postgres em Docker
pnpm dev                    # http://localhost:3000 e http://localhost:3000/admin
```

Na primeira vez que abrir `/admin`, o Payload pede para criar o usuário administrador.

## Estrutura

```
src/
  app/(site)/          páginas públicas (landing e políticas)
  app/(payload)/       painel admin e API do Payload (não editar à mão)
  components/sections/ seções da landing, uma por arquivo
  components/ui/       peças reutilizáveis (botão, tag, etc.)
  components/icons/    catálogo único de ícones (Icon name="...")
  collections/         coleções do CMS (Usuários, Mídia, ...)
  globals/             configurações únicas do CMS (Ofertas, Frete, Bônus, ...)
  seed/                dados iniciais vindos do protótipo
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
| `pnpm build` / `pnpm start` | build de produção |
| `pnpm generate:types` | atualiza `src/payload-types.ts` |
| `pnpm generate:importmap` | atualiza o import map do admin |
| `pnpm lint` / `pnpm typecheck` | checagens |
