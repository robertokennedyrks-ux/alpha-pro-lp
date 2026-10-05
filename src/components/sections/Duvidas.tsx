import { Avisos } from '@/components/prova/Avisos'
import { Perguntas } from '@/components/prova/Perguntas'
import type { Dados } from '@/lib/dados'

// 9. dúvidas: banner + avisos de uso ao lado, perguntas frequentes do CMS.
export function Duvidas({ d }: { d: Dados }) {
  const itens = d.faq.map((q) => ({ id: q.id, pergunta: q.pergunta, resposta: q.resposta, aberta: q.aberta }))
  return (
    <section id="duvidas" data-secao="duvidas">
      <div className="wrap stack">
        <div className="faq-side">
          <div className="faq-ban">
            <h2>
              Ainda com <span className="l">dúvida?</span>
            </h2>
            <div className="faq-ill" role="img" aria-label="Espaço para ilustração">
              <span>Ilustração</span>
            </div>
          </div>
          <div className="safe">
            <h3>Para usar com tranquilidade</h3>
            <p className="safe-desc">O ALPHA PRO é intenso e entrega resultados, mas não é para todo mundo:</p>
            <Avisos />
          </div>
        </div>
        {itens.length > 0 && <Perguntas itens={itens} />}
      </div>
    </section>
  )
}
