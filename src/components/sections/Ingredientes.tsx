import { Icon, type IconName } from '@/components/icons'
import { IngredientesCarrossel } from '@/components/prova/IngredientesCarrossel'
import { midia } from '@/components/prova/midia'
import type { Dados } from '@/lib/dados'
import { Rico } from '@/lib/texto'

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
  const t = d.textos.ingredientes
  return (
    <section className="bg-paper" id="ingredientes" data-secao="ingredientes">
      <div className="wrap stack">
        <span className="pill">{t.etiqueta}</span>
        <IngredientesCarrossel
          titulo={
            <h2>
              {t.titulo} {t.tituloLeve && <span className="l">{t.tituloLeve}</span>}
            </h2>
          }
        >
          {d.ingredientes.map((ing, i) => {
            const foto = midia(ing.foto)
            const icone = ing.icone as IconName | null | undefined
            return (
              <article className="ic-card" key={i}>
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
              {t.porcao}
            </span>
            <p>
              <Rico texto={t.comoUsar} />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
