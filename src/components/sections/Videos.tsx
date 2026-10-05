import { midia } from '@/components/prova/midia'
import { VideosCarrossel } from '@/components/prova/VideosCarrossel'
import type { Dados } from '@/lib/dados'

// 5b. depoimentos em vídeo: carrossel centrado + visualizador em stories.
export function Videos({ d }: { d: Dados }) {
  if (!d.videos.length) return null
  const t = d.textos.videos
  const itens = d.videos.map((v, i) => ({
    id: i,
    tema: v.tema,
    nome: v.nome,
    legenda: v.legenda,
    video: midia(v.video)?.url ?? null,
    capa: midia(v.capa)?.url ?? null,
  }))
  return (
    <section className="vd pt-0" id="videos" data-secao="videos">
      <div className="wrap stack">
        <span className="pill">{t.etiqueta}</span>
        <h2>
          {t.titulo} {t.tituloLeve && <span className="l">{t.tituloLeve}</span>}
        </h2>
        <p className="text-graphite">{t.subtitulo}</p>
        <VideosCarrossel itens={itens} />
      </div>
    </section>
  )
}
