// Listas da página. Antes vinham de coleções do painel; agora são estáticas.
// Vieram do protótipo aprovado (reference/alpha-pro-lp.html).
import type { Imagem } from './fotos'

export type Pergunta = { pergunta: string; resposta: string; aberta?: boolean }
export type Ingrediente = { nome: string; beneficio: string; dosagem: string; icone: string; foto?: Imagem | null }
export type Mensagem = { texto: string; hora: string; lado: 'cliente' | 'loja' }
export type Depoimento = { titulo: string; mensagens: Mensagem[]; print?: Imagem | null }
export type Video = { nome: string; legenda: string; tema: string; video?: Imagem | null; capa?: Imagem | null }

export const faq: Pergunta[] = [
    {
      "pergunta": "Funciona mesmo?",
      "resposta": "A maioria das clientes sente a fome diminuir já no primeiro ou no segundo dia, e o efeito aumenta com o uso. São mais de 25 mil vendas da linha ALPHA, e metade das clientes volta a comprar.",
      "aberta": true
    },
    {
      "pergunta": "Tem efeito colateral? Faz mal?",
      "resposta": "O ALPHA PRO usa ingredientes conhecidos, como feno grego, cromo, café verde, cúrcuma e vitaminas. Ele pede bastante água, e algumas clientes sentem mais sede e a boca seca. Não é indicado para gestantes, lactantes e menores de 19 anos.",
      "aberta": false
    },
    {
      "pergunta": "Já tentei de tudo. Por que seria diferente?",
      "resposta": "Se você já tentou de tudo, você não é fraca. Você estava lutando contra a fome sozinha. O ALPHA PRO age direto na fome e na vontade de doce, e você percebe nos primeiros dias.",
      "aberta": false
    },
    {
      "pergunta": "E se não funcionar comigo?",
      "resposta": "A maioria sente a diferença nos primeiros dias, como as clientes dos prints acima. E você tem 7 dias, a partir do recebimento, para desistir da compra e receber o seu dinheiro de volta.",
      "aberta": false
    },
    {
      "pergunta": "Como eu tomo?",
      "resposta": "2 cápsulas por dia, antes das refeições principais, de preferência de manhã e à tarde, com bastante água.",
      "aberta": false
    },
    {
      "pergunta": "Posso tomar à noite?",
      "resposta": "O ideal é de manhã e à tarde. À noite, algumas pessoas sentem um pouco mais de energia na hora de dormir.",
      "aberta": false
    },
    {
      "pergunta": "Um pote dura quanto tempo?",
      "resposta": "Cada pote tem 60 cápsulas, que dão 30 dias tomando 2 por dia. Como o uso é contínuo, vale já programar o próximo pote.",
      "aberta": false
    },
    {
      "pergunta": "Em quanto tempo chega?",
      "resposta": "O prazo para o seu CEP aparece no checkout, antes de você pagar. No Pix o pagamento é confirmado na hora, então o pedido sai mais rápido.",
      "aberta": false
    },
    {
      "pergunta": "Como acompanho meu pedido?",
      "resposta": "Assim que o pedido é enviado, você recebe o código de rastreio por e-mail e WhatsApp. Se tiver qualquer dúvida, é só chamar a equipe no WhatsApp.",
      "aberta": false
    },
    {
      "pergunta": "É golpe? Posso confiar?",
      "resposta": "A Alpha tem loja física, emite nota fiscal e atende pelo WhatsApp. São milhares de clientes e mais de 25 mil vendas da linha.",
      "aberta": false
    },
    {
      "pergunta": "Tem registro na ANVISA?",
      "resposta": "O ALPHA PRO é um alimento notificado na ANVISA, número 25351118192202606, fabricado no Brasil.",
      "aberta": false
    },
    {
      "pergunta": "Tem glúten ou lactose?",
      "resposta": "Não. Pode conter derivados de crustáceos, soja e pinoli, e a cápsula é de colágeno bovino.",
      "aberta": false
    },
    {
      "pergunta": "Quais as formas de pagamento?",
      "resposta": "Cartão em até 5x sem juros ou Pix com 5% de desconto.",
      "aberta": false
    }
  ]

export const ingredientes: Ingrediente[] = [
    {
      "nome": "Picolinato de cromo",
      "beneficio": "Ajuda a acalmar a vontade de doce.",
      "dosagem": "250 mcg de cromo por porção.",
      "icone": "molecula"
    },
    {
      "nome": "Feno grego + inulina + chia",
      "beneficio": "Fibras que dão sensação de saciedade, a barriga cheia por mais tempo.",
      "dosagem": "125 mg de saponinas por porção.",
      "icone": "sementes"
    },
    {
      "nome": "Café verde",
      "beneficio": "Mais disposição no dia.",
      "dosagem": "75 mg de ácido clorogênico por porção.",
      "icone": "grao-cafe"
    },
    {
      "nome": "Cúrcuma",
      "beneficio": "O ingrediente natural que você já usa na cozinha.",
      "dosagem": "130 mg de curcumina por porção.",
      "icone": "raiz"
    },
    {
      "nome": "D3, B12 e colina",
      "beneficio": "Energia e foco para a sua rotina corrida.",
      "dosagem": "50 mcg de D3, 4,8 mcg de B12 e 200 mg de colina por porção.",
      "icone": "sol-vitamina"
    }
  ]

export const depoimentos: Depoimento[] = [
    {
      "titulo": "Até quem é formiga",
      "mensagens": [
        {
          "texto": "Segurou fome e zero vontade de doce… doce foi o que mais surpreendeu, pq sou formiga",
          "hora": "14:02",
          "lado": "cliente"
        }
      ]
    },
    {
      "titulo": "Sem rodeio",
      "mensagens": [
        {
          "texto": "Realmente tira a fome e a vontade de doces",
          "hora": "09:47",
          "lado": "cliente"
        }
      ]
    },
    {
      "titulo": "A resposta que a gente mais recebe",
      "mensagens": [
        {
          "texto": "Ta segurando a fome?",
          "hora": "18:20",
          "lado": "loja"
        },
        {
          "texto": "Simmmm",
          "hora": "18:21",
          "lado": "cliente"
        }
      ]
    },
    {
      "titulo": "Ela sentiu já no segundo dia",
      "mensagens": [
        {
          "texto": "No primeiro dia não teve tanta inibição, mas no segundo já teve mais",
          "hora": "11:15",
          "lado": "cliente"
        }
      ]
    },
    {
      "titulo": "E ainda tem o bônus",
      "mensagens": [
        {
          "texto": "Melhora significativa na digestão",
          "hora": "20:08",
          "lado": "cliente"
        },
        {
          "texto": "colocou o intestino para funcionar",
          "hora": "20:08",
          "lado": "cliente"
        }
      ]
    },
    {
      "titulo": "Até o marido quis",
      "mensagens": [
        {
          "texto": "tá tomando todo dia e sentindo bem. Como faço pra comprar?",
          "hora": "16:33",
          "lado": "cliente"
        }
      ]
    }
  ]

export const videos: Video[] = [
    {
      "nome": "Nome da cliente",
      "legenda": "Cidade · 2 meses de uso",
      "tema": "A primeira semana"
    },
    {
      "nome": "Nome da cliente",
      "legenda": "Cidade · 1 mês de uso",
      "tema": "A vontade de doce"
    },
    {
      "nome": "Nome da cliente",
      "legenda": "Cidade · 4 meses de uso",
      "tema": "A calça que fechou"
    },
    {
      "nome": "Nome da cliente",
      "legenda": "Cidade · 3 meses de uso",
      "tema": "Por que comprei de novo"
    }
  ]
