import Image from 'next/image'
import React from 'react'

import type { Media } from '@/payload-types'

export type FotoCms = number | Media | null | undefined

// Upload do CMS já populado e com URL (ou null).
export const midiaDe = (m: FotoCms): Media | null => (m && typeof m === 'object' && m.url ? m : null)

// Só a imagem, cobrindo o pai inteiro (o pai precisa ser posicionado).
export function FotoCobre({ foto, sizes = '100vw', className = '' }: { foto: Media; sizes?: string; className?: string }) {
  return <Image src={foto.url!} alt={foto.alt ?? ''} fill sizes={sizes} className={`object-cover ${className}`} />
}

type Props = {
  foto: FotoCms
  titulo: React.ReactNode
  texto: React.ReactNode
  className?: string
  style?: React.CSSProperties
  sizes?: string
  'aria-hidden'?: boolean
  children?: React.ReactNode
}

// Espaço de foto do protótipo (.ph): com foto do painel, a imagem ocupa o mesmo espaço;
// sem foto, continua o espaço reservado com a descrição.
export function FotoOuEspaco({ foto, titulo, texto, className = '', style, sizes, children, ...rest }: Props) {
  const m = midiaDe(foto)
  return (
    <div className={`ph ${className}`} style={style} aria-hidden={rest['aria-hidden']}>
      {m ? (
        <FotoCobre foto={m} sizes={sizes} />
      ) : (
        <span>
          <b>{titulo}</b>
          {texto}
        </span>
      )}
      {children}
    </div>
  )
}

// Texto do painel com quebras de linha (Enter) virando <br>.
export function ComQuebras({ texto }: { texto: string }) {
  const partes = texto.split(/\r?\n/)
  return (
    <>
      {partes.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {p}
        </React.Fragment>
      ))}
    </>
  )
}
