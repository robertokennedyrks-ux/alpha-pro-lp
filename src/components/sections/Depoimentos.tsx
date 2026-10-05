import { Icon } from '@/components/icons'
import { Contador } from '@/components/prova/Contador'
import { midia } from '@/components/prova/midia'
import type { Dados } from '@/lib/dados'

// 5. prova social: conversas reais (ou o print original) e os números da linha.
export function Depoimentos({ d }: { d: Dados }) {
  const numeros = d.prova.numeros ?? []
  const t = d.textos.depoimentos
  const foto = d.fotos.depoimentos
  return (
    <section id="depoimentos" data-secao="depoimentos">
      <div className="wrap stack">
        <span className="pill">{t.etiqueta}</span>
        <h2>
          {t.titulo} {t.tituloLeve && <span className="l">{t.tituloLeve}</span>}
        </h2>
        <p className="text-graphite">{t.subtitulo}</p>
        {d.depoimentos.length > 0 && (
          <>
            <div className="revs" tabIndex={0} role="group" aria-label="Conversas de clientes (role de lado)">
              {d.depoimentos.map((dep, i) => {
                const print = midia(dep.print)
                return (
                  <div className="rev" key={i}>
                    <h3>{dep.titulo}</h3>
                    {print ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="rev-print"
                        src={print.url!}
                        alt={print.alt || `Print da conversa: ${dep.titulo}`}
                        width={print.width ?? undefined}
                        height={print.height ?? undefined}
                        loading="lazy"
                      />
                    ) : (
                      <div className="chat">
                        <div className="top">
                          <i />
                          <s />
                        </div>
                        {(dep.mensagens ?? []).map((m, k) => (
                          <div key={k} className={`b ${m.lado === 'loja' ? 'out' : 'in'}`}>
                            {m.texto}
                            {m.hora ? <small>{m.hora}</small> : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <p className="text-right text-[12.5px] text-stone">Arraste para ver mais →</p>
          </>
        )}
        {!d.depoimentos.some((dep) => midia(dep.print)) && (
          <p className="text-[12.5px] text-stone">
            No site final, cada conversa é o print original da cliente, com o telefone coberto.
          </p>
        )}
        {numeros.length > 0 && (
          <div className="st-panel">
            <div className="st-photo">
              {foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={foto.url!} alt={foto.alt ?? ''} width={foto.width ?? undefined} height={foto.height ?? undefined} loading="lazy" />
              ) : (
                <div className="ph">
                  <span>
                    <b>Foto</b>Ela sorrindo, segurando o pote perto do rosto
                  </span>
                </div>
              )}
            </div>
            <h3 className="st-title">{t.painelTitulo}</h3>
            <p className="st-sub">{t.painelSubtitulo}</p>
            <div className="st-list">
              {numeros.map((n, k) => {
                const pct = n.sufixo?.trim() === '%'
                const suf = !pct && n.sufixo ? ` ${n.sufixo.trim()}` : ''
                return (
                  <div key={k}>
                    <span className="st-num" aria-label={pct ? `${n.valor}%` : `Mais de ${n.valor}${suf}`}>
                      <Contador valor={n.valor} sufixo={suf} />
                      <span className="st-ic" aria-hidden="true">
                        {pct ? '%' : <Icon name="mais" />}
                      </span>
                    </span>
                    <p>{n.legenda}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
