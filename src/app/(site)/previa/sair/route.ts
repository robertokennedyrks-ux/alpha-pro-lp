import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

// Sai do modo rascunho e volta para a página publicada.
export async function GET(request: Request) {
  const draft = await draftMode()
  draft.disable()
  const caminho = new URL(request.url).searchParams.get('caminho') || '/'
  redirect(/^\/[a-z0-9-]*$/.test(caminho) ? caminho : '/')
}
