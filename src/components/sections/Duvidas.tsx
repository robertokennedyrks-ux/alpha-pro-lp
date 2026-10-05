import { FotoCobre, midiaDe } from '@/components/Foto'
import { Avisos } from '@/components/prova/Avisos'
import { Perguntas } from '@/components/prova/Perguntas'
import type { Dados } from '@/lib/dados'
import { textosDe } from '@/lib/textos-padrao'

// 9. dúvidas: banner + avisos de uso ao lado, perguntas frequentes do CMS.
export function Duvidas({ d }: { d: Dados }) {
  const t = textosDe(d.textos).duvidas
  const ilustracao = midiaDe(t.ilustracao)
  const avisos = t.avisos.map((a) => ({ ico: a.icone ?? null, lab: a.rotulo ?? '', t: a.titulo, p: a.texto ?? '' }))
  const itens = d.faq.map((q) => ({ id: q.id, pergunta: q.pergunta, resposta: q.resposta, aberta: q.aberta }))
  return (
    <section id="duvidas" data-secao="duvidas">
      <div className="wrap stack">
        <div className="faq-side">
          <div className="faq-ban">
            <h2>
              {t.titulo} {t.tituloLeve && <span className="l">{t.tituloLeve}</span>}
            </h2>
            {ilustracao ? (
              <div className="faq-ill relative overflow-hidden border-0">
                <FotoCobre foto={ilustracao} sizes="(min-width:1024px) 40vw, 120px" />
              </div>
            ) : (
              <div className="faq-ill" role="img" aria-label="Espaço para ilustração">
                <span>Ilustração</span>
              </div>
            )}
          </div>
          <div className="safe">
            <h3>{t.avisosTitulo}</h3>
            <p className="safe-desc">{t.avisosTexto}</p>
            <Avisos avisos={avisos} />
          </div>
        </div>
        {itens.length > 0 && <Perguntas itens={itens} />}
      </div>
    </section>
  )
}
