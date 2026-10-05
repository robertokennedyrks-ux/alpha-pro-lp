import { PedidoProvider } from '@/components/pedido'
import { Anuncios } from '@/components/sections/Anuncios'
import { AvisoCookies } from '@/components/sections/AvisoCookies'
import { Bonus } from '@/components/sections/Bonus'
import { Carrinho } from '@/components/sections/Carrinho'
import { Depoimentos } from '@/components/sections/Depoimentos'
import { Destaque } from '@/components/sections/Destaque'
import { Dor } from '@/components/sections/Dor'
import { Duvidas } from '@/components/sections/Duvidas'
import { Final } from '@/components/sections/Final'
import { Hero } from '@/components/sections/Hero'
import { Ingredientes } from '@/components/sections/Ingredientes'
import { JaUsa } from '@/components/sections/JaUsa'
import { NaoECulpa } from '@/components/sections/NaoECulpa'
import { Oferta } from '@/components/sections/Oferta'
import { Produto } from '@/components/sections/Produto'
import { Rodape } from '@/components/sections/Rodape'
import { Topo } from '@/components/sections/Topo'
import { Videos } from '@/components/sections/Videos'
import { getDados } from '@/lib/dados'

// Gerada estática; o painel revalida ao salvar (src/hooks/revalidar.ts).
export const dynamic = 'force-static'

export default async function HomePage() {
  const d = await getDados()
  return (
    <PedidoProvider>
      <Anuncios d={d} />
      <Topo d={d} />
      <main>
        <Hero d={d} />
        <Dor d={d} />
        <NaoECulpa d={d} />
        <Destaque d={d} />
        <Produto d={d} />
        <Depoimentos d={d} />
        <Videos d={d} />
        <Ingredientes d={d} />
        <JaUsa d={d} />
        <Bonus d={d} />
        <Oferta d={d} />
        <Duvidas d={d} />
        <Final d={d} />
      </main>
      <Rodape d={d} />
      <Carrinho d={d} />
      <AvisoCookies d={d} />
    </PedidoProvider>
  )
}
