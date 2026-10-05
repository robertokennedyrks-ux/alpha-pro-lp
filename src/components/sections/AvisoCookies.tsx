import { Cookies } from '@/components/topo/Cookies'
import type { Dados } from '@/lib/dados'

// Aviso de cookies (canto inferior). Termina com o link para a política de privacidade.
export function AvisoCookies({ d }: { d: Dados }) {
  if (d.cookies.ativo === false) return null
  const p = d.politicas.find((x) => x.slug?.includes('privacidade'))
  return (
    <Cookies
      texto={d.cookies.texto ?? ''}
      botao={d.cookies.botao || 'Entendi'}
      politica={p?.slug ? { titulo: p.titulo, href: `/${p.slug}` } : null}
    />
  )
}
