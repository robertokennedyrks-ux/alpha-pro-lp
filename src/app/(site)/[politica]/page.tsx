import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PedidoProvider } from '@/components/pedido'
import { Abas } from '@/components/politicas/Abas'
import { Conteudo } from '@/components/politicas/Conteudo'
import { getListaPoliticas, getPolitica } from '@/components/politicas/dados'
import { Rodape } from '@/components/sections/Rodape'
import { Topo } from '@/components/sections/Topo'
import { getDados } from '@/lib/dados'

// Trocas e devoluções, Política de privacidade e Termos de uso: uma URL por política,
// todas no mesmo widget de abas (reference/legal.html).
export async function generateStaticParams() {
  const lista = await getListaPoliticas()
  return lista.map((p) => ({ politica: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[politica]'>): Promise<Metadata> {
  const { politica } = await params
  const p = await getPolitica(politica)
  if (!p) return {}
  return { title: `${p.titulo} · ALPHA PRO`, description: p.intro?.replace(/\*\*/g, '') || undefined }
}

export default async function PoliticaPage({ params }: PageProps<'/[politica]'>) {
  const { politica } = await params
  const [p, abas, d] = await Promise.all([getPolitica(politica), getListaPoliticas(), getDados()])
  if (!p) notFound()

  return (
    <PedidoProvider>
      <Topo d={d} />
      <div className="bg-paper pt-6 md:pt-10">
        <main className="mx-auto max-w-[1240px] px-4 pb-12 text-base leading-[1.65] md:px-[60px]">
          <div className="overflow-hidden rounded-lg border border-border bg-white lg:grid lg:min-h-[70vh] lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <Abas abas={abas} atual={p.slug} />
            <Conteudo p={p} abas={abas} />
          </div>
        </main>
      </div>
      <Rodape d={d} />
    </PedidoProvider>
  )
}
