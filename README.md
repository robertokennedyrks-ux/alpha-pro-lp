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

Na primeira vez que abrir `/admin`, o Payload pede para criar o primeiro usuário. Ele vira perfil **RK Studios** automaticamente.
`pnpm seed` só roda com o banco vazio. Para apagar o conteúdo e preencher de novo: `pnpm seed:reset` (usuários e mídias ficam).

## O que se edita no painel

| Grupo | Item | O que tem |
| --- | --- | --- |
| Loja | Ofertas e preços | produto, desconto no Pix, parcelas, opções de 1 a 4 potes (preço, preço "de", link do checkout) |
| Loja | Frete grátis | liga/desliga, valor mínimo, segmentos da barra, textos |
| Loja | Bônus | liga/desliga, textos da seção, cada bônus (título, descrição, a partir de quantos potes, valor riscado, ícone, imagem) |
| Conteúdo | Textos da página | uma aba por seção, na ordem da página (topo e menu lateral, dor, "não é culpa sua", destaque, produto, depoimentos, vídeos, ingredientes, "já usa", bônus, oferta, dúvidas, final, rodapé) e os textos dos botões: títulos, tags, parágrafos, listas e as fotos de cada seção. Campo vazio volta para o texto do protótipo (`src/lib/textos-padrao.ts`) |
| Conteúdo | Prova social | faixa de anúncios, selo da foto, números da linha |
| Conteúdo | Depoimentos, Vídeos, Perguntas frequentes, Ingredientes | listas com ordem por arrastar e "Mostrar na página" |
| Conteúdo | Políticas | Trocas e devoluções, Privacidade e Termos (cada uma vira uma URL) |
| Configurações | Contato e rodapé | WhatsApp, loja física, redes (vazio esconde), grupos de links, aviso legal |
| Configurações | SEO e compartilhamento, Aviso de cookies | título, descrição, imagem, ícone da aba (favicon); texto e botão do aviso |

## Rascunho, pré-visualização e publicação

- Tudo o que muda na página (os itens acima, menos Mídias) tem rascunho com salvamento automático.
- O ícone de olho no topo do formulário abre a página ao lado, em celular, tablet ou computador, e ela se atualiza a cada mudança. Uma etiqueta "Pré-visualização do rascunho" aparece no canto.
- A página no ar só muda em **Publicar alterações**, que gera a página de novo (revalidação). Itens novos nascem como rascunho e não aparecem até serem publicados.
- "Versões" guarda as últimas 20 de cada item, para voltar atrás.
- Por baixo: `/previa?caminho=/` liga o modo rascunho do Next (só com login no painel) e `/previa/sair` desliga.

## Perfis de acesso

| Perfil | O que pode |
| --- | --- |
| RK Studios (`rk`) | tudo, inclusive criar, editar e apagar usuários e trocar perfis |
| Cliente (`cliente`) | editar todo o conteúdo e a própria conta. Não vê o menu Usuários nem muda o próprio perfil |

Login bloqueia por 10 minutos depois de 5 senhas erradas.

## Marca do painel

Logo, ícone e aviso do login ficam em `src/components/admin/Marca.tsx`; fonte, raios e estilos em `src/app/(payload)/custom.scss` (a fonte vem de `public/fonts`). O favicon do site é editável em SEO; sem imagem, usa `public/favicon.svg`.

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
  components/admin/    marca do painel (logo, ícone, login)
  hooks/               revalidação da página ao publicar
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
