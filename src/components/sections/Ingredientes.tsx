import { Icon, type IconName } from '@/components/icons'
import { IngredientesCarrossel } from '@/components/prova/IngredientesCarrossel'
import { midia } from '@/components/prova/midia'
import type { Dados } from '@/lib/dados'

// Descrição da foto de cada ingrediente enquanto não há foto no CMS (texto do protótipo).
const FOTOS: Record<string, string> = {
  molecula: 'Cristais minerais em macro, fundo claro',
  sementes: 'Sementes de feno grego e chia numa colher de madeira',
  'grao-cafe': 'Grãos de café verde crus espalhados',
  raiz: 'Raiz de cúrcuma cortada ao lado do pó',
  'sol-vitamina': 'Luz de sol entrando por uma janela sobre cápsulas',
}

// 6. ingredientes: carrossel (3 por vez no PC) + "Como usar".
export function Ingredientes({ d }: { d: Dados }) {
  return (
    <section className="bg-paper" id="ingredientes" data-secao="ingredientes">
      <div className="wrap stack">
        <span className="pill">O que tem dentro</span>
        <IngredientesCarrossel
          titulo={
            <h2>
              Ingredientes que você conhece. <span className="l">Efeito que você sente.</span>
            </h2>
          }
        >
          {d.ingredientes.map((ing) => {
            const foto = midia(ing.foto)
            const icone = ing.icone as IconName | null | undefined
            return (
              <article className="ic-card" key={ing.id}>
                {foto ? (
                  <div className="ic-ph ic-foto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={foto.url!} alt={foto.alt || ing.nome} loading="lazy" />
                    <h3 className="ic-bar">{ing.nome}</h3>
                  </div>
                ) : (
                  <div className="ph ic-ph">
                    <span>
                      <b>Foto</b>
                      {(icone && FOTOS[icone]) || `Foto do ingrediente: ${ing.nome}`}
                    </span>
                    <h3 className="ic-bar">{ing.nome}</h3>
                  </div>
                )}
                <div className="ic-row">
                  <span className="ic-ico">{icone ? <Icon name={icone} /> : null}</span>
                  <p>
                    {ing.beneficio} {ing.dosagem ? <small>{ing.dosagem}</small> : null}
                  </p>
                </div>
              </article>
            )
          })}
        </IngredientesCarrossel>
        <div className="dose">
          <span className="caps" aria-hidden="true">
            <i />
            <i />
          </span>
          <div className="dose-txt">
            <span className="dose-key">
              <span className="mcap" aria-hidden="true">
                <i />
                <i />
              </span>
              1 porção = 2 cápsulas
            </span>
            <p>
              <strong>Como usar:</strong> 2 cápsulas por dia, antes das refeições principais, de preferência de manhã e
              à tarde. Com bastante água.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
