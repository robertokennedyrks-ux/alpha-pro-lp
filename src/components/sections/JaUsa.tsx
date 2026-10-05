import { Icon } from '@/components/icons'
import { JaUsaComparacao } from '@/components/prova/JaUsaComparacao'
import type { Dados } from '@/lib/dados'

// 7. "Já usa ALPHA?": convite para quem já é cliente.
export function JaUsa({ d }: { d: Dados }) {
  const t = d.textos.jaUsa
  return (
    <section className="jc" id="ja-usa" data-secao="ja-usa">
      <div className="wrap">
        <p className="jc-eye">
          <Icon name="estrela" />
          {t.etiqueta}
        </p>
        <h2 className="jc-title">
          <svg className="jc-svg" viewBox="0 0 400 172" role="img" aria-label={[t.titulo1, t.titulo2, t.titulo3].join(' ')}>
            <g style={{ fontFamily: "var(--font-sans)" }} fontWeight="600" fontSize="50" fill="#121212">
              <text x="0" y="52" textLength="400" lengthAdjust="spacingAndGlyphs">
                {t.titulo1.toUpperCase()}
              </text>
              <rect x="1" y="70" width="44" height="44" rx="10" fill="#e7e7e7" stroke="#8a8a8a" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="56" y="110" textLength="344" lengthAdjust="spacingAndGlyphs">
                {t.titulo2.toUpperCase()}
              </text>
              <text x="0" y="168" textLength="400" lengthAdjust="spacingAndGlyphs">
                {t.titulo3.toUpperCase()}
              </text>
            </g>
          </svg>
        </h2>
        <p className="jc-sub">{t.subtitulo}</p>
        <ul className="jc-list">
          {t.vantagens.map((v, i) => (
            <li key={i}>
              <Icon name="check" />
              {v.texto}
            </li>
          ))}
        </ul>
        <JaUsaComparacao forte={t.forte} rotulo={t.tickerRotulo} itens={t.ticker.map((v, i) => ({ texto: v.texto, foto: d.fotos.ticker[i] ?? null }))} />
        <div className="cta">
          <a className="btn" href="#comprar">
            {d.textos.botoes?.produto || 'Quero meu ALPHA PRO'} <span className="arr">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
