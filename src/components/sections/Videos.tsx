import { midia } from '@/components/prova/midia'
import { VideosCarrossel } from '@/components/prova/VideosCarrossel'
import type { Dados } from '@/lib/dados'

// 5b. depoimentos em vídeo: carrossel centrado + visualizador em stories.
export function Videos({ d }: { d: Dados }) {
  if (!d.videos.length) return null
  const itens = d.videos.map((v) => ({
    id: v.id,
    tema: v.tema,
    nome: v.nome,
    legenda: v.legenda,
    video: midia(v.video)?.url ?? null,
    capa: midia(v.capa)?.url ?? null,
  }))
  return (
    <section className="vd pt-0" id="videos" data-secao="videos">
      <div className="wrap stack">
        <span className="pill">Em vídeo</span>
        <h2>
          Quem toma, <span className="l">conta.</span>
        </h2>
        <p className="text-graphite">Clientes contando com as próprias palavras como foi. Toque para ouvir.</p>
        <VideosCarrossel itens={itens} />
      </div>
    </section>
  )
}
