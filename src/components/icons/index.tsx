import { HugeiconsIcon } from '@hugeicons/react'
import React from 'react'

import { type IconDef, icons, type IconName } from './catalog'

export type { IconName }

type Props = React.SVGProps<SVGSVGElement> & { name: IconName; title?: string }

// Ícones do Hugeicons (conjunto gratuito), com a cor herdada do texto.
// O tamanho vem do CSS (`size-*` do Tailwind), não de um atributo fixo, para os
// ajustes de tamanho que já existem nas seções continuarem valendo.
export function Icon({ name, title, strokeWidth, ...rest }: Props) {
  // Alargado para IconDef: o `satisfies` do catálogo mantém o tipo literal de cada
  // entrada, e só algumas declaram `stroke`.
  const def: IconDef = icons[name]
  return (
    <HugeiconsIcon
      icon={def.icon}
      size={undefined}
      color="currentColor"
      strokeWidth={typeof strokeWidth === 'number' ? strokeWidth : (def.stroke ?? 2)}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      data-icon={name}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
    </HugeiconsIcon>
  )
}
