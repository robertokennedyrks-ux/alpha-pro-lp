import Link from 'next/link'

import { Icon } from '@/components/icons'

// Fase 1: página base. As seções do protótipo (reference/alpha-pro-lp.html)
// entram em src/components/sections na fase 3.
export default function HomePage() {
  return (
    <main className="wrap flex min-h-dvh flex-col items-start justify-center gap-6 py-16">
      <span className="rounded-sm bg-mist px-3 py-2 text-xs font-bold uppercase tracking-[.06em] text-graphite">
        Ambiente local
      </span>
      <h1 className="text-[clamp(30px,8.2vw,40px)] font-semibold leading-[1.06] tracking-[-.035em]">
        ALPHA PRO <span className="font-light">em construção</span>
      </h1>
      <p className="max-w-xl text-graphite">
        Base Next.js + Payload + Tailwind rodando. O protótipo aprovado está em{' '}
        <code className="rounded-sm bg-paper px-1.5 py-0.5 text-[15px]">reference/</code>.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin"
          className="inline-flex min-h-[52px] items-center gap-2 whitespace-nowrap rounded-md bg-ink px-6 text-[14.5px] font-semibold uppercase tracking-[.04em] text-white"
        >
          <Icon name="sacola" className="size-5" />
          Abrir painel
        </Link>
        <span className="inline-flex min-h-[52px] items-center rounded-md bg-ok-bg px-4 text-[14.5px] font-semibold text-ok">
          Frete Grátis
        </span>
      </div>
    </main>
  )
}
