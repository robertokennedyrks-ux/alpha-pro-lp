import '@fontsource-variable/plus-jakarta-sans'
import './globals.css'

import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'ALPHA PRO',
  description: 'Landing page ALPHA PRO',
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
