import '@fontsource-variable/plus-jakarta-sans'
import './globals.css'

import type { Metadata } from 'next'
import React from 'react'

import { getDados } from '@/lib/dados'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getDados()
  return {
    title: seo.titulo || 'ALPHA PRO',
    description: seo.descricao || undefined,
    robots: seo.indexar === false ? { index: false, follow: false } : undefined,
    openGraph: seo.imagem ? { images: [seo.imagem] } : undefined,
    icons: { icon: seo.favicon },
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  }
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
