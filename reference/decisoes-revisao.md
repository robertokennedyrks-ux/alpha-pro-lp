# Decisões da revisão final (Roberto, 2026-10-05)

1. Promessas de emagrecimento: A — suavizar para benefícios de sensação (saciedade, menos vontade de doce) e tirar a comparação com caneta.
2. Garantia: A — 7 dias de arrependimento (mínimo legal), com selo perto do botão de compra.
3. Checkout: A — checkout externo, um link por quantidade de potes. Pendente: qual plataforma e os links.
4. Preço "de": A — preço real já praticado; valores configurados no final via CMS (campo por oferta).
5. Desconto por quantidade: A — preço por pote menor conforme a quantidade, valores definidos no CMS.
6. Frete grátis: A — valor mínimo no CMS + selo "Frete grátis" automático nos cards que passam do mínimo. Extra: toggle no CMS para ligar/desligar toda a funcionalidade de frete grátis (barra, selos, textos).
7. Boleto: B — não aceita; tirar do rodapé.
8. Links do rodapé: A — todos no CMS; WhatsApp com mensagem pronta (wa.me), loja abre no Google Maps, rede social sem link some sozinha.
9. Prazo e rastreio: A — duas perguntas novas no FAQ ("Em quanto tempo chega?", "Como acompanho meu pedido?"), texto no CMS.
10. Bônus: C — bônus 100% editáveis no CMS (nome, descrição, valor, imagem). Extra: toggle no CMS para desativar completamente a funcionalidade de bônus (seção Bônus, brindes no carrinho, faixa "Você ganhou", textos de bônus nas ofertas).
11. Diferença ALPHA x PRO: B — manter genérico como está.
12. Privacidade e termos: A — Claude escreve modelo das duas páginas + aviso de cookies, texto editável no CMS, cliente revisa.
13. Modo escuro: A — desenvolver tudo só no light na primeira versão; modo escuro vira um update separado depois (manter tokens de cor prontos para isso).
14. Ajustes de usabilidade: A — aplicar todos (texto de preço/condição >= 13px, toque 44px, CTA da barra fixo, CTAs unificados). Roberto: "Usabilidade é pilar fundamental".

## Aplicado no protótipo (v202)
- Preços de exemplo com desconto por quantidade: 1 pote R$ 227, 2 R$ 434, 3 R$ 621, 4 R$ 788 (placeholders; valores reais virão do CMS).
- JSONs de CMS na página: `#bonus-config` (ativo), `#frete-gratis` (ativo, valor_minimo...), `#checkout` (plataforma, links por quantidade), `#contato` (whatsapp, mensagem, maps, redes, trocas, privacidade, termos).
- Botões com `data-checkout` (oferta, carrinho, barra) vão para o link da quantidade escolhida; sem link, continuam levando à oferta.
- Modo escuro: botão removido; CSS escuro mantido dormente para o update futuro.
- Textos legais (modelos): legal/politica-de-privacidade.md, legal/termos-de-uso.md, legal/aviso-de-cookies.md.
- Páginas de políticas (v206): legal.html, um layout com abas (Trocas e devoluções, Política de privacidade, Termos de uso), referência donnanutrition.com.br/politica-de-envio. Cada aba tem seu link; trocar de aba troca a URL. Conteúdo vem do JSON `#paginas-legais` (CMS). No Next.js: rotas /trocas-e-devolucoes, /politica-de-privacidade, /termos-de-uso com layout compartilhado.
