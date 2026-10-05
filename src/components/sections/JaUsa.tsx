import { Icon } from '@/components/icons'
import { JaUsaComparacao } from '@/components/prova/JaUsaComparacao'
import type { Dados } from '@/lib/dados'

const VANTAGENS = [
  'Mais potente na fome e na vontade de doce',
  'Para quem quer ainda mais controle',
  'Mesma marca, mesmo atendimento, mesma nota fiscal',
]

// 7. "Já usa ALPHA?": convite para quem já é cliente.
export function JaUsa({ d }: { d: Dados }) {
  return (
    <section className="jc" id="ja-usa" data-secao="ja-usa">
      <div className="wrap">
        <p className="jc-eye">
          <Icon name="estrela" />
          Já é cliente?
        </p>
        <h2 className="jc-title">
          <svg className="jc-svg" viewBox="0 0 400 172" role="img" aria-label="Já usa ALPHA? Conheça a versão PRO.">
            <g style={{ fontFamily: "var(--font-sans)" }} fontWeight="600" fontSize="50" fill="#121212">
              <text x="0" y="52" textLength="400" lengthAdjust="spacingAndGlyphs">
                JÁ USA ALPHA?
              </text>
              <rect x="1" y="70" width="44" height="44" rx="10" fill="#e7e7e7" stroke="#8a8a8a" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="56" y="110" textLength="344" lengthAdjust="spacingAndGlyphs">
                CONHEÇA A
              </text>
              <text x="0" y="168" textLength="400" lengthAdjust="spacingAndGlyphs">
                VERSÃO PRO.
              </text>
            </g>
          </svg>
        </h2>
        <p className="jc-sub">Você já confia na linha. O PRO é o próximo passo.</p>
        <ul className="jc-list">
          {VANTAGENS.map((v) => (
            <li key={v}>
              <Icon name="check" />
              {v}
            </li>
          ))}
        </ul>
        <JaUsaComparacao />
        <div className="cta">
          <a className="btn" href="#comprar">
            {d.textos.botoes?.produto || 'Quero meu ALPHA PRO'} <span className="arr">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
