import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@payload-config'

// Entrada da pré-visualização: só quem está logado no painel liga o modo rascunho.
// Uso: /previa?caminho=/  ou  /previa?caminho=/politica-de-privacidade
export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return new Response('Entre no painel para ver a pré-visualização.', { status: 401 })

  const caminho = new URL(request.url).searchParams.get('caminho') || '/'
  // Só caminhos internos do site (evita redirecionar para fora).
  const destino = /^\/[a-z0-9-]*$/.test(caminho) ? caminho : '/'

  const draft = await draftMode()
  draft.enable()
  redirect(destino)
}
